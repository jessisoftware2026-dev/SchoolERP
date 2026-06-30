"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  GraduationCap,
  Wallet,
  CalendarCheck,
  ClipboardList,
  Clock,
  Users,
  Bus,
  Bot,
  Settings,
  School,
  Lock,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

const navGroups = [
  {
    label: "CORE",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, module: "DASHBOARD" },
      { href: "/students",  label: "Students",  icon: GraduationCap,   module: "STUDENTS"  },
    ],
  },
  {
    label: "ACADEMICS",
    items: [
      { href: "/fees",       label: "Fees",            icon: Wallet,        module: "FEES",       soon: true },
      { href: "/attendance", label: "Attendance",      icon: CalendarCheck, module: "ATTENDANCE", soon: true },
      { href: "/exams",      label: "Exams & Results", icon: ClipboardList, module: "EXAMS",      soon: true },
      { href: "/timetable",  label: "Timetable",       icon: Clock,         module: "TIMETABLE",  soon: true },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      { href: "/hr",        label: "HR & Payroll", icon: Users, module: "HR",        soon: true },
      { href: "/transport", label: "Transport",    icon: Bus,   module: "TRANSPORT", soon: true },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { href: "/ai", label: "AI Assistant", icon: Bot, module: "AI", soon: true },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { href: "/settings/users", label: "Users",               icon: UserCog,    module: "ROLES"    },
      { href: "/settings/roles", label: "Roles & Permissions", icon: ShieldCheck, module: "ROLES"    },
      { href: "/settings",       label: "Settings",            icon: Settings,   module: "SETTINGS", soon: true },
    ],
  },
];

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  module: string;
  soon?: boolean;
};

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={clsx(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20"
          : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
      )}
    >
      {active && (
        <span className="absolute inset-y-0 left-0 w-0.5 rounded-r-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)]" />
      )}
      <Icon
        className={clsx(
          "h-4 w-4 shrink-0 transition-colors",
          active ? "text-white" : "text-slate-500 group-hover:text-slate-300"
        )}
      />
      <span className="flex-1">{item.label}</span>
      {item.soon && !active && (
        <Lock className="h-3 w-3 text-slate-700 group-hover:text-slate-500" />
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { canView, user } = usePermissions();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <aside
      className="hidden md:flex w-64 shrink-0 flex-col"
      style={{ background: "linear-gradient(180deg, #070c15 0%, #0a0e1c 100%)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/5">
        <div
          className="grid place-items-center h-9 w-9 rounded-lg shadow-lg shadow-indigo-500/30"
          style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
        >
          <School className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">Jessi ERP</p>
          <p className="text-[11px] text-slate-500">School Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group) => {
          const visible = group.items.filter((item) => canView(item.module));
          if (visible.length === 0) return null;
          return (
            <div key={group.label}>
              <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-widest text-indigo-500/40">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {visible.map((item) => (
                  <NavLink key={item.href} item={item} pathname={pathname} />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/5 px-4 py-3 flex items-center gap-3">
        <div
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-white shadow-sm"
          style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
        >
          {initials}
        </div>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-xs font-semibold text-slate-200">
            {user?.name ?? "—"}
          </p>
          <p className="truncate text-[11px] text-slate-500">
            {user?.role ?? ""}
          </p>
        </div>
      </div>
    </aside>
  );
}
