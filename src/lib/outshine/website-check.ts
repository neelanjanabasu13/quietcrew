/** Look for contact actions in server-rendered HTML. Absence is inconclusive. */
export function websiteNextStep(html: string): boolean | null {
  for (const [, target] of html.matchAll(/<a\b[^>]*\shref\s*=\s*["']([^"']+)["']/gi)) {
    if (target && /^(?:tel:|mailto:)|(?:^|[/.#_-])(?:book(?:ing)?|contact|enquir(?:e|y)|appointments?)(?:[/.?#_-]|$)/i.test(target)) return true;
  }
  return null;
}
