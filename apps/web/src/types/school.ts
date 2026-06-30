export type SchoolStatus = "TRIAL" | "ACTIVE" | "SUSPENDED";
export type Plan = "FREE" | "BASIC" | "PRO" | "ENTERPRISE";

export interface School {
  id: string;
  name: string;
  slug: string;
  status: SchoolStatus;
  plan: Plan;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  userCount?: number;
  studentCount?: number;
}

export interface CreateSchoolInput {
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  plan?: Plan;
  status?: SchoolStatus;
}
