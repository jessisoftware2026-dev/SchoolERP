import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";

const toneConfig = {
  primary: {
    bar: "from-indigo-500 to-violet-500",
    icon: "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/15 dark:text-indigo-400",
    delta: "text-indigo-600 dark:text-indigo-400",
    glow: "hover:shadow-indigo-500/10",
  },
  accent: {
    bar: "from-violet-500 to-purple-500",
    icon: "bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    delta: "text-violet-600 dark:text-violet-400",
    glow: "hover:shadow-violet-500/10",
  },
  green: {
    bar: "from-emerald-500 to-teal-500",
    icon: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    delta: "text-emerald-600 dark:text-emerald-400",
    glow: "hover:shadow-emerald-500/10",
  },
  amber: {
    bar: "from-amber-500 to-orange-500",
    icon: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    delta: "text-amber-600 dark:text-amber-400",
    glow: "hover:shadow-amber-500/10",
  },
};

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  tone?: "primary" | "accent" | "green" | "amber";
}) {
  const config = toneConfig[tone];

  return (
    <div className={clsx("relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5", config.glow)}>
      <div className={clsx("h-[3px] w-full bg-gradient-to-r", config.bar)} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className={clsx("grid h-9 w-9 shrink-0 place-items-center rounded-lg", config.icon)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
        {delta && (
          <div className={clsx("mt-2 flex items-center gap-1 text-xs font-medium", config.delta)}>
            <TrendingUp className="h-3 w-3" />
            <span>{delta}</span>
          </div>
        )}
      </div>
    </div>
  );
}
