"use client";

import { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { demoInvoices } from "@/lib/demo-data";
import { downloadText, safeFilename } from "@/lib/download-utils";
import { Search, Plus, FileText, Send, Download, Eye, DollarSign, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);

  const filtered = demoInvoices.filter((inv) => {
    const matchSearch = inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || inv.clientName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });
  const totalInvoiced = demoInvoices.reduce((s, i) => s + i.total, 0);
  const totalPaid = demoInvoices.reduce((s, i) => s + i.amountPaid, 0);

  const handleDownloadInvoice = (inv: (typeof demoInvoices)[0]) => {
    const content = [
      "EventPro — INVOICE",
      "==================",
      "",
      `Invoice Number: ${inv.invoiceNumber}`,
      `Status: ${inv.status.replace("_", " ")}`,
      `Issued: ${inv.issuedDate || "Draft"}`,
      `Due Date: ${inv.dueDate}`,
      "",
      "BILL TO",
      inv.clientName,
      inv.clientEmail,
      "",
      `Event: ${inv.eventName}`,
      "",
      "SUMMARY",
      `Line Items: ${inv.items}`,
      `Subtotal: ${formatCurrency(inv.subtotal)}`,
      `Tax: ${formatCurrency(inv.tax)}`,
      `Total: ${formatCurrency(inv.total)}`,
      `Amount Paid: ${formatCurrency(inv.amountPaid)}`,
      `Balance Due: ${formatCurrency(inv.total - inv.amountPaid)}`,
      "",
      `Generated: ${new Date().toLocaleString()}`,
    ].join("\n");
    downloadText(content, safeFilename(inv.invoiceNumber, "txt"));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Invoices</h1><p className="text-sm text-slate-500 mt-0.5">Manage invoices and billing</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30"><Plus className="w-4 h-4" /> Create Invoice</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Invoiced", value: formatCurrency(totalInvoiced), icon: FileText, color: "text-teal-600" },
          { label: "Total Paid", value: formatCurrency(totalPaid), icon: CheckCircle2, color: "text-emerald-600" },
          { label: "Outstanding", value: formatCurrency(totalInvoiced - totalPaid), icon: Clock, color: "text-amber-600" },
          { label: "Overdue", value: demoInvoices.filter((i) => i.status === "overdue").length.toString(), icon: AlertTriangle, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">{s.label}</p><p className={cn("text-xl font-bold mt-1", s.color)}>{s.value}</p></div><s.icon className={cn("w-5 h-5", s.color)} /></div></div>
        ))}
      </div>

      {/* Create Invoice Form */}
      {showForm && (
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Create New Invoice</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Client Name", type: "text" },
              { label: "Client Email", type: "email" },
              { label: "Event", type: "select", options: ["NexGen Series X Launch", "Summer Music Festival", "Elite Awards Night 2026"] },
              { label: "Due Date", type: "date" },
              { label: "Amount", type: "number" },
              { label: "Tax Rate (%)", type: "number" },
            ].map((f) => (
              <div key={f.label}><label className="text-xs text-slate-500 block mb-1">{f.label}</label>
                {f.type === "select" ? (
                  <select className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-500/50">
                    <option>Select event</option>{f.options?.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type} placeholder={f.label} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4"><label className="text-xs text-slate-500 block mb-1">Notes</label>
            <textarea rows={2} placeholder="Invoice notes..." className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-600 focus:outline-none focus:border-violet-500/50" /></div>
          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 bg-teal-600 hover:bg-teal-600 text-white text-sm rounded-lg">Save as Draft</button>
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg">Save & Send</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-700 text-slate-700 text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="relative max-w-xs w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-violet-500/50" /></div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-500/50">
          <option value="all">All Status</option>
          <option value="draft">Draft</option><option value="sent">Sent</option><option value="paid">Paid</option><option value="partially_paid">Partially Paid</option><option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-slate-200/50">
            {["Invoice", "Client", "Event", "Amount", "Paid", "Status", "Due Date", "Actions"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((inv) => (
              <tr key={inv.id} className="border-b border-slate-100 table-row-hover">
                <td className="px-4 py-3 text-sm font-medium font-mono text-teal-600">{inv.invoiceNumber}</td>
                <td className="px-4 py-3"><p className="text-sm text-slate-800">{inv.clientName}</p><p className="text-xs text-slate-500">{inv.clientEmail}</p></td>
                <td className="px-4 py-3 text-sm text-slate-600">{inv.eventName}</td>
                <td className="px-4 py-3 text-sm font-bold font-mono text-slate-800">{formatCurrency(inv.total)}</td>
                <td className="px-4 py-3 text-sm font-mono text-emerald-600">{formatCurrency(inv.amountPaid)}</td>
                <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full border",
                  inv.status === "paid" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                  inv.status === "overdue" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                  inv.status === "partially_paid" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                  inv.status === "sent" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                  "bg-slate-500/10 text-slate-600 border-slate-500/20"
                )}>{inv.status.replace("_", " ")}</span></td>
                <td className="px-4 py-3 text-xs text-slate-500">{inv.dueDate}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-800" title="View"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600" title="Send"><Send className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDownloadInvoice(inv)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-emerald-600" title="Download"><Download className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
