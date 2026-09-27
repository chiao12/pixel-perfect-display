import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plane } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in / 登入 — Flight Price Notifier" },
      {
        name: "description",
        content: "Sign in or create an account to watch flight prices from Taipei.",
      },
      { property: "og:title", content: "Sign in / 登入 — Flight Price Notifier" },
      {
        property: "og:description",
        content: "Sign in or create an account to watch flight prices from Taipei.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.origin },
          });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    const { data } = await supabase.auth.getSession();
    if (data.session) {
      navigate({ to: "/app", replace: true });
    } else {
      setError("Check your email to confirm your account, then sign in.");
    }
  }

  return (
    <div className="hero-surface flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <Link to="/" className="mb-8 flex items-center gap-2 font-semibold tracking-tight">
        <Plane className="size-5 text-primary" />
        Flight Price Notifier
      </Link>

      <div className="animate-fade-up w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-card">
        <h1 className="text-xl font-semibold text-card-foreground">
          {mode === "signin" ? "Sign in / 登入" : "Sign up / 註冊"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "歡迎回來，登入查看你的航線追蹤。"
            : "建立帳號，開始追蹤機票價格。"}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading
              ? "請稍候…"
              : mode === "signin"
                ? "Sign in / 登入"
                : "Sign up / 註冊"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
          }}
          className="mt-5 w-full text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {mode === "signin"
            ? "還沒有帳號？註冊 / Create an account"
            : "已經有帳號？登入 / Sign in"}
        </button>
      </div>
    </div>
  );
}
