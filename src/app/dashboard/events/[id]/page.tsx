"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn, formatCurrency, getStatusColor, getPriorityColor, getInitials } from "@/lib/utils";
import { useEvent } from "@/lib/data-store";
import { useEventData } from "@/lib/event-store";
import {
  ArrowLeft, Edit, MapPin, Calendar, Users, DollarSign,
  CheckCircle2, Plus, X,
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type EventModal = "timeline" | "task" | "risk" | null;

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const event = useEvent(eventId);
  const eventData = useEventData(eventId);
  const [activeTab, setActiveTab] = useState("overview");
  const [modal, setModal] = useState<EventModal>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [timelineForm, setTimelineForm] = useState<{ time: string; title: string; location: string; status: "pending" | "in_progress" | "completed" }>({ time: "09:00", title: "", location: "", status: "pending" });
  const [taskForm, setTaskForm] = useState<{ title: string; category: string; priority: "low" | "medium" | "high" | "urgent"; assignee: string; dueDate: string }>({ title: "", category: "General", priority: "medium", assignee: "John Smith", dueDate: "" });
  const [riskForm, setRiskForm] = useState<{ risk: string; likelihood: "Low" | "Medium" | "High"; impact: "Low" | "Medium" | "High"; mitigation: string; status: "Open" | "Mitigated" }>({ risk: "", likelihood: "Low", impact: "Medium", mitigation: "", status: "Open" });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-slate-500">Event not found.</p>
        <Link href="/dashboard/events" className="btn-primary">Back to Events</Link>
      </div>
    );
  }

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
  const pieColors = ["#0d9488", "#0891b2", "#0284c7", "#14b8a6", "#06b6d4", "#22d3ee", "#94a3b8"];

  const tabs = ["overview", "timeline", "budget", "tasks", "risks"];
  const statusSteps = ["Draft", "Planning", "Pre-Event", "Live", "Post-Event", "Completed"];
  const currentStep = statusSteps.findIndex((s) => s.toLowerCase().replace("-", "_").replace(" ", "_") === event.status) + 1;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/events" className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><ArrowLeft className="w-5 h-5 text-slate-400" /></Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{event.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", getStatusColor(event.status))}>{event.status.replace("_", " ")}</span>
              <span className="text-xs text-slate-500">{event.type}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-slate-100 hover:bg-slate-700 text-slate-800 text-sm rounded-lg transition-colors">Change Status</button>
          <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"><Edit className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200/50">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn("px-4 py-2.5 text-sm font-medium capitalize transition-colors relative", activeTab === tab ? "text-teal-600" : "text-slate-500 hover:text-slate-700")}>
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
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Event Progress</h3>
            <div className="flex items-center gap-2">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex items-center gap-2 flex-1">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    i < currentStep ? "bg-teal-600 text-white" : i === currentStep ? "bg-teal-600/50 text-teal-700 ring-2 ring-violet-500/50" : "bg-slate-100 text-slate-500"
                  )}>{i + 1}</div>
                  {i < statusSteps.length - 1 && <div className={cn("h-0.5 flex-1", i < currentStep ? "bg-teal-600" : "bg-slate-100")} />}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {statusSteps.map((step, i) => (
                <span key={step} className={cn("text-[9px] text-center", i < currentStep ? "text-teal-600" : "text-slate-600")} style={{ width: `${100 / statusSteps.length}%` }}>{step}</span>
              ))}
            </div>
          </div>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Venue", value: event.venueName?.split(",")[0] || "TBD", icon: MapPin, color: "text-teal-600" },
              { label: "Date", value: event.startDate, icon: Calendar, color: "text-purple-600" },
              { label: "Expected Guests", value: event.expectedGuests?.toString() || "0", icon: Users, color: "text-cyan-600" },
              { label: "Budget", value: formatCurrency(event.totalBudget), icon: DollarSign, color: "text-emerald-600" },
            ].map((m) => (
              <div key={m.label} className="glass-card p-4">
                <div className="flex items-center gap-2">
                  <m.icon className={cn("w-4 h-4", m.color)} />
                  <span className="text-xs text-slate-500">{m.label}</span>
                </div>
                <p className="text-base font-bold text-slate-900 mt-2">{m.value}</p>
              </div>
            ))}
          </div>
          {/* Tasks Summary */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Task Summary</h3>
            <div className="flex items-center gap-6">
              {[
                { label: "Completed", count: eventData.tasks.filter((t) => t.status === "completed").length, color: "text-emerald-500" },
                { label: "In Progress", count: eventData.tasks.filter((t) => t.status === "in_progress").length, color: "text-blue-500" },
                { label: "Pending", count: eventData.tasks.filter((t) => t.status === "pending").length, color: "text-amber-500" },
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
            <h3 className="text-base font-semibold text-slate-800">Event Day Timeline</h3>
            <button onClick={() => setModal("timeline")} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium px-3 py-1.5 bg-teal-50 rounded-lg"><Plus className="w-3 h-3" /> Add Item</button>
          </div>
          {eventData.timeline.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No timeline items yet. Click Add Item to create one.</p>
          ) : (
          <div className="space-y-0">
            {eventData.timeline.map((item, i) => (
              <div key={item.id} className="flex gap-4 pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={cn("w-3 h-3 rounded-full shrink-0",
                    item.status === "completed" ? "bg-emerald-500" : item.status === "in_progress" ? "bg-blue-500 animate-pulse" : "bg-slate-300"
                  )} />
                  {i < eventData.timeline.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
                </div>
                <div className="flex-1 pb-4 border-b border-slate-100 last:border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-mono font-bold text-teal-600 mr-3">{item.time}</span>
                      <span className="text-sm font-medium text-slate-800">{item.title}</span>
                    </div>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", getStatusColor(item.status))}>{item.status.replace("_", " ")}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 ml-14">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}

      {/* Budget */}
      {activeTab === "budget" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-5">
            <h3 className="text-base font-semibold text-slate-800 mb-4">Budget vs Actual</h3>
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
            <h3 className="text-base font-semibold text-slate-800 mb-4">Allocation</h3>
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
                  <span className="text-slate-700 font-mono">{formatCurrency(b.estimated)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tasks */}
      {activeTab === "tasks" && (
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200/50">
            <h3 className="text-base font-semibold text-slate-800">Tasks</h3>
            <button onClick={() => setModal("task")} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 px-3 py-1.5 bg-teal-50 rounded-lg font-medium"><Plus className="w-3 h-3" /> Add Task</button>
          </div>
          <table className="w-full">
            <thead><tr className="border-b border-slate-200/50">
              {["Task", "Category", "Priority", "Assignee", "Due Date", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {eventData.tasks.map((task) => (
                <tr key={task.id} className="border-b border-slate-100 table-row-hover">
                  <td className="px-4 py-3 text-sm text-slate-800">{task.title}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{task.category}</td>
                  <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full border", getPriorityColor(task.priority))}>{task.priority}</span></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-[8px] font-bold text-white">{getInitials(task.assignee)}</div><span className="text-xs text-slate-500">{task.assignee}</span></div></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{task.dueDate || "—"}</td>
                  <td className="px-4 py-3">
                    <select value={task.status} onChange={(e) => eventData.updateTaskStatus(task.id, e.target.value as "pending" | "in_progress" | "completed")} className="text-[10px] px-2 py-1 rounded-lg border border-slate-200 bg-white">
                      <option value="pending">pending</option>
                      <option value="in_progress">in progress</option>
                      <option value="completed">completed</option>
                    </select>
                  </td>
                </tr>
              ))}
              {eventData.tasks.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">No tasks yet. Click Add Task to create one.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Risks */}
      {activeTab === "risks" && (
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200/50">
            <h3 className="text-base font-semibold text-slate-800">Risk Assessment</h3>
            <button onClick={() => setModal("risk")} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 px-3 py-1.5 bg-teal-50 rounded-lg font-medium"><Plus className="w-3 h-3" /> Add Risk</button>
          </div>
          <table className="w-full">
            <thead><tr className="border-b border-slate-200/50">
              {["Risk", "Likelihood", "Impact", "Mitigation", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {eventData.risks.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 table-row-hover">
                  <td className="px-4 py-3 text-sm text-slate-800">{r.risk}</td>
                  <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full border",
                    r.likelihood === "High" ? "bg-red-50 text-red-600 border-red-200" : r.likelihood === "Medium" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                  )}>{r.likelihood}</span></td>
                  <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full border",
                    r.impact === "High" ? "bg-red-50 text-red-600 border-red-200" : r.impact === "Medium" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                  )}>{r.impact}</span></td>
                  <td className="px-4 py-3 text-xs text-slate-500 max-w-[200px]">{r.mitigation}</td>
                  <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full border", r.status === "Mitigated" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200")}>{r.status}</span></td>
                </tr>
              ))}
              {eventData.risks.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">No risks logged yet. Click Add Risk to create one.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {modal === "timeline" && "Add Timeline Item"}
                {modal === "task" && "Add Task"}
                {modal === "risk" && "Add Risk"}
              </h3>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            {modal === "timeline" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-slate-500 block mb-1">Time</label><input value={timelineForm.time} onChange={(e) => setTimelineForm({ ...timelineForm, time: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" placeholder="09:00" /></div>
                  <div><label className="text-xs text-slate-500 block mb-1">Status</label><select value={timelineForm.status} onChange={(e) => setTimelineForm({ ...timelineForm, status: e.target.value as "pending" | "in_progress" | "completed" })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option></select></div>
                </div>
                <div><label className="text-xs text-slate-500 block mb-1">Title *</label><input value={timelineForm.title} onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                <div><label className="text-xs text-slate-500 block mb-1">Location</label><input value={timelineForm.location} onChange={(e) => setTimelineForm({ ...timelineForm, location: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                <button onClick={() => { if (!timelineForm.title) return; eventData.addTimelineItem(timelineForm); setModal(null); setTimelineForm({ time: "09:00", title: "", location: "", status: "pending" }); showToast("Timeline item added"); }} className="btn-primary w-full justify-center">Add Item</button>
              </div>
            )}
            {modal === "task" && (
              <div className="space-y-4">
                <div><label className="text-xs text-slate-500 block mb-1">Task Title *</label><input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-slate-500 block mb-1">Category</label><input value={taskForm.category} onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                  <div><label className="text-xs text-slate-500 block mb-1">Priority</label><select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as "low" | "medium" | "high" | "urgent" })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></div>
                </div>
                <div><label className="text-xs text-slate-500 block mb-1">Due Date</label><input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                <button onClick={() => { if (!taskForm.title) return; eventData.addTask(taskForm); setModal(null); setTaskForm({ title: "", category: "General", priority: "medium", assignee: "John Smith", dueDate: "" }); showToast("Task added"); }} className="btn-primary w-full justify-center">Add Task</button>
              </div>
            )}
            {modal === "risk" && (
              <div className="space-y-4">
                <div><label className="text-xs text-slate-500 block mb-1">Risk Description *</label><input value={riskForm.risk} onChange={(e) => setRiskForm({ ...riskForm, risk: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-slate-500 block mb-1">Likelihood</label><select value={riskForm.likelihood} onChange={(e) => setRiskForm({ ...riskForm, likelihood: e.target.value as "Low" | "Medium" | "High" })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"><option>Low</option><option>Medium</option><option>High</option></select></div>
                  <div><label className="text-xs text-slate-500 block mb-1">Impact</label><select value={riskForm.impact} onChange={(e) => setRiskForm({ ...riskForm, impact: e.target.value as "Low" | "Medium" | "High" })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"><option>Low</option><option>Medium</option><option>High</option></select></div>
                </div>
                <div><label className="text-xs text-slate-500 block mb-1">Mitigation Plan</label><textarea rows={2} value={riskForm.mitigation} onChange={(e) => setRiskForm({ ...riskForm, mitigation: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
                <button onClick={() => { if (!riskForm.risk) return; eventData.addRisk(riskForm); setModal(null); setRiskForm({ risk: "", likelihood: "Low", impact: "Medium", mitigation: "", status: "Open" }); showToast("Risk added"); }} className="btn-primary w-full justify-center">Add Risk</button>
              </div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </div>
      )}
    </div>
  );
}
