"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { demoCommunications } from "@/lib/demo-data";
import { Mail, MessageSquare, Send, Search, Plus, Smartphone, Globe, CheckCircle2, Eye, Clock, Users } from "lucide-react";

const templates = [
  { id: 1, name: "Event Invitation", type: "Email", desc: "Formal event invitation with RSVP link" },
  { id: 2, name: "RSVP Reminder", type: "SMS", desc: "Short reminder for pending RSVPs" },
  { id: 3, name: "Thank You", type: "Email", desc: "Post-event thank you message" },
  { id: 4, name: "VIP Welcome", type: "WhatsApp", desc: "Welcome package details for VIP guests" },
];

export default function CommunicationPage() {
  const [search, setSearch] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeType, setComposeType] = useState("Email");

  const filtered = demoCommunications.filter((c) => c.subject.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Communication Hub</h1><p className="text-sm text-slate-500 mt-0.5">Manage all event communications</p></div>
        <button onClick={() => setShowCompose(!showCompose)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30"><Plus className="w-4 h-4" /> New Campaign</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Emails Sent", value: "1,250", icon: Mail, color: "text-teal-600" },
          { label: "SMS Sent", value: "380", icon: Smartphone, color: "text-emerald-600" },
          { label: "Delivery Rate", value: "96.4%", icon: CheckCircle2, color: "text-cyan-600" },
          { label: "Open Rate", value: "68.2%", icon: Eye, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">{s.label}</p><p className={cn("text-xl font-bold mt-1", s.color)}>{s.value}</p></div><s.icon className={cn("w-5 h-5", s.color)} /></div></div>
        ))}
      </div>

      {showCompose && (
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Compose Message</h3>
          <div className="flex gap-2 mb-4">
            {["Email", "SMS", "WhatsApp"].map((t) => (
              <button key={t} onClick={() => setComposeType(t)} className={cn("px-3 py-1.5 text-sm rounded-lg transition-colors", composeType === t ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-400 hover:text-white")}>{t}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs text-slate-500 block mb-1">Event</label><select className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-500/50"><option>Select event</option><option>NexGen Series X Launch</option><option>Summer Music Festival</option><option>Elite Awards Night 2026</option></select></div>
            <div><label className="text-xs text-slate-500 block mb-1">Recipients</label><select className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-500/50"><option>All Guests</option><option>VIP Only</option><option>Speakers</option><option>Not Responded</option></select></div>
            <div className="md:col-span-2"><label className="text-xs text-slate-500 block mb-1">Subject</label><input type="text" placeholder="Message subject" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
            <div className="md:col-span-2"><label className="text-xs text-slate-500 block mb-1">Message</label><textarea rows={4} placeholder="Write your message..." className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-600 text-white text-sm rounded-lg"><Send className="w-4 h-4" /> Send Now</button>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-lg">Schedule</button>
            <button onClick={() => setShowCompose(false)} className="px-4 py-2 text-slate-400 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="relative max-w-xs w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search communications..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-violet-500/50" /></div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-slate-200/50">
          {["Type", "Subject", "Event", "Recipients", "Status", "Sent"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}
        </tr></thead><tbody>
          {filtered.map((c) => (
            <tr key={c.id} className="border-b border-slate-100 table-row-hover">
              <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full border",
                c.type === "Email" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : c.type === "SMS" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"
              )}>{c.type}</span></td>
              <td className="px-4 py-3 text-sm text-slate-800">{c.subject}</td>
              <td className="px-4 py-3 text-xs text-slate-500">{c.eventName}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{c.recipients}</td>
              <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-600 border-emerald-500/20">{c.status}</span></td>
              <td className="px-4 py-3 text-xs text-slate-500">{new Date(c.sentAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody></table>
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-3">Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((t) => (
            <div key={t.id} className="glass-card p-4 cursor-pointer hover:border-violet-500/30 transition-all">
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", t.type === "Email" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : t.type === "SMS" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-green-500/10 text-green-400 border-green-500/20")}>{t.type}</span>
              <h4 className="text-sm font-semibold text-slate-800 mt-2">{t.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
