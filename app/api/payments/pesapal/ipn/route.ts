import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  return NextResponse.json({
    status: "200",
    message: "IPN received",
    orderTrackingId: searchParams.get("OrderTrackingId") || searchParams.get("orderTrackingId"),
    merchantReference: searchParams.get("OrderMerchantReference") || searchParams.get("merchantReference")
  });
}
