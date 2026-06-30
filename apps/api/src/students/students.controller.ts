import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import type { School } from "@prisma/client";
import { StudentsService } from "./students.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { TenantGuard } from "../tenant/tenant.guard";
import { CurrentSchool } from "../tenant/tenant.decorator";

// Every route here is tenant-scoped: the school is resolved from the subdomain
// (or x-tenant-slug header) by TenantMiddleware and enforced by TenantGuard.
@ApiTags("students")
@Controller("students")
@UseGuards(TenantGuard)
export class StudentsController {
  constructor(private readonly students: StudentsService) {}

  @Get()
  @ApiQuery({ name: "academicYear", required: false, example: "2026-27" })
  findAll(
    @CurrentSchool() school: School,
    @Query("academicYear") academicYear?: string
  ) {
    return this.students.findAll(school.id, academicYear);
  }

  @Get(":id")
  findOne(@CurrentSchool() school: School, @Param("id") id: string) {
    return this.students.findOne(school.id, id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@CurrentSchool() school: School, @Body() dto: CreateStudentDto) {
    return this.students.create(school.id, dto);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(
    @CurrentSchool() school: School,
    @Param("id") id: string,
    @Body() dto: UpdateStudentDto
  ) {
    return this.students.update(school.id, id, dto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@CurrentSchool() school: School, @Param("id") id: string) {
    return this.students.remove(school.id, id);
  }
}
