"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn, formatCurrency, formatDate, getStatusColor, getPriorityColor, getInitials } from "@/lib/utils";
import { demoLeads } from "@/lib/demo-data";
import {
  ArrowLeft, Edit, Trash2, ArrowRightLeft, Mail, Phone, Building2,
  Calendar, DollarSign, Users, MapPin, Clock, MessageSquare,
  FileText, CheckCircle2, AlertTriangle, Send, Eye,
} from "lucide-react";

export default function LeadDetailPage() {
  const params = useParams();
  const lead = demoLeads.find((l) => l.id === params.id) || demoLeads[0];
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "meetings", label: "Meetings" },
    { id: "proposals", label: "Proposals" },
    { id: "activity", label: "Activity" },
  ];

  const meetings = [
    { id: 1, title: "Initial Discovery Call", date: "2026-06-22", type: "Video Call", duration: "45 min", outcome: "Client interested, needs detailed proposal" },
    { id: 2, title: "Requirements Deep Dive", date: "2026-06-28", type: "In Person", duration: "90 min", outcome: "Full requirements gathered, budget range discussed" },
    { id: 3, title: "Venue Site Visit", date: "2026-07-05", type: "Site Visit", duration: "120 min", outcome: "Venue approved, layout finalized" },
  ];

  const proposals = [
    { id: 1, version: 1, title: "Initial Proposal", total: lead.estimatedBudget || 85000, status: "Revised", date: "2026-06-25" },
    { id: 2, version: 2, title: "Revised Proposal - Updated Scope", total: (lead.estimatedBudget || 85000) * 1.15, status: "Sent", date: "2026-07-02" },
  ];

  const activities = [
    { id: 1, action: "Proposal v2 sent to client", user: "John Smith", date: "2026-07-02T14:30:00" },
    { id: 2, action: "Site visit completed at Grand Ballroom", user: "Lisa Park", date: "2026-07-05T16:00:00" },
    { id: 3, action: "Requirements document updated", user: "John Smith", date: "2026-06-28T17:00:00" },
    { id: 4, action: "Initial discovery call completed", user: "John Smith", date: "2026-06-22T11:00:00" },
    { id: 5, action: "Lead created from website inquiry", user: "System", date: "2026-06-20T09:15:00" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/crm" className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{lead.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", getStatusColor(lead.status))}>{lead.status.replace(/_/g, " ")}</span>
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", getPriorityColor(lead.priority))}>{lead.priority}</span>
              <span className="text-xs text-slate-500">Created {formatDate(lead.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg transition-colors">
            <ArrowRightLeft className="w-4 h-4" /> Convert to Event
          </button>
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-100 transition-colors"><Edit className="w-4 h-4" /></button>
          <button className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200/50">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn("px-4 py-2.5 text-sm font-medium transition-colors relative", activeTab === tab.id ? "text-teal-600" : "text-slate-500 hover:text-slate-700")}>
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-t" />}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Client Info */}
            <div className="glass-card p-5">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Client Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Building2, label: "Company", value: lead.clientCompany || "N/A" },
                  { icon: Mail, label: "Email", value: lead.clientEmail },
                  { icon: Phone, label: "Phone", value: lead.clientPhone || "N/A" },
                  { icon: Users, label: "Contact", value: lead.clientName },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100"><item.icon className="w-4 h-4 text-slate-400" /></div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">{item.label}</p>
                      <p className="text-sm text-slate-800">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Event Requirements */}
            <div className="glass-card p-5">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Event Requirements</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Calendar, label: "Event Type", value: lead.eventType || "TBD" },
                  { icon: Calendar, label: "Event Date", value: lead.eventDate || "TBD" },
                  { icon: MapPin, label: "Location", value: lead.eventLocation || "TBD" },
                  { icon: Users, label: "Expected Guests", value: lead.estimatedGuests?.toString() || "TBD" },
                  { icon: DollarSign, label: "Budget", value: formatCurrency(lead.estimatedBudget || 0) },
                  { icon: MessageSquare, label: "Source", value: lead.source },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100"><item.icon className="w-4 h-4 text-slate-400" /></div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">{item.label}</p>
                      <p className="text-sm text-slate-800">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-6 animate-fade-in">
            <div className="glass-card p-5">
              <h3 className="text-base font-semibold text-slate-800 mb-3">Assigned To</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">{getInitials(lead.assignedTo || "?")}</div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{lead.assignedTo}</p>
                  <p className="text-xs text-slate-500">Event Director</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-5">
              <h3 className="text-base font-semibold text-slate-800 mb-3">Next Follow-up</h3>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-slate-800">{lead.nextFollowUp || "Not scheduled"}</span>
              </div>
            </div>
            <div className="glass-card p-5">
              <h3 className="text-base font-semibold text-slate-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { icon: Mail, label: "Send Email", color: "text-blue-400 hover:bg-blue-500/10" },
                  { icon: Phone, label: "Log Call", color: "text-emerald-400 hover:bg-emerald-500/10" },
                  { icon: FileText, label: "Create Proposal", color: "text-purple-400 hover:bg-purple-500/10" },
                  { icon: Calendar, label: "Schedule Meeting", color: "text-amber-400 hover:bg-amber-500/10" },
                ].map((action) => (
                  <button key={action.label} className={cn("flex items-center gap-3 w-full p-2 rounded-lg text-sm transition-colors", action.color)}>
                    <action.icon className="w-4 h-4" />{action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meetings Tab */}
      {activeTab === "meetings" && (
        <div className="space-y-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors">
            <Calendar className="w-4 h-4" /> Schedule Meeting
          </button>
          {meetings.map((m) => (
            <div key={m.id} className="glass-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">{m.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500">{m.date}</span>
                    <span className="text-xs text-teal-600">{m.type}</span>
                    <span className="text-xs text-slate-500">{m.duration}</span>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-sm text-slate-400 mt-3 border-t border-slate-200 pt-3">{m.outcome}</p>
            </div>
          ))}
        </div>
      )}

      {/* Proposals Tab */}
      {activeTab === "proposals" && (
        <div className="space-y-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors">
            <FileText className="w-4 h-4" /> Create New Proposal
          </button>
          {proposals.map((p) => (
            <div key={p.id} className="glass-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-800">{p.title}</h4>
                    <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">v{p.version}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Created {p.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 font-mono">{formatCurrency(p.total)}</p>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", p.status === "Sent" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20")}>{p.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200">
                <button className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1"><Eye className="w-3 h-3" /> View</button>
                <button className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 ml-3"><Edit className="w-3 h-3" /> Edit</button>
                <button className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 ml-3"><Send className="w-3 h-3" /> Send to Client</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <div className="glass-card p-5">
          <div className="space-y-0">
            {activities.map((a, i) => (
              <div key={a.id} className="flex gap-3 py-3 border-b border-slate-100 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-teal-600 shrink-0">
                  {getInitials(a.user)}
                </div>
                <div>
                  <p className="text-sm text-slate-700">{a.action}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">by {a.user} · {formatDate(a.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
