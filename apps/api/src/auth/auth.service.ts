import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import type { School } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  /**
   * Tenant-aware login.
   * - With a school (tenant subdomain): authenticate a user that belongs to it.
   * - Without a school (platform/root domain): authenticate a SUPER_ADMIN.
   */
  async login(dto: LoginDto, school: School | null) {
    const user = school
      ? await this.prisma.user.findUnique({
          where: { schoolId_email: { schoolId: school.id, email: dto.email } },
        })
      : await this.prisma.user.findFirst({
          where: { email: dto.email, schoolId: null, role: Role.SUPER_ADMIN },
        });

    if (!user) throw new UnauthorizedException("Invalid credentials");

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    // ADMIN / SUPER_ADMIN bypass the permission table at runtime.
    const permissions =
      user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN
        ? []
        : await this.prisma.rolePermission.findMany({
            where: { role: user.role },
            select: {
              module: true,
              canView: true,
              canCreate: true,
              canEdit: true,
              canDelete: true,
            },
          });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    };

    return {
      accessToken: await this.jwt.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        schoolId: user.schoolId,
      },
      school: school
        ? { id: school.id, name: school.name, slug: school.slug }
        : null,
      permissions,
    };
  }
}
