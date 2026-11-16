/** Every Quietcrew price, stored once in pence. Browser-safe. */
export const PRICES_PENCE = {
  fixPack: 1999,
  fixPackWas: 2499,
  outshineScan: 299,
  goldmineScan: 4900,
  workflowAudit: 9900,
  consultationHourly: 14900,
} as const;

/** £19.99, or £49 when the amount is whole pounds. */
export function formatGbp(pence: number): string {
  return `£${pence % 100 === 0 ? pence / 100 : (pence / 100).toFixed(2)}`;
}

export const PRICE_LABELS = {
  fixPack: formatGbp(PRICES_PENCE.fixPack),
  fixPackWas: formatGbp(PRICES_PENCE.fixPackWas),
  outshineScan: formatGbp(PRICES_PENCE.outshineScan),
  goldmineScan: formatGbp(PRICES_PENCE.goldmineScan),
  workflowAudit: formatGbp(PRICES_PENCE.workflowAudit),
  consultationHourly: formatGbp(PRICES_PENCE.consultationHourly),
} as const;
