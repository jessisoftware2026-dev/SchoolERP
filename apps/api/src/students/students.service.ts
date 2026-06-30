import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { currentAcademicYear } from "./academic-year";

// All methods are scoped to a single tenant (schoolId) for row-level isolation.
@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(schoolId: string, academicYear?: string) {
    return this.prisma.student.findMany({
      where: {
        schoolId,
        ...(academicYear ? { enrollments: { some: { academicYear } } } : {}),
      },
      include: {
        guardians: true,
        enrollments: { orderBy: { academicYear: "desc" } },
      },
      orderBy: { admissionDate: "desc" },
    });
  }

  async findOne(schoolId: string, id: string) {
    const student = await this.prisma.student.findFirst({
      where: { id, schoolId },
      include: {
        guardians: true,
        addresses: true,
        documents: true,
        healthRecords: { orderBy: { recordedAt: "desc" } },
        enrollments: {
          orderBy: { academicYear: "desc" },
          include: {
            hostel: true,
            transport: true,
            activities: true,
            feeItems: { include: { feeHead: true, concessions: true, payments: true } },
          },
        },
      },
    });
    if (!student) throw new NotFoundException(`Student ${id} not found`);
    return student;
  }

  async create(schoolId: string, dto: CreateStudentDto) {
    const admissionYear = dto.admissionYear ?? currentAcademicYear();
    const academicYear = dto.academicYear ?? admissionYear;
    const admissionNo =
      dto.admissionNo ?? (await this.nextAdmissionNo(schoolId, admissionYear));

    const data: Prisma.StudentCreateInput = {
      school: { connect: { id: schoolId } },
      applicationNo: dto.applicationNo,
      admissionNo,
      admissionYear,
      firstName: dto.firstName,
      lastName: dto.lastName,
      gender: dto.gender,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      bloodGroup: dto.bloodGroup,
      photoUrl: dto.photoUrl,
      nationality: dto.nationality,
      motherTongue: dto.motherTongue,
      aadharNo: dto.aadharNo,
      emisId: dto.emisId,
      email: dto.email,
      phone: dto.phone,
      previousSchool: dto.previousSchool,
      previousBoard: dto.previousBoard,
      previousClass: dto.previousClass,
      lastExamPercent: dto.lastExamPercent,
      transferCertificateNo: dto.transferCertificateNo,
      status: dto.status,
      guardians: dto.guardians?.length
        ? { create: dto.guardians }
        : undefined,
      addresses: dto.addresses?.length ? { create: dto.addresses } : undefined,
      documents: dto.documents?.length ? { create: dto.documents } : undefined,
      enrollments: {
        create: {
          school: { connect: { id: schoolId } },
          academicYear,
          grade: dto.grade,
          section: dto.section,
          medium: dto.medium,
          sectionGroup: dto.sectionGroup,
          rollNo: dto.rollNo,
        },
      },
    };

    return this.prisma.student.create({
      data,
      include: { guardians: true, addresses: true, documents: true, enrollments: true },
    });
  }

  async update(schoolId: string, id: string, dto: UpdateStudentDto) {
    await this.findOne(schoolId, id); // ensures the row belongs to this tenant
    const { dateOfBirth, ...rest } = dto;
    return this.prisma.student.update({
      where: { id },
      data: {
        ...rest,
        ...(dateOfBirth ? { dateOfBirth: new Date(dateOfBirth) } : {}),
      },
    });
  }

  async remove(schoolId: string, id: string) {
    await this.findOne(schoolId, id);
    await this.prisma.student.delete({ where: { id } });
    return { deleted: true, id };
  }

  // Next admission number within the tenant for a given admission session, e.g.
  // ADM-2026-27-0004. The sequence restarts each session.
  private async nextAdmissionNo(
    schoolId: string,
    admissionYear: string
  ): Promise<string> {
    const count = await this.prisma.student.count({
      where: { schoolId, admissionYear },
    });
    const seq = String(count + 1).padStart(4, "0");
    return `ADM-${admissionYear}-${seq}`;
  }
}