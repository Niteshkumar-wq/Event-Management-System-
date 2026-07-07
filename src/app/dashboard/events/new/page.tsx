"use client";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Check, FileText, MapPin, DollarSign, Users, Eye } from "lucide-react";

const steps = [
  { id: 1, title: "Basic Info", icon: FileText },
  { id: 2, title: "Venue", icon: MapPin },
  { id: 3, title: "Budget", icon: DollarSign },
  { id: 4, title: "Team", icon: Users },
  { id: 5, title: "Review", icon: Eye },
];

export default function NewEventPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", type: "", description: "", startDate: "", endDate: "",
    venueName: "", venueAddress: "", venueCapacity: "",
    totalBudget: "", budgetNotes: "",
    manager: "", team: "",
  });
  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/events" className="p-2 rounded-lg hover:bg-slate-800/50"><ArrowLeft className="w-5 h-5 text-slate-400" /></Link>
        <h1 className="text-2xl font-bold text-slate-100">Create Event</h1>
      </div>

      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", step > s.id ? "bg-emerald-600 text-white" : step === s.id ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-500")}>
              {step > s.id ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
            </div>
            <span className={cn("text-xs hidden md:block", step >= s.id ? "text-slate-300" : "text-slate-600")}>{s.title}</span>
            {i < steps.length - 1 && <div className={cn("h-0.5 flex-1", step > s.id ? "bg-emerald-600" : "bg-slate-800")} />}
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className="text-xs text-slate-500 block mb-1">Event Name *</label><input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Enter event name" className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
              <div><label className="text-xs text-slate-500 block mb-1">Event Type *</label><select value={form.type} onChange={(e) => update("type", e.target.value)} className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50"><option value="">Select type</option><option>Corporate</option><option>Wedding</option><option>Conference</option><option>Social</option><option>Festival</option></select></div>
              <div><label className="text-xs text-slate-500 block mb-1">Start Date *</label><input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500/50" /></div>
              <div><label className="text-xs text-slate-500 block mb-1">End Date</label><input type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500/50" /></div>
            </div>
            <div><label className="text-xs text-slate-500 block mb-1">Description</label><textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Event description..." className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Venue Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className="text-xs text-slate-500 block mb-1">Venue Name</label><input type="text" value={form.venueName} onChange={(e) => update("venueName", e.target.value)} placeholder="Venue name" className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
              <div><label className="text-xs text-slate-500 block mb-1">Address</label><input type="text" value={form.venueAddress} onChange={(e) => update("venueAddress", e.target.value)} placeholder="Full address" className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
              <div><label className="text-xs text-slate-500 block mb-1">Capacity</label><input type="number" value={form.venueCapacity} onChange={(e) => update("venueCapacity", e.target.value)} placeholder="0" className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500/50" /></div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Budget</h3>
            <div><label className="text-xs text-slate-500 block mb-1">Total Budget ($)</label><input type="number" value={form.totalBudget} onChange={(e) => update("totalBudget", e.target.value)} placeholder="0" className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500/50" /></div>
            <div><label className="text-xs text-slate-500 block mb-1">Budget Notes</label><textarea rows={3} value={form.budgetNotes} onChange={(e) => update("budgetNotes", e.target.value)} placeholder="Budget allocation notes..." className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Team Assignment</h3>
            <div><label className="text-xs text-slate-500 block mb-1">Event Manager</label><select value={form.manager} onChange={(e) => update("manager", e.target.value)} className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50"><option value="">Select manager</option><option>John Smith</option><option>Lisa Park</option><option>Miguel Santos</option><option>Rachel Green</option></select></div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Review & Create</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(form).filter(([_, v]) => v).map(([k, v]) => (
                <div key={k} className="p-3 rounded-lg bg-slate-900/30"><p className="text-[10px] text-slate-500 uppercase">{k.replace(/([A-Z])/g, " $1")}</p><p className="text-sm text-slate-200 mt-0.5">{v}</p></div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/30">
          <button onClick={() => setStep((p) => Math.max(1, p - 1))} disabled={step === 1} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 text-sm rounded-lg disabled:opacity-30"><ArrowLeft className="w-4 h-4" /> Back</button>
          {step < 5 ? (
            <button onClick={() => setStep((p) => Math.min(5, p + 1))} className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg">Next <ArrowRight className="w-4 h-4" /></button>
          ) : (
            <Link href="/dashboard/events" className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg"><Check className="w-4 h-4" /> Create Event</Link>
          )}
        </div>
      </div>
    </div>
  );
}
