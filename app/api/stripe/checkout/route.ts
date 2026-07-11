import { createClient, createAdminClient } from "@/lib/supabase/server";
import { stripe, PRO_PRICE_ID, getSiteUrl } from "@/lib/stripe";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "unauthenticated" }, { status: 401 });
  }

  if (!PRO_PRICE_ID) {
    return Response.json(
      { error: "missing_price", message: "STRIPE_PRICE_ID is not set." },
      { status: 500 }
    );
  }

  const admin = createAdminClient();

  // Reuse an existing Stripe customer if we have one, otherwise create it.
  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id, is_pro")
    .eq("id", user.id)
    .single();

  if (profile?.is_pro) {
    return Response.json({ error: "already_pro" }, { status: 400 });
  }

  let customerId = profile?.stripe_customer_id ?? undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await admin
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const siteUrl = getSiteUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
    client_reference_id: user.id,
    subscription_data: { metadata: { user_id: user.id } },
    success_url: `${siteUrl}/?checkout=success`,
    cancel_url: `${siteUrl}/?checkout=cancel`,
    allow_promotion_codes: true,
  });

  return Response.json({ url: session.url });
}
