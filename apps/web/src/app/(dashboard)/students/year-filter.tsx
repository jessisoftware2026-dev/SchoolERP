"use client";

import { useRouter, useSearchParams } from "next/navigation";

// Navigates to /students?academicYear=… (or clears it for "All years").
export function YearFilter({ years }: { years: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("academicYear") ?? "";

  function onChange(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set("academicYear", value);
    else next.delete("academicYear");
    const qs = next.toString();
    router.push(qs ? `/students?${qs}` : "/students");
  }

  return (
    <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
      <span>Academic year</span>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border bg-muted/40 px-2 py-1.5 text-sm text-foreground outline-none focus:bg-background focus:ring-2 focus:ring-indigo-500/30"
      >
        <option value="">All years</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </label>
  );
}
