"use client";
import { cn, formatCurrency } from "@/lib/utils";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";
import { TrendingUp, Users, Calendar, DollarSign, Clock, CheckCircle2, Percent, BarChart3 } from "lucide-react";

const satisfactionData = [
  { month: "Jan", score: 4.2 }, { month: "Feb", score: 4.5 }, { month: "Mar", score: 4.3 },
  { month: "Apr", score: 4.6 }, { month: "May", score: 4.7 }, { month: "Jun", score: 4.8 }, { month: "Jul", score: 4.9 },
];

const guestGrowth = [
  { month: "Jan", guests: 320 }, { month: "Feb", guests: 450 }, { month: "Mar", guests: 580 },
  { month: "Apr", guests: 420 }, { month: "May", guests: 750 }, { month: "Jun", guests: 920 }, { month: "Jul", guests: 1050 },
];

const taskCompletion = [
  { name: "On Time", value: 72, color: "#10b981" },
  { name: "Late", value: 18, color: "#f59e0b" },
  { name: "Overdue", value: 10, color: "#ef4444" },
];

const budgetAccuracy = [
  { event: "NexGen Launch", estimated: 180000, actual: 165000 },
  { event: "Music Fest", estimated: 450000, actual: 430000 },
  { event: "Awards Night", estimated: 120000, actual: 118000 },
  { event: "Tech Conf", estimated: 200000, actual: 195000 },
  { event: "Charity Gala", estimated: 75000, actual: 72000 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-slate-900">Analytics</h1><p className="text-sm text-slate-500 mt-0.5">Deep insights into your event operations</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg Satisfaction", value: "4.6/5", icon: TrendingUp, color: "text-emerald-400", change: "+0.3 vs last quarter" },
          { label: "Guest Retention", value: "78%", icon: Users, color: "text-teal-600", change: "+5% YoY" },
          { label: "On-time Delivery", value: "92%", icon: Clock, color: "text-cyan-400", change: "+3% vs last month" },
          { label: "Budget Accuracy", value: "96.2%", icon: Percent, color: "text-amber-400", change: "Avg across events" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-500">{s.label}</p><p className={cn("text-xl font-bold mt-1", s.color)}>{s.value}</p><p className="text-[10px] text-slate-500 mt-1">{s.change}</p></div>
              <s.icon className={cn("w-5 h-5", s.color)} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Guest Satisfaction Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={satisfactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <YAxis domain={[3.5, 5]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "#060c1a", border: "1px solid rgba(51,65,85,0.3)", borderRadius: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-5">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Guest Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={guestGrowth}>
              <defs><linearGradient id="guestG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="100%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "#060c1a", border: "1px solid rgba(51,65,85,0.3)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="guests" stroke="#6366f1" fill="url(#guestG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Task Completion</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart><Pie data={taskCompletion} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={3} dataKey="value">{taskCompletion.map((d, i) => <Cell key={i} fill={d.color} />)}</Pie></PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">{taskCompletion.map((c) => (<div key={c.name} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} /><span className="text-xs text-slate-400">{c.name}</span></div><span className="text-xs text-slate-700">{c.value}%</span></div>))}</div>
        </div>
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Budget Accuracy by Event</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={budgetAccuracy}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="event" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "#060c1a", border: "1px solid rgba(51,65,85,0.3)", borderRadius: 12 }} />
              <Bar dataKey="estimated" fill="#6366f1" radius={[4, 4, 0, 0]} name="Estimated" />
              <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
