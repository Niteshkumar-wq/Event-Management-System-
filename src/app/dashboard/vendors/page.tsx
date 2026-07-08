"use client";

import { useState } from "react";
import Link from "next/link";
import { cn, formatCurrency, getStatusColor } from "@/lib/utils";
import { demoVendors } from "@/lib/demo-data";
import { Search, Plus, Star, Phone, Mail, ExternalLink, MapPin, Filter, Heart, CheckCircle2, X } from "lucide-react";

export default function VendorsPage() {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [vendors, setVendors] = useState(demoVendors);
  const [toast, setToast] = useState<string | null>(null);
  const [vForm, setVForm] = useState({ name: "", category: "", contactPerson: "", email: "", phone: "", website: "" });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const filtered = vendors.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || v.category === filterCat;
    return matchSearch && matchCat;
  });
  const categories = [...new Set(vendors.map((v) => v.category))];

  const handleAddVendor = () => {
    if (!vForm.name || !vForm.email) { showToast("Please fill in Name and Email"); return; }
    const newVendor = {
      id: `vendor-${Date.now()}`, name: vForm.name, category: vForm.category || "Other",
      contactPerson: vForm.contactPerson || vForm.name, email: vForm.email, phone: vForm.phone || "",
      rating: 5, isPreferred: false, tags: ["New"],
    };
    setVendors(prev => [newVendor, ...prev]);
    setVForm({ name: "", category: "", contactPerson: "", email: "", phone: "", website: "" });
    setShowForm(false);
    showToast(`"${newVendor.name}" added successfully!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Vendor Directory</h1><p className="text-sm text-slate-500 mt-0.5">Manage your vendor relationships</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30"><Plus className="w-4 h-4" /> Add Vendor</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Vendors", value: vendors.length.toString(), color: "text-teal-600" },
          { label: "Preferred", value: vendors.filter((v) => v.isPreferred).length.toString(), color: "text-emerald-600" },
          { label: "Avg Rating", value: (vendors.reduce((s, v) => s + v.rating, 0) / vendors.length).toFixed(1), color: "text-amber-600" },
          { label: "Categories", value: categories.length.toString(), color: "text-pink-600" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4"><p className="text-xs text-slate-500">{s.label}</p><p className={cn("text-xl font-bold mt-1", s.color)}>{s.value}</p></div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative max-w-xs w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-violet-500/50" /></div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-500/50">
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Add Vendor Form */}
      {showForm && (
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Add New Vendor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs text-slate-500 block mb-1">Vendor Name *</label>
              <input type="text" placeholder="Vendor Name" value={vForm.name} onChange={(e) => setVForm({...vForm, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
            <div><label className="text-xs text-slate-500 block mb-1">Category</label>
              <select value={vForm.category} onChange={(e) => setVForm({...vForm, category: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-500/50">
                <option value="">Select category</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}<option value="Other">Other</option>
              </select></div>
            <div><label className="text-xs text-slate-500 block mb-1">Contact Person</label>
              <input type="text" placeholder="Contact Person" value={vForm.contactPerson} onChange={(e) => setVForm({...vForm, contactPerson: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
            <div><label className="text-xs text-slate-500 block mb-1">Email *</label>
              <input type="email" placeholder="Email" value={vForm.email} onChange={(e) => setVForm({...vForm, email: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
            <div><label className="text-xs text-slate-500 block mb-1">Phone</label>
              <input type="text" placeholder="Phone" value={vForm.phone} onChange={(e) => setVForm({...vForm, phone: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
            <div><label className="text-xs text-slate-500 block mb-1">Website</label>
              <input type="text" placeholder="Website" value={vForm.website} onChange={(e) => setVForm({...vForm, website: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAddVendor} className="px-4 py-2 bg-teal-600 hover:bg-teal-600 text-white text-sm rounded-lg flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Save Vendor</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-700 text-slate-700 text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((vendor) => (
          <Link key={vendor.id} href={`/dashboard/vendors/${vendor.id}`} className="glass-card p-5 group cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500/20 to-purple-500/20 flex items-center justify-center text-base font-bold text-teal-600">{vendor.name[0]}</div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">{vendor.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">{vendor.category}</span>
                </div>
              </div>
              {vendor.isPreferred && <Heart className="w-4 h-4 text-pink-600 fill-pink-400" />}
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-slate-500" />{vendor.email}</div>
              <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-slate-500" />{vendor.phone}</div>
              <div className="flex items-center gap-2"><Star className="w-3 h-3 text-slate-500" />Contact: {vendor.contactPerson}</div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("w-3 h-3", i < Math.floor(vendor.rating) ? "text-amber-600 fill-amber-400" : "text-slate-700")} />
                ))}
                <span className="text-xs text-slate-400 ml-1">{vendor.rating}</span>
              </div>
              <div className="flex gap-1">{vendor.tags.map((t) => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{t}</span>)}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl shadow-2xl border bg-emerald-900/90 border-emerald-500/30 text-emerald-200 text-sm font-medium flex items-center gap-2 animate-slide-up">
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </div>
      )}
    </div>
  );
}
