"use client";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Check, User, Calendar, DollarSign, Eye } from "lucide-react";

const steps = [
  { id: 1, title: "Client Info", icon: User },
  { id: 2, title: "Event Details", icon: Calendar },
  { id: 3, title: "Budget & Requirements", icon: DollarSign },
  { id: 4, title: "Review", icon: Eye },
];

export default function NewLeadPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    clientName: "", clientEmail: "", clientPhone: "", clientCompany: "",
    eventType: "", eventDate: "", eventLocation: "", estimatedGuests: "",
    estimatedBudget: "", source: "", priority: "medium", notes: "",
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-card p-8 text-center max-w-md w-full animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Lead Created Successfully!</h2>
          <p className="text-sm text-slate-400 mt-2">
            {form.clientName || "New lead"} has been added to your pipeline.
          </p>
          <div className="flex gap-3 mt-6 justify-center">
            <Link href="/dashboard/crm" className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-xl font-medium transition-colors">
              View Pipeline
            </Link>
            <button onClick={() => { setSubmitted(false); setStep(1); setForm({ clientName: "", clientEmail: "", clientPhone: "", clientCompany: "", eventType: "", eventDate: "", eventLocation: "", estimatedGuests: "", estimatedBudget: "", source: "", priority: "medium", notes: "" }); }} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl transition-colors">
              Add Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/crm" className="p-2 rounded-lg hover:bg-slate-800/50"><ArrowLeft className="w-5 h-5 text-slate-400" /></Link>
        <h1 className="text-2xl font-bold text-slate-100">New Lead</h1>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors",
              step > s.id ? "bg-emerald-600 text-white" : step === s.id ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-500"
            )}>{step > s.id ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}</div>
            <span className={cn("text-xs hidden sm:block", step >= s.id ? "text-slate-300" : "text-slate-600")}>{s.title}</span>
            {i < steps.length - 1 && <div className={cn("h-0.5 flex-1", step > s.id ? "bg-emerald-600" : "bg-slate-800")} />}
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "clientName", label: "Full Name *", type: "text" },
                { key: "clientEmail", label: "Email *", type: "email" },
                { key: "clientPhone", label: "Phone", type: "tel" },
                { key: "clientCompany", label: "Company", type: "text" },
              ].map((f) => (
                <div key={f.key}><label className="text-xs text-slate-500 block mb-1">{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={(e) => update(f.key, e.target.value)}
                    className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-xs text-slate-500 block mb-1">Event Type *</label>
                <select value={form.eventType} onChange={(e) => update("eventType", e.target.value)} className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50">
                  <option value="">Select type</option><option>Corporate</option><option>Wedding</option><option>Conference</option><option>Social</option><option>Festival</option><option>Other</option></select></div>
              <div><label className="text-xs text-slate-500 block mb-1">Event Date</label><input type="date" value={form.eventDate} onChange={(e) => update("eventDate", e.target.value)} className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500/50" /></div>
              <div><label className="text-xs text-slate-500 block mb-1">Location</label><input type="text" value={form.eventLocation} onChange={(e) => update("eventLocation", e.target.value)} placeholder="Venue or city" className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
              <div><label className="text-xs text-slate-500 block mb-1">Expected Guests</label><input type="number" value={form.estimatedGuests} onChange={(e) => update("estimatedGuests", e.target.value)} placeholder="0" className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500/50" /></div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Budget & Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-xs text-slate-500 block mb-1">Estimated Budget ($)</label><input type="number" value={form.estimatedBudget} onChange={(e) => update("estimatedBudget", e.target.value)} placeholder="0" className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500/50" /></div>
              <div><label className="text-xs text-slate-500 block mb-1">Lead Source</label>
                <select value={form.source} onChange={(e) => update("source", e.target.value)} className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50">
                  <option value="">Select source</option><option>Website</option><option>Referral</option><option>Social Media</option><option>Cold Call</option><option>Partner</option></select></div>
              <div><label className="text-xs text-slate-500 block mb-1">Priority</label>
                <select value={form.priority} onChange={(e) => update("priority", e.target.value)} className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-violet-500/50">
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></div>
            </div>
            <div><label className="text-xs text-slate-500 block mb-1">Notes</label>
              <textarea rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Additional requirements or notes..." className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Review & Submit</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(form).filter(([_, v]) => v).map(([k, v]) => (
                <div key={k} className="p-3 rounded-lg bg-slate-900/30">
                  <p className="text-[10px] text-slate-500 uppercase">{k.replace(/([A-Z])/g, " $1")}</p>
                  <p className="text-sm text-slate-200 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            {Object.entries(form).filter(([_, v]) => v).length === 0 && (
              <div className="text-center py-8 text-sm text-slate-500">No information filled in yet. Go back to fill in the details.</div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/30">
          <button onClick={() => setStep((p) => Math.max(1, p - 1))} disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 text-sm rounded-lg disabled:opacity-30"><ArrowLeft className="w-4 h-4" /> Back</button>
          {step < 4 ? (
            <button onClick={() => setStep((p) => Math.min(4, p + 1))} className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg">
              Next <ArrowRight className="w-4 h-4" /></button>
          ) : (
            <button onClick={() => setSubmitted(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20">
              <Check className="w-4 h-4" /> Submit Lead</button>
          )}
        </div>
      </div>
    </div>
  );
}
