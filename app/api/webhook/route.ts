// app/api/webhook/route.ts
// Stripe webhook handler — grants pack access after successful payment.
// Register this URL in your Stripe dashboard:
//   https://dashboard.stripe.com/webhooks → https://yourdomain.com/api/webhook
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });
  }

  const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (!userId) {
      console.error("Webhook: no userId in metadata for session", session.id);
      return NextResponse.json({ received: true });
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const supabase = getSupabaseServerClient();
    const packExpiresAt = new Date();
    packExpiresAt.setDate(packExpiresAt.getDate() + 30);

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        plan: "pack",
        pack_purchased_at: new Date().toISOString(),
        pack_expires_at: packExpiresAt.toISOString(),
      });

    if (error) {
      console.error("Webhook: failed to update profile for user", userId, error);
      return NextResponse.json({ error: "DB update failed." }, { status: 500 });
    }

    console.log(`Pack granted to user ${userId}, expires ${packExpiresAt.toISOString()}`);
  }

  return NextResponse.json({ received: true });
}
