import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";

export default function AppPage({ user }: { user: User | null }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <span className="flex items-center gap-2 font-semibold tracking-tight">
            <Plane className="size-5 text-primary" />
            Flight Price Notifier
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Sign out / 登出
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-16">
        <h1 className="animate-fade-up text-2xl font-semibold tracking-tight sm:text-3xl">
          Hi {user?.email}
        </h1>
        <div className="animate-fade-up mt-8 rounded-2xl border border-border bg-card p-8 shadow-card">
          <p className="text-base text-card-foreground">
            你的航線追蹤儀表板即將上線 — 下一個里程碑會加上訂閱航線的功能。
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Your dashboard is coming soon. Route-subscription will be added in the next
            milestone.
          </p>
        </div>
      </main>
    </div>
  );
}
