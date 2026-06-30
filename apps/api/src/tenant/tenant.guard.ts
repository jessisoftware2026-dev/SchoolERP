import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

/**
 * Ensures a valid tenant (School) was resolved for the request. Apply to any
 * controller whose data is tenant-owned (students, fees, attendance, …).
 *
 * Access via a tenant subdomain, e.g. http://demo.localhost:3000, or send the
 * `x-tenant-slug` header. Requests without a resolvable tenant are rejected.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    if (!req.school) {
      throw new NotFoundException(
        "Unknown or missing school (tenant). Use a school subdomain or x-tenant-slug header."
      );
    }
    return true;
  }
}
