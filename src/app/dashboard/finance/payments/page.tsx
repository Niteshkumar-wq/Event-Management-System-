"use client";
import { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { CreditCard, Search } from "lucide-react";

const payments = [
  { id: 1, date: "2026-07-06", invoice: "INV-2026-001", client: "TechCorp Industries", amount: 98100, method: "Bank Transfer", reference: "TRF-892456" },
  { id: 2, date: "2026-06-28", invoice: "INV-2025-048", client: "TechCorp Industries", amount: 40875, method: "Card", reference: "CH-456123" },
  { id: 3, date: "2026-06-15", invoice: "INV-2025-048", client: "TechCorp Industries", amount: 40875, method: "Card", reference: "CH-456124" },
  { id: 4, date: "2026-06-01", invoice: "INV-2025-045", client: "Innovate.io", amount: 25000, method: "UPI", reference: "UPI-789012" },
  { id: 5, date: "2026-05-20", invoice: "INV-2025-042", client: "Hope Foundation", amount: 15000, method: "Cash", reference: "CASH-001" },
];

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("all");
  const filtered = payments.filter((p) => {
    const ms = p.client.toLowerCase().includes(search.toLowerCase()) || p.invoice.toLowerCase().includes(search.toLowerCase());
    const mm = filterMethod === "all" || p.method === filterMethod;
    return ms && mm;
  });
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-slate-900">Payments</h1><p className="text-sm text-slate-500 mt-0.5">Track all payment transactions</p></div>
      <div className="flex items-center gap-3">
        <div className="relative max-w-xs w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search payments..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-violet-500/50" /></div>
        <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-500/50">
          <option value="all">All Methods</option><option>Card</option><option>Bank Transfer</option><option>Cash</option><option>UPI</option>
        </select>
      </div>
      <div className="glass-card overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-slate-200/50">
          {["Date", "Invoice", "Client", "Amount", "Method", "Reference"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}
        </tr></thead><tbody>
          {filtered.map((p) => (
            <tr key={p.id} className="border-b border-slate-100 table-row-hover">
              <td className="px-4 py-3 text-sm text-slate-600">{p.date}</td>
              <td className="px-4 py-3 text-sm font-mono text-teal-600">{p.invoice}</td>
              <td className="px-4 py-3 text-sm text-slate-800">{p.client}</td>
              <td className="px-4 py-3 text-sm font-bold font-mono text-emerald-600">{formatCurrency(p.amount)}</td>
              <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full border",
                p.method === "Card" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : p.method === "Bank Transfer" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" : p.method === "UPI" ? "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              )}>{p.method}</span></td>
              <td className="px-4 py-3 text-xs font-mono text-slate-500">{p.reference}</td>
            </tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );
}
