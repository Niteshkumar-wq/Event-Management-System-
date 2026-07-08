"use client";

import { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { demoInventory } from "@/lib/demo-data";
import { Search, Plus, Package, AlertTriangle, DollarSign, Layers, CheckCircle2, X } from "lucide-react";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState(demoInventory);
  const [toast, setToast] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "", sku: "", location: "", category: "", totalQuantity: "", costPerUnit: "",
  });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const categories = [...new Set(items.map((i) => i.category))];
  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || item.category === filterCat;
    return matchSearch && matchCat;
  });
  const lowStock = items.filter((i) => i.availableQty / i.totalQuantity < 0.2);
  const totalValue = items.reduce((s, i) => s + i.totalQuantity * (i.costPerUnit || 0), 0);

  const handleAddItem = () => {
    if (!formData.name || !formData.category || !formData.totalQuantity) {
      showToast("Please fill in Name, Category, and Quantity");
      return;
    }
    const qty = parseInt(formData.totalQuantity) || 0;
    const newItem = {
      id: `inv-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      totalQuantity: qty,
      availableQty: qty,
      unit: "pcs",
      condition: "Good" as const,
      location: formData.location || "Warehouse A",
      costPerUnit: parseFloat(formData.costPerUnit) || 0,
    };
    setItems(prev => [newItem, ...prev]);
    setFormData({ name: "", sku: "", location: "", category: "", totalQuantity: "", costPerUnit: "" });
    setShowForm(false);
    showToast(`"${newItem.name}" added to inventory!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1><p className="text-sm text-slate-500 mt-0.5">Track resources and equipment</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30"><Plus className="w-4 h-4" /> Add Item</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Items", value: items.length.toString(), icon: Package, color: "text-teal-600" },
          { label: "Low Stock", value: lowStock.length.toString(), icon: AlertTriangle, color: "text-red-600" },
          { label: "Total Value", value: formatCurrency(totalValue), icon: DollarSign, color: "text-emerald-600" },
          { label: "Categories", value: categories.length.toString(), icon: Layers, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">{s.label}</p><p className={cn("text-xl font-bold mt-1", s.color)}>{s.value}</p></div><s.icon className={cn("w-5 h-5", s.color)} /></div></div>
        ))}
      </div>

      {lowStock.length > 0 && (
        <div className="glass-card p-4 border-l-4 border-red-500/50">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-red-600" /><span className="text-sm font-semibold text-red-600">Low Stock Alerts</span></div>
          <div className="flex gap-3 flex-wrap">
            {lowStock.map((item) => (
              <span key={item.id} className="text-xs bg-red-500/10 text-red-300 px-2 py-1 rounded-lg border border-red-500/20">
                {item.name} — {item.availableQty}/{item.totalQuantity} remaining
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add Item Form */}
      {showForm && (
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Add Inventory Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="text-xs text-slate-500 block mb-1">Item Name *</label>
              <input type="text" placeholder="e.g. LED Stage Light" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
            <div><label className="text-xs text-slate-500 block mb-1">SKU</label>
              <input type="text" placeholder="SKU-001" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
            <div><label className="text-xs text-slate-500 block mb-1">Location</label>
              <input type="text" placeholder="Warehouse A" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
            <div><label className="text-xs text-slate-500 block mb-1">Category *</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-500/50">
                <option value="">Select category</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}
                <option value="Other">Other</option>
              </select></div>
            <div><label className="text-xs text-slate-500 block mb-1">Total Quantity *</label>
              <input type="number" placeholder="0" value={formData.totalQuantity} onChange={(e) => setFormData({...formData, totalQuantity: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-violet-500/50" /></div>
            <div><label className="text-xs text-slate-500 block mb-1">Cost per Unit</label>
              <input type="number" placeholder="0.00" value={formData.costPerUnit} onChange={(e) => setFormData({...formData, costPerUnit: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-violet-500/50" /></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAddItem} className="px-4 py-2 bg-teal-600 hover:bg-teal-600 text-white text-sm rounded-lg flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Save Item</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-700 text-slate-700 text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="relative max-w-xs w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-violet-500/50" /></div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-500/50">
          <option value="all">All Categories</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-slate-200/50">
            {["Item", "Category", "Available / Total", "Condition", "Location", "Cost/Unit"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((item) => {
              const pct = Math.round((item.availableQty / item.totalQuantity) * 100);
              const isLow = pct < 20;
              return (
                <tr key={item.id} className="border-b border-slate-100 table-row-hover">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-teal-50"><Package className="w-4 h-4 text-teal-600" /></div><span className="text-sm font-medium text-slate-800">{item.name}</span></div></td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">{item.category}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={cn("text-sm font-mono", isLow ? "text-red-600" : "text-slate-800")}>{item.availableQty} / {item.totalQuantity}</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", isLow ? "bg-red-500" : pct < 50 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full border", item.condition === "Good" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20")}>{item.condition}</span></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{item.location}</td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-700">{formatCurrency(item.costPerUnit || 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center"><Package className="w-10 h-10 text-slate-700 mx-auto mb-2" /><p className="text-sm text-slate-500">No items found</p></div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl shadow-2xl border bg-emerald-900/90 border-emerald-500/30 text-emerald-200 text-sm font-medium flex items-center gap-2 animate-slide-up">
          <CheckCircle2 className="w-4 h-4" /> {toast}
          <button onClick={() => setToast(null)} className="ml-2"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
    </div>
  );
}
