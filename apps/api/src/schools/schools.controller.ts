import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import type { School } from "@prisma/client";
import { SchoolsService } from "./schools.service";
import { CreateSchoolDto } from "./dto/create-school.dto";
import { UpdateSchoolDto } from "./dto/update-school.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { CurrentSchool } from "../tenant/tenant.decorator";

@ApiTags("schools")
@Controller("schools")
export class SchoolsController {
  constructor(private readonly schools: SchoolsService) {}

  // Public: returns the tenant resolved from the current subdomain (for login
  // page branding). Null when on the platform/root domain.
  @Get("current")
  current(@CurrentSchool() school: School | null) {
    if (!school) return null;
    return {
      id: school.id,
      name: school.name,
      slug: school.slug,
      status: school.status,
    };
  }

  // Everything below is platform-admin only.
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  findAll() {
    return this.schools.findAll();
  }

  @Get(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  findOne(@Param("id") id: string) {
    return this.schools.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  create(@Body() dto: CreateSchoolDto) {
    return this.schools.create(dto);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  update(@Param("id") id: string, @Body() dto: UpdateSchoolDto) {
    return this.schools.update(id, dto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  remove(@Param("id") id: string) {
    return this.schools.remove(id);
  }
}
