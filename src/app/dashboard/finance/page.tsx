"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { demoInvoices } from "@/lib/demo-data";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Receipt, ArrowUpRight, FileText, AlertTriangle } from "lucide-react";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const monthlyData = [
  { month: "Jan", revenue: 45000, expenses: 32000 },
  { month: "Feb", revenue: 52000, expenses: 38000 },
  { month: "Mar", revenue: 61000, expenses: 42000 },
  { month: "Apr", revenue: 48000, expenses: 35000 },
  { month: "May", revenue: 72000, expenses: 48000 },
  { month: "Jun", revenue: 89000, expenses: 55000 },
  { month: "Jul", revenue: 95000, expenses: 62000 },
];

const cashFlow = [
  { month: "Jan", inflow: 48000, outflow: 35000 },
  { month: "Feb", inflow: 55000, outflow: 40000 },
  { month: "Mar", inflow: 65000, outflow: 45000 },
  { month: "Apr", inflow: 52000, outflow: 38000 },
  { month: "May", inflow: 78000, outflow: 52000 },
  { month: "Jun", inflow: 92000, outflow: 58000 },
  { month: "Jul", inflow: 100000, outflow: 65000 },
];

export default function FinancePage() {
  const totalRevenue = demoInvoices.reduce((s, i) => s + i.amountPaid, 0);
  const outstanding = demoInvoices.reduce((s, i) => s + (i.total - i.amountPaid), 0);
  const overdueCount = demoInvoices.filter((i) => i.status === "overdue").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-slate-100">Financial Overview</h1><p className="text-sm text-slate-500 mt-0.5">Track revenue, expenses, and cash flow</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-emerald-400", change: "+18.2%", gradient: "kpi-gradient-2" , mono: true},
          { label: "Outstanding", value: formatCurrency(outstanding), icon: CreditCard, color: "text-amber-400", change: `${overdueCount} overdue`, gradient: "kpi-gradient-3" },
          { label: "Total Expenses", value: formatCurrency(345000), icon: TrendingDown, color: "text-red-400", change: "+5.4%", gradient: "kpi-gradient-4" },
          { label: "Profit Margin", value: "34.2%", icon: TrendingUp, color: "text-violet-400", change: "+2.1%", gradient: "kpi-gradient-1" },
        ].map((s) => <div key={s.label} className={cn("glass-card p-4 group", s.gradient)}>
                <div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">{s.label}</p><p className="text-xl font-bold text-slate-100 mt-1 font-mono">{s.value}</p><p className="text-[10px] text-slate-500 mt-1">{s.change}</p></div><div className="p-2.5 rounded-xl bg-slate-800/30 group-hover:scale-110 transition-transform"><s.icon className={cn("w-5 h-5", s.color)} /></div></div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-base font-semibold text-slate-200 mb-4">Revenue vs Expenses</h3>
          <div className="animate-slide-up">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "#060c1a", border: "1px solid rgba(51,65,85,0.3)", borderRadius: 12 }} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card p-5">
          <h3 className="text-base font-semibold text-slate-200 mb-4">Cash Flow</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={cashFlow}>
              <defs>
                <linearGradient id="inflowG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                <linearGradient id="outflowG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} /><stop offset="100%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "#060c1a", border: "1px solid rgba(51,65,85,0.3)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="inflow" stroke="#10b981" fill="url(#inflowG)" name="Inflow" />
              <Area type="monotone" dataKey="outflow" stroke="#f43f5e" fill="url(#outflowG)" name="Outflow" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Links + Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-base font-semibold text-slate-200 mb-4">Quick Access</h3>
          <div className="space-y-2">
            {[
              { label: "Invoices", href: "/dashboard/finance/invoices", icon: FileText, count: demoInvoices.length },
              { label: "Payments", href: "/dashboard/finance/payments", icon: CreditCard, count: 15 },
              { label: "Expenses", href: "/dashboard/finance/expenses", icon: Receipt, count: 28 },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 hover:bg-slate-800/50 transition-colors group">
                <div className="flex items-center gap-3"><item.icon className="w-4 h-4 text-slate-400" /><span className="text-sm text-slate-300 group-hover:text-violet-300">{item.label}</span></div>
                <div className="flex items-center gap-2"><span className="text-xs bg-slate-800/50 text-slate-500 px-2 py-0.5 rounded-full">{item.count}</span><ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-violet-400" /></div>
              </Link>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="text-base font-semibold text-slate-200 mb-4">Recent Invoices</h3>
          <div className="space-y-2">
            {demoInvoices.slice(0, 4).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-500/10"><FileText className="w-4 h-4 text-violet-400" /></div>
                  <div><p className="text-sm font-medium text-slate-200">{inv.invoiceNumber}</p><p className="text-xs text-slate-500">{inv.clientName}</p></div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold font-mono text-slate-200">{formatCurrency(inv.total)}</p>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full border",
                    inv.status === "paid" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    inv.status === "overdue" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                    inv.status === "partially_paid" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                    "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  )}>{inv.status.replace("_", " ")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
