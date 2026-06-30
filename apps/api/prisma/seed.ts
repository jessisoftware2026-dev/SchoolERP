import dotenv from "dotenv";
dotenv.config();

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
  PaymentMode,
  ConcessionType,
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

const ACADEMIC_YEAR = "2026-27";
const FEE_HEADS = ["Tuition", "Hostel", "Transport", "Exam", "Extra"];

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
    hostel: { blockName: "Block A", roomNo: "A-101", bedNo: "1" },
    transport: null,
    tuitionAmount: 45000,
    concession: null,
    payment: { amount: 45000, mode: PaymentMode.ONLINE, receiptNo: "REC-2026-0001", reference: "TXN-00001", paidAt: new Date("2026-06-01") },
    activities: [
      { name: "Cricket", category: "Sports", role: "Captain", achievement: "District Level Winner" },
      { name: "Debate Club", category: "Academic", role: "Member", achievement: null },
    ],
    health: { heightCm: 158, weightKg: 52, vision: "6/6", allergies: "None", conditions: null },
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
    hostel: null,
    transport: { routeName: "Route 3 – Ahmedabad East", stopName: "Civil Hospital Stop", vehicleNo: "GJ-01-AB-1234", pickupTime: "07:15" },
    tuitionAmount: 45000,
    concession: { type: ConcessionType.SCHOLARSHIP, percent: 20, reason: "Merit scholarship – top 10% of Grade 9", approvedBy: "admin@jessi.local" },
    payment: { amount: 36000, mode: PaymentMode.BANK_TRANSFER, receiptNo: "REC-2026-0002", reference: "NEFT-00002", paidAt: new Date("2026-06-03") },
    activities: [
      { name: "Classical Dance", category: "Arts", role: "Participant", achievement: "State Level Finalist" },
    ],
    health: { heightCm: 162, weightKg: 55, vision: "6/9 – corrected with glasses", allergies: "Dust allergy", conditions: null },
  },
  {
    admissionNo: "ADM-2026-27-0003",
    applicationNo: null,
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
    hostel: null,
    transport: null,
    tuitionAmount: 45000,
    concession: null,
    payment: null,
    activities: [],
    health: null,
  },
];

async function main() {
  // ── Platform super-admin (schoolId = null, can't use upsert on nullable unique) ──
  const superHash = await bcrypt.hash("super123", 10);
  const existingSuper = await prisma.user.findFirst({ where: { email: "super@jessi.local", schoolId: null } });
  if (!existingSuper) {
    await prisma.user.create({
      data: { email: "super@jessi.local", name: "Platform Owner", role: Role.SUPER_ADMIN, passwordHash: superHash, schoolId: null },
    });
  }

  // ── Demo tenant ───────────────────────────────────────────────────────
  const school = await prisma.school.upsert({
    where: { slug: "demo" },
    update: {},
    create: {
      name: "Demo Public School",
      slug: "demo",
      status: "ACTIVE",
      plan: "PRO",
      email: "office@demo.school",
      phone: "+91 80000 00000",
    },
  });

  // ── School users ──────────────────────────────────────────────────────
  const pw = (plain: string) => bcrypt.hash(plain, 10);
  const [adminHash, staffHash, t1Hash, t2Hash, parentHash] = await Promise.all([
    pw("admin123"), pw("staff123"), pw("teacher123"), pw("teacher123"), pw("parent123"),
  ]);

  const schoolUsers = [
    { email: "admin@jessi.local",          name: "Demo Admin",    role: Role.ADMIN,   passwordHash: adminHash },
    { email: "staff@jessi.local",          name: "Priya Menon",   role: Role.STAFF,   passwordHash: staffHash },
    { email: "teacher.ram@jessi.local",    name: "Ramesh Kumar",  role: Role.TEACHER, passwordHash: t1Hash },
    { email: "teacher.anita@jessi.local",  name: "Anita Rao",     role: Role.TEACHER, passwordHash: t2Hash },
    // Parent accounts (linked by convention — not a FK, just same email as guardian)
    { email: "rakesh.sharma@jessi.local",  name: "Rakesh Sharma", role: Role.PARENT,  passwordHash: parentHash },
    { email: "nisha.patel@jessi.local",    name: "Nisha Patel",   role: Role.PARENT,  passwordHash: parentHash },
  ];

  for (const u of schoolUsers) {
    await prisma.user.upsert({
      where: { schoolId_email: { schoolId: school.id, email: u.email } },
      update: {},
      create: { ...u, schoolId: school.id },
    });
  }

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

  // ── Students + all dependent records ─────────────────────────────────
  for (const s of SAMPLE_STUDENTS) {
    const { grade, section, medium, guardians, addresses, documents, hostel, transport, tuitionAmount, concession, payment, activities, health, ...identity } = s;

    const student = await prisma.student.upsert({
      where: { schoolId_admissionNo: { schoolId: school.id, admissionNo: s.admissionNo } },
      update: {},
      create: {
        ...identity,
        admissionYear: ACADEMIC_YEAR,
        schoolId: school.id,
        guardians: { create: guardians },
        addresses: { create: addresses },
        documents: { create: documents },
        enrollments: {
          create: { schoolId: school.id, academicYear: ACADEMIC_YEAR, grade, section, medium },
        },
      },
      include: { enrollments: true },
    });

    const enrollment = student.enrollments[0];
    if (!enrollment) continue;

    // Hostel allocation
    if (hostel) {
      const existing = await prisma.hostelAllocation.findUnique({ where: { enrollmentId: enrollment.id } });
      if (!existing) {
        await prisma.hostelAllocation.create({
          data: { schoolId: school.id, enrollmentId: enrollment.id, ...hostel },
        });
      }
    }

    // Transport allocation
    if (transport) {
      const existing = await prisma.transportAllocation.findUnique({ where: { enrollmentId: enrollment.id } });
      if (!existing) {
        await prisma.transportAllocation.create({
          data: { schoolId: school.id, enrollmentId: enrollment.id, ...transport },
        });
      }
    }

    // Tuition fee item
    let feeItem = await prisma.feeItem.findFirst({
      where: { enrollmentId: enrollment.id, feeHeadId: tuition.id },
    });
    if (!feeItem) {
      feeItem = await prisma.feeItem.create({
        data: {
          schoolId: school.id,
          enrollmentId: enrollment.id,
          feeHeadId: tuition.id,
          amount: tuitionAmount,
          description: "Annual tuition fee",
        },
      });
    }

    // Concession
    if (concession) {
      const existing = await prisma.concession.findFirst({ where: { feeItemId: feeItem.id } });
      if (!existing) {
        await prisma.concession.create({
          data: { schoolId: school.id, feeItemId: feeItem.id, ...concession },
        });
      }
    }

    // Payment
    if (payment) {
      const existing = await prisma.payment.findFirst({
        where: { schoolId: school.id, receiptNo: payment.receiptNo },
      });
      if (!existing) {
        await prisma.payment.create({
          data: { schoolId: school.id, feeItemId: feeItem.id, ...payment },
        });
      }
    }

    // Extracurricular activities
    for (const act of activities) {
      const existing = await prisma.extracurricularActivity.findFirst({
        where: { enrollmentId: enrollment.id, name: act.name },
      });
      if (!existing) {
        await prisma.extracurricularActivity.create({
          data: { schoolId: school.id, enrollmentId: enrollment.id, ...act },
        });
      }
    }

    // Health record
    if (health) {
      const existing = await prisma.healthRecord.findFirst({
        where: { studentId: student.id, academicYear: ACADEMIC_YEAR },
      });
      if (!existing) {
        await prisma.healthRecord.create({
          data: {
            schoolId: school.id,
            studentId: student.id,
            academicYear: ACADEMIC_YEAR,
            bloodGroup: student.bloodGroup ?? undefined,
            ...health,
          },
        });
      }
    }
  }

  console.log(
    "Seed complete — school '%s' (%s): %d students, %d fee heads, %d school users, permissions seeded",
    school.name,
    school.slug,
    SAMPLE_STUDENTS.length,
    FEE_HEADS.length,
    schoolUsers.length
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
