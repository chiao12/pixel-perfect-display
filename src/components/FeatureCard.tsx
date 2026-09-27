import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  body: string;
}

export function FeatureCard({ icon, title, subtitle, body }: FeatureCardProps) {
  return (
    <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-colors duration-300 hover:border-primary/50">
      <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-accent text-primary transition-transform duration-300 group-hover:scale-105">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      <p className="mt-1 text-sm font-medium text-primary">{subtitle}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
