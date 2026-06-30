import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import type { School } from "@prisma/client";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { TenantGuard } from "../tenant/tenant.guard";
import { CurrentSchool } from "../tenant/tenant.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(Role.ADMIN)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  findAll(@CurrentSchool() school: School) {
    return this.users.findAll(school.id);
  }

  @Get(":id")
  findOne(@CurrentSchool() school: School, @Param("id") id: string) {
    return this.users.findOne(school.id, id);
  }

  @Post()
  create(@CurrentSchool() school: School, @Body() dto: CreateUserDto) {
    return this.users.create(school.id, dto);
  }

  @Patch(":id")
  update(
    @CurrentSchool() school: School,
    @Param("id") id: string,
    @Body() dto: UpdateUserDto
  ) {
    return this.users.update(school.id, id, dto);
  }

  @Delete(":id")
  remove(
    @CurrentSchool() school: School,
    @Param("id") id: string,
    @Req() req: { user: { id: string } }
  ) {
    return this.users.remove(school.id, id, req.user.id);
  }
}
