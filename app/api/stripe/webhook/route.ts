import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

// Stripe requires the raw request body to verify the signature.
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return Response.json({ error: "missing_signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid signature";
    return Response.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  const admin = createAdminClient();

  const setPro = async (
    userId: string | null | undefined,
    isPro: boolean,
    fields: Record<string, unknown> = {}
  ) => {
    if (!userId) return;
    await admin
      .from("profiles")
      .update({ is_pro: isPro, ...fields })
      .eq("id", userId);
  };

  // Resolve our user id from event data (metadata first, then customer lookup).
  const resolveUserId = async (
    metadataUserId?: string | null,
    customerId?: string | null
  ): Promise<string | null> => {
    if (metadataUserId) return metadataUserId;
    if (customerId) {
      const { data } = await admin
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();
      return data?.id ?? null;
    }
    return null;
  };

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId =
        session.client_reference_id ??
        (session.metadata?.user_id as string | undefined) ??
        (await resolveUserId(null, session.customer as string));
      await setPro(userId, true, {
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
      });
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const active = sub.status === "active" || sub.status === "trialing";
      const userId = await resolveUserId(
        sub.metadata?.user_id,
        sub.customer as string
      );
      await setPro(userId, active, { stripe_subscription_id: sub.id });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = await resolveUserId(
        sub.metadata?.user_id,
        sub.customer as string
      );
      await setPro(userId, false, { stripe_subscription_id: null });
      break;
    }

    default:
      break;
  }

  return Response.json({ received: true });
}
