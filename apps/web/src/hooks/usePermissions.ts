"use client";

import { useEffect, useState } from "react";
import { getPermissions, getUser } from "@/lib/auth";
import type { AuthUser, Permission } from "@/lib/auth";

type Action = "view" | "create" | "edit" | "delete";

export function usePermissions() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  // loaded starts false so both server and client render identically (no hydration mismatch).
  // Before localStorage is read we default to showing everything — avoids a blank sidebar flash.
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setPermissions(getPermissions());
    setLoaded(true);
  }, []);

  const isAdmin = user?.role === "ADMIN";

  function can(module: string, action: Action): boolean {
    if (!loaded) return true; // show all items until real permissions are available
    if (isAdmin) return true;
    const perm = permissions.find((p) => p.module === module.toUpperCase());
    if (!perm) return false;
    switch (action) {
      case "view":   return perm.canView;
      case "create": return perm.canCreate;
      case "edit":   return perm.canEdit;
      case "delete": return perm.canDelete;
    }
  }

  function canView(module: string) {
    return can(module, "view");
  }

  return { can, canView, isAdmin, permissions, user };
}
