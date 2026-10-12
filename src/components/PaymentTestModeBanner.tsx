const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;

export function PaymentTestModeBanner() {
  if (!clientToken) {
    return (
      <div className="w-full border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
        Live checkout is not configured yet, so payments cannot be taken on this version of the site.
      </div>
    );
  }
  if (clientToken.startsWith("pk_test_")) {
    return (
      <div className="w-full border-b border-border bg-violet-tint px-4 py-2 text-center text-sm text-ink">
        All payments made in the preview are in test mode.{" "}
        <a
          href="https://docs.lovable.dev/features/payments#test-and-live-environments"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline"
        >
          Read more
        </a>
      </div>
    );
  }
  return null;
}
