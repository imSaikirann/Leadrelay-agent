
"use client";
 
import { useState, useEffect } from "react";
 
// ─── Types ────────────────────────────────────────────────────────────────────
 
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
 
type Team = {
  id: string;
  name: string;
  description: string;
  color: string;
  memberIds: string[];
  leads: number;
  converted: number;
  createdAt: string;
};
 
type FormState = {
  name: string;
  email: string;
  role: string;
  seniority: string;
  specialty: string;
};
 
type TeamFormState = {
  name: string;
  description: string;
  color: string;
  memberIds: string[];
};
 
// ─── Config ───────────────────────────────────────────────────────────────────
 
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
 
const TEAM_COLORS = [
  { value: "#D4622A", label: "Ember" },
  { value: "#5B6CF4", label: "Indigo" },
  { value: "#16A34A", label: "Green" },
  { value: "#DC2626", label: "Red" },
  { value: "#9333EA", label: "Purple" },
  { value: "#0891B2", label: "Cyan" },
];
 
const defaultForm: FormState = {
  name: "", email: "", role: "Sales Rep", seniority: "junior", specialty: "",
};
 
const defaultTeamForm: TeamFormState = {
  name: "", description: "", color: "#D4622A", memberIds: [],
};
 
// ─── Avatar helper ────────────────────────────────────────────────────────────
 
function Avatar({ name, size = "sm", color }: { name: string; size?: "sm" | "md" | "lg"; color?: string }) {
  const sz = size === "sm" ? "w-7 h-7 text-xs" : size === "md" ? "w-9 h-9 text-sm" : "w-11 h-11 text-base";
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-medium text-white shrink-0`}
      style={{ background: color ?? "#C4B9A8" }}
    >
      {name[0]?.toUpperCase()}
    </div>
  );
}
 
// ─── Main page ────────────────────────────────────────────────────────────────
 
export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<"members" | "teams">("members");
 
  // Members state
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberSaving, setMemberSaving] = useState(false);
  const [memberError, setMemberError] = useState("");
  const [createdPassword, setCreatedPassword] = useState("");
  const [memberForm, setMemberForm] = useState<FormState>(defaultForm);
 
  // Teams state
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamSaving, setTeamSaving] = useState(false);
  const [teamError, setTeamError] = useState("");
  const [teamForm, setTeamForm] = useState<TeamFormState>(defaultTeamForm);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
 
  // ── Fetch members
  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => { setMembers(Array.isArray(data) ? data : []); setMembersLoading(false); })
      .catch(() => setMembersLoading(false));
  }, []);


 
  // ── Fetch teams (adjust endpoint to match your API)
  useEffect(() => {
    fetch("/api/teams")
      .then((r) => r.json())
      .then((data) => { setTeams(Array.isArray(data) ? data : []); setTeamsLoading(false); })
      .catch(() => setTeamsLoading(false));
  }, []);
 
  // ── Member actions
  const toggleStatus = async (member: TeamMember) => {
    const newStatus = nextStatus[member.status as keyof typeof nextStatus];
    setMembers((prev) => prev.map((m) => m.id === member.id ? { ...m, status: newStatus } : m));
    await fetch(`/api/team/${member.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  };
 
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberSaving(true);
    setMemberError("");
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberForm),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to add member");
      }
      const { plainPassword, ...newMember } = await res.json();
      setMembers((prev) => [...prev, newMember]);
      setCreatedPassword(plainPassword);
      setMemberForm(defaultForm);
    } catch (err: any) {
      setMemberError(err.message);
    } finally {
      setMemberSaving(false);
    }
  };
 
  const handleDeleteMember = async (id: string) => {
    if (!confirm("Remove this team member?")) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
    // Also remove from all teams
    setTeams((prev) => prev.map((t) => ({ ...t, memberIds: t.memberIds.filter((mid) => mid !== id) })));
    await fetch(`/api/team/${id}`, { method: "DELETE" });
  };
 
  const closeMemberModal = () => {
    setShowMemberModal(false);
    setCreatedPassword("");
    setMemberError("");
    setMemberForm(defaultForm);
  };
 
  // ── Team actions
  const openCreateTeam = () => {
    setEditingTeam(null);
    setTeamForm(defaultTeamForm);
    setTeamError("");
    setShowTeamModal(true);
  };
 
  const openEditTeam = (team: Team) => {
    setEditingTeam(team);
    setTeamForm({ name: team.name, description: team.description, color: team.color, memberIds: team.memberIds });
    setTeamError("");
    setShowTeamModal(true);
  };
 
  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeamSaving(true);
    setTeamError("");
    try {
      if (editingTeam) {
        const res = await fetch(`/api/teams/${editingTeam.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teamForm),
        });
        if (!res.ok) throw new Error("Failed to update team");
        setTeams((prev) => prev.map((t) => t.id === editingTeam.id ? { ...t, ...teamForm } : t));
      } else {
        const res = await fetch("/api/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teamForm),
        });
        if (!res.ok) throw new Error("Failed to create team");
        const newTeam = await res.json();
        setTeams((prev) => [...prev, newTeam]);
      }
      setShowTeamModal(false);
      setTeamForm(defaultTeamForm);
      setEditingTeam(null);
    } catch (err: any) {
      setTeamError(err.message);
    } finally {
      setTeamSaving(false);
    }
  };
 
  const handleDeleteTeam = async (id: string) => {
    if (!confirm("Delete this team?")) return;
    setTeams((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/teams/${id}`, { method: "DELETE" });
  };
 
  const toggleMemberInTeamForm = (memberId: string) => {
    setTeamForm((f) => ({
      ...f,
      memberIds: f.memberIds.includes(memberId)
        ? f.memberIds.filter((id) => id !== memberId)
        : [...f.memberIds, memberId],
    }));
  };
 
  const getMemberById = (id: string) => members.find((m) => m.id === id);
 
  const getTeamStats = (team: Team) => {
    const teamMembers = team.memberIds.map(getMemberById).filter(Boolean) as TeamMember[];
    const totalLeads = teamMembers.reduce((a, m) => a + m.leads, 0);
    const totalConverted = teamMembers.reduce((a, m) => a + m.converted, 0);
    const activeCount = teamMembers.filter((m) => m.status === "active").length;
    const convRate = totalLeads > 0 ? Math.round((totalConverted / totalLeads) * 100) : 0;
    return { totalLeads, totalConverted, activeCount, convRate, teamMembers };
  };
 
  // ─── Render ────────────────────────────────────────────────────────────────
 
  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">
 
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#1A1714] leading-tight"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Team
          </h1>
          <p className="text-sm text-[#9B8E7E] mt-1">
            Manage members, create teams and assign leads.
          </p>
        </div>
 
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {activeTab === "members" && (
            <button
              onClick={() => setShowMemberModal(true)}
              className="text-xs font-mono border border-[#E8E2D9] rounded-xl px-4 py-2 text-[#9B8E7E] hover:border-[#C4B9A8] hover:text-[#1A1714] transition-colors whitespace-nowrap"
            >
              + Add member
            </button>
          )}
          {activeTab === "teams" && (
            <button
              onClick={openCreateTeam}
              className="text-xs font-mono bg-[#D4622A] rounded-xl px-4 py-2 text-white hover:bg-[#C05520] transition-colors whitespace-nowrap"
            >
              + Create team
            </button>
          )}
        </div>
      </div>
 
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-[#F0EDE6] rounded-xl p-1 w-fit">
        {(["members", "teams"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-mono capitalize px-4 py-2 rounded-lg transition-all ${
              activeTab === tab
                ? "bg-white text-[#1A1714] shadow-sm border border-[#E8E2D9]"
                : "text-[#9B8E7E] hover:text-[#1A1714]"
            }`}
          >
            {tab}
            <span className={`ml-1.5 text-[10px] ${activeTab === tab ? "text-[#D4622A]" : "text-[#C4B9A8]"}`}>
              {tab === "members" ? members.length : teams.length}
            </span>
          </button>
        ))}
      </div>
 
      {/* ══════════════ MEMBERS TAB ══════════════ */}
      {activeTab === "members" && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: "Active now", value: members.filter((m) => m.status === "active").length, color: "text-green-600" },
              { label: "Total leads", value: members.reduce((a, m) => a + m.leads, 0), color: "text-[#1A1714]" },
              { label: "Converted", value: members.reduce((a, m) => a + m.converted, 0), color: "text-[#D4622A]" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-4">
                <p className="text-xs text-[#9B8E7E] font-mono mb-1">{s.label}</p>
                <p className={`text-2xl font-mono font-medium ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
 
          {membersLoading && (
            <div className="text-center py-16 text-sm text-[#9B8E7E] font-mono">Loading members...</div>
          )}
 
          {!membersLoading && members.length === 0 && (
            <div className="text-center py-16 border border-dashed border-[#E8E2D9] rounded-2xl">
              <p className="text-sm text-[#9B8E7E] font-mono">No team members yet.</p>
              <button onClick={() => setShowMemberModal(true)} className="mt-3 text-xs text-[#D4622A] font-mono hover:underline">
                + Add your first member
              </button>
            </div>
          )}
 
          {/* Desktop table */}
          {!membersLoading && members.length > 0 && (
            <div className="hidden sm:block bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8E2D9] bg-[#FAF9F6]">
                    {["Rep", "Email", "Seniority", "Specialty", "Status", "Active Leads", "Total Leads", "Converted", "Avg Response", "Conv. Rate", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-mono text-[#9B8E7E] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => {
                    const s = statusConfig[member.status as keyof typeof statusConfig] ?? statusConfig.offline;
                    const sen = seniorityColors[member.seniority as keyof typeof seniorityColors] ?? seniorityColors.junior;
                    const convRate = member.leads > 0 ? Math.round((member.converted / member.leads) * 100) : 0;
                    // Find teams this member belongs to
                    const memberTeams = teams.filter((t) => t.memberIds.includes(member.id));
 
                    return (
                      <tr key={member.id} className="border-b border-[#E8E2D9] last:border-0 hover:bg-[#FAF9F6] transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <div className="w-8 h-8 rounded-full bg-[#E8E2D9] flex items-center justify-center text-xs font-medium text-[#1A1714]">
                                {member?.name[0]}
                              </div>
                              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${s.dot}`} />
                            </div>
                            <div>
                              <p className="text-sm text-[#1A1714] font-medium whitespace-nowrap">{member.name}</p>
                              <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                <p className="text-[10px] text-[#9B8E7E] font-mono">{member.role}</p>
                                {memberTeams.map((t) => (
                                  <span
                                    key={t.id}
                                    className="text-[9px] font-mono px-1.5 py-0.5 rounded-full text-white"
                                    style={{ background: t.color }}
                                  >
                                    {t.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs font-mono text-[#9B8E7E]">{member.email}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs border rounded-full px-2.5 py-1 font-mono capitalize ${sen}`}>{member.seniority}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs bg-[#F0EDE6] border border-[#E8E2D9] rounded-full px-2.5 py-1 text-[#9B8E7E] font-mono">
                            {member.specialty || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => toggleStatus(member)}
                            className={`inline-flex items-center gap-1.5 border text-xs font-medium rounded-full px-2.5 py-1 transition-all ${s.badge}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {s.label}
                          </button>
                        </td>
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
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-mono ${
                            parseInt(member.avgResponseTime) <= 15 ? "text-green-600"
                            : parseInt(member.avgResponseTime) <= 30 ? "text-amber-600"
                            : "text-red-500"
                          }`}>
                            {member.avgResponseTime}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-[#E8E2D9] rounded-full overflow-hidden">
                              <div className="h-full bg-[#D4622A] rounded-full" style={{ width: `${convRate}%` }} />
                            </div>
                            <span className="text-xs font-mono text-[#1A1714]">{convRate}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <button onClick={() => handleDeleteMember(member.id)} className="text-xs text-[#C4B9A8] hover:text-red-500 font-mono transition-colors">
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
          {!membersLoading && members.length > 0 && (
            <div className="flex flex-col gap-3 sm:hidden">
              {members.map((member) => {
                const s = statusConfig[member.status as keyof typeof statusConfig] ?? statusConfig.offline;
                const sen = seniorityColors[member.seniority as keyof typeof seniorityColors] ?? seniorityColors.junior;
                const convRate = member.leads > 0 ? Math.round((member.converted / member.leads) * 100) : 0;
                const memberTeams = teams.filter((t) => t.memberIds.includes(member.id));
 
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
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <p className="text-[10px] text-[#9B8E7E] font-mono">{member.role}</p>
                            <span className={`text-[10px] border rounded-full px-1.5 py-0.5 font-mono capitalize ${sen}`}>{member.seniority}</span>
                            {memberTeams.map((t) => (
                              <span key={t.id} className="text-[9px] font-mono px-1.5 py-0.5 rounded-full text-white" style={{ background: t.color }}>
                                {t.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => toggleStatus(member)} className={`inline-flex items-center gap-1.5 border text-xs font-medium rounded-full px-2.5 py-1 ${s.badge}`}>
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
                    <button onClick={() => handleDeleteMember(member.id)} className="mt-3 text-[10px] text-[#C4B9A8] hover:text-red-500 font-mono transition-colors">
                      remove member
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
 
      {/* ══════════════ TEAMS TAB ══════════════ */}
      {activeTab === "teams" && (
        <>
          {/* Teams summary */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: "Total teams", value: teams.length, color: "text-[#1A1714]" },
              { label: "Members assigned", value: [...new Set(teams.flatMap((t) => t.memberIds))].length, color: "text-[#D4622A]" },
              { label: "Unassigned", value: members.filter((m) => !teams.some((t) => t.memberIds.includes(m.id))).length, color: "text-amber-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-4">
                <p className="text-xs text-[#9B8E7E] font-mono mb-1">{s.label}</p>
                <p className={`text-2xl font-mono font-medium ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
 
          {teamsLoading && (
            <div className="text-center py-16 text-sm text-[#9B8E7E] font-mono">Loading teams...</div>
          )}
 
          {!teamsLoading && teams.length === 0 && (
            <div className="text-center py-16 border border-dashed border-[#E8E2D9] rounded-2xl">
              <p className="text-sm text-[#9B8E7E] font-mono">No teams yet.</p>
              <button onClick={openCreateTeam} className="mt-3 text-xs text-[#D4622A] font-mono hover:underline">
                + Create your first team
              </button>
            </div>
          )}
 
          {!teamsLoading && teams.length > 0 && (
            <div className="flex flex-col gap-4">
              {teams.map((team) => {
                const { totalLeads, totalConverted, activeCount, convRate, teamMembers } = getTeamStats(team);
                const isExpanded = expandedTeam === team.id;
 
                return (
                  <div key={team.id} className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden">
                    {/* Team header */}
                    <div className="px-5 py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Color dot / icon */}
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-mono font-medium"
                          style={{ background: team.color }}
                        >
                          {team.name[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1A1714]">{team.name}</p>
                          {team.description && (
                            <p className="text-[11px] text-[#9B8E7E] font-mono truncate">{team.description}</p>
                          )}
                        </div>
                      </div>
 
                      {/* Stats row */}
                      <div className="hidden sm:flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm font-mono font-medium text-[#1A1714]">{team.memberIds.length}</p>
                          <p className="text-[10px] text-[#9B8E7E] font-mono">members</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-mono font-medium text-green-600">{activeCount}</p>
                          <p className="text-[10px] text-[#9B8E7E] font-mono">active</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-mono font-medium text-[#1A1714]">{totalLeads}</p>
                          <p className="text-[10px] text-[#9B8E7E] font-mono">leads</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-mono font-medium text-[#D4622A]">{convRate}%</p>
                          <p className="text-[10px] text-[#9B8E7E] font-mono">conv.</p>
                        </div>
                      </div>
 
                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => openEditTeam(team)}
                          className="text-xs font-mono text-[#9B8E7E] hover:text-[#1A1714] transition-colors border border-[#E8E2D9] rounded-lg px-3 py-1.5"
                        >
                          edit
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(team.id)}
                          className="text-xs font-mono text-[#C4B9A8] hover:text-red-500 transition-colors"
                        >
                          delete
                        </button>
                        <button
                          onClick={() => setExpandedTeam(isExpanded ? null : team.id)}
                          className="text-xs font-mono text-[#9B8E7E] hover:text-[#1A1714] transition-colors ml-1"
                        >
                          {isExpanded ? "▲" : "▼"}
                        </button>
                      </div>
                    </div>
 
                    {/* Expanded members list */}
                    {isExpanded && (
                      <div className="border-t border-[#E8E2D9] px-5 py-4">
                        {teamMembers.length === 0 ? (
                          <p className="text-xs text-[#9B8E7E] font-mono py-2">No members in this team yet. Edit the team to add members.</p>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <p className="text-[10px] text-[#9B8E7E] font-mono uppercase tracking-wider mb-2">Members</p>
                            {teamMembers.map((member) => {
                              const s = statusConfig[member.status as keyof typeof statusConfig] ?? statusConfig.offline;
                              const convRate = member.leads > 0 ? Math.round((member.converted / member.leads) * 100) : 0;
                              return (
                                <div key={member.id} className="flex items-center justify-between py-2.5 border-b border-[#F0EDE6] last:border-0">
                                  <div className="flex items-center gap-3">
                                    <div className="relative">
                                      <div className="w-7 h-7 rounded-full bg-[#E8E2D9] flex items-center justify-center text-xs font-medium text-[#1A1714]">
                                        {member.name[0]}
                                      </div>
                                      <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-white ${s.dot}`} />
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium text-[#1A1714]">{member.name}</p>
                                      <p className="text-[10px] text-[#9B8E7E] font-mono">{member.email}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="hidden sm:flex items-center gap-4">
                                      <div className="text-center">
                                        <p className="text-xs font-mono text-[#1A1714]">{member.activeLeads}</p>
                                        <p className="text-[9px] text-[#9B8E7E]">active</p>
                                      </div>
                                      <div className="text-center">
                                        <p className="text-xs font-mono text-[#1A1714]">{member.leads}</p>
                                        <p className="text-[9px] text-[#9B8E7E]">leads</p>
                                      </div>
                                      <div className="text-center">
                                        <p className="text-xs font-mono text-[#D4622A]">{convRate}%</p>
                                        <p className="text-[9px] text-[#9B8E7E]">conv.</p>
                                      </div>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 border text-[10px] font-medium rounded-full px-2 py-0.5 ${s.badge}`}>
                                      <span className={`w-1 h-1 rounded-full ${s.dot}`} />
                                      {s.label}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
 
                        {/* Add lead to team CTA */}
                        <div className="mt-4 pt-4 border-t border-[#F0EDE6]">
                          <p className="text-[10px] text-[#9B8E7E] font-mono uppercase tracking-wider mb-2">Assign Lead</p>
                          <TeamLeadAssigner team={team} members={teamMembers} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
 
      {/* ══════════════ ADD MEMBER MODAL ══════════════ */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D9] w-full max-w-md p-6 shadow-xl">
            {createdPassword ? (
              <>
                <div className="w-10 h-10 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-4">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <h2 className="text-xl text-[#1A1714] mb-1" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                  Member added!
                </h2>
                <p className="text-xs text-[#9B8E7E] font-mono mb-6">Share these credentials. Password won't be shown again.</p>
                <div className="bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-4 mb-6">
                  <p className="text-xs text-[#9B8E7E] font-mono mb-3">Login credentials</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#9B8E7E] font-mono">Email</span>
                      <span className="text-xs text-[#1A1714] font-mono">{members[members.length - 1]?.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#9B8E7E] font-mono">Password</span>
                      <span className="text-sm text-[#D4622A] font-mono font-medium select-all">{createdPassword}</span>
                    </div>
                  </div>
                </div>
                <button onClick={closeMemberModal} className="w-full bg-[#D4622A] text-white rounded-xl py-3 text-sm font-mono hover:bg-[#C05520] transition-colors">
                  Done
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl text-[#1A1714] mb-1" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                  Add team member
                </h2>
                <p className="text-xs text-[#9B8E7E] font-mono mb-6">A password will be auto-generated.</p>
                <form onSubmit={handleAddMember} className="flex flex-col gap-4">
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
                        value={memberForm[field.key as keyof FormState]}
                        onChange={(e) => setMemberForm((f) => ({ ...f, [field.key]: e.target.value }))}
                        required={field.key === "name" || field.key === "email"}
                        className="bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] font-mono outline-none focus:border-[#D4622A] transition-colors"
                      />
                    </div>
                  ))}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-[#9B8E7E]">Seniority</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["junior", "mid", "senior"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setMemberForm((f) => ({ ...f, seniority: level }))}
                          className="py-2.5 rounded-xl text-xs font-mono border capitalize transition-all"
                          style={{
                            background: memberForm.seniority === level ? "#D4622A" : "#FAF9F6",
                            color: memberForm.seniority === level ? "#fff" : "#1A1714",
                            borderColor: memberForm.seniority === level ? "#D4622A" : "#E8E2D9",
                          }}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  {memberError && <p className="text-xs text-red-500 font-mono">{memberError}</p>}
                  <div className="flex gap-3 mt-2">
                    <button type="button" onClick={closeMemberModal} className="flex-1 border border-[#E8E2D9] rounded-xl py-3 text-sm text-[#9B8E7E] hover:border-[#C4B9A8] transition-colors font-mono">
                      Cancel
                    </button>
                    <button type="submit" disabled={memberSaving} className="flex-1 bg-[#D4622A] text-white rounded-xl py-3 text-sm font-mono hover:bg-[#C05520] transition-colors disabled:opacity-50">
                      {memberSaving ? "Adding..." : "Add member"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
 
      {/* ══════════════ CREATE / EDIT TEAM MODAL ══════════════ */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D9] w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl text-[#1A1714] mb-1" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              {editingTeam ? "Edit team" : "Create team"}
            </h2>
            <p className="text-xs text-[#9B8E7E] font-mono mb-6">
              {editingTeam ? "Update team details and members." : "Group your reps into a focused team."}
            </p>
 
            <form onSubmit={handleSaveTeam} className="flex flex-col gap-5">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-[#9B8E7E]">Team name</label>
                <input
                  type="text"
                  placeholder="e.g. Enterprise Sales"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  className="bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] font-mono outline-none focus:border-[#D4622A] transition-colors"
                />
              </div>
 
              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-[#9B8E7E]">Description <span className="text-[#C4B9A8]">(optional)</span></label>
                <input
                  type="text"
                  placeholder="Handles enterprise accounts above $10k MRR"
                  value={teamForm.description}
                  onChange={(e) => setTeamForm((f) => ({ ...f, description: e.target.value }))}
                  className="bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] font-mono outline-none focus:border-[#D4622A] transition-colors"
                />
              </div>
 
              {/* Color */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-[#9B8E7E]">Team color</label>
                <div className="flex gap-2 flex-wrap">
                  {TEAM_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setTeamForm((f) => ({ ...f, color: c.value }))}
                      className="w-8 h-8 rounded-full transition-all flex items-center justify-center"
                      style={{
                        background: c.value,
                        outline: teamForm.color === c.value ? `3px solid ${c.value}` : "none",
                        outlineOffset: "2px",
                      }}
                      title={c.label}
                    >
                      {teamForm.color === c.value && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
 
              {/* Members */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-[#9B8E7E]">
                  Members <span className="text-[#C4B9A8]">({teamForm.memberIds.length} selected)</span>
                </label>
                {members.length === 0 ? (
                  <p className="text-xs text-[#C4B9A8] font-mono py-2">No members yet. Add members first.</p>
                ) : (
                  <div className="flex flex-col gap-1 max-h-48 overflow-y-auto border border-[#E8E2D9] rounded-xl p-2">
                    {members.map((member) => {
                      const selected = teamForm.memberIds.includes(member.id);
                      const s = statusConfig[member.status as keyof typeof statusConfig] ?? statusConfig.offline;
                      return (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => toggleMemberInTeamForm(member.id)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                            selected ? "bg-[#FFF5F0] border border-[#F4C5AE]" : "hover:bg-[#FAF9F6] border border-transparent"
                          }`}
                        >
                          {/* Checkbox */}
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                              selected ? "border-[#D4622A] bg-[#D4622A]" : "border-[#E8E2D9]"
                            }`}
                          >
                            {selected && <span className="text-white text-[9px]">✓</span>}
                          </div>
                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-6 h-6 rounded-full bg-[#E8E2D9] flex items-center justify-center text-[10px] font-medium text-[#1A1714]">
                              {member.name[0]}
                            </div>
                            <span className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-white ${s.dot}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-[#1A1714] truncate">{member.name}</p>
                            <p className="text-[10px] text-[#9B8E7E] font-mono truncate">{member.role} · {member.seniority}</p>
                          </div>
                          <span className={`text-[9px] border rounded-full px-1.5 py-0.5 font-mono ${s.badge}`}>
                            {s.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
 
              {teamError && <p className="text-xs text-red-500 font-mono">{teamError}</p>}
 
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => { setShowTeamModal(false); setEditingTeam(null); setTeamForm(defaultTeamForm); }}
                  className="flex-1 border border-[#E8E2D9] rounded-xl py-3 text-sm text-[#9B8E7E] hover:border-[#C4B9A8] transition-colors font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={teamSaving}
                  className="flex-1 bg-[#D4622A] text-white rounded-xl py-3 text-sm font-mono hover:bg-[#C05520] transition-colors disabled:opacity-50"
                >
                  {teamSaving ? "Saving..." : editingTeam ? "Save changes" : "Create team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
 
// ─── Team Lead Assigner sub-component ────────────────────────────────────────
// Drop-in inside expanded team panel. Wire to your lead assignment API.
 
function TeamLeadAssigner({ team, members }: { team: Team; members: TeamMember[] }) {
  const [leadId, setLeadId] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
 
  const handleAssign = async () => {
    if (!leadId.trim()) { setErr("Enter a lead ID"); return; }
    if (!assignTo) { setErr("Select a rep"); return; }
    setAssigning(true);
    setErr("");
    try {
      const res = await fetch("/api/leads/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: leadId.trim(), memberId: assignTo, teamId: team.id }),
      });
      if (!res.ok) throw new Error("Assignment failed");
      setDone(true);
      setLeadId("");
      setAssignTo("");
      setTimeout(() => setDone(false), 3000);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setAssigning(false);
    }
  };
 
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        placeholder="Lead ID or email"
        value={leadId}
        onChange={(e) => { setLeadId(e.target.value); setErr(""); }}
        className="flex-1 bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-3 py-2 text-xs text-[#1A1714] font-mono outline-none focus:border-[#D4622A] transition-colors"
      />
      <select
        value={assignTo}
        onChange={(e) => { setAssignTo(e.target.value); setErr(""); }}
        className="flex-1 bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-3 py-2 text-xs text-[#1A1714] font-mono outline-none focus:border-[#D4622A] transition-colors"
      >
        <option value="">Assign to rep...</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>{m.name} ({m.activeLeads} active)</option>
        ))}
      </select>
      <button
        onClick={handleAssign}
        disabled={assigning}
        className={`px-4 py-2 rounded-xl text-xs font-mono transition-colors whitespace-nowrap ${
          done
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-[#D4622A] text-white hover:bg-[#C05520] disabled:opacity-50"
        }`}
      >
        {done ? "✓ Assigned" : assigning ? "Assigning..." : "Assign lead"}
      </button>
      {err && <p className="text-[10px] text-red-500 font-mono self-center">{err}</p>}
    </div>
  );
}
 
