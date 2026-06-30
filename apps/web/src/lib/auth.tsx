// ⚠️ REDUNDANT DUPLICATE of ./auth.ts — please DELETE this file.
// Because ".tsx" resolves before ".ts", this file SHADOWS auth.ts for every
// `@/lib/auth` import. It is kept as an EXACT copy of auth.ts so nothing breaks,
// but the correct fix is to delete it:  del "apps\web\src\lib\auth.tsx"
const TOKEN_KEY = "jessi_token";
const USER_KEY = "jessi_user";
const PERMS_KEY = "jessi_permissions";

export type Permission = {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function getPermissions(): Permission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PERMS_KEY);
    return raw ? (JSON.parse(raw) as Permission[]) : [];
  } catch {
    return [];
  }
}

export function setAuth(token: string, user: AuthUser, permissions: Permission[] = []): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(PERMS_KEY, JSON.stringify(permissions));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(PERMS_KEY);
}
