"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileText, Search, Plus, ArrowLeft } from "lucide-react";
import { demoVendorContracts } from "@/lib/demo-data";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

function statusClass(status: string) {
  switch (status) {
    case "Active": return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    case "Completed": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
    case "Pending Signature": return "bg-amber-500/10 text-amber-700 border-amber-500/20";
    default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
  }
}

export default function VendorContractsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    let list = [...demoVendorContracts];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.vendorName.toLowerCase().includes(q) ||
        c.eventName.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "All") list = list.filter((c) => c.status === statusFilter);
    return list;
  }, [search, statusFilter]);

  const totalValue = demoVendorContracts.reduce((s, c) => s + c.value, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/dashboard/vendors" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Vendors
          </Link>
          <div className="flex items-center gap-3">
            <div className="kpi-icon-box">
              <FileText className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h1 className="page-title">Vendor Contracts</h1>
              <p className="page-subtitle">Track agreements, values, and contract status</p>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium">
          <Plus className="w-4 h-4" /> New Contract
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Contracts", value: demoVendorContracts.length },
          { label: "Active", value: demoVendorContracts.filter((c) => c.status === "Active").length },
          { label: "Pending", value: demoVendorContracts.filter((c) => c.status === "Pending Signature").length },
          { label: "Total Value", value: formatCurrency(totalValue) },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            <p className="text-sm text-slate-600">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by vendor, event, or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900"
          >
            <option value="All">All Statuses</option>
            {["Active", "Completed", "Pending Signature"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                {["Vendor", "Event", "Type", "Value", "Start Date", "End Date", "Status"].map((h) => (
                  <th key={h} className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 table-row-hover">
                  <td className="p-4 text-sm font-medium text-slate-900">{c.vendorName}</td>
                  <td className="p-4 text-sm text-slate-800">{c.eventName}</td>
                  <td className="p-4 text-sm text-slate-800">{c.type}</td>
                  <td className="p-4 text-sm text-slate-800">{formatCurrency(c.value)}</td>
                  <td className="p-4 text-sm text-slate-600">{formatDate(c.startDate)}</td>
                  <td className="p-4 text-sm text-slate-600">{formatDate(c.endDate)}</td>
                  <td className="p-4">
                    <span className={cn("inline-flex px-2.5 py-1 rounded-full text-xs font-medium border", statusClass(c.status))}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
