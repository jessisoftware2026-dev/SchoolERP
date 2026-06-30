"use client";

import { useEffect, useState } from "react";
import { Building2, Plus, AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import type { School, CreateSchoolInput, Plan } from "@/types/school";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  TRIAL: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  SUSPENDED: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const PLANS: Plan[] = ["FREE", "BASIC", "PRO", "ENTERPRISE"];

export default function SchoolsAdminPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuper, setIsSuper] = useState(true);

  const [form, setForm] = useState<CreateSchoolInput>({
    name: "",
    slug: "",
    email: "",
    plan: "FREE",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<School[]>("/schools");
      setSchools(data);
    } catch (e) {
      setError((e as { message?: string }).message ?? "Failed to load schools");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setIsSuper(getUser()?.role === "SUPER_ADMIN");
    load();
  }, []);

  function set<K extends keyof CreateSchoolInput>(k: K, v: CreateSchoolInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  // auto-suggest slug from name
  function onName(v: string) {
    set("name", v);
    if (!form.slug || form.slug === slugify(form.name)) set("slug", slugify(v));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await api.post("/schools", form);
      setForm({ name: "", slug: "", email: "", plan: "FREE" });
      await load();
    } catch (e) {
      setFormError((e as { message?: string }).message ?? "Could not create school");
    } finally {
      setSaving(false);
    }
  }

  function tenantUrl(slug: string) {
    if (typeof window === "undefined") return "#";
    const { protocol, host } = window.location;
    // strip an existing subdomain to get the base host
    const base = host.split(".").length > 1 ? host.split(".").slice(1).join(".") : host;
    return `${protocol}//${slug}.${base}`;
  }

  if (!isSuper) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Only platform owners (SUPER_ADMIN) can manage schools.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Schools</h1>
          <p className="text-sm text-muted-foreground">
            Platform tenants — each school runs on its own subdomain.
          </p>
        </div>
      </div>

      {/* Create form */}
      <form onSubmit={onSubmit} className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <Plus className="h-4 w-4" /> Onboard a new school
        </h2>
        {formError && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {formError}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="School name" required value={form.name} onChange={onName} placeholder="Springfield High School" />
          <div>
            <label className="mb-1 block text-sm font-medium">
              Subdomain <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center rounded-lg border bg-background focus-within:ring-2 focus-within:ring-indigo-500/30">
              <input
                required
                value={form.slug}
                onChange={(e) => set("slug", slugify(e.target.value))}
                placeholder="springfield"
                className="w-full rounded-l-lg bg-transparent px-3 py-2 text-sm outline-none"
              />
              <span className="px-3 text-xs text-muted-foreground">.your-domain</span>
            </div>
          </div>
          <Field label="Contact email" type="email" value={form.email ?? ""} onChange={(v) => set("email", v)} placeholder="office@school.edu" />
          <div>
            <label className="mb-1 block text-sm font-medium">Plan</label>
            <select
              value={form.plan}
              onChange={(e) => set("plan", e.target.value as Plan)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              {PLANS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Creating…" : "Create school"}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b px-4 py-3 text-sm font-medium">
          {loading ? "Loading…" : `${schools.length} school${schools.length !== 1 ? "s" : ""}`}
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" /> {error}
          </div>
        )}

        {!error && !loading && (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">School</th>
                <th className="px-4 py-3 font-semibold">Subdomain</th>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Users</th>
                <th className="px-4 py-3 font-semibold">Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {schools.map((s) => (
                <tr key={s.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3">
                    <a
                      href={tenantUrl(s.slug)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      {s.slug}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                  <td className="px-4 py-3">{s.plan}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[s.status]}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.userCount ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.studentCount ?? "—"}</td>
                </tr>
              ))}
              {schools.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No schools yet — onboard the first tenant above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
      />
    </div>
  );
}
