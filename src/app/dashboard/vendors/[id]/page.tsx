"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn, formatCurrency } from "@/lib/utils";
import { demoVendors } from "@/lib/demo-data";
import { ArrowLeft, Star, Mail, Phone, Globe, Heart, Edit, Calendar, DollarSign, FileText, CheckCircle2 } from "lucide-react";

export default function VendorDetailPage() {
  const params = useParams();
  const vendor = demoVendors.find((v) => v.id === params.id) || demoVendors[0];
  const [activeTab, setActiveTab] = useState("overview");

  const bookings = [
    { id: 1, event: "NexGen Series X Launch", service: "Main Catering", dates: "Aug 20, 2026", price: 35000, status: "Confirmed" },
    { id: 2, event: "TechCorp Annual Gala 2025", service: "Dinner Service", dates: "Sep 15, 2025", price: 28000, status: "Completed" },
    { id: 3, event: "Elite Awards Night 2026", service: "Cocktail Hour", dates: "Jul 7, 2026", price: 18000, status: "Confirmed" },
  ];

  const contracts = [
    { id: 1, title: "Annual Service Agreement 2026", value: 120000, start: "Jan 2026", end: "Dec 2026", status: "Active" },
    { id: 2, title: "NexGen Launch - Catering Contract", value: 35000, start: "Jul 2026", end: "Aug 2026", status: "Signed" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/vendors" className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"><ArrowLeft className="w-5 h-5 text-slate-400" /></Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100">{vendor.name}</h1>
            {vendor.isPreferred && <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">{vendor.category}</span>
            <div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn("w-3 h-3", i < Math.floor(vendor.rating) ? "text-amber-400 fill-amber-400" : "text-slate-700")} />)}<span className="text-xs text-slate-400 ml-1">{vendor.rating}</span></div>
          </div>
        </div>
        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg"><Edit className="w-4 h-4" /></button>
      </div>

      <div className="flex gap-1 border-b border-slate-800/50">
        {["overview", "bookings", "contracts"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={cn("px-4 py-2.5 text-sm font-medium capitalize relative transition-colors", activeTab === tab ? "text-violet-400" : "text-slate-500 hover:text-slate-300")}>
            {tab}{activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-t" />}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-5">
            <h3 className="text-base font-semibold text-slate-200 mb-4">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Mail, label: "Email", value: vendor.email },
                { icon: Phone, label: "Phone", value: vendor.phone },
                { icon: Globe, label: "Contact", value: vendor.contactPerson },
                { icon: Star, label: "Category", value: vendor.category },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800/50"><item.icon className="w-4 h-4 text-slate-400" /></div>
                  <div><p className="text-[10px] text-slate-500 uppercase">{item.label}</p><p className="text-sm text-slate-200">{item.value}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/30">
              <p className="text-[10px] text-slate-500 uppercase mb-2">Tags</p>
              <div className="flex gap-2">{vendor.tags.map((t) => <span key={t} className="text-xs px-2 py-1 rounded-lg bg-slate-800/50 text-slate-400">{t}</span>)}</div>
            </div>
          </div>
          <div className="glass-card p-5">
            <h3 className="text-base font-semibold text-slate-200 mb-3">Quick Stats</h3>
            <div className="space-y-3">
              {[
                { label: "Total Bookings", value: "12", color: "text-violet-400" },
                { label: "Active Contracts", value: "2", color: "text-emerald-400" },
                { label: "Total Revenue", value: formatCurrency(183000), color: "text-amber-400" },
                { label: "Avg Rating", value: `${vendor.rating}/5.0`, color: "text-pink-400" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/30">
                  <span className="text-xs text-slate-500">{s.label}</span>
                  <span className={cn("text-sm font-bold", s.color)}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-slate-800/50">
              {["Event", "Service", "Dates", "Price", "Status"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}
            </tr></thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-slate-800/20 table-row-hover">
                  <td className="px-4 py-3 text-sm text-slate-200">{b.event}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{b.service}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{b.dates}</td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-200">{formatCurrency(b.price)}</td>
                  <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full border", b.status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20")}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "contracts" && (
        <div className="space-y-4">
          {contracts.map((c) => (
            <div key={c.id} className="glass-card p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-purple-500/10"><FileText className="w-5 h-5 text-purple-400" /></div>
                <div><h4 className="text-sm font-semibold text-slate-200">{c.title}</h4><p className="text-xs text-slate-500 mt-0.5">{c.start} → {c.end}</p></div>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-slate-100 font-mono">{formatCurrency(c.value)}</p>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", c.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20")}>{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
