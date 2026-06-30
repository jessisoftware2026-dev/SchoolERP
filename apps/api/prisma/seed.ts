import {
  PrismaClient,
  Role,
  Module,
  StudentStatus,
  Gender,
  BloodGroup,
  GuardianRelation,
  AddressType,
  DocumentType,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type PermissionMap = {
  canView?: boolean;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
};

const ALL_MODULES = Object.values(Module);

// Default permissions by role (SUPER_ADMIN & ADMIN bypass at runtime, seeded for completeness)
const DEFAULT_PERMISSIONS: Record<Role, Partial<Record<Module, PermissionMap>>> = {
  SUPER_ADMIN: Object.fromEntries(
    ALL_MODULES.map((m) => [m, { canView: true, canCreate: true, canEdit: true, canDelete: true }])
  ) as Partial<Record<Module, PermissionMap>>,

  ADMIN: Object.fromEntries(
    ALL_MODULES.map((m) => [m, { canView: true, canCreate: true, canEdit: true, canDelete: true }])
  ) as Partial<Record<Module, PermissionMap>>,

  STAFF: {
    DASHBOARD: { canView: true },
    STUDENTS: { canView: true, canCreate: true, canEdit: true },
    FEES: { canView: true, canCreate: true },
    ATTENDANCE: { canView: true, canCreate: true, canEdit: true },
    EXAMS: { canView: true },
    TIMETABLE: { canView: true },
    TRANSPORT: { canView: true },
    AI: { canView: true },
  },

  TEACHER: {
    DASHBOARD: { canView: true },
    STUDENTS: { canView: true },
    ATTENDANCE: { canView: true, canCreate: true, canEdit: true },
    EXAMS: { canView: true, canCreate: true, canEdit: true },
    TIMETABLE: { canView: true },
    AI: { canView: true },
  },

  PARENT: {
    DASHBOARD: { canView: true },
    STUDENTS: { canView: true },
    FEES: { canView: true },
    ATTENDANCE: { canView: true },
    EXAMS: { canView: true },
    TIMETABLE: { canView: true },
    TRANSPORT: { canView: true },
  },

  STUDENT: {
    DASHBOARD: { canView: true },
    FEES: { canView: true },
    ATTENDANCE: { canView: true },
    EXAMS: { canView: true },
    TIMETABLE: { canView: true },
    TRANSPORT: { canView: true },
    AI: { canView: true },
  },
};

// Sample students for the demo tenant. Each carries the full admission payload:
// identity + guardians + addresses + documents + the first year's enrollment.
const SAMPLE_STUDENTS = [
  {
    admissionNo: "ADM-2026-27-0001",
    applicationNo: "APP-2026-0001",
    firstName: "Aarav",
    lastName: "Sharma",
    gender: Gender.MALE,
    dateOfBirth: new Date("2012-05-14"),
    bloodGroup: BloodGroup.O_POS,
    nationality: "Indian",
    motherTongue: "Hindi",
    emisId: "EMIS-1029384001",
    email: "aarav.sharma@example.com",
    phone: "+91 90000 00001",
    previousSchool: "Little Flower School",
    previousBoard: "CBSE",
    previousClass: "Grade 8",
    lastExamPercent: 87.5,
    transferCertificateNo: "TC-2025-0001",
    status: StudentStatus.ACTIVE,
    grade: "Grade 9",
    section: "A",
    medium: "English",
    guardians: [
      { relation: GuardianRelation.FATHER, name: "Rakesh Sharma", mobile: "+91 90000 10001", email: "rakesh.sharma@example.com", occupation: "Engineer", annualIncome: 950000, isPrimary: true },
      { relation: GuardianRelation.MOTHER, name: "Sunita Sharma", mobile: "+91 90000 20001", occupation: "Teacher", annualIncome: 600000 },
    ],
    addresses: [
      { type: AddressType.CURRENT, line: "12 MG Road", city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka", country: "India", pincode: "560001" },
      { type: AddressType.PERMANENT, line: "12 MG Road", city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka", country: "India", pincode: "560001" },
    ],
    documents: [
      { type: DocumentType.BIRTH_CERTIFICATE, number: "BC-2012-5567", verified: true },
      { type: DocumentType.TRANSFER_CERTIFICATE, number: "TC-2025-0001", verified: true },
      { type: DocumentType.AADHAR, number: "1234 5678 9001" },
    ],
  },
  {
    admissionNo: "ADM-2026-27-0002",
    applicationNo: "APP-2026-0002",
    firstName: "Diya",
    lastName: "Patel",
    gender: Gender.FEMALE,
    dateOfBirth: new Date("2011-11-02"),
    bloodGroup: BloodGroup.A_POS,
    nationality: "Indian",
    motherTongue: "Gujarati",
    emisId: "EMIS-1029384002",
    email: "diya.patel@example.com",
    phone: "+91 90000 00002",
    previousSchool: "St. Xavier's High School",
    previousBoard: "GSEB",
    previousClass: "Grade 9",
    lastExamPercent: 91.2,
    status: StudentStatus.ACTIVE,
    grade: "Grade 10",
    section: "B",
    medium: "English",
    guardians: [
      { relation: GuardianRelation.FATHER, name: "Mehul Patel", mobile: "+91 90000 10002", occupation: "Businessman", annualIncome: 1500000 },
      { relation: GuardianRelation.MOTHER, name: "Nisha Patel", mobile: "+91 90000 20002", email: "nisha.patel@example.com", occupation: "Homemaker", isPrimary: true },
    ],
    addresses: [
      { type: AddressType.CURRENT, line: "45 Ashram Road", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", country: "India", pincode: "380009" },
    ],
    documents: [
      { type: DocumentType.BIRTH_CERTIFICATE, number: "BC-2011-2290", verified: true },
      { type: DocumentType.PASSPORT_PHOTO },
    ],
  },
  {
    admissionNo: "ADM-2026-27-0003",
    firstName: "Kabir",
    lastName: "Singh",
    gender: Gender.MALE,
    dateOfBirth: new Date("2014-03-21"),
    bloodGroup: BloodGroup.B_POS,
    nationality: "Indian",
    motherTongue: "Punjabi",
    phone: "+91 90000 00003",
    previousClass: "Grade 6",
    status: StudentStatus.PENDING,
    grade: "Grade 7",
    section: "C",
    medium: "English",
    guardians: [
      { relation: GuardianRelation.FATHER, name: "Harpreet Singh", mobile: "+91 90000 10003", occupation: "Farmer", annualIncome: 400000, isPrimary: true },
      { relation: GuardianRelation.MOTHER, name: "Manjeet Kaur", mobile: "+91 90000 20003" },
    ],
    addresses: [
      { type: AddressType.PERMANENT, line: "8 Model Town", city: "Ludhiana", district: "Ludhiana", state: "Punjab", country: "India", pincode: "141002" },
    ],
    documents: [
      { type: DocumentType.AADHAR, number: "1234 5678 9003" },
    ],
  },
];

const ACADEMIC_YEAR = "2026-27";

// Fee heads the demo school charges. FeeItems reference these per enrollment.
const FEE_HEADS = ["Tuition", "Hostel", "Transport", "Exam", "Extra"];

async function main() {
  // ── Platform super-admin (no tenant) ──────────────────────────────────
  const superHash = await bcrypt.hash("super123", 10);
  const existingSuper = await prisma.user.findFirst({
    where: { email: "super@jessi.local", schoolId: null },
  });
  if (!existingSuper) {
    await prisma.user.create({
      data: {
        email: "super@jessi.local",
        name: "Platform Owner",
        role: Role.SUPER_ADMIN,
        passwordHash: superHash,
        schoolId: null,
      },
    });
  }

  // ── Demo tenant ───────────────────────────────────────────────────────
  const school = await prisma.school.upsert({
    where: { slug: "demo" },
    update: {},
    create: {
      name: "Demo Public School",
      slug: "demo", // → demo.localhost in dev, demo.jessierp.com in prod
      status: "ACTIVE",
      plan: "PRO",
      email: "office@demo.school",
      phone: "+91 80000 00000",
    },
  });

  // School admin (scoped to the demo tenant)
  const adminHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { schoolId_email: { schoolId: school.id, email: "admin@jessi.local" } },
    update: {},
    create: {
      email: "admin@jessi.local",
      name: "Demo Admin",
      role: Role.ADMIN,
      passwordHash: adminHash,
      schoolId: school.id,
    },
  });

  // ── Role permissions (global defaults) ────────────────────────────────
  for (const [role, moduleMap] of Object.entries(DEFAULT_PERMISSIONS)) {
    for (const mod of ALL_MODULES) {
      const perms = (moduleMap as Record<string, PermissionMap>)[mod] ?? {};
      await prisma.rolePermission.upsert({
        where: { role_module: { role: role as Role, module: mod } },
        update: {
          canView: perms.canView ?? false,
          canCreate: perms.canCreate ?? false,
          canEdit: perms.canEdit ?? false,
          canDelete: perms.canDelete ?? false,
        },
        create: {
          role: role as Role,
          module: mod,
          canView: perms.canView ?? false,
          canCreate: perms.canCreate ?? false,
          canEdit: perms.canEdit ?? false,
          canDelete: perms.canDelete ?? false,
        },
      });
    }
  }

  // ── Fee heads (per-school catalog) ────────────────────────────────────
  for (const name of FEE_HEADS) {
    await prisma.feeHead.upsert({
      where: { schoolId_name: { schoolId: school.id, name } },
      update: {},
      create: { schoolId: school.id, name },
    });
  }
  const tuition = await prisma.feeHead.findUniqueOrThrow({
    where: { schoolId_name: { schoolId: school.id, name: "Tuition" } },
  });

  // ── Sample students (identity + guardians + addresses + docs + year 1) ─
  for (const s of SAMPLE_STUDENTS) {
    const { grade, section, medium, guardians, addresses, documents, ...identity } = s;
    const student = await prisma.student.upsert({
      where: {
        schoolId_admissionNo: { schoolId: school.id, admissionNo: s.admissionNo },
      },
      update: {},
      create: {
        ...identity,
        admissionYear: ACADEMIC_YEAR,
        schoolId: school.id,
        guardians: { create: guardians },
        addresses: { create: addresses },
        documents: { create: documents },
        enrollments: {
          create: {
            schoolId: school.id,
            academicYear: ACADEMIC_YEAR,
            grade,
            section,
            medium,
          },
        },
      },
      include: { enrollments: true },
    });

    // A sample tuition fee item on the current enrollment.
    const enrollment = student.enrollments[0];
    if (enrollment) {
      const existingFee = await prisma.feeItem.findFirst({
        where: { enrollmentId: enrollment.id, feeHeadId: tuition.id },
      });
      if (!existingFee) {
        await prisma.feeItem.create({
          data: {
            schoolId: school.id,
            enrollmentId: enrollment.id,
            feeHeadId: tuition.id,
            amount: 45000,
            description: "Annual tuition fee",
          },
        });
      }
    }
  }

  console.log(
    "Seed complete: 1 super-admin, school '%s' (slug: %s) with admin + %d students, %d fee heads, permissions seeded",
    school.name,
    school.slug,
    SAMPLE_STUDENTS.length,
    FEE_HEADS.length
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });