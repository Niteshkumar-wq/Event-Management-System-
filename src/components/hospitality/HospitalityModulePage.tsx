"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, ArrowLeft, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type HospitalityColumn<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T extends { id: string; status?: string }> = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  backHref?: string;
  data: T[];
  columns: HospitalityColumn<T>[];
  searchKeys: (keyof T)[];
  statusOptions?: string[];
  addLabel?: string;
};

function statusClass(status: string) {
  const s = status.toLowerCase();
  if (s.includes("confirm") || s.includes("active") || s.includes("resolved") || s.includes("completed"))
    return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
  if (s.includes("pending") || s.includes("open") || s.includes("review") || s.includes("scheduled"))
    return "bg-amber-500/10 text-amber-700 border-amber-500/20";
  if (s.includes("progress") || s.includes("booked"))
    return "bg-blue-500/10 text-blue-700 border-blue-500/20";
  return "bg-slate-500/10 text-slate-600 border-slate-500/20";
}

export default function HospitalityModulePage<T extends { id: string; status?: string }>({
  title,
  subtitle,
  icon: Icon,
  backHref = "/dashboard/hospitality",
  data,
  columns,
  searchKeys,
  statusOptions,
  addLabel = "Add New",
}: Props<T>) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    let list = [...data];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((row) =>
        searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(q))
      );
    }
    if (statusFilter !== "All") {
      list = list.filter((row) => row.status === statusFilter);
    }
    return list;
  }, [data, search, searchKeys, statusFilter]);

  const statuses = statusOptions ?? ["All", ...new Set(data.map((d) => d.status).filter(Boolean) as string[])];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Hospitality
          </Link>
          <div className="flex items-center gap-3">
            <div className="kpi-icon-box">
              <Icon className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h1 className="page-title">{title}</h1>
              <p className="page-subtitle">{subtitle}</p>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> {addLabel}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Records", value: data.length },
          { label: "Confirmed", value: data.filter((d) => /confirm|active|resolved|completed/i.test(d.status ?? "")).length },
          { label: "Pending", value: data.filter((d) => /pending|open|review|scheduled/i.test(d.status ?? "")).length },
          { label: "Showing", value: filtered.length },
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
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50"
            />
          </div>
          {statuses.length > 1 && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-teal-500/50"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                {columns.map((col) => (
                  <th key={String(col.key)} className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 table-row-hover">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="p-4 text-sm text-slate-800">
                      {col.render
                        ? col.render(row)
                        : col.key === "status" && row.status
                          ? (
                            <span className={cn("inline-flex px-2.5 py-1 rounded-full text-xs font-medium border", statusClass(row.status))}>
                              {row.status}
                            </span>
                          )
                          : String((row as Record<string, unknown>)[col.key as string] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-slate-600 font-medium">No records found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
