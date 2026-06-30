"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { getUser, clearAuth, type AuthUser } from "@/lib/auth";

export function Topbar() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  const initials = user
    ? (user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase())
    : "JS";

  const displayName = user?.name ?? "Admin";
  const displaySub  = user?.role
    ? user.role.charAt(0) + user.role.slice(1).toLowerCase()
    : "Jessi School";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-card/95 px-4 backdrop-blur-sm md:px-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search students, fees, classes…"
          className="w-full rounded-lg border bg-muted/50 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:bg-background focus:ring-2 focus:ring-indigo-500/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400 ring-2 ring-card shadow-[0_0_6px_1px_rgba(34,211,238,0.6)]" />
        </button>

        <ThemeToggle />

        {/* User menu */}
        <div className="relative ml-1">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-lg border bg-muted/30 px-2.5 py-1.5 transition-colors hover:bg-muted"
          >
            <div className="grid h-7 w-7 place-items-center rounded-full bg-indigo-600 text-[11px] font-bold text-white shadow-sm">
              {initials}
            </div>
            <div className="hidden sm:block leading-tight text-left">
              <p className="text-xs font-semibold">{displayName}</p>
              <p className="text-[11px] text-muted-foreground">{displaySub}</p>
            </div>
          </button>

          {menuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              {/* Dropdown */}
              <div className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-xl border bg-card shadow-lg">
                <div className="border-b px-4 py-3">
                  <p className="text-sm font-semibold truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
