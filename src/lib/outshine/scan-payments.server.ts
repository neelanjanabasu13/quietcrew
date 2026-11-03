import { createStripeClient, type StripeEnv } from "@/lib/stripe.server";
import { isPaidScanSession } from "./scan-rules";
export async function confirmScanPayment(sessionId: string, environment: StripeEnv, userId?: string, businessId?: string) {
  const stripe = createStripeClient(environment);
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const id = session.metadata?.["outshineScanCreditId"];
  if (!id) return false;
  const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
  const { data: credit, error } = await db.from("outshine_scan_credits").select("*").eq("id", id).eq("stripe_session_id", sessionId).eq("environment", environment).maybeSingle();
  if (error) throw error;
  if (!credit || (userId && credit.user_id !== userId) || (businessId && credit.business_id !== businessId) || !isPaidScanSession(session, credit)) return false;
  const { error: updateError } = await db.from("outshine_scan_credits").update({ payment_status: "paid" }).eq("id", credit.id);
  if (updateError) throw updateError;
  return true;
}
