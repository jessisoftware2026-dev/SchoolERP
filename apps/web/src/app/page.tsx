import Link from "next/link";
import {
  School,
  ArrowRight,
  GraduationCap,
  Wallet,
  CalendarCheck,
  ClipboardList,
  Clock,
  Users,
  Bus,
  Bot,
  BarChart2,
  Shield,
  Zap,
  CheckCircle2,
  ChevronRight,
  Star,
  TrendingUp,
} from "lucide-react";

export const metadata = {
  title: "Jessi ERP — AI-Powered School Management Platform",
  description: "The modern ERP platform for schools. Manage students, fees, attendance, HR, and AI insights — all in one place.",
};

/* ─────────────────────────────────────────────────── */
/*  Page                                              */
/* ─────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
      <Navbar />
      <Hero />
      <StatsBar />
      <Features />
      <AISection />
      <WhySection />
      <CTASection />
      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────────── */
/*  Navbar                                            */
/* ─────────────────────────────────────────────────── */
function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/30">
            <School className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-white">Jessi ERP</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          {["Features", "Modules", "Pricing", "Docs"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="transition-colors hover:text-slate-900 dark:hover:text-white"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:block text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md active:scale-95"
          >
            Get Started
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────── */
/*  Hero                                              */
/* ─────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 pb-24 pt-20">
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text */}
          <div className="animate-fade-up space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400">
              <Zap className="h-3 w-3" />
              AI-Powered School Management
            </div>

            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white lg:text-6xl">
              Run your school{" "}
              <span className="animate-gradient bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                smarter
              </span>
              ,{" "}
              <br className="hidden sm:block" />
              not harder.
            </h1>

            <p className="text-lg leading-relaxed text-slate-400 max-w-xl">
              Jessi ERP brings admissions, fees, attendance, HR, and AI-driven
              insights into one seamless platform — built for the schools of tomorrow.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-600/40 active:scale-95"
              >
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-slate-500 hover:text-white"
              >
                Explore features
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {["bg-indigo-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500"].map((c, i) => (
                  <div
                    key={i}
                    className={`grid h-8 w-8 place-items-center rounded-full border-2 border-slate-950 text-[10px] font-bold text-white ${c}`}
                  >
                    {["PS", "RK", "AM", "DT"][i]}
                  </div>
                ))}
              </div>
              <div className="text-sm text-slate-400">
                <span className="font-semibold text-white">500+</span> school admins trust Jessi ERP
              </div>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="animate-float lg:justify-self-end">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardMockup() {
  const bars = [42, 55, 48, 67, 73, 61, 80, 76, 69, 88, 91, 84];
  return (
    <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50 overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-950 px-4 py-3">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        <div className="mx-4 h-5 flex-1 rounded-md bg-slate-800 px-2 text-[10px] text-slate-600 flex items-center">
          localhost:3000/dashboard
        </div>
      </div>

      {/* App shell */}
      <div className="flex h-72">
        {/* Mini sidebar */}
        <div className="w-14 shrink-0 border-r border-slate-800 bg-slate-950 p-2 flex flex-col gap-1.5">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-600 mx-auto mb-3">
            <School className="h-3.5 w-3.5 text-white" />
          </div>
          {[true, false, false, false, false, false].map((active, i) => (
            <div
              key={i}
              className={`h-7 w-7 rounded-lg mx-auto ${active ? "bg-indigo-600" : "bg-slate-800"}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-3 space-y-3 overflow-hidden">
          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { bar: "bg-indigo-500", val: "2,847" },
              { bar: "bg-emerald-500", val: "₹38L" },
              { bar: "bg-violet-500",  val: "94.6%" },
              { bar: "bg-amber-500",   val: "63" },
            ].map(({ bar, val }) => (
              <div key={val} className="rounded-lg bg-slate-800 p-2 overflow-hidden">
                <div className={`h-0.5 w-full rounded-full ${bar} mb-2`} />
                <div className="h-1 w-8 rounded bg-slate-700 mb-1.5" />
                <div className="text-[11px] font-bold text-white">{val}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="rounded-lg bg-slate-800 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="h-1.5 w-20 rounded bg-slate-700" />
              <div className="h-1.5 w-12 rounded bg-slate-700" />
            </div>
            <div className="flex h-20 items-end gap-1">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-indigo-500/30 transition-colors hover:bg-indigo-500/60"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Mini table rows */}
          <div className="rounded-lg bg-slate-800 overflow-hidden">
            {[
              { color: "bg-indigo-500", name: "Aarav Sharma", badge: "Active" },
              { color: "bg-emerald-500", name: "Diya Patel",   badge: "Active" },
              { color: "bg-amber-500",  name: "Kabir Singh",   badge: "Pending" },
            ].map(({ color, name, badge }) => (
              <div key={name} className="flex items-center gap-2 border-b border-slate-700/50 px-3 py-1.5 last:border-0">
                <div className={`h-4 w-4 shrink-0 rounded-full ${color}`} />
                <span className="text-[11px] font-medium text-slate-300 flex-1">{name}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${badge === "Active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────── */
/*  Stats bar                                         */
/* ─────────────────────────────────────────────────── */
function StatsBar() {
  const stats = [
    { label: "Students managed",   value: "2,847+",  icon: GraduationCap },
    { label: "Fees processed",     value: "₹38.2L",  icon: Wallet },
    { label: "Avg. attendance",    value: "94.6%",   icon: CalendarCheck },
    { label: "Schools onboarded",  value: "500+",    icon: School },
  ];

  return (
    <section className="border-b bg-white dark:bg-slate-900 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 dark:divide-slate-800 md:grid-cols-4 md:divide-y-0">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 py-8 px-4 text-center">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 mb-1">
                <Icon className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────── */
/*  Features                                          */
/* ─────────────────────────────────────────────────── */
const FEATURES = [
  { icon: GraduationCap, title: "Student Management",  desc: "Admissions, profiles, grades, and enrolment history in one place.",       color: "text-indigo-500",  bg: "bg-indigo-50 dark:bg-indigo-500/10" },
  { icon: Wallet,         title: "Fees & Finance",      desc: "Invoicing, collections, reminders, and real-time fee dashboards.",        color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { icon: CalendarCheck,  title: "Attendance",          desc: "Daily and session-wise tracking with biometric integration support.",      color: "text-violet-500",  bg: "bg-violet-50 dark:bg-violet-500/10" },
  { icon: ClipboardList,  title: "Exams & Results",     desc: "Schedule exams, record marks, and publish report cards instantly.",       color: "text-rose-500",    bg: "bg-rose-50 dark:bg-rose-500/10" },
  { icon: Clock,          title: "Timetable",           desc: "Auto-generate conflict-free timetables for classes and teachers.",        color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-500/10" },
  { icon: Users,          title: "HR & Payroll",        desc: "Staff records, leave management, and automated payroll processing.",      color: "text-sky-500",     bg: "bg-sky-50 dark:bg-sky-500/10" },
  { icon: Bus,            title: "Transport",           desc: "Route planning, vehicle tracking, and parent notifications.",             color: "text-orange-500",  bg: "bg-orange-50 dark:bg-orange-500/10" },
  { icon: Bot,            title: "AI Assistant",        desc: "Predict at-risk students, generate insights, and automate reports.",      color: "text-purple-500",  bg: "bg-purple-50 dark:bg-purple-500/10" },
];

function Features() {
  return (
    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Everything you need
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            One platform. Every module.
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            Purpose-built modules that talk to each other — no stitching together
            five different tools.
          </p>
        </div>

        {/* Grid */}
        <div id="modules" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className={`mb-4 grid h-11 w-11 place-items-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────── */
/*  AI Section                                        */
/* ─────────────────────────────────────────────────── */
function AISection() {
  const insights = [
    { tag: "Risk model", color: "bg-red-500/10 text-red-400 border-red-500/20",    dot: "bg-red-500",    text: "12 students flagged at-risk based on attendance & assessment trends." },
    { tag: "Scheduler",  color: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-500", text: "Grade 9-B timetable can be optimised to remove 3 idle periods per week." },
    { tag: "Finance",    color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", dot: "bg-indigo-500", text: "₹4.2L in fee reminders drafted and queued for 41 overdue accounts." },
    { tag: "Assistant",  color: "bg-violet-500/10 text-violet-400 border-violet-500/20", dot: "bg-violet-500", text: "Predicted 18% enrolment growth for Grade 6 next term based on trends." },
  ];

  return (
    <section className="bg-slate-950 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Insights panel */}
          <div className="order-2 lg:order-1 space-y-3">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10">
                <Bot className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-400">AI Insights</p>
                <p className="text-sm text-slate-400">Updated just now</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </div>
            </div>

            {insights.map(({ tag, color, dot, text }) => (
              <div
                key={tag}
                className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-slate-700"
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
                  <p className="flex-1 text-sm text-slate-300 leading-relaxed">{text}</p>
                </div>
                <div className="mt-3">
                  <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${color}`}>
                    {tag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2 space-y-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              Powered by AI
            </p>
            <h2 className="text-4xl font-bold leading-tight text-white">
              Your school data,{" "}
              <span className="text-violet-400">working for you.</span>
            </h2>
            <p className="text-lg leading-relaxed text-slate-400">
              The Jessi AI engine continuously analyses attendance, academic
              performance, and financial data to surface actionable insights —
              before problems become crises.
            </p>
            <ul className="space-y-3">
              {[
                "Early detection of at-risk students",
                "Automated fee reminders & follow-ups",
                "Timetable optimisation suggestions",
                "Enrolment & capacity forecasting",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-400" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-500 hover:shadow-xl active:scale-95"
            >
              Try the AI Assistant
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────── */
/*  Why Jessi                                         */
/* ─────────────────────────────────────────────────── */
function WhySection() {
  const pillars = [
    {
      icon: Zap,
      title: "Built for speed",
      desc: "Sub-second page loads, real-time data sync, and a UI optimised for daily workflows — not quarterly report runs.",
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-500/10",
    },
    {
      icon: Shield,
      title: "Enterprise-grade security",
      desc: "Role-based access control, JWT auth, encrypted at rest, and audit logs for every action across the platform.",
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      icon: BarChart2,
      title: "Data-driven decisions",
      desc: "Live dashboards, exportable reports, and an AI layer that turns raw school data into clear, actionable guidance.",
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
    },
  ];

  return (
    <section className="bg-white py-24 px-6 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Why Jessi ERP
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Designed for the way schools actually work.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl ${bg}`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-8 dark:border-slate-800 dark:from-indigo-500/5 dark:to-slate-950">
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <blockquote className="text-lg font-medium leading-relaxed text-slate-700 dark:text-slate-200">
            &ldquo;Jessi ERP cut our admin time in half. What used to take our staff a full day — generating fee reports, tracking attendance, and preparing class lists — now happens automatically. The AI insights alone paid for the platform in the first month.&rdquo;
          </blockquote>
          <div className="mt-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">
              RS
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Rahul Sharma</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Principal, Delhi Public School — Jaipur</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────── */
/*  CTA                                               */
/* ─────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="relative overflow-hidden bg-indigo-600 px-6 py-24 text-center">
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-violet-600/40 blur-3xl" />

      <div className="relative mx-auto max-w-2xl space-y-6">
        <h2 className="text-4xl font-bold text-white">
          Ready to transform your school?
        </h2>
        <p className="text-lg text-indigo-200">
          Sign in to your Jessi ERP workspace and experience the difference
          from day one.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-indigo-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-7 py-3 text-sm font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10"
          >
            See all features
          </a>
        </div>
        <p className="text-xs text-indigo-300">
          No credit card required · Free demo available
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────── */
/*  Footer                                            */
/* ─────────────────────────────────────────────────── */
function Footer() {
  const columns = [
    {
      heading: "Product",
      links: ["Features", "Modules", "AI Assistant", "Pricing", "Changelog"],
    },
    {
      heading: "Company",
      links: ["About", "Blog", "Careers", "Press", "Contact"],
    },
    {
      heading: "Resources",
      links: ["Documentation", "API Reference", "Status", "Support", "Community"],
    },
    {
      heading: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"],
    },
  ];

  return (
    <footer className="bg-slate-950 px-6 pt-16 pb-8">
      <div className="mx-auto max-w-7xl">
        {/* Top row */}
        <div className="grid gap-12 md:grid-cols-5 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600">
                <School className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-bold text-white">Jessi ERP</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              The AI-powered school management platform for modern institutions.
            </p>
          </div>

          {/* Link columns */}
          {columns.map(({ heading, links }) => (
            <div key={heading}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
                {heading}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-xs text-slate-600">
            © 2026 Jessi Software Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <TrendingUp className="h-3 w-3 text-indigo-500" />
            Built with Next.js · NestJS · FastAPI · PostgreSQL · AI
          </div>
        </div>
      </div>
    </footer>
  );
}
