"use client";
import { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Search, Plus, Receipt, Upload } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const expenses = [
  { id: 1, description: "Venue deposit - Grand Exhibit Hall", category: "Venue", event: "NexGen Series X Launch", amount: 20000, paidBy: "John Smith", status: "Paid" },
  { id: 2, description: "LED lighting equipment rental", category: "AV/Tech", event: "NexGen Series X Launch", amount: 8500, paidBy: "Miguel Santos", status: "Approved" },
  { id: 3, description: "Floral arrangements order", category: "Decoration", event: "Elite Awards Night 2026", amount: 5200, paidBy: "Rachel Green", status: "Paid" },
  { id: 4, description: "Security team advance", category: "Security", event: "Summer Music Festival", amount: 12000, paidBy: "Miguel Santos", status: "Pending" },
  { id: 5, description: "Printing - invitations & signage", category: "Printing", event: "NexGen Series X Launch", amount: 3800, paidBy: "Amy Chen", status: "Approved" },
  { id: 6, description: "Catering tasting session", category: "Catering", event: "Elite Awards Night 2026", amount: 1500, paidBy: "Rachel Green", status: "Paid" },
];
const catData = [
  { name: "Venue", value: 20000, color: "#6366f1" }, { name: "AV/Tech", value: 8500, color: "#8b5cf6" },
  { name: "Decoration", value: 5200, color: "#a78bfa" }, { name: "Security", value: 12000, color: "#c084fc" },
  { name: "Printing", value: 3800, color: "#e879f9" }, { name: "Catering", value: 1500, color: "#f472b6" },
];

export default function ExpensesPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const filtered = expenses.filter((e) => e.description.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()));
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Expenses</h1><p className="text-sm text-slate-500 mt-0.5">Track and categorize event expenses</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30"><Plus className="w-4 h-4" /> Add Expense</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {showForm && (
            <div className="glass-card p-6 mb-6">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Add Expense</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-500 block mb-1">Description</label><input type="text" placeholder="Expense description" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
                <div><label className="text-xs text-slate-500 block mb-1">Amount</label><input type="number" placeholder="0.00" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-violet-500/50" /></div>
                <div><label className="text-xs text-slate-500 block mb-1">Category</label><select className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-500/50"><option>Venue</option><option>Catering</option><option>AV/Tech</option><option>Decoration</option><option>Security</option><option>Other</option></select></div>
                <div><label className="text-xs text-slate-500 block mb-1">Receipt</label><div className="flex items-center gap-2 p-2 border border-dashed border-slate-700 rounded-lg"><Upload className="w-4 h-4 text-slate-500" /><span className="text-xs text-slate-500">Upload receipt</span></div></div>
              </div>
              <div className="flex gap-3 mt-4"><button className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg">Save</button><button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-lg">Cancel</button></div>
            </div>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative max-w-xs w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-violet-500/50" /></div>
          </div>
          <div className="glass-card overflow-hidden">
            <table className="w-full"><thead><tr className="border-b border-slate-200/50">
              {["Description", "Category", "Event", "Amount", "Paid By", "Status"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}
            </tr></thead><tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-slate-100 table-row-hover">
                  <td className="px-4 py-3 text-sm text-slate-800">{e.description}</td>
                  <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">{e.category}</span></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{e.event}</td>
                  <td className="px-4 py-3 text-sm font-bold font-mono text-slate-800">{formatCurrency(e.amount)}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{e.paidBy}</td>
                  <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full border", e.status === "Paid" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : e.status === "Approved" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20")}>{e.status}</span></td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </div>
        <div className="glass-card p-5">
          <h3 className="text-base font-semibold text-slate-800 mb-2">By Category</h3>
          <p className="text-2xl font-bold text-slate-900 mb-4">{formatCurrency(total)}</p>
          <ResponsiveContainer width="100%" height={180}><PieChart><Pie data={catData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">{catData.map((d, i) => <Cell key={i} fill={d.color} />)}</Pie><Tooltip contentStyle={{ background: "#060c1a", border: "1px solid rgba(51,65,85,0.3)", borderRadius: 12 }} /></PieChart></ResponsiveContainer>
          <div className="space-y-2 mt-3">{catData.map((c) => (<div key={c.name} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} /><span className="text-xs text-slate-400">{c.name}</span></div><span className="text-xs font-mono text-slate-700">{formatCurrency(c.value)}</span></div>))}</div>
        </div>
      </div>
    </div>
  );
}
