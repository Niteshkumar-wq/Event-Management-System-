"use client";

import { useState } from "react";
import Link from "next/link";
import { cn, formatCurrency, formatDate, getStatusColor, getPriorityColor, getInitials } from "@/lib/utils";
import { demoLeads } from "@/lib/demo-data";
import {
  Search, Filter, Plus, LayoutGrid, List, ChevronRight,
  Phone, Mail, Building2, Calendar, Users, DollarSign,
  MoreVertical, Eye, Edit, Trash2, ArrowRightLeft,
  Target, TrendingUp, UserCheck, Clock,
} from "lucide-react";

const statusColumns = [
  { key: "inquiry_received", label: "Inquiry Received", color: "border-blue-500" },
  { key: "meeting_scheduled", label: "Meeting Scheduled", color: "border-purple-500" },
  { key: "requirement_gathered", label: "Requirements", color: "border-cyan-500" },
  { key: "budget_discussed", label: "Budget Discussed", color: "border-amber-500" },
  { key: "proposal_sent", label: "Proposal Sent", color: "border-violet-500" },
  { key: "negotiation", label: "Negotiation", color: "border-orange-500" },
  { key: "approved", label: "Approved", color: "border-emerald-500" },
  { key: "rejected", label: "Rejected", color: "border-red-500" },
];

export default function CRMPage() {
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterSource, setFilterSource] = useState("all");

  const filtered = demoLeads.filter((lead) => {
    const matchSearch = lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.clientCompany?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPriority = filterPriority === "all" || lead.priority === filterPriority;
    const matchSource = filterSource === "all" || lead.source === filterSource;
    return matchSearch && matchPriority && matchSource;
  });

  const totalPipeline = filtered.reduce((s, l) => s + (l.estimatedBudget || 0), 0);
  const approvedLeads = filtered.filter((l) => l.status === "approved").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Lead Pipeline</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and convert your leads</p>
        </div>
        <Link href="/dashboard/crm/new" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30">
          <Plus className="w-4 h-4" /> New Lead
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: filtered.length, icon: Target, color: "text-violet-400" },
          { label: "Pipeline Value", value: formatCurrency(totalPipeline), icon: DollarSign, color: "text-emerald-400" },
          { label: "Conversion Rate", value: `${filtered.length > 0 ? Math.round((approvedLeads / filtered.length) * 100) : 0}%`, icon: TrendingUp, color: "text-amber-400" },
          { label: "Avg Deal Size", value: formatCurrency(filtered.length > 0 ? totalPipeline / filtered.length : 0), icon: UserCheck, color: "text-pink-400" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-xl font-bold text-slate-100 mt-1">{s.value}</p>
              </div>
              <s.icon className={cn("w-5 h-5", s.color)} />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Search leads..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50" />
          </div>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50">
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)}
            className="bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50">
            <option value="all">All Sources</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Social Media">Social Media</option>
            <option value="Cold Call">Cold Call</option>
            <option value="Email">Email</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Partner">Partner</option>
          </select>
        </div>
        <div className="flex items-center gap-1 bg-slate-900/40 border border-slate-800/40 rounded-xl p-1">
          <button onClick={() => setView("kanban")} className={cn("p-1.5 rounded-md transition-colors", view === "kanban" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white")}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setView("table")} className={cn("p-1.5 rounded-md transition-colors", view === "table" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white")}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {view === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {statusColumns.map((col) => {
            const colLeads = filtered.filter((l) => l.status === col.key);
            return (
              <div key={col.key} className="min-w-[280px] w-[280px] shrink-0">
                <div className={cn("flex items-center gap-2 mb-3 pb-2 border-b-2", col.color)}>
                  <span className="text-sm font-semibold text-slate-300">{col.label}</span>
                  <span className="text-xs bg-slate-800/50 text-slate-400 px-1.5 py-0.5 rounded-full">{colLeads.length}</span>
                </div>
                <div className="space-y-3 kanban-column">
                  {colLeads.map((lead) => (
                    <Link key={lead.id} href={`/dashboard/crm/${lead.id}`}
                      className="block glass-card p-4 cursor-pointer hover:border-violet-500/30 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", getPriorityColor(lead.priority))}>
                          {lead.priority}
                        </span>
                        <span className="text-[10px] text-slate-600">{lead.source}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-200 mb-1 line-clamp-1">{lead.title}</h4>
                      <p className="text-xs text-slate-500 mb-3">{lead.clientName}{lead.clientCompany ? ` · ${lead.clientCompany}` : ""}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{formatCurrency(lead.estimatedBudget || 0)}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{lead.estimatedGuests || 0}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{lead.eventDate ? new Date(lead.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD"}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/30">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[8px] font-bold text-white">
                          {getInitials(lead.assignedTo || "?")}
                        </div>
                        <span className="text-[10px] text-slate-500">{lead.assignedTo}</span>
                      </div>
                    </Link>
                  ))}
                  {colLeads.length === 0 && (
                    <div className="text-center py-8 text-xs text-slate-600">No leads</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/50">
                  {["Lead", "Client", "Event Type", "Budget", "Guests", "Status", "Priority", "Assigned", "Date"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-800/20 table-row-hover">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/crm/${lead.id}`} className="text-sm font-medium text-slate-200 hover:text-violet-400 transition-colors">{lead.title}</Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-300">{lead.clientName}</p>
                      <p className="text-xs text-slate-500">{lead.clientCompany}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">{lead.eventType}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-200 font-mono">{formatCurrency(lead.estimatedBudget || 0)}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{lead.estimatedGuests}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", getStatusColor(lead.status))}>{lead.status.replace(/_/g, " ")}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", getPriorityColor(lead.priority))}>{lead.priority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[8px] font-bold text-white">{getInitials(lead.assignedTo || "?")}</div>
                        <span className="text-xs text-slate-400">{lead.assignedTo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{lead.eventDate || "TBD"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
