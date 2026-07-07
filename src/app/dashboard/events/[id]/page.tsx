"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn, formatCurrency, getStatusColor, getPriorityColor, getInitials } from "@/lib/utils";
import { demoEvents, demoTasks } from "@/lib/demo-data";
import {
  ArrowLeft, Edit, Trash2, MapPin, Calendar, Users, DollarSign,
  Clock, CheckCircle2, AlertTriangle, Plus, BarChart3,
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function EventDetailPage() {
  const params = useParams();
  const event = demoEvents.find((e) => e.id === params.id) || demoEvents[0];
  const eventTasks = demoTasks.filter((t) => t.eventId === event.id);
  const [activeTab, setActiveTab] = useState("overview");

  const budgetData = [
    { category: "Venue", estimated: 45000, actual: 42000 },
    { category: "Catering", estimated: 35000, actual: 28000 },
    { category: "AV/Tech", estimated: 25000, actual: 20000 },
    { category: "Decor", estimated: 20000, actual: 15000 },
    { category: "Entertainment", estimated: 15000, actual: 12000 },
    { category: "Staff", estimated: 10000, actual: 8000 },
    { category: "Other", estimated: 8000, actual: 5000 },
  ];

  const pieData = budgetData.map((b) => ({ name: b.category, value: b.estimated }));
  const pieColors = ["#6366f1", "#8b5cf6", "#a78bfa", "#c084fc", "#e879f9", "#f472b6", "#94a3b8"];

  const timeline = [
    { time: "07:00", title: "Venue Setup Begins", location: "Main Hall", status: "completed" },
    { time: "09:00", title: "AV & Lighting Check", location: "Main Stage", status: "completed" },
    { time: "11:00", title: "Catering Delivery & Setup", location: "Banquet Area", status: "in_progress" },
    { time: "14:00", title: "Registration Opens", location: "Lobby", status: "pending" },
    { time: "15:00", title: "Welcome Keynote", location: "Main Stage", status: "pending" },
    { time: "17:00", title: "Networking Session", location: "Lounge", status: "pending" },
    { time: "19:00", title: "Gala Dinner", location: "Ballroom", status: "pending" },
    { time: "22:00", title: "Event Wrap & Teardown", location: "All Areas", status: "pending" },
  ];

  const risks = [
    { risk: "Vendor no-show", likelihood: "Low", impact: "High", mitigation: "Backup vendors on standby", status: "Mitigated" },
    { risk: "Severe weather", likelihood: "Medium", impact: "High", mitigation: "Indoor backup plan ready", status: "Open" },
    { risk: "AV equipment failure", likelihood: "Low", impact: "Medium", mitigation: "Spare equipment available", status: "Mitigated" },
    { risk: "Guest overflow", likelihood: "Low", impact: "Low", mitigation: "Additional seating arranged", status: "Open" },
  ];

  const tabs = ["overview", "timeline", "budget", "tasks", "risks"];
  const statusSteps = ["Draft", "Planning", "Pre-Event", "Live", "Post-Event", "Completed"];
  const currentStep = statusSteps.findIndex((s) => s.toLowerCase().replace("-", "_").replace(" ", "_") === event.status) + 1;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/events" className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"><ArrowLeft className="w-5 h-5 text-slate-400" /></Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">{event.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", getStatusColor(event.status))}>{event.status.replace("_", " ")}</span>
              <span className="text-xs text-slate-500">{event.type}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-lg transition-colors">Change Status</button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg"><Edit className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-800/50">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn("px-4 py-2.5 text-sm font-medium capitalize transition-colors relative", activeTab === tab ? "text-violet-400" : "text-slate-500 hover:text-slate-300")}>
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-t" />}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* Status Timeline */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Event Progress</h3>
            <div className="flex items-center gap-2">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex items-center gap-2 flex-1">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    i < currentStep ? "bg-violet-600 text-white" : i === currentStep ? "bg-violet-600/50 text-violet-300 ring-2 ring-violet-500/50" : "bg-slate-800 text-slate-500"
                  )}>{i + 1}</div>
                  {i < statusSteps.length - 1 && <div className={cn("h-0.5 flex-1", i < currentStep ? "bg-violet-600" : "bg-slate-800")} />}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {statusSteps.map((step, i) => (
                <span key={step} className={cn("text-[9px] text-center", i < currentStep ? "text-violet-400" : "text-slate-600")} style={{ width: `${100 / statusSteps.length}%` }}>{step}</span>
              ))}
            </div>
          </div>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Venue", value: event.venueName?.split(",")[0] || "TBD", icon: MapPin, color: "text-violet-400" },
              { label: "Date", value: event.startDate, icon: Calendar, color: "text-purple-400" },
              { label: "Expected Guests", value: event.expectedGuests?.toString() || "0", icon: Users, color: "text-cyan-400" },
              { label: "Budget", value: formatCurrency(event.totalBudget), icon: DollarSign, color: "text-emerald-400" },
            ].map((m) => (
              <div key={m.label} className="glass-card p-4">
                <div className="flex items-center gap-2">
                  <m.icon className={cn("w-4 h-4", m.color)} />
                  <span className="text-xs text-slate-500">{m.label}</span>
                </div>
                <p className="text-base font-bold text-slate-100 mt-2">{m.value}</p>
              </div>
            ))}
          </div>
          {/* Tasks Summary */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Task Summary</h3>
            <div className="flex items-center gap-6">
              {[
                { label: "Completed", count: eventTasks.filter((t) => t.status === "completed").length, color: "text-emerald-400" },
                { label: "In Progress", count: eventTasks.filter((t) => t.status === "in_progress").length, color: "text-blue-400" },
                { label: "Pending", count: eventTasks.filter((t) => t.status === "pending").length, color: "text-amber-400" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className={cn("text-lg font-bold", s.color)}>{s.count}</span>
                  <span className="text-xs text-slate-500">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      {activeTab === "timeline" && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-200">Event Day Timeline</h3>
            <button className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300"><Plus className="w-3 h-3" /> Add Item</button>
          </div>
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-4 pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={cn("w-3 h-3 rounded-full shrink-0",
                    item.status === "completed" ? "bg-emerald-500" : item.status === "in_progress" ? "bg-blue-500 animate-pulse" : "bg-slate-700"
                  )} />
                  {i < timeline.length - 1 && <div className="w-px flex-1 bg-slate-800 mt-1" />}
                </div>
                <div className="flex-1 pb-4 border-b border-slate-800/20 last:border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-mono font-bold text-violet-400 mr-3">{item.time}</span>
                      <span className="text-sm font-medium text-slate-200">{item.title}</span>
                    </div>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", getStatusColor(item.status))}>{item.status.replace("_", " ")}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 ml-14">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget */}
      {activeTab === "budget" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-5">
            <h3 className="text-base font-semibold text-slate-200 mb-4">Budget vs Actual</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ background: "#060c1a", border: "1px solid rgba(51,65,85,0.3)", borderRadius: 12 }} labelStyle={{ color: "#94a3b8" }} itemStyle={{ color: "#e2e8f0" }} />
                <Bar dataKey="estimated" fill="#6366f1" radius={[4, 4, 0, 0]} name="Estimated" />
                <Bar dataKey="actual" fill="#22d3ee" radius={[4, 4, 0, 0]} name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card p-5">
            <h3 className="text-base font-semibold text-slate-200 mb-4">Allocation</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (<Cell key={i} fill={pieColors[i]} />))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-3">
              {budgetData.map((b, i) => (
                <div key={b.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: pieColors[i] }} /><span className="text-slate-400">{b.category}</span></div>
                  <span className="text-slate-300 font-mono">{formatCurrency(b.estimated)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tasks */}
      {activeTab === "tasks" && (
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
            <h3 className="text-base font-semibold text-slate-200">Tasks</h3>
            <button className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 px-3 py-1.5 bg-violet-600/10 rounded-lg"><Plus className="w-3 h-3" /> Add Task</button>
          </div>
          <table className="w-full">
            <thead><tr className="border-b border-slate-800/50">
              {["Task", "Category", "Priority", "Assignee", "Due Date", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {eventTasks.map((task) => (
                <tr key={task.id} className="border-b border-slate-800/20 table-row-hover">
                  <td className="px-4 py-3 text-sm text-slate-200">{task.title}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{task.category}</td>
                  <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full border", getPriorityColor(task.priority))}>{task.priority}</span></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[8px] font-bold text-white">{getInitials(task.assignee)}</div><span className="text-xs text-slate-400">{task.assignee}</span></div></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{task.dueDate}</td>
                  <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full border", getStatusColor(task.status))}>{task.status.replace("_", " ")}</span></td>
                </tr>
              ))}
              {eventTasks.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">No tasks yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Risks */}
      {activeTab === "risks" && (
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
            <h3 className="text-base font-semibold text-slate-200">Risk Assessment</h3>
            <button className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 px-3 py-1.5 bg-violet-600/10 rounded-lg"><Plus className="w-3 h-3" /> Add Risk</button>
          </div>
          <table className="w-full">
            <thead><tr className="border-b border-slate-800/50">
              {["Risk", "Likelihood", "Impact", "Mitigation", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {risks.map((r, i) => (
                <tr key={i} className="border-b border-slate-800/20 table-row-hover">
                  <td className="px-4 py-3 text-sm text-slate-200">{r.risk}</td>
                  <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full border",
                    r.likelihood === "High" ? "bg-red-500/10 text-red-400 border-red-500/20" : r.likelihood === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  )}>{r.likelihood}</span></td>
                  <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full border",
                    r.impact === "High" ? "bg-red-500/10 text-red-400 border-red-500/20" : r.impact === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  )}>{r.impact}</span></td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-[200px]">{r.mitigation}</td>
                  <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full border", r.status === "Mitigated" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20")}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
