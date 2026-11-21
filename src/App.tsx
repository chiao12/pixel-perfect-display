import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import AppPage from "@/pages/AppPage";
import AuthPage from "@/pages/AuthPage";
import Landing from "@/pages/Landing";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Tracks the Supabase session; `undefined` while it is still loading. */
function useSession(): Session | null | undefined {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      if (event === "SIGNED_IN" || event === "USER_UPDATED") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient]);

  return session;
}

function RequireAuth({ session, children }: { session: Session | null | undefined; children: ReactNode }) {
  if (session === undefined) return null;
  if (!session) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

export function App() {
  const session = useSession();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthPage session={session} />} />
      <Route
        path="/app"
        element={
          <RequireAuth session={session}>
            <AppPage user={session?.user ?? null} />
          </RequireAuth>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
