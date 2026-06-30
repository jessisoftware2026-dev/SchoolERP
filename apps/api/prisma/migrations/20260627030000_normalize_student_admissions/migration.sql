-- Normalize the student data model:
--   • Student keeps lifetime identity only (personal + admission + history).
--   • Per-year data (class/section/status) moves into a new Enrollment table.
--   • New related tables: Guardian, Address, StudentDocument, HostelAllocation,
--     TransportAllocation, FeeHead, FeeItem, Concession, Payment,
--     ExtracurricularActivity, HealthRecord.
-- Existing Student rows are preserved and backfilled into Enrollment.

-- ── Enums ─────────────────────────────────────────────────────────────────
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE "BloodGroup" AS ENUM ('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'O_POS', 'O_NEG', 'AB_POS', 'AB_NEG', 'UNKNOWN');
CREATE TYPE "GuardianRelation" AS ENUM ('FATHER', 'MOTHER', 'GUARDIAN');
CREATE TYPE "AddressType" AS ENUM ('CURRENT', 'PERMANENT');
CREATE TYPE "DocumentType" AS ENUM ('BIRTH_CERTIFICATE', 'TRANSFER_CERTIFICATE', 'COMMUNITY_CERTIFICATE', 'PASSPORT_PHOTO', 'AADHAR', 'OTHER');
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'PROMOTED', 'DETAINED', 'TC_ISSUED', 'GRADUATED', 'INACTIVE');
CREATE TYPE "ConcessionType" AS ENUM ('CONCESSION', 'SCHOLARSHIP', 'WAIVER', 'EXCLUSION');
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'ONLINE');

-- ── Student: add identity columns (nullable / defaulted for safe backfill) ──
ALTER TABLE "Student"
  ADD COLUMN "applicationNo" TEXT,
  ADD COLUMN "admissionYear" TEXT,
  ADD COLUMN "gender" "Gender",
  ADD COLUMN "dateOfBirth" TIMESTAMP(3),
  ADD COLUMN "bloodGroup" "BloodGroup",
  ADD COLUMN "photoUrl" TEXT,
  ADD COLUMN "nationality" TEXT,
  ADD COLUMN "motherTongue" TEXT,
  ADD COLUMN "aadharNo" TEXT,
  ADD COLUMN "emisId" TEXT,
  ADD COLUMN "previousSchool" TEXT,
  ADD COLUMN "previousBoard" TEXT,
  ADD COLUMN "previousClass" TEXT,
  ADD COLUMN "lastExamPercent" DOUBLE PRECISION,
  ADD COLUMN "transferCertificateNo" TEXT,
  ADD COLUMN "admissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill identity columns from the soon-to-be-dropped per-year columns.
UPDATE "Student" SET "admissionYear" = "academicYear", "admissionDate" = "enrolledAt";
ALTER TABLE "Student" ALTER COLUMN "admissionYear" SET NOT NULL;

-- ── Enrollment table ───────────────────────────────────────────────────────
CREATE TABLE "Enrollment" (
  "id" TEXT NOT NULL,
  "schoolId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "academicYear" TEXT NOT NULL,
  "grade" TEXT NOT NULL,
  "section" TEXT,
  "medium" TEXT,
  "sectionGroup" TEXT,
  "rollNo" TEXT,
  "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
  "result" TEXT,
  "remarks" TEXT,
  "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "promotedFromId" TEXT,
  CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- Backfill one Enrollment per existing student from their per-year columns.
INSERT INTO "Enrollment" ("id", "schoolId", "studentId", "academicYear", "grade", "section", "status", "enrolledAt", "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  "schoolId",
  "id",
  "academicYear",
  "grade",
  "section",
  CASE "status" WHEN 'INACTIVE' THEN 'INACTIVE'::"EnrollmentStatus" ELSE 'ACTIVE'::"EnrollmentStatus" END,
  "enrolledAt",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Student";

-- ── Drop the per-year columns now living on Enrollment ─────────────────────
DROP INDEX "Student_grade_idx";
DROP INDEX "Student_academicYear_idx";
ALTER TABLE "Student"
  DROP COLUMN "grade",
  DROP COLUMN "section",
  DROP COLUMN "guardianName",
  DROP COLUMN "academicYear",
  DROP COLUMN "enrolledAt";

-- ── Related identity tables ────────────────────────────────────────────────
CREATE TABLE "Guardian" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "relation" "GuardianRelation" NOT NULL,
  "name" TEXT NOT NULL,
  "mobile" TEXT,
  "email" TEXT,
  "occupation" TEXT,
  "annualIncome" DECIMAL(65,30),
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Guardian_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Address" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "type" "AddressType" NOT NULL,
  "line" TEXT NOT NULL,
  "city" TEXT,
  "district" TEXT,
  "state" TEXT,
  "country" TEXT DEFAULT 'India',
  "pincode" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StudentDocument" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "type" "DocumentType" NOT NULL,
  "number" TEXT,
  "fileUrl" TEXT,
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StudentDocument_pkey" PRIMARY KEY ("id")
);

-- ── Per-year service & fee tables ──────────────────────────────────────────
CREATE TABLE "HostelAllocation" (
  "id" TEXT NOT NULL,
  "schoolId" TEXT NOT NULL,
  "enrollmentId" TEXT NOT NULL,
  "blockName" TEXT,
  "roomNo" TEXT,
  "bedNo" TEXT,
  "allocatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "HostelAllocation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TransportAllocation" (
  "id" TEXT NOT NULL,
  "schoolId" TEXT NOT NULL,
  "enrollmentId" TEXT NOT NULL,
  "routeName" TEXT,
  "stopName" TEXT,
  "vehicleNo" TEXT,
  "pickupTime" TEXT,
  "allocatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TransportAllocation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FeeHead" (
  "id" TEXT NOT NULL,
  "schoolId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "code" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FeeHead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FeeItem" (
  "id" TEXT NOT NULL,
  "schoolId" TEXT NOT NULL,
  "enrollmentId" TEXT NOT NULL,
  "feeHeadId" TEXT NOT NULL,
  "amount" DECIMAL(65,30) NOT NULL,
  "dueDate" TIMESTAMP(3),
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FeeItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Concession" (
  "id" TEXT NOT NULL,
  "schoolId" TEXT NOT NULL,
  "feeItemId" TEXT NOT NULL,
  "type" "ConcessionType" NOT NULL,
  "amount" DECIMAL(65,30),
  "percent" DOUBLE PRECISION,
  "reason" TEXT,
  "approvedBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Concession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Payment" (
  "id" TEXT NOT NULL,
  "schoolId" TEXT NOT NULL,
  "feeItemId" TEXT NOT NULL,
  "amount" DECIMAL(65,30) NOT NULL,
  "mode" "PaymentMode" NOT NULL DEFAULT 'CASH',
  "receiptNo" TEXT,
  "reference" TEXT,
  "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExtracurricularActivity" (
  "id" TEXT NOT NULL,
  "schoolId" TEXT NOT NULL,
  "enrollmentId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT,
  "role" TEXT,
  "achievement" TEXT,
  "remarks" TEXT,
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ExtracurricularActivity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HealthRecord" (
  "id" TEXT NOT NULL,
  "schoolId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "academicYear" TEXT,
  "heightCm" DOUBLE PRECISION,
  "weightKg" DOUBLE PRECISION,
  "bloodGroup" "BloodGroup",
  "vision" TEXT,
  "allergies" TEXT,
  "conditions" TEXT,
  "remarks" TEXT,
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "HealthRecord_pkey" PRIMARY KEY ("id")
);

-- ── Indexes & unique constraints ───────────────────────────────────────────
CREATE UNIQUE INDEX "Student_schoolId_applicationNo_key" ON "Student"("schoolId", "applicationNo");
CREATE INDEX "Student_admissionYear_idx" ON "Student"("admissionYear");

CREATE INDEX "Guardian_studentId_idx" ON "Guardian"("studentId");
CREATE UNIQUE INDEX "Guardian_studentId_relation_key" ON "Guardian"("studentId", "relation");

CREATE INDEX "Address_studentId_idx" ON "Address"("studentId");
CREATE UNIQUE INDEX "Address_studentId_type_key" ON "Address"("studentId", "type");

CREATE INDEX "StudentDocument_studentId_idx" ON "StudentDocument"("studentId");

CREATE UNIQUE INDEX "Enrollment_promotedFromId_key" ON "Enrollment"("promotedFromId");
CREATE UNIQUE INDEX "Enrollment_studentId_academicYear_key" ON "Enrollment"("studentId", "academicYear");
CREATE INDEX "Enrollment_schoolId_idx" ON "Enrollment"("schoolId");
CREATE INDEX "Enrollment_grade_idx" ON "Enrollment"("grade");
CREATE INDEX "Enrollment_academicYear_idx" ON "Enrollment"("academicYear");
CREATE INDEX "Enrollment_status_idx" ON "Enrollment"("status");

CREATE UNIQUE INDEX "HostelAllocation_enrollmentId_key" ON "HostelAllocation"("enrollmentId");
CREATE INDEX "HostelAllocation_schoolId_idx" ON "HostelAllocation"("schoolId");

CREATE UNIQUE INDEX "TransportAllocation_enrollmentId_key" ON "TransportAllocation"("enrollmentId");
CREATE INDEX "TransportAllocation_schoolId_idx" ON "TransportAllocation"("schoolId");

CREATE UNIQUE INDEX "FeeHead_schoolId_name_key" ON "FeeHead"("schoolId", "name");
CREATE INDEX "FeeHead_schoolId_idx" ON "FeeHead"("schoolId");

CREATE INDEX "FeeItem_schoolId_idx" ON "FeeItem"("schoolId");
CREATE INDEX "FeeItem_enrollmentId_idx" ON "FeeItem"("enrollmentId");
CREATE INDEX "FeeItem_feeHeadId_idx" ON "FeeItem"("feeHeadId");

CREATE INDEX "Concession_schoolId_idx" ON "Concession"("schoolId");
CREATE INDEX "Concession_feeItemId_idx" ON "Concession"("feeItemId");

CREATE UNIQUE INDEX "Payment_schoolId_receiptNo_key" ON "Payment"("schoolId", "receiptNo");
CREATE INDEX "Payment_schoolId_idx" ON "Payment"("schoolId");
CREATE INDEX "Payment_feeItemId_idx" ON "Payment"("feeItemId");

CREATE INDEX "ExtracurricularActivity_schoolId_idx" ON "ExtracurricularActivity"("schoolId");
CREATE INDEX "ExtracurricularActivity_enrollmentId_idx" ON "ExtracurricularActivity"("enrollmentId");

CREATE INDEX "HealthRecord_schoolId_idx" ON "HealthRecord"("schoolId");
CREATE INDEX "HealthRecord_studentId_idx" ON "HealthRecord"("studentId");

-- ── Foreign keys ───────────────────────────────────────────────────────────
ALTER TABLE "Guardian" ADD CONSTRAINT "Guardian_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Address" ADD CONSTRAINT "Address_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentDocument" ADD CONSTRAINT "StudentDocument_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_promotedFromId_fkey" FOREIGN KEY ("promotedFromId") REFERENCES "Enrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "HostelAllocation" ADD CONSTRAINT "HostelAllocation_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TransportAllocation" ADD CONSTRAINT "TransportAllocation_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FeeHead" ADD CONSTRAINT "FeeHead_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FeeItem" ADD CONSTRAINT "FeeItem_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FeeItem" ADD CONSTRAINT "FeeItem_feeHeadId_fkey" FOREIGN KEY ("feeHeadId") REFERENCES "FeeHead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Concession" ADD CONSTRAINT "Concession_feeItemId_fkey" FOREIGN KEY ("feeItemId") REFERENCES "FeeItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_feeItemId_fkey" FOREIGN KEY ("feeItemId") REFERENCES "FeeItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ExtracurricularActivity" ADD CONSTRAINT "ExtracurricularActivity_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HealthRecord" ADD CONSTRAINT "HealthRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;