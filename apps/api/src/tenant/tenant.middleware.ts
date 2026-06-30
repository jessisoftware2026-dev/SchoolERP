import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { PrismaService } from "../prisma/prisma.service";
import type { School } from "@prisma/client";

// Subdomains that are NOT tenants (platform / infra hosts).
const RESERVED = new Set(["www", "app", "api", "admin", "localhost", ""]);

/**
 * Resolve the slug from an explicit header (set by the web middleware) or by
 * parsing the Host subdomain. Examples:
 *   demo.localhost:3000   -> "demo"
 *   demo.jessierp.com     -> "demo"
 *   localhost / jessierp.com -> null (platform/root)
 */
export function extractTenantSlug(req: Request): string | null {
  const header = (req.headers["x-tenant-slug"] as string | undefined)?.trim();
  if (header) return header.toLowerCase();

  const host = (req.headers.host ?? "").split(":")[0]; // strip port
  const labels = host.split(".");
  // Need at least <sub>.<domain> (2 labels) — for *.localhost that's sub.localhost
  if (labels.length < 2) return null;
  const sub = labels[0].toLowerCase();
  if (RESERVED.has(sub)) return null;
  return sub;
}

// Augment Express Request with tenant context.
declare module "express-serve-static-core" {
  interface Request {
    school?: School | null;
    tenantSlug?: string | null;
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const slug = extractTenantSlug(req);
    req.tenantSlug = slug;
    req.school = slug
      ? await this.prisma.school.findUnique({ where: { slug } })
      : null;
    next();
  }
}
