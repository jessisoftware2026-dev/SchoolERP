"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { currentAcademicYear, recentAcademicYears } from "@/lib/academic-year";
import type { CreateStudentInput } from "@/types/student";

const YEAR_OPTIONS = recentAcademicYears(5);

const initial: CreateStudentInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  grade: "",
  section: "",
  guardianName: "",
  guardianRelation: "",
  guardianPhone: "",
  guardianEmail: "",
  fatherName: "",
  motherName: "",
  address: "",
  academicYear: currentAcademicYear(),
  status: "PENDING",
};

export default function NewStudentPage() {
  const router = useRouter();
  const [form, setForm] = useState<CreateStudentInput>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof CreateStudentInput, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post("/students", form);
      router.push("/students");
      router.refresh();
    } catch (err) {
      const message =
        (err as { message?: string })?.message ??
        "Could not save. Is the API running?";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/students"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to students
      </Link>

      <div className="rounded-xl border bg-card p-6">
        <h1 className="text-xl font-semibold">New admission</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Posts to <code className="font-mono">POST /students</code> on the NestJS API.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="First name" required value={form.firstName} onChange={(v) => set("firstName", v)} />
          <Field label="Last name" required value={form.lastName} onChange={(v) => set("lastName", v)} />
          <Field label="Grade" required value={form.grade} onChange={(v) => set("grade", v)} placeholder="Grade 9" />
          <Field label="Section" value={form.section ?? ""} onChange={(v) => set("section", v)} placeholder="A" />
          <label className="block">
            <span className="mb-1 block text-sm font-medium">
              Academic year<span className="text-red-500"> *</span>
            </span>
            <select
              required
              value={form.academicYear ?? ""}
              onChange={(e) => set("academicYear", e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <Field label="Phone" value={form.phone ?? ""} onChange={(v) => set("phone", v)} />
          <div className="sm:col-span-2">
            <Field label="Email" type="email" value={form.email ?? ""} onChange={(v) => set("email", v)} />
          </div>

          <h2 className="sm:col-span-2 mt-2 border-t pt-4 text-sm font-semibold text-muted-foreground">
            Family details
          </h2>
          <Field label="Guardian name" value={form.guardianName ?? ""} onChange={(v) => set("guardianName", v)} />
          <Field label="Guardian relation" value={form.guardianRelation ?? ""} onChange={(v) => set("guardianRelation", v)} placeholder="Father" />
          <Field label="Guardian phone" value={form.guardianPhone ?? ""} onChange={(v) => set("guardianPhone", v)} />
          <Field label="Guardian email" type="email" value={form.guardianEmail ?? ""} onChange={(v) => set("guardianEmail", v)} />
          <Field label="Father's name" value={form.fatherName ?? ""} onChange={(v) => set("fatherName", v)} />
          <Field label="Mother's name" value={form.motherName ?? ""} onChange={(v) => set("motherName", v)} />
          <div className="sm:col-span-2">
            <Field label="Address" value={form.address ?? ""} onChange={(v) => set("address", v)} placeholder="Residential address" />
          </div>

          <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
            <Link
              href="/students"
              className="rounded-lg border px-4 py-2 text-sm hover:bg-muted"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Create admission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
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
    <label className="block">
      <span className="mb-1 block text-sm font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
      />
    </label>
  );
}
