"use client";
import { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Download, FileText, Calendar, TrendingUp, Users, DollarSign } from "lucide-react";

const eventPerformance = [
  { name: "NexGen Launch", guests: 500, budget: 180000, satisfaction: 4.8, revenue: 210000 },
  { name: "Music Festival", guests: 3000, budget: 450000, satisfaction: 4.5, revenue: 520000 },
  { name: "Awards Night", guests: 250, budget: 120000, satisfaction: 4.9, revenue: 145000 },
  { name: "Tech Conference", guests: 800, budget: 200000, satisfaction: 4.6, revenue: 240000 },
  { name: "Charity Gala", guests: 150, budget: 75000, satisfaction: 4.7, revenue: 95000 },
];

const monthlyTrend = [
  { month: "Jan", events: 3, revenue: 45000 }, { month: "Feb", events: 4, revenue: 52000 },
  { month: "Mar", events: 5, revenue: 61000 }, { month: "Apr", events: 3, revenue: 48000 },
  { month: "May", events: 6, revenue: 72000 }, { month: "Jun", events: 7, revenue: 89000 },
  { month: "Jul", events: 5, revenue: 95000 },
];

const channelData = [
  { name: "Website", value: 35, color: "#6366f1" }, { name: "Referral", value: 25, color: "#8b5cf6" },
  { name: "Social Media", value: 20, color: "#a78bfa" }, { name: "Cold Call", value: 10, color: "#c4b5fd" },
  { name: "Other", value: 10, color: "#94a3b8" },
];

const reports = [
  { name: "Monthly Revenue Report", date: "Jul 2026", type: "Finance" },
  { name: "Event Performance Summary", date: "Q2 2026", type: "Events" },
  { name: "Guest Satisfaction Survey", date: "Jun 2026", type: "Guests" },
  { name: "Vendor Evaluation Report", date: "Q2 2026", type: "Vendors" },
  { name: "Team Productivity Report", date: "Jun 2026", type: "Teams" },
  { name: "Inventory Audit Report", date: "Jul 2026", type: "Inventory" },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("performance");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1><p className="text-sm text-slate-500 mt-0.5">Comprehensive reporting and insights</p></div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-800 text-sm rounded-lg"><Download className="w-4 h-4" /> Export All</button>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "performance", label: "Event Performance" },
          { id: "financial", label: "Financial Summary" },
          { id: "leads", label: "Lead Analytics" },
          { id: "guest", label: "Guest Insights" },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setSelectedReport(tab.id)} className={cn("px-4 py-2 text-sm rounded-lg transition-colors", selectedReport === tab.id ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-400 hover:text-white")}>{tab.label}</button>
        ))}
      </div>

      {selectedReport === "performance" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Events & Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyTrend}>
                  <defs><linearGradient id="revG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="100%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip contentStyle={{ background: "#060c1a", border: "1px solid rgba(51,65,85,0.3)", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#revG)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card p-5">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Lead Sources</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart><Pie data={channelData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">{channelData.map((d, i) => <Cell key={i} fill={d.color} />)}</Pie></PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">{channelData.map((c) => (<div key={c.name} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} /><span className="text-xs text-slate-400">{c.name}</span></div><span className="text-xs text-slate-700">{c.value}%</span></div>))}</div>
            </div>
          </div>
          <div className="glass-card p-5">
            <h3 className="text-base font-semibold text-slate-800 mb-4">Event Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={eventPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ background: "#060c1a", border: "1px solid rgba(51,65,85,0.3)", borderRadius: 12 }} />
                <Bar dataKey="budget" fill="#6366f1" radius={[4, 4, 0, 0]} name="Budget" />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selectedReport !== "performance" && (
        <div className="glass-card p-10 text-center">
          <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700">Report: {selectedReport}</h3>
          <p className="text-sm text-slate-500 mt-2">Select filters and date range to generate this report</p>
          <button className="mt-4 px-4 py-2 bg-teal-600 hover:bg-violet-500 text-white text-sm rounded-lg">Generate Report</button>
        </div>
      )}

      {/* Downloadable Reports */}
      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-3">Available Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((r) => (
            <div key={r.name} className="glass-card p-4 flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-50"><FileText className="w-4 h-4 text-teal-600" /></div>
                <div><h4 className="text-sm font-medium text-slate-800">{r.name}</h4><div className="flex gap-2 mt-0.5"><span className="text-[10px] text-slate-500">{r.date}</span><span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{r.type}</span></div></div>
              </div>
              <Download className="w-4 h-4 text-slate-600 group-hover:text-teal-600 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
