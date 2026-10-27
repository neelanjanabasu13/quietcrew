import { createStripeClient, type StripeEnv } from "@/lib/stripe.server";
import { isPaidDiySession } from "./payment-rules";

export async function confirmDiyPayment(sessionId: string, environment: StripeEnv) {
  const stripe = createStripeClient(environment);
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const purchaseId = session.metadata?.['outshinePurchaseId'];
  if (!purchaseId) return false;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: purchase, error } = await supabaseAdmin.from("outshine_purchases").select("*").eq("id", purchaseId).eq("stripe_session_id", sessionId).eq("environment", environment).maybeSingle();
  if (error) throw error;
  if (!purchase || !isPaidDiySession(session, purchase)) return false;
  const { error: updateError } = await supabaseAdmin.from("outshine_purchases").update({ payment_status: "paid", paid_at: new Date().toISOString() }).eq("id", purchase.id);
  if (updateError) throw updateError;
  return true;
}