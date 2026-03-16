"use client";

import { useState, useEffect } from "react";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  seniority: string;
  specialty: string;
  leads: number;
  converted: number;
  avgResponseTime: string;
  status: string;
  activeLeads: number;
};

type FormState = {
  name: string;
  email: string;
  role: string;
  seniority: string;
  specialty: string;
};

const statusConfig = {
  active: { label: "Active", dot: "bg-green-500", badge: "bg-green-50 border-green-200 text-green-700" },
  busy: { label: "Busy", dot: "bg-amber-400", badge: "bg-amber-50 border-amber-200 text-amber-700" },
  offline: { label: "Offline", dot: "bg-gray-300", badge: "bg-gray-50 border-gray-200 text-gray-500" },
};

const nextStatus = { active: "busy", busy: "offline", offline: "active" } as const;

const seniorityColors = {
  junior: "bg-blue-50 border-blue-200 text-blue-600",
  mid: "bg-purple-50 border-purple-200 text-purple-600",
  senior: "bg-amber-50 border-amber-200 text-amber-700",
};

const defaultForm: FormState = {
  name: "", email: "", role: "Sales Rep", seniority: "junior", specialty: "",
};

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [createdPassword, setCreatedPassword] = useState("");
  const [form, setForm] = useState<FormState>(defaultForm);

  // Fetch team
  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => { setTeam(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Toggle status
  const toggleStatus = async (member: TeamMember) => {
    const newStatus = nextStatus[member.status as keyof typeof nextStatus];
    setTeam((prev) => prev.map((m) => m.id === member.id ? { ...m, status: newStatus } : m));
    await fetch(`/api/team/${member.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  // Add member
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to add member");
      }
      const { plainPassword, ...newMember } = await res.json();
      setTeam((prev) => [...prev, newMember]);
      setCreatedPassword(plainPassword);
      setForm(defaultForm);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete member
  const handleDelete = async (id: string) => {
    if (!confirm("Remove this team member?")) return;
    setTeam((prev) => prev.filter((m) => m.id !== id));
    await fetch(`/api/team/${id}`, { method: "DELETE" });
  };

  const closeModal = () => {
    setShowModal(false);
    setCreatedPassword("");
    setError("");
    setForm(defaultForm);
  };

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#1A1714] leading-tight"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Team
          </h1>
          <p className="text-sm text-[#9B8E7E] mt-1">
            Track rep availability, response times and conversion rates.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-auto text-xs font-mono border border-[#E8E2D9] rounded-xl px-4 py-2 text-[#9B8E7E] hover:border-[#C4B9A8] hover:text-[#1A1714] transition-colors whitespace-nowrap"
        >
          + Add member
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Active now", value: team.filter((m) => m.status === "active").length, color: "text-green-600" },
          { label: "Total leads", value: team.reduce((a, m) => a + m.leads, 0), color: "text-[#1A1714]" },
          { label: "Converted", value: team.reduce((a, m) => a + m.converted, 0), color: "text-[#D4622A]" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-4">
            <p className="text-xs text-[#9B8E7E] font-mono mb-1">{s.label}</p>
            <p className={`text-2xl font-mono font-medium ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16 text-sm text-[#9B8E7E] font-mono">Loading team...</div>
      )}

      {/* Empty */}
      {!loading && team.length === 0 && (
        <div className="text-center py-16 border border-dashed border-[#E8E2D9] rounded-2xl">
          <p className="text-sm text-[#9B8E7E] font-mono">No team members yet.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-3 text-xs text-[#D4622A] font-mono hover:underline"
          >
            + Add your first member
          </button>
        </div>
      )}

      {/* Desktop table */}
      {!loading && team.length > 0 && (
        <div className="hidden sm:block bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E2D9] bg-[#FAF9F6]">
                {["Rep","email", "Seniority", "Specialty", "Status", "Active Leads", "Total Leads", "Converted", "Avg Response", "Conv. Rate", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-mono text-[#9B8E7E] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {team.map((member) => {
                const s = statusConfig[member.status as keyof typeof statusConfig] ?? statusConfig.offline;
                const sen = seniorityColors[member.seniority as keyof typeof seniorityColors] ?? seniorityColors.junior;
                const convRate = member.leads > 0 ? Math.round((member.converted / member.leads) * 100) : 0;

                return (
                  <tr key={member.id} className="border-b border-[#E8E2D9] last:border-0 hover:bg-[#FAF9F6] transition-colors">

                    {/* Rep */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 rounded-full bg-[#E8E2D9] flex items-center justify-center text-xs font-medium text-[#1A1714]">
                            {member.name[0]}
                          </div>
                          <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${s.dot}`} />
                        </div>
                        <div>
                          <p className="text-sm text-[#1A1714] font-medium whitespace-nowrap">{member.name}</p>
                          
                          <p className="text-[10px] text-[#9B8E7E] font-mono">{member.role}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`text-xs border rounded-full px-2.5 py-1 font-mono capitalize `}>
                        {member.email}
                      </span>
                    </td>

                    {/* Seniority */}
                    <td className="px-4 py-3.5">
                      <span className={`text-xs border rounded-full px-2.5 py-1 font-mono capitalize ${sen}`}>
                        {member.seniority}
                      </span>
                    </td>

                    {/* Specialty */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-[#F0EDE6] border border-[#E8E2D9] rounded-full px-2.5 py-1 text-[#9B8E7E] font-mono">
                        {member.specialty || "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => toggleStatus(member)}
                        className={`inline-flex items-center gap-1.5 border text-xs font-medium rounded-full px-2.5 py-1 transition-all ${s.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </button>
                    </td>

                    {/* Active leads */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-[#1A1714]">{member.activeLeads}</span>
                        {member.activeLeads >= 4 && (
                          <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-1.5 py-0.5 font-mono">overloaded</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-sm font-mono text-[#1A1714]">{member.leads}</td>
                    <td className="px-4 py-3.5 text-sm font-mono text-[#1A1714]">{member.converted}</td>

                    {/* Avg response */}
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-mono ${
                        parseInt(member.avgResponseTime) <= 15 ? "text-green-600"
                        : parseInt(member.avgResponseTime) <= 30 ? "text-amber-600"
                        : "text-red-500"
                      }`}>
                        {member.avgResponseTime}
                      </span>
                    </td>

                    {/* Conv rate */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#E8E2D9] rounded-full overflow-hidden">
                          <div className="h-full bg-[#D4622A] rounded-full" style={{ width: `${convRate}%` }} />
                        </div>
                        <span className="text-xs font-mono text-[#1A1714]">{convRate}%</span>
                      </div>
                    </td>

                    {/* Remove */}
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-xs text-[#C4B9A8] hover:text-red-500 font-mono transition-colors"
                      >
                        remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {!loading && team.length > 0 && (
        <div className="flex flex-col gap-3 sm:hidden">
          {team.map((member) => {
            const s = statusConfig[member.status as keyof typeof statusConfig] ?? statusConfig.offline;
            const sen = seniorityColors[member.seniority as keyof typeof seniorityColors] ?? seniorityColors.junior;
            const convRate = member.leads > 0 ? Math.round((member.converted / member.leads) * 100) : 0;

            return (
              <div key={member.id} className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-[#E8E2D9] flex items-center justify-center text-sm font-medium text-[#1A1714]">
                        {member.name[0]}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${s.dot}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A1714]">{member.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-[10px] text-[#9B8E7E] font-mono">{member.role}</p>
                        <span className={`text-[10px] border rounded-full px-1.5 py-0.5 font-mono capitalize ${sen}`}>
                          {member.seniority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStatus(member)}
                    className={`inline-flex items-center gap-1.5 border text-xs font-medium rounded-full px-2.5 py-1 ${s.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#E8E2D9]">
                  {[
                    { label: "Leads", value: member.leads },
                    { label: "Converted", value: member.converted },
                    { label: "Active", value: member.activeLeads },
                    { label: "Resp.", value: member.avgResponseTime },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-xs font-mono font-medium text-[#1A1714]">{stat.value}</p>
                      <p className="text-[10px] text-[#9B8E7E]">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E8E2D9]">
                  <p className="text-[10px] text-[#9B8E7E] font-mono shrink-0">Conv. rate</p>
                  <div className="flex-1 h-1.5 bg-[#E8E2D9] rounded-full overflow-hidden">
                    <div className="h-full bg-[#D4622A] rounded-full" style={{ width: `${convRate}%` }} />
                  </div>
                  <p className="text-[10px] font-mono text-[#1A1714] shrink-0">{convRate}%</p>
                </div>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="mt-3 text-[10px] text-[#C4B9A8] hover:text-red-500 font-mono transition-colors"
                >
                  remove member
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D9] w-full max-w-md p-6 shadow-xl">

            {createdPassword ? (
              // ── Password reveal screen ──
              <>
                <div className="w-10 h-10 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-4">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <h2 className="text-xl text-[#1A1714] mb-1" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                  Member added!
                </h2>
                <p className="text-xs text-[#9B8E7E] font-mono mb-6">
                  Share these login credentials. The password won't be shown again.
                </p>
                <div className="bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-4 mb-6">
                  <p className="text-xs text-[#9B8E7E] font-mono mb-3">Login credentials</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#9B8E7E] font-mono">Email</span>
                      <span className="text-xs text-[#1A1714] font-mono">{form.email || team[team.length - 1]?.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#9B8E7E] font-mono">Password</span>
                      <span className="text-sm text-[#D4622A] font-mono font-medium select-all">{createdPassword}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-full bg-[#D4622A] text-white rounded-xl py-3 text-sm font-mono hover:bg-[#C05520] transition-colors"
                >
                  Done
                </button>
              </>
            ) : (
              // ── Add member form ──
              <>
                <h2 className="text-xl text-[#1A1714] mb-1" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                  Add team member
                </h2>
                <p className="text-xs text-[#9B8E7E] font-mono mb-6">
                  A password will be auto-generated.
                </p>

                <form onSubmit={handleAdd} className="flex flex-col gap-4">
                  {/* Text fields */}
                  {[
                    { label: "Full name", key: "name", type: "text", placeholder: "Arjun Mehta" },
                    { label: "Email", key: "email", type: "email", placeholder: "arjun@company.com" },
                    { label: "Role", key: "role", type: "text", placeholder: "Sales Rep" },
                    { label: "Specialty", key: "specialty", type: "text", placeholder: "SaaS, EdTech..." },
                  ].map((field) => (
                    <div key={field.key} className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono text-[#9B8E7E]">{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={form[field.key as keyof FormState]}
                        onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                        required={field.key === "name" || field.key === "email"}
                        className="bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] font-mono outline-none focus:border-[#D4622A] transition-colors"
                      />
                    </div>
                  ))}

                  {/* Seniority */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-[#9B8E7E]">Seniority</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["junior", "mid", "senior"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, seniority: level }))}
                          className="py-2.5 rounded-xl text-xs font-mono border capitalize transition-all"
                          style={{
                            background: form.seniority === level ? "#D4622A" : "#FAF9F6",
                            color: form.seniority === level ? "#fff" : "#1A1714",
                            borderColor: form.seniority === level ? "#D4622A" : "#E8E2D9",
                          }}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-500 font-mono">{error}</p>}

                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 border border-[#E8E2D9] rounded-xl py-3 text-sm text-[#9B8E7E] hover:border-[#C4B9A8] transition-colors font-mono"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-[#D4622A] text-white rounded-xl py-3 text-sm font-mono hover:bg-[#C05520] transition-colors disabled:opacity-50"
                    >
                      {saving ? "Adding..." : "Add member"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}