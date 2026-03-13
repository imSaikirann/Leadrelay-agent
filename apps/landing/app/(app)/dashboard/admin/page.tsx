"use client";

import { useState } from "react";
import { useAppStore, Member } from "@/store/useAppStore";
import { industries } from "@/lib/industry-data";
import {
  UserPlus, Trash2, Edit2, Check, X,
  Shield, User, TrendingUp
} from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────────

const roleConfig = {
  admin: {
    label: "Admin",
    badge: "bg-[#D4622A]/10 text-[#D4622A] border-[#D4622A]/20",
    icon: <Shield className="w-3 h-3" />,
  },
  sales_lead: {
    label: "Sales Lead",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <TrendingUp className="w-3 h-3" />,
  },
  sales_rep: {
    label: "Sales Rep",
    badge: "bg-[#F0EDE6] text-[#9B8E7E] border-[#E8E2D9]",
    icon: <User className="w-3 h-3" />,
  },
};

const statusConfig = {
  active: { dot: "bg-green-500", label: "Active" },
  busy: { dot: "bg-amber-400", label: "Busy" },
  offline: { dot: "bg-gray-300", label: "Offline" },
};

// ─── Empty form state ─────────────────────────────────────────────────────────

const emptyForm = {
  name: "",
  email: "",
  role: "sales_rep" as Member["role"],
  specialty: "",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompanyAdminPage() {
  const { company, members, addMember, updateMember, removeMember } = useAppStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState<Partial<Member>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    addMember({
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      role: form.role,
      specialty: form.specialty,
      status: "offline",
      addedAt: new Date().toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      }),
    });
    setForm(emptyForm);
    setShowAddModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleEdit = (member: Member) => {
    setEditingId(member.id);
    setEditForm({
      name: member.name,
      email: member.email,
      role: member.role,
      specialty: member.specialty,
    });
  };

  const handleSaveEdit = (id: string) => {
    updateMember(id, editForm);
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    removeMember(id);
    setConfirmDeleteId(null);
  };

  const adminCount = members.filter((m) => m.role === "admin").length;
  const activeCount = members.filter((m) => m.status === "active").length;

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-4xl">

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#1A1714] leading-tight"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Team Admin
          </h1>
          <p className="text-sm text-[#9B8E7E] mt-1">
            Manage who's on your team and what they can do.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto flex items-center gap-2 bg-[#1A1714] text-[#FAF9F6] text-xs font-mono px-4 py-2.5 rounded-xl hover:bg-[#2C2825] transition-colors whitespace-nowrap"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Add member
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total members", value: members.length, color: "text-[#1A1714]" },
          { label: "Active now", value: activeCount, color: "text-green-600" },
          { label: "Sales reps", value: members.filter((m) => m.role === "sales_rep").length, color: "text-[#1A1714]" },
          { label: "Admins", value: adminCount, color: "text-[#D4622A]" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-4">
            <p className="text-xs text-[#9B8E7E] font-mono mb-1">{s.label}</p>
            <p className={"text-2xl font-mono font-medium " + s.color}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Roles explanation */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {[
          {
            role: "Admin",
            desc: "Full access. Can add/remove members, change settings, view all leads and analytics.",
            icon: <Shield className="w-4 h-4 text-[#D4622A]" />,
          },
          {
            role: "Sales Lead",
            desc: "Can view all leads, assign reps, and see team analytics. Cannot change settings.",
            icon: <TrendingUp className="w-4 h-4 text-amber-500" />,
          },
          {
            role: "Sales Rep",
            desc: "Can only see leads assigned to them. Cannot view other reps or settings.",
            icon: <User className="w-4 h-4 text-[#9B8E7E]" />,
          },
        ].map((r) => (
          <div key={r.role} className="bg-white border border-[#E8E2D9] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              {r.icon}
              <p className="text-sm font-medium text-[#1A1714]">{r.role}</p>
            </div>
            <p className="text-xs text-[#9B8E7E] leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Members list */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden">

        {/* Desktop table */}
        <table className="w-full hidden sm:table">
          <thead>
            <tr className="border-b border-[#E8E2D9] bg-[#FAF9F6]">
              {["Member", "Email", "Role", "Specialty", "Status", "Added", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-mono text-[#9B8E7E] whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const role = roleConfig[member.role];
              const status = statusConfig[member.status];
              const isEditing = editingId === member.id;

              return (
                <tr
                  key={member.id}
                  className="border-b border-[#E8E2D9] last:border-0 hover:bg-[#FAF9F6] transition-colors"
                >
                  {/* Member */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-8 h-8 rounded-full bg-[#E8E2D9] flex items-center justify-center text-xs font-medium text-[#1A1714]">
                          {member.name[0]}
                        </div>
                        <span className={"absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white " + status.dot} />
                      </div>
                      {isEditing ? (
                        <input
                          value={editForm.name ?? ""}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="bg-[#FAF9F6] border border-[#E8E2D9] rounded-lg px-2 py-1 text-xs text-[#1A1714] font-mono outline-none focus:border-[#D4622A] w-28"
                        />
                      ) : (
                        <p className="text-sm text-[#1A1714] whitespace-nowrap">{member.name}</p>
                      )}
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3.5">
                    {isEditing ? (
                      <input
                        value={editForm.email ?? ""}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="bg-[#FAF9F6] border border-[#E8E2D9] rounded-lg px-2 py-1 text-xs text-[#1A1714] font-mono outline-none focus:border-[#D4622A] w-36"
                      />
                    ) : (
                      <p className="text-xs font-mono text-[#9B8E7E]">{member.email}</p>
                    )}
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3.5">
                    {isEditing ? (
                      <select
                        value={editForm.role ?? member.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value as Member["role"] })}
                        className="bg-[#FAF9F6] border border-[#E8E2D9] rounded-lg px-2 py-1 text-xs text-[#1A1714] font-mono outline-none appearance-none focus:border-[#D4622A]"
                      >
                        <option value="admin">Admin</option>
                        <option value="sales_lead">Sales Lead</option>
                        <option value="sales_rep">Sales Rep</option>
                      </select>
                    ) : (
                      <span className={"inline-flex items-center gap-1 text-[10px] font-medium border rounded-full px-2 py-0.5 " + role.badge}>
                        {role.icon}
                        {role.label}
                      </span>
                    )}
                  </td>

                  {/* Specialty */}
                  <td className="px-4 py-3.5">
                    {isEditing ? (
                      <select
                        value={editForm.specialty ?? member.specialty}
                        onChange={(e) => setEditForm({ ...editForm, specialty: e.target.value })}
                        className="bg-[#FAF9F6] border border-[#E8E2D9] rounded-lg px-2 py-1 text-xs text-[#1A1714] font-mono outline-none appearance-none focus:border-[#D4622A]"
                      >
                        <option value="">All</option>
                        {industries.map((i) => (
                          <option key={i.value} value={i.label}>{i.label}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs bg-[#F0EDE6] border border-[#E8E2D9] rounded-full px-2.5 py-1 text-[#9B8E7E] font-mono whitespace-nowrap">
                        {member.specialty || "All"}
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => {
                        const next = member.status === "active" ? "busy" : member.status === "busy" ? "offline" : "active";
                        updateMember(member.id, { status: next });
                      }}
                      className="flex items-center gap-1.5 text-xs text-[#9B8E7E] hover:text-[#1A1714] transition-colors"
                    >
                      <span className={"w-2 h-2 rounded-full " + status.dot} />
                      {status.label}
                    </button>
                  </td>

                  {/* Added */}
                  <td className="px-4 py-3.5 text-[10px] font-mono text-[#9B8E7E] whitespace-nowrap">
                    {member.addedAt}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSaveEdit(member.id)}
                          className="flex items-center gap-1 text-[10px] font-mono bg-[#1A1714] text-white rounded-lg px-2 py-1 hover:bg-[#2C2825] transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setEditForm({}); }}
                          className="flex items-center gap-1 text-[10px] font-mono border border-[#E8E2D9] text-[#9B8E7E] rounded-lg px-2 py-1 hover:border-[#C4B9A8] transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : confirmDeleteId === member.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-[#9B8E7E]">Sure?</span>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="text-[10px] font-mono text-red-500 border border-red-200 rounded-lg px-2 py-1 hover:bg-red-50 transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-[10px] font-mono text-[#9B8E7E] border border-[#E8E2D9] rounded-lg px-2 py-1 hover:border-[#C4B9A8] transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEdit(member)}
                          className="flex items-center gap-1 text-[10px] font-mono text-[#9B8E7E] hover:text-[#1A1714] border border-[#E8E2D9] hover:border-[#C4B9A8] rounded-lg px-2 py-1 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(member.id)}
                          className="text-[#C4B9A8] hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Mobile cards */}
        <div className="sm:hidden flex flex-col divide-y divide-[#E8E2D9]">
          {members.map((member) => {
            const role = roleConfig[member.role];
            const status = statusConfig[member.status];

            return (
              <div key={member.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-[#E8E2D9] flex items-center justify-center text-sm font-medium text-[#1A1714]">
                        {member.name[0]}
                      </div>
                      <span className={"absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white " + status.dot} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A1714]">{member.name}</p>
                      <p className="text-[10px] font-mono text-[#9B8E7E]">{member.email}</p>
                    </div>
                  </div>
                  <span className={"inline-flex items-center gap-1 text-[10px] font-medium border rounded-full px-2 py-0.5 " + role.badge}>
                    {role.icon}
                    {role.label}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-[#F0EDE6] border border-[#E8E2D9] rounded-full px-2 py-0.5 text-[#9B8E7E] font-mono text-[10px]">
                      {member.specialty || "All"}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-[#9B8E7E]">
                      <span className={"w-1.5 h-1.5 rounded-full " + status.dot} />
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-[10px] font-mono text-[#9B8E7E] border border-[#E8E2D9] rounded-lg px-2.5 py-1 hover:text-[#1A1714] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(member.id)}
                      className="text-[#C4B9A8] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {members.length === 0 && (
          <p className="text-sm text-[#9B8E7E] py-12 text-center font-mono">
            No team members yet. Add one above.
          </p>
        )}
      </div>

      {/* Add member modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4">
          <div className="bg-[#FAF9F6] border border-[#E8E2D9] rounded-2xl p-6 w-full max-w-sm shadow-xl">

            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl text-[#1A1714]"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              >
                Add team member
              </h2>
              <button
                onClick={() => { setShowAddModal(false); setForm(emptyForm); }}
                className="text-[#9B8E7E] hover:text-[#1A1714] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">

              {/* Name */}
              <div>
                <label className="text-xs font-mono text-[#9B8E7E] mb-1.5 block">Full name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Arjun Mehta"
                  className="w-full bg-white border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] font-mono placeholder:text-[#C4B9A8] outline-none focus:border-[#D4622A] focus:ring-2 focus:ring-[#D4622A]/10 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-mono text-[#9B8E7E] mb-1.5 block">Work email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="arjun@company.com"
                  className="w-full bg-white border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] font-mono placeholder:text-[#C4B9A8] outline-none focus:border-[#D4622A] focus:ring-2 focus:ring-[#D4622A]/10 transition-all"
                />
              </div>

              {/* Role */}
              <div>
                <label className="text-xs font-mono text-[#9B8E7E] mb-1.5 block">Role</label>
                <div className="relative">
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as Member["role"] })}
                    className="w-full bg-white border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] font-mono outline-none appearance-none focus:border-[#D4622A] transition-colors cursor-pointer"
                  >
                    <option value="sales_rep">Sales Rep</option>
                    <option value="sales_lead">Sales Lead</option>
                    <option value="admin">Admin</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C4B9A8] pointer-events-none text-xs">↓</span>
                </div>
              </div>

              {/* Specialty */}
              <div>
                <label className="text-xs font-mono text-[#9B8E7E] mb-1.5 block">Specialty</label>
                <div className="relative">
                  <select
                    value={form.specialty}
                    onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                    className="w-full bg-white border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] font-mono outline-none appearance-none focus:border-[#D4622A] transition-colors cursor-pointer"
                  >
                    <option value="">All industries</option>
                    {industries.map((i) => (
                      <option key={i.value} value={i.label}>{i.label}</option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C4B9A8] pointer-events-none text-xs">↓</span>
                </div>
              </div>

              {/* Role description */}
              <div className="bg-[#F0EDE6] border border-[#E8E2D9] rounded-xl px-4 py-3">
                <p className="text-[10px] font-mono text-[#9B8E7E] leading-relaxed">
                  {form.role === "admin" && "Full access — can manage team, settings, and all leads."}
                  {form.role === "sales_lead" && "Can view all leads and assign reps. No settings access."}
                  {form.role === "sales_rep" && "Can only see leads assigned to them."}
                </p>
              </div>

              <button
                onClick={handleAdd}
                disabled={!form.name || !form.email}
                className="w-full bg-[#1A1714] text-[#FAF9F6] text-sm font-mono py-3 rounded-xl hover:bg-[#2C2825] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-1"
              >
                Add member
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Saved toast */}
      {saved && (
        <div className="fixed bottom-6 right-6 bg-[#1A1714] text-[#FAF9F6] text-xs font-mono px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
          <Check className="w-3.5 h-3.5 text-green-400" />
          Member added successfully
        </div>
      )}

    </div>
  );
}