export const GUEST_FREE_SCANS = 1;
export const ACCOUNT_FREE_SCANS = 3;
export const SCAN_AMOUNT = 299;
export const SCAN_PRICE_ID = "outshine_scan_single";
export const REPORT_TTL_MS = 48 * 60 * 60 * 1000;

export function freeScansRemaining(signedIn: boolean, used: number) {
  return Math.max(0, (signedIn ? ACCOUNT_FREE_SCANS : GUEST_FREE_SCANS) - used);
}
export function savedReportValid(expiresAt: string | null, now = Date.now()) {
  return Boolean(expiresAt && Date.parse(expiresAt) > now);
}
export function isPaidScanSession(session: { status?: string | null; payment_status?: string; amount_total?: number | null; currency?: string | null; metadata?: Record<string, string> | null }, credit: { id: string; user_id: string; business_id: string; environment: string }) {
  return session.status === "complete" && session.payment_status === "paid" && session.amount_total === SCAN_AMOUNT && session.currency === "gbp"
    && session.metadata?.["outshineScanCreditId"] === credit.id && session.metadata?.["userId"] === credit.user_id
    && session.metadata?.["businessId"] === credit.business_id && session.metadata?.["environment"] === credit.environment;
}
