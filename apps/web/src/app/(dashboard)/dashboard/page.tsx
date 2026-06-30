import {
  GraduationCap,
  Wallet,
  CalendarCheck,
  TrendingUp,
  Bot,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";

export const metadata = { title: "Dashboard · Jessi ERP" };

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back — here is what is happening across your school today.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live · {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Students"
          value="2,847"
          delta="+124 this term"
          icon={GraduationCap}
          tone="primary"
        />
        <StatCard
          label="Fees Collected"
          value="₹38.2L"
          delta="+8.4% vs last month"
          icon={Wallet}
          tone="green"
        />
        <StatCard
          label="Attendance Today"
          value="94.6%"
          delta="+1.2% vs avg"
          icon={CalendarCheck}
          tone="accent"
        />
        <StatCard
          label="Pending Admissions"
          value="63"
          delta="18 awaiting review"
          icon={TrendingUp}
          tone="amber"
        />
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Enrolment Overview</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly student count · 2025–2026</p>
            </div>
            <span className="rounded-full border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground">
              Last 12 months
            </span>
          </div>
          <EnrolmentChart />
        </div>

        {/* AI Insights */}
        <div className="rounded-xl border bg-card shadow-sm p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(124,58,237,0.15))" }}>
              <Bot className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="font-semibold leading-none">AI Insights</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Powered by Jessi AI</p>
            </div>
          </div>

          <ul className="space-y-2.5">
            <InsightCard
              text="12 students flagged as at-risk based on attendance & recent results."
              tag="Risk model"
              color="red"
            />
            <InsightCard
              text="Grade 9-B timetable can be optimised to remove 3 idle periods."
              tag="Scheduler"
              color="amber"
            />
            <InsightCard
              text="Fee reminders drafted for 41 overdue accounts."
              tag="Assistant"
              color="indigo"
            />
          </ul>

          <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed py-2 text-xs text-muted-foreground transition-colors hover:border-violet-400 hover:text-violet-500">
            <Sparkles className="h-3 w-3" />
            Ask AI Assistant
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

const tagColors: Record<string, string> = {
  red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
};

const dotColors: Record<string, string> = {
  red: "bg-red-500",
  amber: "bg-amber-500",
  indigo: "bg-indigo-500",
};

function InsightCard({ text, tag, color }: { text: string; tag: string; color: string }) {
  return (
    <li className="rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/60">
      <div className="flex items-start gap-2">
        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotColors[color]}`} />
        <p className="text-sm leading-snug">{text}</p>
      </div>
      <span className={`mt-2 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tagColors[color]}`}>
        {tag}
      </span>
    </li>
  );
}

function EnrolmentChart() {
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const values = [42, 55, 48, 67, 73, 61, 80, 76, 69, 88, 91, 84];
  const max = Math.max(...values);
  const gridLines = [0, 25, 50, 75, 100];

  return (
    <div className="mt-6">
      <div className="relative flex h-44 items-end gap-1.5">
        {/* Y-axis grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-0">
          {gridLines.reverse().map((v) => (
            <div key={v} className="flex items-center gap-2">
              <span className="w-6 text-right text-[10px] text-muted-foreground">{v}</span>
              <div className="flex-1 border-t border-dashed border-border/60" />
            </div>
          ))}
        </div>
        {/* Bars */}
        <div className="relative flex flex-1 items-end gap-1.5 pl-8 h-full">
          {values.map((v, i) => (
            <div
              key={i}
              className="group relative flex-1 cursor-default"
              style={{ height: "100%" }}
            >
              <div
                className="absolute bottom-0 w-full rounded-t-md overflow-hidden transition-all duration-200"
                style={{ height: `${(v / max) * 100}%` }}
              >
                <div
                  className="absolute inset-0 opacity-25 group-hover:opacity-70 transition-opacity duration-200"
                  style={{ background: "linear-gradient(to top, #4f46e5, #7c3aed)" }}
                />
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 hidden group-hover:block z-10">
                <div className="rounded bg-foreground px-1.5 py-0.5 text-[10px] font-medium text-background whitespace-nowrap shadow-lg">
                  {v}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* X-axis labels */}
      <div className="mt-2 flex pl-8 gap-1.5">
        {months.map((m) => (
          <span key={m} className="flex-1 text-center text-[10px] text-muted-foreground">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
