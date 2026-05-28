import { NextResponse } from "next/server";
import { getBearerUser, getSupabaseAdmin } from "@/lib/supabase/server";

const urls = {
  sandbox: "https://cybqa.pesapal.com/pesapalv3/api",
  live: "https://pay.pesapal.com/v3/api"
};

function getBaseUrl() {
  return process.env.PESAPAL_ENVIRONMENT === "sandbox" ? urls.sandbox : urls.live;
}

function isLocalSiteUrl(siteUrl: string) {
  return siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1");
}

async function requestToken() {
  const consumer_key = process.env.PESAPAL_CONSUMER_KEY;
  const consumer_secret = process.env.PESAPAL_CONSUMER_SECRET;

  if (!consumer_key || !consumer_secret) {
    throw new Error("Pesapal credentials are not configured.");
  }

  const response = await fetch(`${getBaseUrl()}/Auth/RequestToken`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ consumer_key, consumer_secret })
  });

  const data = await response.json();
  if (!response.ok || !data.token) {
    throw new Error(data.message || "Pesapal authentication failed.");
  }

  return data.token as string;
}

async function registerIpn(token: string, siteUrl: string) {
  const response = await fetch(`${getBaseUrl()}/URLSetup/RegisterIPN`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      url: `${siteUrl}/api/payments/pesapal/ipn`,
      ipn_notification_type: "GET"
    })
  });

  const data = await response.json();
  if (!response.ok || !data.ipn_id) {
    throw new Error(data.message || "Pesapal IPN registration failed. Use a public HTTPS NEXT_PUBLIC_SITE_URL or set PESAPAL_NOTIFICATION_ID.");
  }

  return data.ipn_id as string;
}

export async function POST(request: Request) {
  const user = await getBearerUser(request);
  if (!user) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002";
  const supabase = getSupabaseAdmin();

  try {
    const token = await requestToken();
    if (!process.env.PESAPAL_NOTIFICATION_ID && isLocalSiteUrl(siteUrl)) {
      return NextResponse.json({
        message: "Pesapal requires a registered IPN notification ID for real payments. Set PESAPAL_NOTIFICATION_ID in .env.local, or deploy with a public HTTPS NEXT_PUBLIC_SITE_URL so the IPN URL can be registered.",
        provider: "Pesapal"
      }, { status: 400 });
    }
    const notificationId = process.env.PESAPAL_NOTIFICATION_ID || await registerIpn(token, siteUrl);
    const merchantReference = `VOLLI-${body.poolId || "POOL"}-${Date.now()}`.replace(/[^a-zA-Z0-9_.:-]/g, "-").slice(0, 50);

    const response = await fetch(`${getBaseUrl()}/Transactions/SubmitOrderRequest`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id: merchantReference,
        currency: body.currency || "USD",
        amount: Number(body.amount || 500),
        description: `VOLLIFX pool payment for ${body.poolName || body.poolId || "investment pool"}`.slice(0, 100),
        callback_url: `${siteUrl}/dashboard/transactions?payment=pesapal&pool=${body.poolId || ""}`,
        cancellation_url: `${siteUrl}/dashboard/pools/${body.poolId || ""}`,
        redirect_mode: "TOP_WINDOW",
        notification_id: notificationId,
        branch: "VOLLIFX",
        billing_address: {
          email_address: body.email || user.email || "",
          phone_number: body.phone || "",
          country_code: body.countryCode || "KE",
          first_name: body.firstName || "VOLLIFX",
          middle_name: "",
          last_name: body.lastName || "Investor",
          line_1: "VOLLIFX Investor Portal",
          line_2: "",
          city: body.city || "",
          state: "",
          postal_code: "",
          zip_code: ""
        }
      })
    });

    const data = await response.json();
    if (!response.ok || !data.redirect_url) {
      return NextResponse.json({ message: data.message || "Pesapal order creation failed.", error: data }, { status: 400 });
    }
    const { data: payment, error: paymentError } = await supabase.from("payments").insert({
      user_id: user.id,
      provider: "Pesapal",
      pool_id: body.poolId === "wallet-deposit" ? null : body.poolId,
      amount: Number(body.amount || 500),
      currency: body.currency || "USD",
      checkout_url: data.redirect_url,
      external_reference: data.merchant_reference || merchantReference,
      status: "Pending payment",
      customer: body
    }).select("*").single();
    if (paymentError) throw new Error(paymentError.message);

    return NextResponse.json({
      provider: "Pesapal",
      mode: process.env.PESAPAL_ENVIRONMENT === "sandbox" ? "sandbox" : "live",
      message: "Pesapal checkout created. Redirect the customer to complete payment.",
      checkoutUrl: data.redirect_url,
      payment: {
        id: payment.id,
        orderTrackingId: data.order_tracking_id,
        merchantReference: payment.external_reference,
        poolId: payment.pool_id,
        amount: payment.amount,
        currency: payment.currency,
        checkoutUrl: payment.checkout_url,
        status: payment.status,
        provider: payment.provider,
        createdAt: payment.created_at,
        customer: payment.customer
      }
    }, { status: 201 });
  } catch (error) {
    await supabase.from("payments").insert({
      user_id: user.id,
      provider: "Pesapal",
      pool_id: body.poolId === "wallet-deposit" ? null : body.poolId,
      amount: Number(body.amount || 500),
      currency: body.currency || "USD",
      status: "Failed to create checkout",
      customer: { ...body, error: error instanceof Error ? error.message : "Pesapal payment failed." }
    });
    return NextResponse.json({
      message: error instanceof Error ? error.message : "Pesapal payment failed.",
      provider: "Pesapal"
    }, { status: 500 });
  }
}
