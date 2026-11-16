const ALLOWED = new Set(["https://quietcrew.ai", "https://www.quietcrew.ai", "https://quietcrew.lovable.app"]);

function isAllowed(origin: string): boolean {
  if (ALLOWED.has(origin)) return true;
  const u = new URL(origin);
  if (u.protocol === "http:" && u.hostname === "localhost") return true;
  return u.protocol === "https:" && u.hostname.includes("6459a9a5-e354-4c9b-9a4d-75ab325da696") && (u.hostname.endsWith(".lovable.app") || u.hostname.endsWith(".lovableproject.com"));
}

/** Returns the origin only when it is one of the app's own hosts. */
export function allowedOrigin(value: string): string {
  const origin = new URL(value).origin;
  if (!isAllowed(origin)) throw new Error("Invalid return address");
  return origin;
}

/** Validates that a full return URL points back to the app itself. */
export function assertAllowedReturnUrl(value: string): string {
  allowedOrigin(value);
  return value;
}
