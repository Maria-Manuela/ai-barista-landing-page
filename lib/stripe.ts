import Stripe from "stripe";

// Test-mode secret key (sk_test_...) from your Stripe sandbox. A non-empty
// placeholder keeps the module importable before env is configured (real API
// calls will still fail loudly until STRIPE_SECRET_KEY is set).
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
  { typescript: true }
);

export const PRO_PRICE_ID = process.env.STRIPE_PRICE_ID ?? "";

export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}
