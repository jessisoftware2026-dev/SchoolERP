import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Users,
  Home,
  CalendarDays,
} from "lucide-react";
import { apiServerGet } from "@/lib/api.server";
import type { Student } from "@/types/student";

async function getStudent(id: string): Promise<Student | null> {
  try {
    return await apiServerGet<Student>(`/students/${id}`);
  } catch {
    return null;
  }
}

export default async function StudentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const student = await getStudent(params.id);
  if (!student) notFound();

  const fields = [
    { icon: Mail, label: "Email", value: student.email ?? "—" },
    { icon: Phone, label: "Phone", value: student.phone ?? "—" },
    { icon: CalendarDays, label: "Academic year", value: student.academicYear },
    {
      icon: CalendarDays,
      label: "Enrolled",
      value: new Date(student.enrolledAt).toLocaleDateString(),
    },
  ];

  const familyFields = [
    {
      icon: User,
      label: "Guardian",
      value: student.guardianName
        ? student.guardianRelation
          ? `${student.guardianName} (${student.guardianRelation})`
          : student.guardianName
        : "—",
    },
    { icon: Phone, label: "Guardian phone", value: student.guardianPhone ?? "—" },
    { icon: Mail, label: "Guardian email", value: student.guardianEmail ?? "—" },
    { icon: Users, label: "Father", value: student.fatherName ?? "—" },
    { icon: Users, label: "Mother", value: student.motherName ?? "—" },
    { icon: Home, label: "Address", value: student.address ?? "—" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/students"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to students
      </Link>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
            {student.firstName[0]}
            {student.lastName[0]}
          </div>
          <div>
            <h1 className="text-xl font-semibold">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {student.admissionNo} · {student.grade}
              {student.section ? ` · Section ${student.section}` : ""}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {fields.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="flex items-center gap-3 rounded-lg border bg-background p-3"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                  <p className="text-sm font-medium">{f.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="mt-8 mb-4 text-sm font-semibold text-muted-foreground">
          Family details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {familyFields.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="flex items-center gap-3 rounded-lg border bg-background p-3"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                  <p className="text-sm font-medium">{f.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}