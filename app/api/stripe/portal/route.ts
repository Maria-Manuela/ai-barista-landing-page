import { createClient, createAdminClient } from "@/lib/supabase/server";
import { stripe, getSiteUrl } from "@/lib/stripe";

// Opens the Stripe customer billing portal so users can manage/cancel Pro.
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "unauthenticated" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return Response.json({ error: "no_customer" }, { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: getSiteUrl(),
  });

  return Response.json({ url: session.url });
}
