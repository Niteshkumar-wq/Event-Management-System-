"use client";

import { useState } from "react";
import { cn, getInitials } from "@/lib/utils";
import { demoTeam } from "@/lib/demo-data";
import { Search, Plus, Mail, Phone, Shield, MoreVertical, UserCheck, UserX, Users, Crown } from "lucide-react";

const roleColors: Record<string, string> = {
  EVENT_DIRECTOR: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  EVENT_MANAGER: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  OPERATIONS_MANAGER: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  HOSPITALITY_MANAGER: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  VENDOR_MANAGER: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  GUEST_MANAGER: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  FINANCE_MANAGER: "bg-green-500/10 text-green-400 border-green-500/20",
  TEAM_LEADER: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  STAFF_MEMBER: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const eventTeams = [
  { name: "Setup Crew", event: "NexGen Series X Launch", members: 5, leader: "Miguel Santos" },
  { name: "Registration Team", event: "NexGen Series X Launch", members: 3, leader: "Amy Chen" },
  { name: "VIP Services", event: "Elite Awards Night 2026", members: 4, leader: "Rachel Green" },
  { name: "Stage & AV", event: "Summer Music Festival", members: 6, leader: "Brandon Lee" },
];

export default function TeamsPage() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showForm, setShowForm] = useState(false);

  const filtered = demoTeam.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || m.role === filterRole;
    return matchSearch && matchRole;
  });
  const roles = [...new Set(demoTeam.map((m) => m.role))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-100">Team Management</h1><p className="text-sm text-slate-500 mt-0.5">Manage staff and event teams</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"><Plus className="w-4 h-4" /> Add Member</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Members", value: demoTeam.length.toString(), icon: Users, color: "text-violet-400" },
          { label: "Active", value: demoTeam.filter((m) => m.isActive).length.toString(), icon: UserCheck, color: "text-emerald-400" },
          { label: "Inactive", value: demoTeam.filter((m) => !m.isActive).length.toString(), icon: UserX, color: "text-red-400" },
          { label: "Event Teams", value: eventTeams.length.toString(), icon: Crown, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">{s.label}</p><p className={cn("text-xl font-bold mt-1", s.color)}>{s.value}</p></div><s.icon className={cn("w-5 h-5", s.color)} /></div></div>
        ))}
      </div>

      {/* Add Member Form */}
      {showForm && (
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-slate-200 mb-4">Add Team Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Full Name", "Email", "Phone"].map((f) => (
              <div key={f}><label className="text-xs text-slate-500 block mb-1">{f}</label>
                <input type="text" placeholder={f} className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
            ))}
            <div><label className="text-xs text-slate-500 block mb-1">Role</label>
              <select className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50">
                <option>Select role</option>{roles.map((r) => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
              </select></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg">Save Member</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="relative max-w-xs w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50" /></div>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50">
          <option value="all">All Roles</option>{roles.map((r) => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {/* Staff Directory */}
      <div className="glass-card overflow-hidden">
        <h3 className="text-base font-semibold text-slate-200 px-5 pt-5 pb-3">Staff Directory</h3>
        <table className="w-full">
          <thead><tr className="border-b border-slate-800/50">
            {["Member", "Role", "Email", "Phone", "Status"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((member) => (
              <tr key={member.id} className="border-b border-slate-800/20 table-row-hover">
                <td className="px-4 py-3"><div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">{getInitials(member.name)}</div>
                  <span className="text-sm font-medium text-slate-200">{member.name}</span></div></td>
                <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full border", roleColors[member.role] || roleColors.STAFF_MEMBER)}>{member.role.replace(/_/g, " ")}</span></td>
                <td className="px-4 py-3 text-sm text-slate-400">{member.email}</td>
                <td className="px-4 py-3 text-sm text-slate-400">{member.phone}</td>
                <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full border", member.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20")}>{member.isActive ? "Active" : "Inactive"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Event Teams */}
      <div>
        <h3 className="text-base font-semibold text-slate-200 mb-3">Event Teams</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eventTeams.map((team) => (
            <div key={team.name} className="glass-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">{team.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{team.event}</p>
                </div>
                <span className="text-xs bg-slate-800/50 text-slate-400 px-2 py-0.5 rounded-full">{team.members} members</span>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/30">
                <Crown className="w-3 h-3 text-amber-400" />
                <span className="text-xs text-slate-400">Leader: {team.leader}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
