"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { School, Eye, EyeOff, GraduationCap, Wallet, CalendarCheck, Bot, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import { getTenantSlug } from "@/lib/tenant";
import type { Permission } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const tenant = getTenantSlug();
  const demoEmail = tenant ? "admin@jessi.local" : "super@jessi.local";
  const demoPassword = tenant ? "admin123" : "super123";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<{
        accessToken: string;
        user: { id: string; email: string; name: string; role: string };
        permissions: Permission[];
      }>("/auth/login", { email, password });
      setAuth(res.accessToken, res.user, res.permissions ?? []);
      router.push("/dashboard");
    } catch (err) {
      const msg = (err as { message?: string })?.message;
      setError(
        msg === "Unauthorized" || msg?.toLowerCase().includes("invalid")
          ? "Invalid email or password."
          : (msg ?? "Could not reach the server. Is the API running?")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* ── Left brand panel ── */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between px-12 py-10"
        style={{ background: "linear-gradient(160deg, #05080f 0%, #080e1d 55%, #0d0e28 100%)" }}
      >
        {/* Decorative glow orb */}
        <div
          className="pointer-events-none absolute left-0 top-0 h-[45%] w-[45%] opacity-20"
          style={{ background: "radial-gradient(ellipse at 20% 20%, #4f46e5 0%, transparent 70%)" }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div
            className="grid h-10 w-10 place-items-center rounded-xl shadow-lg shadow-indigo-500/30"
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
          >
            <School className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-white leading-none">Jessi ERP</p>
            <p className="text-[11px] text-slate-500 mt-0.5">School Management Platform</p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative space-y-8">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-white">
              The smarter way to<br />
              <span
                style={{
                  background: "linear-gradient(90deg, #818cf8, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                run your school.
              </span>
            </h1>
            <p className="mt-4 text-base text-slate-400 leading-relaxed max-w-sm">
              An AI-powered ERP designed for modern schools — from admissions to analytics, all in one place.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-4">
            {[
              { icon: GraduationCap, label: "Student & admission management", color: "from-indigo-500/20 to-violet-500/20", text: "text-indigo-400" },
              { icon: Wallet,        label: "Fees collection & finance",        color: "from-emerald-500/20 to-teal-500/20", text: "text-emerald-400" },
              { icon: CalendarCheck, label: "Attendance & timetable",            color: "from-sky-500/20 to-cyan-500/20",    text: "text-cyan-400" },
              { icon: Bot,           label: "AI-powered insights & predictions", color: "from-violet-500/20 to-purple-500/20", text: "text-violet-400" },
            ].map(({ icon: Icon, label, color, text }) => (
              <li key={label} className="flex items-center gap-3">
                <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${color}`}>
                  <Icon className={`h-4 w-4 ${text}`} />
                </div>
                <span className="text-sm text-slate-300">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-slate-600">© 2026 Jessi Software. All rights reserved.</p>
      </div>

      {/* ── Right login panel ── */}
      <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div
              className="grid h-9 w-9 place-items-center rounded-xl"
              style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
            >
              <School className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">Jessi ERP</span>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to your workspace to continue.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@jessi.local"
                className="w-full rounded-xl border bg-card px-4 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-indigo-500 hover:underline dark:text-indigo-400"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border bg-card px-4 py-2.5 pr-11 text-sm outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-px active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="rounded-xl border border-dashed bg-muted/30 px-4 py-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Demo credentials
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Email</span>
                <code
                  className="cursor-pointer font-mono text-foreground hover:text-indigo-500 transition-colors"
                  onClick={() => setEmail(demoEmail)}
                >
                  {demoEmail}
                </code>
              </div>
              <div className="flex justify-between">
                <span>Password</span>
                <code
                  className="cursor-pointer font-mono text-foreground hover:text-indigo-500 transition-colors"
                  onClick={() => setPassword(demoPassword)}
                >
                  {demoPassword}
                </code>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">Click values to auto-fill</p>
          </div>
        </div>
      </div>
    </div>
  );
}
