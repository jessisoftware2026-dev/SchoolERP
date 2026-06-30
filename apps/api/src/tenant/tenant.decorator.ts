import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { School } from "@prisma/client";

/** Injects the resolved tenant (School) for the current request, or null. */
export const CurrentSchool = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): School | null => {
    const req = ctx.switchToHttp().getRequest();
    return req.school ?? null;
  }
);

export interface RequestUser {
  id: string;
  email: string;
  role: string;
  schoolId: string | null;
}

/** Injects the authenticated user (set by the JWT strategy). */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestUser | undefined => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  }
);
