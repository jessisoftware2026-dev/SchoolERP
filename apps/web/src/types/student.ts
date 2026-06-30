export type StudentStatus = "ACTIVE" | "PENDING" | "INACTIVE";

export interface Student {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  grade: string;
  section: string | null;
  guardianName: string | null;
  guardianRelation: string | null;
  guardianPhone: string | null;
  guardianEmail: string | null;
  fatherName: string | null;
  motherName: string | null;
  address: string | null;
  academicYear: string;
  status: StudentStatus;
  enrolledAt: string;
}

export interface CreateStudentInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  grade: string;
  section?: string;
  guardianName?: string;
  guardianRelation?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  academicYear?: string;
  status?: StudentStatus;
}
