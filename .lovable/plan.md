# Promo codes and test purchases: findings (read-only)

## What was recommended in this project
- 12 Oct (chat #197) and 13 Nov (chat #565): no codes. Test in the preview with Stripe's test card 4242 4242 4242 4242, any future expiry, any CVC. Promo codes were offered as a later option and never built.
- Nothing in this project has created a coupon or promotion code.

## Sandbox vs live
- Preview uses the sandbox (test) Stripe account. The published site uses the live account. Each checkout passes `environment` ("sandbox" or "live"), and Outshine purchases are stored separately per environment.
- A Stripe coupon or promotion code exists in only one environment. A code made in the test account does nothing on the live site.

## Where codes would be made and typed
- Made: in the Stripe dashboard for the chosen account (Product catalogue, Coupons, then add a promotion code). I cannot see whether any exist.
- Typed: nowhere at the moment. No checkout turns on `allow_promotion_codes` or passes `discounts`, so Stripe shows no "Add promotion code" box:
  - Goldmine: `src/lib/goldmine.functions.ts`, `checkout.sessions.create`
  - Outshine Fix Pack: `src/lib/outshine/payments.functions.ts`, `checkout.sessions.create`
- There is no separate test-unlock mechanism. The only test route is the sandbox test card.

## What a 100% discount would do (if the box is turned on)
Stripe then marks the session `payment_status: "no_payment_required"` with `amount_total: 0`.
- Goldmine: `src/routes/api/public/payments/webhook.ts` fulfils whenever `payment_status !== "unpaid"`, then `markOrderPaid` in `src/lib/goldmine/orders.server.ts` sets the order to paid with no check on the amount. So a 100% code would unlock the scan.
- Outshine Fix Pack: `isPaidDiySession` in `src/lib/outshine/payment-rules.ts` requires `payment_status === "paid"` and `amount_total === DIY_AMOUNT` (999). A free session fails, and the pack stays locked.
- Outshine £2.99 scan: `isPaidScanSession` in `src/lib/outshine/scan-rules.ts` has the same strict checks, so it stays locked too.

## What I could not check
Whether any coupons exist in either Stripe account, and what Lovable's own tooling says about promo codes. If she saw promo codes created somewhere, they were not wired into this checkout.

## Optional next step (needs approval, not done)
If she wants working codes, I would turn on `allow_promotion_codes` for both checkouts. The Outshine checks would then accept the amount after the discount, still matching the user, business, environment and metadata, and Goldmine would also get an amount check. Tests would be added for each rule.
