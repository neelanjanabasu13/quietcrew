import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

function safeNext(value: unknown): string {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export const Route = createFileRoute("/login")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({ next: safeNext(search['next']) }),
  head: () => ({
    meta: [
      { title: "Sign in | Quietcrew" },
      {
        name: "description",
        content: "Sign in to the Quietcrew account area to review Workflow Review enquiries.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Sign in | Quietcrew" },
      {
        property: "og:description",
        content: "Sign in to the Quietcrew account area to review Workflow Review enquiries.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://quietcrew.ai/login" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://quietcrew.ai/login" }],
  }),
  component: Login,
});

const fieldClass =
  "w-full rounded-[14px] border-0 bg-muted px-4 py-3.5 text-[16px] text-ink placeholder:text-muted-paper";

function Login() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) {
      setBusy(false);
      setError(signInError.message);
      return;
    }
    window.location.href = next;
    navigate({ to: next as string }).catch(() => undefined);
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-[460px] flex-col justify-center px-6 py-16">
      <h1 className="text-[2rem] font-extrabold tracking-[-0.02em] text-ink">Sign in</h1>
      <p className="mt-3 text-[17px] leading-[1.6] text-muted-paper">
        This area is for the Quietcrew team. Accounts are created by the owner, so there is no public
        sign up.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="mb-2 block text-[14px] font-semibold text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className={fieldClass}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-[14px] font-semibold text-ink">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            className={fieldClass}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error ? (
          <p role="alert" className="text-[15px] text-ink">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={busy} className="pill-btn btn-violet w-full px-7 py-4">
          {busy ? "Signing in" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
