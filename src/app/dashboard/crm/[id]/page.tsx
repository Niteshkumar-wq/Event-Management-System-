"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cn, formatCurrency, formatDate, formatDateTime, getStatusColor, getPriorityColor, getInitials } from "@/lib/utils";
import { useLead, convertLeadToEvent, updateLead, deleteLead, type Lead } from "@/lib/data-store";
import { useLeadCrm, type LeadProposal } from "@/lib/lead-store";
import {
  ArrowLeft, Edit, Trash2, ArrowRightLeft, Mail, Phone, Building2,
  Calendar, DollarSign, Users, MapPin, Clock, MessageSquare,
  FileText, CheckCircle2, Send, Eye, X,
} from "lucide-react";

type ModalType = "email" | "call" | "proposal" | "meeting" | "edit" | "viewProposal" | null;

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lead = useLead(params.id as string);
  const crm = useLeadCrm(params.id as string, lead);
  const [activeTab, setActiveTab] = useState("overview");
  const [modal, setModal] = useState<ModalType>(null);
  const [viewProposal, setViewProposal] = useState<LeadProposal | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [emailForm, setEmailForm] = useState({ subject: "", body: "" });
  const [callNotes, setCallNotes] = useState("");
  const [meetingForm, setMeetingForm] = useState({
    title: "", date: "", type: "Video Call", duration: "30 min", outcome: "",
  });
  const [proposalForm, setProposalForm] = useState({ title: "", total: "", notes: "" });
  const [editForm, setEditForm] = useState<Partial<Lead>>({});

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openQuickAction = (action: string) => {
    if (!lead) return;
    switch (action) {
      case "Send Email":
        setEmailForm({ subject: `Re: ${lead.title}`, body: `Hi ${lead.clientName},\n\n` });
        setModal("email");
        break;
      case "Log Call":
        setCallNotes("");
        setModal("call");
        break;
      case "Create Proposal":
        setProposalForm({ title: `${lead.eventType || "Event"} Proposal`, total: String(lead.estimatedBudget || ""), notes: "" });
        setActiveTab("proposals");
        setModal("proposal");
        break;
      case "Schedule Meeting":
        setMeetingForm({ title: `Meeting with ${lead.clientName}`, date: lead.nextFollowUp || new Date().toISOString().slice(0, 10), type: "Video Call", duration: "45 min", outcome: "" });
        setActiveTab("meetings");
        setModal("meeting");
        break;
    }
  };

  const handleSendEmail = () => {
    if (!emailForm.subject.trim()) { showToast("Please enter a subject"); return; }
    crm.sendEmail(emailForm.subject, emailForm.body);
    setModal(null);
    setActiveTab("activity");
    showToast(`Email sent to ${lead?.clientEmail}`);
  };

  const handleLogCall = () => {
    crm.logCall(callNotes);
    setModal(null);
    setActiveTab("activity");
    showToast("Call logged successfully");
  };

  const handleScheduleMeeting = () => {
    if (!meetingForm.title.trim() || !meetingForm.date) { showToast("Please fill meeting title and date"); return; }
    crm.scheduleMeeting(meetingForm);
    setModal(null);
    showToast("Meeting scheduled successfully");
  };

  const handleCreateProposal = () => {
    if (!proposalForm.total) { showToast("Please enter proposal amount"); return; }
    crm.createProposal({ title: proposalForm.title, total: Number(proposalForm.total), notes: proposalForm.notes });
    setModal(null);
    setActiveTab("proposals");
    showToast("Proposal created successfully");
  };

  const handleConvertToEvent = () => {
    if (!lead) return;
    const event = convertLeadToEvent(lead);
    crm.logCustomActivity(`Lead converted to event: ${event.name}`);
    showToast("Lead converted to event!");
    setTimeout(() => router.push(`/dashboard/events/${event.id}`), 800);
  };

  const handleDelete = () => {
    if (!lead || !confirm("Delete this lead? This cannot be undone.")) return;
    deleteLead(lead.id);
    router.push("/dashboard/crm");
  };

  const openEdit = () => {
    if (!lead) return;
    setEditForm({ ...lead });
    setModal("edit");
  };

  const handleSaveEdit = () => {
    if (!lead) return;
    updateLead({ ...lead, ...editForm } as Lead);
    setModal(null);
    showToast("Lead updated successfully");
  };

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-slate-500">Lead not found.</p>
        <Link href="/dashboard/crm" className="btn-primary">Back to Pipeline</Link>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "meetings", label: "Meetings" },
    { id: "proposals", label: "Proposals" },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/crm" className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{lead.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", getStatusColor(lead.status))}>{lead.status.replace(/_/g, " ")}</span>
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", getPriorityColor(lead.priority))}>{lead.priority}</span>
              <span className="text-xs text-slate-500">Created {formatDate(lead.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleConvertToEvent} className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg transition-colors">
            <ArrowRightLeft className="w-4 h-4" /> Convert to Event
          </button>
          <button onClick={openEdit} className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"><Edit className="w-4 h-4" /></button>
          <button onClick={handleDelete} className="p-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn("px-4 py-2.5 text-sm font-medium transition-colors relative whitespace-nowrap", activeTab === tab.id ? "text-teal-600" : "text-slate-500 hover:text-slate-700")}>
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-t" />}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-5">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Client Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="glass-card p-5">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Event Requirements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="space-y-6">
            <div className="glass-card p-5">
              <h3 className="text-base font-semibold text-slate-800 mb-3">Assigned To</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-sm font-bold text-white">{getInitials(lead.assignedTo || "?")}</div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{lead.assignedTo}</p>
                  <p className="text-xs text-slate-500">Event Director</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-5">
              <h3 className="text-base font-semibold text-slate-800 mb-3">Next Follow-up</h3>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-slate-800">{lead.nextFollowUp || "Not scheduled"}</span>
              </div>
            </div>
            <div className="glass-card p-5">
              <h3 className="text-base font-semibold text-slate-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { icon: Mail, label: "Send Email", color: "text-blue-600 hover:bg-blue-50" },
                  { icon: Phone, label: "Log Call", color: "text-emerald-600 hover:bg-emerald-50" },
                  { icon: FileText, label: "Create Proposal", color: "text-purple-600 hover:bg-purple-50" },
                  { icon: Calendar, label: "Schedule Meeting", color: "text-amber-600 hover:bg-amber-50" },
                ].map((action) => (
                  <button key={action.label} onClick={() => openQuickAction(action.label)} className={cn("flex items-center gap-3 w-full p-2.5 rounded-lg text-sm font-medium transition-colors", action.color)}>
                    <action.icon className="w-4 h-4" />{action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meetings */}
      {activeTab === "meetings" && (
        <div className="space-y-4">
          <button onClick={() => openQuickAction("Schedule Meeting")} className="btn-primary">
            <Calendar className="w-4 h-4" /> Schedule Meeting
          </button>
          {crm.meetings.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No meetings scheduled yet</p>
              <p className="text-sm text-slate-600 mt-1">Click &quot;Schedule Meeting&quot; to add one</p>
            </div>
          ) : (
            crm.meetings.map((m) => (
              <div key={m.id} className="glass-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{m.title}</h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500">{m.date}</span>
                      <span className="text-xs text-teal-600 font-medium">{m.type}</span>
                      <span className="text-xs text-slate-500">{m.duration}</span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                </div>
                <p className="text-sm text-slate-500 mt-3 border-t border-slate-100 pt-3">{m.outcome}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Proposals */}
      {activeTab === "proposals" && (
        <div className="space-y-4">
          <button onClick={() => openQuickAction("Create Proposal")} className="btn-primary">
            <FileText className="w-4 h-4" /> Create New Proposal
          </button>
          {crm.proposals.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No proposals yet</p>
              <p className="text-sm text-slate-600 mt-1">Create a proposal to send to your client</p>
            </div>
          ) : (
            crm.proposals.map((p) => (
              <div key={p.id} className="glass-card p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-800">{p.title}</h4>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">v{p.version}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Created {p.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">{formatCurrency(p.total)}</p>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border",
                      p.status === "Sent" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-slate-50 text-slate-500 border-slate-200"
                    )}>{p.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100">
                  <button onClick={() => { setViewProposal(p); setModal("viewProposal"); }} className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1 font-medium"><Eye className="w-3 h-3" /> View</button>
                  <button onClick={() => { setProposalForm({ title: p.title, total: String(p.total), notes: p.notes }); setModal("proposal"); }} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 font-medium"><Edit className="w-3 h-3" /> Edit</button>
                  <button onClick={() => { crm.sendProposal(p.id); showToast("Proposal sent to client!"); setActiveTab("activity"); }} className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium"><Send className="w-3 h-3" /> Send to Client</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Activity */}
      {activeTab === "activity" && (
        <div className="glass-card p-5">
          {crm.activities.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No activity yet</p>
          ) : (
            <div className="space-y-0">
              {crm.activities.map((a) => (
                <div key={a.id} className="flex gap-3 py-3 border-b border-slate-50 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-xs font-bold text-teal-600 shrink-0">
                    {getInitials(a.user)}
                  </div>
                  <div>
                    <p className="text-sm text-slate-700">{a.action}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">by {a.user} · {formatDateTime(a.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {modal === "email" && "Send Email"}
                {modal === "call" && "Log Call"}
                {modal === "meeting" && "Schedule Meeting"}
                {modal === "proposal" && "Create Proposal"}
                {modal === "edit" && "Edit Lead"}
                {modal === "viewProposal" && "Proposal Details"}
              </h3>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            {modal === "email" && (
              <div className="space-y-4">
                <div><label className="text-xs text-slate-500 block mb-1">To</label><input readOnly value={lead.clientEmail} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600" /></div>
                <div><label className="text-xs text-slate-500 block mb-1">Subject *</label><input value={emailForm.subject} onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                <div><label className="text-xs text-slate-500 block mb-1">Message</label><textarea rows={5} value={emailForm.body} onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                <button onClick={handleSendEmail} className="btn-primary w-full justify-center"><Send className="w-4 h-4" /> Send Email</button>
              </div>
            )}

            {modal === "call" && (
              <div className="space-y-4">
                <p className="text-sm text-slate-500">Log a call with <strong>{lead.clientName}</strong> ({lead.clientPhone || "no phone"})</p>
                <div><label className="text-xs text-slate-500 block mb-1">Call Notes</label><textarea rows={4} value={callNotes} onChange={(e) => setCallNotes(e.target.value)} placeholder="What was discussed..." className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                <button onClick={handleLogCall} className="btn-primary w-full justify-center"><Phone className="w-4 h-4" /> Log Call</button>
              </div>
            )}

            {modal === "meeting" && (
              <div className="space-y-4">
                <div><label className="text-xs text-slate-500 block mb-1">Title *</label><input value={meetingForm.title} onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-slate-500 block mb-1">Date *</label><input type="date" value={meetingForm.date} onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                  <div><label className="text-xs text-slate-500 block mb-1">Duration</label><input value={meetingForm.duration} onChange={(e) => setMeetingForm({ ...meetingForm, duration: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                </div>
                <div><label className="text-xs text-slate-500 block mb-1">Type</label>
                  <select value={meetingForm.type} onChange={(e) => setMeetingForm({ ...meetingForm, type: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm">
                    {["Video Call", "In Person", "Phone Call", "Site Visit"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div><label className="text-xs text-slate-500 block mb-1">Outcome / Notes</label><textarea rows={3} value={meetingForm.outcome} onChange={(e) => setMeetingForm({ ...meetingForm, outcome: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                <button onClick={handleScheduleMeeting} className="btn-primary w-full justify-center"><Calendar className="w-4 h-4" /> Schedule Meeting</button>
              </div>
            )}

            {modal === "proposal" && (
              <div className="space-y-4">
                <div><label className="text-xs text-slate-500 block mb-1">Title</label><input value={proposalForm.title} onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                <div><label className="text-xs text-slate-500 block mb-1">Amount ($) *</label><input type="number" value={proposalForm.total} onChange={(e) => setProposalForm({ ...proposalForm, total: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                <div><label className="text-xs text-slate-500 block mb-1">Notes</label><textarea rows={3} value={proposalForm.notes} onChange={(e) => setProposalForm({ ...proposalForm, notes: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                <button onClick={handleCreateProposal} className="btn-primary w-full justify-center"><FileText className="w-4 h-4" /> Create Proposal</button>
              </div>
            )}

            {modal === "edit" && (
              <div className="space-y-4">
                <div><label className="text-xs text-slate-500 block mb-1">Title</label><input value={editForm.title || ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-slate-500 block mb-1">Client Name</label><input value={editForm.clientName || ""} onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                  <div><label className="text-xs text-slate-500 block mb-1">Email</label><input value={editForm.clientEmail || ""} onChange={(e) => setEditForm({ ...editForm, clientEmail: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                </div>
                <div><label className="text-xs text-slate-500 block mb-1">Budget ($)</label><input type="number" value={editForm.estimatedBudget || ""} onChange={(e) => setEditForm({ ...editForm, estimatedBudget: Number(e.target.value) })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                <div><label className="text-xs text-slate-500 block mb-1">Status</label>
                  <select value={editForm.status || lead.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Lead["status"] })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm">
                    {["inquiry_received", "meeting_scheduled", "requirement_gathered", "budget_discussed", "proposal_sent", "negotiation", "approved", "rejected"].map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleSaveEdit} className="btn-primary w-full justify-center">Save Changes</button>
              </div>
            )}

            {modal === "viewProposal" && viewProposal && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <p className="text-sm font-semibold text-slate-800">{viewProposal.title} (v{viewProposal.version})</p>
                  <p className="text-2xl font-bold text-teal-600">{formatCurrency(viewProposal.total)}</p>
                  <p className="text-xs text-slate-500">Status: {viewProposal.status} · Created {viewProposal.date}</p>
                  {viewProposal.notes && <p className="text-sm text-slate-600 border-t border-slate-200 pt-2 mt-2">{viewProposal.notes}</p>}
                </div>
                <button onClick={() => { crm.sendProposal(viewProposal.id); setModal(null); showToast("Proposal sent!"); setActiveTab("activity"); }} className="btn-primary w-full justify-center"><Send className="w-4 h-4" /> Send to Client</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </div>
      )}
    </div>
  );
}
