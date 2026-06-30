import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { CurrentSchool } from "../tenant/tenant.decorator";
import type { School } from "@prisma/client";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // Tenant is resolved from the subdomain / x-tenant-slug by TenantMiddleware.
  // No tenant => platform login (SUPER_ADMIN).
  @Post("login")
  login(@Body() dto: LoginDto, @CurrentSchool() school: School | null) {
    return this.auth.login(dto, school);
  }

  @Get("me")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  me(@Req() req: { user: unknown }) {
    return req.user;
  }
}
