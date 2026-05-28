# VOLLIFX

Premium forex and institutional trading platform built with Next.js 14, TypeScript, Tailwind CSS, reusable components, responsive layouts, and dark/light mode support.

## Quick Start

```bash
npm install
npm run dev:clean
```

Open `http://localhost:3002`.

## Production Build

```bash
npm run build
npm start
```

## Pages

- `/` Homepage
- `/about` About
- `/faq` FAQ
- `/login` Supabase Auth login
- `/register` Supabase Auth registration
- `/dashboard/*` protected investor portal
- `/dashboard/admin` admin-only platform controls

## Backend Readiness

The app uses Supabase Auth and Supabase tables for persistent data. Run `supabase/schema.sql` in the Supabase SQL editor, then create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
```

The service role key is only used inside API routes/server code. Do not place it in client components.

Required tables are created by the schema: `profiles`, `transactions`, `payments`, `pools`, `allocations`, `kyc_submissions`, `settings`, and `admin_overrides`.

The platform admin is `vollikip@gmail.com`. Admin-only APIs check `profiles.role = 'admin'` before approving payments, editing pools, updating balances, managing KYC, or reading admin overrides.

## Payment Setup

Create `.env.local` from `.env.example` and add the Pesapal credentials there. Do not place the Pesapal consumer secret in client components.

```bash
PESAPAL_CONSUMER_KEY="..."
PESAPAL_CONSUMER_SECRET="..."
NEXT_PUBLIC_SITE_URL="https://vollitrading.com"
```

Crypto pool payments currently display the configured BTC and USDT ERC20 wallet addresses in the protected join-pool flow.

For live Pesapal card payments, Pesapal API 3.0 requires a registered IPN `notification_id`. Use this listener URL in Pesapal:

```text
https://vollitrading.com/api/payments/pesapal/ipn
```

Add the returned IPN ID as `PESAPAL_NOTIFICATION_ID`, or keep it blank and let the backend attempt to register the IPN URL when the deployed production domain is reachable over HTTPS.
