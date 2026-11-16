import { PRICES_PENCE } from "../pricing";

export const DIY_AMOUNT = PRICES_PENCE.fixPack;
export const DIY_PRICE_ID = "outshine_diy_single";

export function isPaidDiySession(session: {
  status?: string | null;
  payment_status?: string;
  amount_total?: number | null;
  amount_subtotal?: number | null;
  currency?: string | null;
  metadata?: Record<string, string> | null;
}, purchase: { id: string; user_id: string; business_id: string; environment: string; amount?: number | null }) {
  return session.status === "complete" && isSettledAmount(session, purchase.amount ?? DIY_AMOUNT) && session.currency === "gbp"
    && session.metadata?.['outshinePurchaseId'] === purchase.id
    && session.metadata?.['userId'] === purchase.user_id
    && session.metadata?.['businessId'] === purchase.business_id
    && session.metadata?.['environment'] === purchase.environment;
}

/** Full price paid, or a promotion code covered the whole expected price. */
export function isSettledAmount(session: { payment_status?: string; amount_total?: number | null; amount_subtotal?: number | null }, expected: number) {
  if (session.payment_status === "paid") return session.amount_total === expected;
  return session.payment_status === "no_payment_required" && session.amount_total === 0 && session.amount_subtotal === expected;
}
