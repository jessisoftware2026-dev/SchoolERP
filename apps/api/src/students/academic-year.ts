// Academic-year helpers — Indian session convention (April–March), rendered as
// "YYYY-YY". The session that runs April 2026 → March 2027 is "2026-27".

export const ACADEMIC_YEAR_REGEX = /^\d{4}-\d{2}$/;

// The academic session a given date falls in. Jan–Mar belong to the session
// that started the previous April (e.g. Feb 2027 → "2026-27").
export function academicYearFor(date: Date): string {
  const year = date.getFullYear();
  const startYear = date.getMonth() >= 3 ? year : year - 1; // month 3 = April
  const endYY = String((startYear + 1) % 100).padStart(2, "0");
  return `${startYear}-${endYY}`;
}

export function currentAcademicYear(): string {
  return academicYearFor(new Date());
}
