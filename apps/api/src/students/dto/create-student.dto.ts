import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from "class-validator";
import {
  AddressType,
  BloodGroup,
  DocumentType,
  Gender,
  GuardianRelation,
  StudentStatus,
} from "@prisma/client";
import { ACADEMIC_YEAR_REGEX } from "../academic-year";

// ── Parent / guardian ──────────────────────────────────────────────────────
export class GuardianDto {
  @ApiProperty({ enum: GuardianRelation })
  @IsEnum(GuardianRelation)
  relation!: GuardianRelation;

  @ApiProperty({ example: "Rakesh Sharma" })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiPropertyOptional({ example: "+91 90000 10001" })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiPropertyOptional({ example: "rakesh.sharma@example.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "Engineer" })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional({ example: 850000 })
  @IsOptional()
  @IsNumber()
  annualIncome?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

// ── Address ────────────────────────────────────────────────────────────────
export class AddressDto {
  @ApiProperty({ enum: AddressType })
  @IsEnum(AddressType)
  type!: AddressType;

  @ApiProperty({ example: "12 MG Road" })
  @IsString()
  @MinLength(1)
  line!: string;

  @ApiPropertyOptional({ example: "Bengaluru" })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: "Bengaluru Urban" })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: "Karnataka" })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: "India" })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: "560001" })
  @IsOptional()
  @IsString()
  pincode?: string;
}

// ── Document ───────────────────────────────────────────────────────────────
export class DocumentDto {
  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  type!: DocumentType;

  @ApiPropertyOptional({ example: "TC-2025-1234" })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiPropertyOptional({ example: "https://files.example.com/tc.pdf" })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  verified?: boolean;
}

// ── Student application (creates Student + first Enrollment) ─────────────────
export class CreateStudentDto {
  // Admission identifiers — admissionNo is auto-generated when omitted.
  @ApiPropertyOptional({ example: "APP-2026-0001" })
  @IsOptional()
  @IsString()
  applicationNo?: string;

  @ApiPropertyOptional({
    example: "ADM-2026-27-0001",
    description: "Auto-generated per school/year when omitted.",
  })
  @IsOptional()
  @IsString()
  admissionNo?: string;

  @ApiPropertyOptional({
    example: "2026-27",
    description: "Admission session, YYYY-YY. Defaults to the current session.",
  })
  @IsOptional()
  @Matches(ACADEMIC_YEAR_REGEX, {
    message: "admissionYear must be in YYYY-YY format, e.g. 2026-27",
  })
  admissionYear?: string;

  // Personal details
  @ApiProperty({ example: "Aarav" })
  @IsString()
  @MinLength(1)
  firstName!: string;

  @ApiProperty({ example: "Sharma" })
  @IsString()
  @MinLength(1)
  lastName!: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ example: "2012-05-14", description: "ISO date" })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: BloodGroup })
  @IsOptional()
  @IsEnum(BloodGroup)
  bloodGroup?: BloodGroup;

  @ApiPropertyOptional({ example: "https://files.example.com/photo.jpg" })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional({ example: "Indian" })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({ example: "Hindi" })
  @IsOptional()
  @IsString()
  motherTongue?: string;

  @ApiPropertyOptional({ example: "1234 5678 9012" })
  @IsOptional()
  @IsString()
  aadharNo?: string;

  @ApiPropertyOptional({ example: "EMIS-1029384756" })
  @IsOptional()
  @IsString()
  emisId?: string;

  @ApiPropertyOptional({ example: "aarav@example.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "+91 90000 00001" })
  @IsOptional()
  @IsString()
  phone?: string;

  // Previous-school history
  @ApiPropertyOptional({ example: "Little Flower School" })
  @IsOptional()
  @IsString()
  previousSchool?: string;

  @ApiPropertyOptional({ example: "CBSE" })
  @IsOptional()
  @IsString()
  previousBoard?: string;

  @ApiPropertyOptional({ example: "Grade 8" })
  @IsOptional()
  @IsString()
  previousClass?: string;

  @ApiPropertyOptional({ example: 87.5 })
  @IsOptional()
  @IsNumber()
  lastExamPercent?: number;

  @ApiPropertyOptional({ example: "TC-2025-1234" })
  @IsOptional()
  @IsString()
  transferCertificateNo?: string;

  @ApiPropertyOptional({ enum: StudentStatus, default: StudentStatus.PENDING })
  @IsOptional()
  @IsEnum(StudentStatus)
  status?: StudentStatus;

  // ── First enrollment (admission class) ─────────────────────────────────
  @ApiProperty({ example: "Grade 9" })
  @IsString()
  @MinLength(1)
  grade!: string;

  @ApiPropertyOptional({ example: "A" })
  @IsOptional()
  @IsString()
  section?: string;

  @ApiPropertyOptional({ example: "English" })
  @IsOptional()
  @IsString()
  medium?: string;

  @ApiPropertyOptional({ example: "Science" })
  @IsOptional()
  @IsString()
  sectionGroup?: string;

  @ApiPropertyOptional({ example: "9A-01" })
  @IsOptional()
  @IsString()
  rollNo?: string;

  @ApiPropertyOptional({
    example: "2026-27",
    description: "Academic year of the first enrollment. Defaults to admissionYear.",
  })
  @IsOptional()
  @Matches(ACADEMIC_YEAR_REGEX, {
    message: "academicYear must be in YYYY-YY format, e.g. 2026-27",
  })
  academicYear?: string;

  // ── Related collections ────────────────────────────────────────────────
  @ApiPropertyOptional({ type: [GuardianDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuardianDto)
  guardians?: GuardianDto[];

  @ApiPropertyOptional({ type: [AddressDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses?: AddressDto[];

  @ApiPropertyOptional({ type: [DocumentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  documents?: DocumentDto[];
}