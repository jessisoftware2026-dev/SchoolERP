import Link from "next/link";
import { Plus, AlertTriangle, GraduationCap, Search } from "lucide-react";
import { apiServerGet } from "@/lib/api.server";
import { recentAcademicYears } from "@/lib/academic-year";
import type { Student } from "@/types/student";
import { YearFilter } from "./year-filter";

export const metadata = { title: "Students · Jessi ERP" };

const SAMPLE: Student[] = [
  {
    id: "sample-1",
    admissionNo: "ADM-2026-27-0001",
    firstName: "Aarav",
    lastName: "Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 90000 00001",
    grade: "Grade 9",
    section: "A",
    guardianName: "Rakesh Sharma",
    guardianRelation: "Father",
    guardianPhone: "+91 90000 10001",
    guardianEmail: "rakesh.sharma@example.com",
    fatherName: "Rakesh Sharma",
    motherName: "Sunita Sharma",
    address: "12 MG Road, Bengaluru 560001",
    academicYear: "2026-27",
    status: "ACTIVE",
    enrolledAt: "2026-04-12T00:00:00.000Z",
  },
  {
    id: "sample-2",
    admissionNo: "ADM-2026-27-0002",
    firstName: "Diya",
    lastName: "Patel",
    email: "diya.patel@example.com",
    phone: "+91 90000 00002",
    grade: "Grade 10",
    section: "B",
    guardianName: "Nisha Patel",
    guardianRelation: "Mother",
    guardianPhone: "+91 90000 10002",
    guardianEmail: "nisha.patel@example.com",
    fatherName: "Mehul Patel",
    motherName: "Nisha Patel",
    address: "45 Ashram Road, Ahmedabad 380009",
    academicYear: "2026-27",
    status: "ACTIVE",
    enrolledAt: "2026-04-15T00:00:00.000Z",
  },
  {
    id: "sample-3",
    admissionNo: "ADM-2025-26-0014",
    firstName: "Kabir",
    lastName: "Singh",
    email: null,
    phone: "+91 90000 00003",
    grade: "Grade 7",
    section: "C",
    guardianName: "Harpreet Singh",
    guardianRelation: "Father",
    guardianPhone: "+91 90000 10003",
    guardianEmail: null,
    fatherName: "Harpreet Singh",
    motherName: "Manjeet Kaur",
    address: "8 Model Town, Ludhiana 141002",
    academicYear: "2025-26",
    status: "PENDING",
    enrolledAt: "2025-06-01T00:00:00.000Z",
  },
];

async function getStudents(
  academicYear?: string
): Promise<{ data: Student[]; live: boolean }> {
  const query = academicYear
    ? `?academicYear=${encodeURIComponent(academicYear)}`
    : "";
  try {
    const data = await apiServerGet<Student[]>(`/students${query}`);
    return { data, live: true };
  } catch {
    const data = academicYear
      ? SAMPLE.filter((s) => s.academicYear === academicYear)
      : SAMPLE;
    return { data, live: false };
  }
}

const avatarColors = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-sky-500",
];

function getAvatarColor(name: string) {
  const sum = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return avatarColors[sum % avatarColors.length];
}

const statusConfig: Record<string, { dot: string; text: string; bg: string }> = {
  ACTIVE:   { dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  PENDING:  { dot: "bg-amber-500",   text: "text-amber-700 dark:text-amber-400",     bg: "bg-amber-50 dark:bg-amber-500/10" },
  INACTIVE: { dot: "bg-slate-400",   text: "text-slate-600 dark:text-slate-400",     bg: "bg-slate-100 dark:bg-slate-500/10" },
};

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { academicYear?: string };
}) {
  const academicYear = searchParams.academicYear;
  const { data: students, live } = await getStudents(academicYear);
  const yearOptions = recentAcademicYears(5);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students &amp; Admissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {students.length} student{students.length !== 1 ? "s" : ""} · reference module wired to the NestJS API
          </p>
        </div>
        <Link
          href="/students/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md active:scale-95"
        >
          <Plus className="h-4 w-4" />
          New admission
        </Link>
      </div>

      {/* API warning */}
      {!live && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            API not reachable — showing sample data. Start the backend and seed the DB to see live records.
          </span>
        </div>
      )}

      {/* Table card */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search students…"
              className="w-full rounded-lg border bg-muted/40 py-1.5 pl-9 pr-3 text-sm outline-none focus:bg-background focus:ring-2 focus:ring-indigo-500/30 transition-all"
            />
          </div>
          <YearFilter years={yearOptions} />
          <span className="text-xs text-muted-foreground">
            {students.length} records
          </span>
        </div>

        <table className="w-full text-sm">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Admission No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Student
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Grade
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Year
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Guardian
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((s) => {
              const status = statusConfig[s.status] ?? statusConfig.INACTIVE;
              const initials = `${s.firstName[0]}${s.lastName[0]}`;
              const avatarBg = getAvatarColor(s.firstName + s.lastName);

              return (
                <tr
                  key={s.id}
                  className="group transition-colors hover:bg-muted/40"
                >
                  <td className="px-4 py-3.5 font-mono text-[11px] text-muted-foreground">
                    {s.admissionNo}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white ${avatarBg}`}>
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold leading-tight">
                          {s.firstName} {s.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {s.email ?? s.phone ?? "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm">
                    <span className="font-medium">{s.grade}</span>
                    {s.section && (
                      <span className="ml-1 text-muted-foreground">· {s.section}</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">
                    {s.academicYear}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground">
                    {s.guardianName ?? "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.bg} ${status.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      {s.status.charAt(0) + s.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/students/${s.id}`}
                      className="rounded-md px-2.5 py-1 text-xs font-semibold text-indigo-600 opacity-0 transition-all group-hover:opacity-100 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {students.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center text-muted-foreground">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-muted">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-foreground">No students yet</p>
              <p className="text-sm">Create the first admission to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
