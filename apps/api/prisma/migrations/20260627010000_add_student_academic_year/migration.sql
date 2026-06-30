-- AlterTable: add academicYear to Student.
-- Backfill existing rows with the current session, then drop the default so the
-- column matches the schema (no DB-level default — the app supplies the value).
ALTER TABLE "Student" ADD COLUMN "academicYear" TEXT NOT NULL DEFAULT '2026-27';
ALTER TABLE "Student" ALTER COLUMN "academicYear" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Student_academicYear_idx" ON "Student"("academicYear");
