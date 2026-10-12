import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const NEXT_KEY = "quietcrew.authNext";

function safeNext(value: unknown): string {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export const Route = createFileRoute("/login")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { next: string; mode?: "signin" | "signup" } => ({
    next: safeNext(search["next"]),
    mode: search["mode"] === "signin" ? "signin" : search["mode"] === "signup" ? "signup" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Create an account or sign in | Quietcrew" },
      {
        name: "description",
        content: "Create a Quietcrew account or sign in to keep your Goldmine scans and unlock full results.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Create an account or sign in | Quietcrew" },
      {
        property: "og:description",
        content: "Create a Quietcrew account or sign in to keep your Goldmine scans and unlock full results.",
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

function GoogleMark() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}

function Login() {
  const { next, mode: initialMode } = Route.useSearch();
  const isGoldmine = next.startsWith("/goldmine");
  const [mode, setMode] = useState<"signup" | "signin">(initialMode ?? (isGoldmine ? "signup" : "signin"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Returning from Google or an email confirmation link lands here with a
  // session, so send the person on to where they were heading.
  useEffect(() => {
    const go = () => {
      const stored = safeNext(sessionStorage.getItem(NEXT_KEY) ?? next);
      sessionStorage.removeItem(NEXT_KEY);
      window.location.href = stored;
    };
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) go();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) go();
    });
    return () => sub.subscription.unsubscribe();
  }, [next]);

  async function onGoogle() {
    setError(null);
    sessionStorage.setItem(NEXT_KEY, next);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/login`,
    });
    if (result.error) {
      setError("Google sign-in did not complete. Please try again.");
      return;
    }
    if (result.redirected) return;
    window.location.href = safeNext(sessionStorage.getItem(NEXT_KEY) ?? next);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Your password needs at least eight characters.");
      return;
    }
    setBusy(true);
    sessionStorage.setItem(NEXT_KEY, next);

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/login?next=${encodeURIComponent(next)}` },
      });
      setBusy(false);
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (!data.session) {
        setNotice(
          `We have sent a confirmation link to ${email.trim()}. Open it on this device and you will come straight back here, signed in, with your preview waiting.`,
        );
      }
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (signInError) setError(signInError.message);
  }

  const tabClass = (active: boolean) =>
    `flex-1 rounded-full px-4 py-2.5 text-[15px] font-semibold transition ${
      active ? "bg-white text-ink soft-shadow" : "text-muted-paper"
    }`;

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-[460px] flex-col justify-center px-6 py-16">
      <h1 className="text-[2rem] font-extrabold tracking-[-0.02em] text-ink">
        {mode === "signup" ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-3 text-[17px] leading-[1.6] text-muted-paper">
        {isGoldmine
          ? "An account keeps your Goldmine preview safe and is where the full scan lives once you buy it for £49. Your free preview comes with you."
          : "Sign in to your Quietcrew account, or create one if this is your first visit."}
      </p>

      <div role="tablist" aria-label="Account" className="mt-6 flex gap-1 rounded-full bg-muted p-1">
        <button type="button" role="tab" aria-selected={mode === "signup"} className={tabClass(mode === "signup")} onClick={() => { setMode("signup"); setError(null); setNotice(null); }}>
          Create account
        </button>
        <button type="button" role="tab" aria-selected={mode === "signin"} className={tabClass(mode === "signin")} onClick={() => { setMode("signin"); setError(null); setNotice(null); }}>
          Sign in
        </button>
      </div>

      <button
        type="button"
        onClick={onGoogle}
        className="pill-btn mt-6 flex w-full items-center justify-center gap-3 bg-white px-7 py-4 text-[16px] font-semibold text-ink soft-shadow"
      >
        <GoogleMark />
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3 text-[13px] text-muted-paper">
        <span className="h-px flex-1 bg-border" />
        or use your email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="mb-2 block text-[14px] font-semibold text-ink">Email</label>
          <input id="email" type="email" autoComplete="email" required className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-[14px] font-semibold text-ink">Password</label>
          <input
            id="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            minLength={8}
            className={fieldClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {mode === "signup" ? <p className="mt-2 text-[13px] text-muted-paper">At least eight characters.</p> : null}
        </div>
        {error ? <p role="alert" className="text-[15px] text-ink">{error}</p> : null}
        {notice ? <p role="status" className="rounded-[14px] bg-violet-tint p-4 text-[15px] text-ink">{notice}</p> : null}
        <button type="submit" disabled={busy} className="pill-btn btn-primary-dark w-full px-7 py-4">
          {busy ? "Please wait" : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      {isGoldmine ? (
        <a href="/goldmine" className="mt-6 text-center text-[15px] font-semibold text-violet underline-offset-4 hover:underline">
          Back to my free preview
        </a>
      ) : null}
    </main>
  );
}
