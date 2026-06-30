"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import clsx from "clsx";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

const ROLES = ["ADMIN", "STAFF", "TEACHER", "PARENT", "STUDENT"] as const;
type RoleKey = (typeof ROLES)[number];

type User = {
  id: string;
  email: string;
  name: string;
  role: RoleKey;
  createdAt: string;
};

type FormState = {
  name: string;
  email: string;
  password: string;
  role: RoleKey;
};

const ROLE_COLORS: Record<RoleKey, string> = {
  ADMIN:   "bg-violet-500/15 text-violet-300 border-violet-500/20",
  STAFF:   "bg-indigo-500/15 text-indigo-300 border-indigo-500/20",
  TEACHER: "bg-sky-500/15 text-sky-300 border-sky-500/20",
  PARENT:  "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  STUDENT: "bg-amber-500/15 text-amber-300 border-amber-500/20",
};

const AVATAR_COLORS = [
  "from-indigo-500 to-violet-500",
  "from-violet-500 to-purple-500",
  "from-sky-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
];

function avatarGradient(name: string) {
  const sum = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Modal ────────────────────────────────────────────────────────────────────

type ModalProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── User Form ────────────────────────────────────────────────────────────────

type UserFormProps = {
  initial?: Partial<FormState>;
  isEdit?: boolean;
  onSubmit: (data: FormState) => Promise<void>;
  onCancel: () => void;
};

function UserForm({ initial, isEdit, onSubmit, onCancel }: UserFormProps) {
  const [form, setForm] = useState<FormState>({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    password: "",
    role: initial?.role ?? "STAFF",
  });
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError((err as { message?: string })?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const fieldCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 transition-all focus:border-indigo-500/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-500/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-400">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-400">Full name</label>
        <input
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. Priya Sharma"
          className={fieldCls}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-400">Email address</label>
        <input
          type="email"
          required={!isEdit}
          disabled={isEdit}
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="priya@jessi.local"
          className={clsx(fieldCls, isEdit && "cursor-not-allowed opacity-50")}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-400">
          Password {isEdit && <span className="text-slate-600">(leave blank to keep current)</span>}
        </label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            required={!isEdit}
            minLength={8}
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            placeholder={isEdit ? "••••••••" : "Min. 8 characters"}
            className={clsx(fieldCls, "pr-10")}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-400">Role</label>
        <select
          value={form.role}
          onChange={(e) => set("role", e.target.value)}
          className={clsx(fieldCls, "cursor-pointer")}
        >
          {ROLES.map((r) => (
            <option key={r} value={r} className="bg-[#0d1117]">
              {r.charAt(0) + r.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow transition-all hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-px active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              {isEdit ? "Saving…" : "Creating…"}
            </>
          ) : isEdit ? (
            "Save changes"
          ) : (
            "Create user"
          )}
        </button>
      </div>
    </form>
  );
}

// ─── Delete confirm inline ─────────────────────────────────────────────────────

type DeleteRowProps = {
  user: User;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
};

function DeleteConfirm({ user, onConfirm, onCancel }: DeleteRowProps) {
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    try { await onConfirm(); } finally { setBusy(false); }
  }

  return (
    <td colSpan={5} className="px-4 py-3 bg-red-500/5 border-l-2 border-red-500/50">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-slate-300">
          Delete <span className="font-semibold text-white">{user.name}</span>? This cannot be undone.
        </span>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg px-3 py-1 text-xs text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={go}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-60 transition-colors"
          >
            {busy ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Trash2 className="h-3 w-3" />}
            Delete
          </button>
        </div>
      </div>
    </td>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const me = getUser();
  const isAdmin = me?.role === "ADMIN";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<User[]>("/users");
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(form: FormState) {
    const created = await api.post<User>("/users", {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    });
    setUsers((u) => [...u, created]);
    setShowCreate(false);
    showToast("User created successfully");
  }

  async function handleEdit(form: FormState) {
    if (!editUser) return;
    const payload: Record<string, string> = { name: form.name, role: form.role };
    if (form.password) payload.password = form.password;
    const updated = await api.patch<User>(`/users/${editUser.id}`, payload);
    setUsers((u) => u.map((x) => (x.id === updated.id ? updated : x)));
    setEditUser(null);
    showToast("User updated successfully");
  }

  async function handleDelete(id: string) {
    await api.delete(`/users/${id}`);
    setUsers((u) => u.filter((x) => x.id !== id));
    setDeleteId(null);
    showToast("User deleted");
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 shadow-xl backdrop-blur">
          <CheckCircle2 className="h-4 w-4" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="grid h-10 w-10 place-items-center rounded-xl"
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
          >
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Users</h1>
            <p className="text-sm text-muted-foreground">
              {users.length} account{users.length !== 1 ? "s" : ""} in the system
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow transition-all hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-px active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            New user
          </button>
        )}
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
        {/* Table head */}
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_5rem] border-b border-white/5 bg-white/[0.03] px-4 py-3 text-[11px] font-semibold tracking-widest text-indigo-500/60 uppercase">
          <span>User</span>
          <span>Email</span>
          <span>Role</span>
          <span>Created</span>
          <span />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
            Loading users…
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-white/5">
              <Users className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">No users yet</p>
              <p className="text-sm">Create the first user to get started.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {users.map((user, i) => {
              const isMe = user.id === me?.id;
              const deleting = deleteId === user.id;

              return (
                <div key={user.id}>
                  {deleting ? (
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <DeleteConfirm
                            user={user}
                            onConfirm={() => handleDelete(user.id)}
                            onCancel={() => setDeleteId(null)}
                          />
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <div
                      className={clsx(
                        "group grid grid-cols-[2fr_2fr_1fr_1fr_5rem] items-center px-4 py-3.5 transition-colors hover:bg-white/[0.03]",
                        i % 2 !== 0 && "bg-white/[0.015]"
                      )}
                    >
                      {/* Name + avatar */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={clsx(
                            "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xs font-bold text-white",
                            avatarGradient(user.name)
                          )}
                        >
                          {initials(user.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-100">
                            {user.name}
                            {isMe && (
                              <span className="ml-2 rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-medium text-indigo-400">
                                you
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <p className="truncate text-sm text-slate-400">{user.email}</p>

                      {/* Role badge */}
                      <span
                        className={clsx(
                          "inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                          ROLE_COLORS[user.role]
                        )}
                      >
                        {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                      </span>

                      {/* Created */}
                      <p className="text-xs text-slate-500">{fmtDate(user.createdAt)}</p>

                      {/* Actions */}
                      {isAdmin ? (
                        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => setEditUser(user)}
                            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          {!isMe && (
                            <button
                              onClick={() => setDeleteId(user.id)}
                              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Roles shortcut */}
      <a
        href="/settings/roles"
        className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3.5 text-sm text-slate-400 transition-all hover:border-indigo-500/30 hover:bg-indigo-500/5 hover:text-slate-200"
      >
        <ShieldCheck className="h-4 w-4 text-indigo-400" />
        <span>Manage role permissions →</span>
      </a>

      {/* Create modal */}
      {showCreate && (
        <Modal title="Create new user" onClose={() => setShowCreate(false)}>
          <UserForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
        </Modal>
      )}

      {/* Edit modal */}
      {editUser && (
        <Modal title={`Edit user · ${editUser.name}`} onClose={() => setEditUser(null)}>
          <UserForm
            isEdit
            initial={{ name: editUser.name, email: editUser.email, role: editUser.role }}
            onSubmit={handleEdit}
            onCancel={() => setEditUser(null)}
          />
        </Modal>
      )}
    </div>
  );
}
