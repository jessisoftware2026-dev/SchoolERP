"use client";

import { useEffect, useState, useCallback } from "react";
import { ShieldCheck, Save, RotateCcw, CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";

const ROLES = ["ADMIN", "STAFF", "TEACHER", "PARENT", "STUDENT"] as const;
const MODULES = [
  "DASHBOARD", "STUDENTS", "FEES", "ATTENDANCE",
  "EXAMS", "TIMETABLE", "HR", "TRANSPORT", "AI", "SETTINGS", "ROLES",
] as const;
const ACTIONS = ["canView", "canCreate", "canEdit", "canDelete"] as const;
const ACTION_LABELS: Record<string, string> = {
  canView: "View", canCreate: "Create", canEdit: "Edit", canDelete: "Delete",
};

type RoleKey = typeof ROLES[number];
type ModuleKey = typeof MODULES[number];
type ActionKey = typeof ACTIONS[number];

type PermRow = {
  module: ModuleKey;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

type PermMap = Record<ModuleKey, PermRow>;

function emptyPerms(): PermMap {
  return Object.fromEntries(
    MODULES.map((m) => [m, { module: m, canView: false, canCreate: false, canEdit: false, canDelete: false }])
  ) as PermMap;
}

export default function RolesPage() {
  const user = getUser();
  const isAdmin = user?.role === "ADMIN";

  const [activeRole, setActiveRole] = useState<RoleKey>("STAFF");
  const [perms, setPerms] = useState<PermMap>(emptyPerms());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchPermissions = useCallback(async (role: RoleKey) => {
    setLoading(true);
    try {
      const rows = await api.get<PermRow[]>(`/roles/permissions/${role}`);
      const map = emptyPerms();
      for (const row of rows) map[row.module] = row;
      setPerms(map);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions(activeRole);
  }, [activeRole, fetchPermissions]);

  function toggle(module: ModuleKey, action: ActionKey) {
    if (!isAdmin) return;
    setPerms((prev) => ({
      ...prev,
      [module]: { ...prev[module], [action]: !prev[module][action] },
    }));
    setSaved(false);
  }

  function toggleAllActions(module: ModuleKey) {
    if (!isAdmin) return;
    const row = perms[module];
    const allOn = ACTIONS.every((a) => row[a]);
    setPerms((prev) => ({
      ...prev,
      [module]: { ...row, canView: !allOn, canCreate: !allOn, canEdit: !allOn, canDelete: !allOn },
    }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    try {
      await api.put(`/roles/permissions/${activeRole}`, Object.values(perms));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Roles &amp; Permissions</h1>
            <p className="text-sm text-muted-foreground">Control module access per role</p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={save}
            disabled={saving}
            className={clsx(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all",
              saved
                ? "bg-emerald-600"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-px active:scale-[0.98]",
              saving && "opacity-60 cursor-not-allowed"
            )}
          >
            {saved ? (
              <><CheckCircle2 className="h-4 w-4" /> Saved</>
            ) : saving ? (
              <><RotateCcw className="h-4 w-4 animate-spin" /> Saving…</>
            ) : (
              <><Save className="h-4 w-4" /> Save changes</>
            )}
          </button>
        )}
      </div>

      {/* Role tabs */}
      <div className="flex gap-1 rounded-xl border border-white/5 bg-white/[0.03] p-1">
        {ROLES.map((role) => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={clsx(
              "flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all",
              activeRole === role
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            {role}
          </button>
        ))}
      </div>

      {/* ADMIN notice */}
      {activeRole === "ADMIN" && (
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-300">
          ADMIN has unrestricted access to all modules and cannot be restricted.
        </div>
      )}

      {/* Permissions table */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
          Loading permissions…
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/5">
          {/* Table head */}
          <div className="grid grid-cols-[1fr_repeat(4,_7rem)] border-b border-white/5 bg-white/[0.02] px-4 py-2.5 text-[11px] font-semibold tracking-widest text-indigo-500/60 uppercase">
            <span>Module</span>
            {ACTIONS.map((a) => (
              <span key={a} className="text-center">{ACTION_LABELS[a]}</span>
            ))}
          </div>

          {/* Table rows */}
          {MODULES.map((mod, i) => {
            const row = perms[mod];
            const allOn = ACTIONS.every((a) => row[a]);
            return (
              <div
                key={mod}
                className={clsx(
                  "grid grid-cols-[1fr_repeat(4,_7rem)] items-center px-4 py-3 text-sm transition-colors",
                  i % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]",
                  activeRole !== "ADMIN" && isAdmin && "hover:bg-white/[0.04]"
                )}
              >
                <button
                  className={clsx(
                    "flex items-center gap-2 text-left font-medium",
                    activeRole === "ADMIN" || !isAdmin
                      ? "cursor-default text-slate-300"
                      : "cursor-pointer text-slate-200 hover:text-white"
                  )}
                  onClick={() => activeRole !== "ADMIN" && toggleAllActions(mod)}
                  title={isAdmin && activeRole !== "ADMIN" ? "Click to toggle all" : undefined}
                >
                  <span
                    className={clsx(
                      "h-1.5 w-1.5 rounded-full",
                      allOn ? "bg-emerald-400" : ACTIONS.some((a) => row[a]) ? "bg-amber-400" : "bg-slate-600"
                    )}
                  />
                  {mod.charAt(0) + mod.slice(1).toLowerCase()}
                </button>

                {ACTIONS.map((action) => (
                  <div key={action} className="flex justify-center">
                    <button
                      onClick={() => activeRole !== "ADMIN" && toggle(mod, action)}
                      disabled={activeRole === "ADMIN" || !isAdmin}
                      aria-label={`${ACTION_LABELS[action]} ${mod}`}
                      className={clsx(
                        "h-5 w-5 rounded transition-all",
                        activeRole === "ADMIN" || row[action]
                          ? "bg-indigo-500 shadow-sm shadow-indigo-500/40"
                          : "border border-white/10 bg-white/5",
                        activeRole !== "ADMIN" && isAdmin
                          ? "cursor-pointer hover:scale-110"
                          : "cursor-default opacity-60"
                      )}
                    >
                      {(activeRole === "ADMIN" || row[action]) && (
                        <svg viewBox="0 0 12 12" className="mx-auto h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {!isAdmin && (
        <p className="text-center text-xs text-muted-foreground">
          Only ADMIN users can modify role permissions.
        </p>
      )}
    </div>
  );
}
