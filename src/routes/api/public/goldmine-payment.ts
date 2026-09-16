/**
 * Goldmine payment notification receiver.
 *
 * Duplicate notifications are the normal case with payment providers, so the
 * event id is recorded first and a repeat is acknowledged without starting a
 * second scan. Paid scanning is switched off until the research engine is
 * connected, so a verified payment is recorded and the scan is left to be
 * started deliberately afterwards.
 *
 * This endpoint has not been exercised by a real provider. It stays inert
 * while GOLDMINE_PAYMENT_WEBHOOK_SECRET is unset.
 */

import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const eventSchema = z.object({
  id: z.string().min(1).max(200),
  type: z.string().min(1).max(120),
  orderId: z.string().uuid(),
  reference: z.string().min(1).max(200),
});

function signatureMatches(secret: string, body: string, provided: string | null): boolean {
  if (!provided) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/public/goldmine-payment")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["GOLDMINE_PAYMENT_WEBHOOK_SECRET"];
        if (!secret) {
          return new Response("Payments are not enabled", { status: 503 });
        }

        const body = await request.text();
        if (!signatureMatches(secret, body, request.headers.get("x-goldmine-signature"))) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: z.infer<typeof eventSchema>;
        try {
          event = eventSchema.parse(JSON.parse(body));
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        const { recordPaymentEvent, markOrderPaid } = await import("@/lib/goldmine/orders.server");

        const isNew = await recordPaymentEvent({
          provider: "goldmine-checkout",
          eventId: event.id,
          orderId: event.orderId,
          payload: event,
        });
        if (!isNew) {
          return Response.json({ received: true, duplicate: true });
        }

        if (event.type !== "payment.succeeded") {
          return Response.json({ received: true, ignored: true });
        }

        const paid = await markOrderPaid(event.orderId, event.reference, "goldmine-checkout");
        return Response.json({ received: true, alreadyPaid: paid === null });
      },
    },
  },
});
