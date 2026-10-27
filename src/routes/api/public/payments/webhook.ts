import { createFileRoute } from "@tanstack/react-router";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";

/**
 * Payment notifications. Trust comes from the signature check alone. Each
 * event is recorded once by its id and an order moves to paid only once, so a
 * repeated notification changes nothing.
 */
async function fulfil(session: any, eventId: string, environment: StripeEnv) {
  if (session?.metadata?.outshinePurchaseId) {
    const { confirmDiyPayment } = await import("@/lib/outshine/payments.server");
    await confirmDiyPayment(session.id, environment);
    return;
  }
  const orderId: string | undefined = session?.metadata?.goldmineOrderId;
  if (!orderId) return;
  const { recordPaymentEvent, markOrderPaid } = await import("@/lib/goldmine/orders.server");
  const fresh = await recordPaymentEvent({ provider: "stripe", eventId, orderId, payload: { session: session.id } });
  if (!fresh) return;
  await markOrderPaid(orderId, session.id, "stripe");
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          return Response.json({ received: true, ignored: "invalid env" });
        }
        const env: StripeEnv = rawEnv;
        try {
          const event = await verifyWebhook(request, env);
          const obj = event.data.object;
          if (event.type === "checkout.session.completed" && obj.payment_status !== "unpaid") {
            await fulfil(obj, event.id, env);
          } else if (event.type === "checkout.session.async_payment_succeeded") {
            await fulfil(obj, event.id, env);
          }
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
