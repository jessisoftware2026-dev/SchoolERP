import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { ModulePermissionDto } from "./dto/update-role-permissions.dto";
import { RolesService } from "./roles.service";

@Controller("roles")
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get("permissions")
  @Roles(Role.ADMIN)
  getAllPermissions() {
    return this.rolesService.getAllPermissions();
  }

  @Get("permissions/:role")
  @Roles(Role.ADMIN)
  getPermissionsByRole(@Param("role") role: Role) {
    return this.rolesService.getPermissionsByRole(role);
  }

  @Put("permissions/:role")
  @Roles(Role.ADMIN)
  updatePermissions(
    @Param("role") role: Role,
    @Body() body: ModulePermissionDto[]
  ) {
    return this.rolesService.updateRolePermissions(role, body);
  }
}
