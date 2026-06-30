import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateStudentDto } from "./create-student.dto";

// Updates patch the Student identity record only. Enrollment, guardians,
// addresses and documents are managed through their own endpoints, so they are
// omitted here.
export class UpdateStudentDto extends PartialType(
  OmitType(CreateStudentDto, [
    "guardians",
    "addresses",
    "documents",
    "grade",
    "section",
    "medium",
    "sectionGroup",
    "rollNo",
    "academicYear",
  ] as const)
) {}