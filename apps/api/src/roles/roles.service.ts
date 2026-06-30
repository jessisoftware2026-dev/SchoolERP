import { Injectable } from "@nestjs/common";
import { Module, Role } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { ModulePermissionDto } from "./dto/update-role-permissions.dto";

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  getAllPermissions() {
    return this.prisma.rolePermission.findMany({
      orderBy: [{ role: "asc" }, { module: "asc" }],
    });
  }

  getPermissionsByRole(role: Role) {
    return this.prisma.rolePermission.findMany({
      where: { role },
      orderBy: { module: "asc" },
    });
  }

  async updateRolePermissions(role: Role, updates: ModulePermissionDto[]) {
    const results = await Promise.all(
      updates.map((u) =>
        this.prisma.rolePermission.upsert({
          where: { role_module: { role, module: u.module as Module } },
          update: {
            canView:   u.canView   ?? false,
            canCreate: u.canCreate ?? false,
            canEdit:   u.canEdit   ?? false,
            canDelete: u.canDelete ?? false,
          },
          create: {
            role,
            module:    u.module as Module,
            canView:   u.canView   ?? false,
            canCreate: u.canCreate ?? false,
            canEdit:   u.canEdit   ?? false,
            canDelete: u.canDelete ?? false,
          },
        })
      )
    );
    return results;
  }
}
