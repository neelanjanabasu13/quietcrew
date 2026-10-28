export const DIY_AMOUNT = 999;
export const DIY_PRICE_ID = "outshine_diy_single";

export function isPaidDiySession(session: {
  status?: string | null;
  payment_status?: string;
  amount_total?: number | null;
  currency?: string | null;
  metadata?: Record<string, string> | null;
}, purchase: { id: string; user_id: string; business_id: string; environment: string }) {
  return session.status === "complete" && session.payment_status === "paid"
    && session.amount_total === DIY_AMOUNT && session.currency === "gbp"
    && session.metadata?.['outshinePurchaseId'] === purchase.id
    && session.metadata?.['userId'] === purchase.user_id
    && session.metadata?.['businessId'] === purchase.business_id
    && session.metadata?.['environment'] === purchase.environment;
}