// Academic-year helpers (client + server) — Indian session, April–March,
// rendered as "YYYY-YY". Mirrors apps/api/src/students/academic-year.ts.

export function academicYearFor(date: Date): string {
  const year = date.getFullYear();
  const startYear = date.getMonth() >= 3 ? year : year - 1; // month 3 = April
  const endYY = String((startYear + 1) % 100).padStart(2, "0");
  return `${startYear}-${endYY}`;
}

export function currentAcademicYear(): string {
  return academicYearFor(new Date());
}

// The current session plus the previous `count - 1` sessions, newest first.
export function recentAcademicYears(count = 5): string[] {
  const startYear = Number(currentAcademicYear().slice(0, 4));
  return Array.from({ length: count }, (_, i) => {
    const s = startYear - i;
    return `${s}-${String((s + 1) % 100).padStart(2, "0")}`;
  });
}
