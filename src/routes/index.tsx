import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing, Plane, XCircle } from "lucide-react";

import { FadeIn } from "@/components/FadeIn";
import { FeatureCard } from "@/components/FeatureCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flight Price Notifier — 機票降價通知" },
      {
        name: "description",
        content:
          "設定航線與目標價，機票降價就通知你。Set a route and a target price — we email you when the fare drops.",
      },
      { property: "og:title", content: "Flight Price Notifier — 機票降價通知" },
      {
        property: "og:description",
        content: "Set a route and a target price — we email you when the fare drops.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: <Plane className="size-5" />,
    title: "盯緊熱門航線",
    subtitle: "Always-on route watching",
    body: "持續監控台北出發的熱門航線（東京、首爾），自動抓最低票價。",
  },
  {
    icon: <BellRing className="size-5" />,
    title: "達標自動通知",
    subtitle: "Target-price email alerts",
    body: "低於你設定的目標價，就寄 email 提醒你，附上立即訂購連結。",
  },
  {
    icon: <XCircle className="size-5" />,
    title: "隨時取消",
    subtitle: "Cancel anytime",
    body: "月訂閱制，不想用隨時停，沒有綁約。",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <span className="flex items-center gap-2 font-semibold tracking-tight">
            <Plane className="size-5 text-primary" />
            Flight Price Notifier
          </span>
          <Link
            to="/auth"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Sign in / 登入
          </Link>
        </div>
      </header>

      <main>
        <section className="hero-surface border-b border-border">
          <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:py-32">
            <p className="animate-fade-up text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Taipei departures
            </p>
            <h1 className="text-gradient animate-fade-up mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              Flight Price Notifier
            </h1>
            <p className="animate-fade-up mt-6 text-xl font-medium sm:text-2xl">
              設定航線與目標價，機票降價就通知你
            </p>
            <p className="animate-fade-up mt-3 text-base text-muted-foreground">
              Set a route and a target price — we email you when the fare drops.
            </p>
            <div className="animate-fade-up mt-10">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
              >
                Sign in / 登入
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <FadeIn key={feature.subtitle} delay={index * 120}>
                <FeatureCard {...feature} />
              </FadeIn>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-muted-foreground">
          © 2026 Flight Price Notifier
        </div>
      </footer>
    </div>
  );
}
