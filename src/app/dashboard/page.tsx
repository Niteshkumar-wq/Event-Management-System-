"use client";

import { useState } from "react";
import Link from "next/link";
import { cn, formatCurrency, formatRelativeTime, getStatusColor, getInitials, getPriorityColor } from "@/lib/utils";
import { demoEvents, demoLeads, demoTasks, demoActivities, demoInvoices, demoNotifications } from "@/lib/demo-data";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  Plus,
  ChevronRight,
  Activity,
  Target,
  BarChart3,
  UserCheck,
  Eye,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Revenue trend data
const revenueData = [
  { month: "Jan", revenue: 45000, events: 3 },
  { month: "Feb", revenue: 52000, events: 4 },
  { month: "Mar", revenue: 61000, events: 5 },
  { month: "Apr", revenue: 48000, events: 3 },
  { month: "May", revenue: 72000, events: 6 },
  { month: "Jun", revenue: 89000, events: 7 },
  { month: "Jul", revenue: 95000, events: 5 },
];

// Event types breakdown
const eventTypeData = [
  { name: "Corporate", value: 35, color: "#0d9488" },
  { name: "Wedding", value: 25, color: "#0891b2" },
  { name: "Conference", value: 20, color: "#0284c7" },
  { name: "Festival", value: 10, color: "#14b8a6" },
  { name: "Other", value: 10, color: "#94a3b8" },
];

// Lead conversion funnel
const funnelData = [
  { stage: "Inquiries", count: 45 },
  { stage: "Meetings", count: 32 },
  { stage: "Proposals", count: 24 },
  { stage: "Negotiation", count: 15 },
  { stage: "Won", count: 10 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg px-3 py-2 shadow-xl border border-slate-200">
        <p className="text-xs text-slate-400">{label}</p>
        {payload.map((item: any, idx: number) => (
          <p key={idx} className="text-sm font-semibold" style={{ color: item.color }}>
            {item.name === "revenue" ? formatCurrency(item.value) : item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");

  const activeEvents = demoEvents.filter((e) => ["planning", "pre_event", "live"].includes(e.status)).length;
  const totalRevenue = demoInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const pendingTasks = demoTasks.filter((t) => t.status !== "completed").length;
  const totalLeads = demoLeads.length;

  const kpiCards = [
    {
      title: "Active Events",
      value: activeEvents.toString(),
      change: "+2 this month",
      trend: "up",
      icon: Calendar,
      gradient: "kpi-gradient-1",
      iconColor: "text-teal-600",
      link: "/dashboard/events",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: "+18.2% vs last month",
      trend: "up",
      icon: DollarSign,
      gradient: "kpi-gradient-2",
      iconColor: "text-emerald-400",
      link: "/dashboard/finance",
    },
    {
      title: "Pending Tasks",
      value: pendingTasks.toString(),
      change: "3 overdue",
      trend: "down",
      icon: CheckCircle2,
      gradient: "kpi-gradient-3",
      iconColor: "text-amber-400",
      link: "/dashboard/events",
    },
    {
      title: "Active Leads",
      value: totalLeads.toString(),
      change: formatCurrency(demoLeads.reduce((s, l) => s + (l.estimatedBudget || 0), 0)) + " pipeline",
      trend: "up",
      icon: Target,
      gradient: "kpi-gradient-4",
      iconColor: "text-pink-400",
      link: "/dashboard/crm",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Good evening, John 👋</h1>
          <p className="text-sm text-slate-500 mt-1">
            Here&apos;s what&apos;s happening across your events today.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <Link
            href="/dashboard/events/new"
            className="btn-primary justify-center sm:justify-start"
          >
            <Plus className="w-4 h-4" />
            New Event
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((card) => (
          <Link
            key={card.title}
            href={card.link}
            className={cn(
              "glass-card p-5 group cursor-pointer",
              card.gradient
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">{card.title}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {card.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-amber-400" />
                  )}
                  <span className={cn("text-xs", card.trend === "up" ? "text-emerald-400" : "text-amber-400")}>
                    {card.change}
                  </span>
                </div>
              </div>
              <div className={cn("p-2.5 rounded-xl bg-slate-100 group-hover:scale-110 transition-transform", card.iconColor)}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Revenue Overview</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                <span className="text-xs text-slate-500">Revenue</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Event Types Pie */}
        <div className="glass-card p-5">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Events by Type</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={eventTypeData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {eventTypeData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="glass rounded-lg px-3 py-2 border border-slate-200">
                        <p className="text-sm text-slate-800">{payload[0].name}: {payload[0].value}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {eventTypeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-400">{item.name}</span>
                </div>
                <span className="text-xs font-medium text-slate-700">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Funnel + Upcoming Events + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Funnel */}
        <div className="glass-card p-5">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Lead Conversion Funnel</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={funnelData} layout="vertical" barCategoryGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="stage" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming Events */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Upcoming Events</h2>
            <Link href="/dashboard/events" className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {demoEvents
              .filter((e) => e.status !== "completed")
              .slice(0, 4)
              .map((event) => (
                <Link
                  key={event.id}
                  href={`/dashboard/events/${event.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate group-hover:text-teal-700 transition-colors">
                      {event.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{event.startDate} · {event.venueName}</p>
                  </div>
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", getStatusColor(event.status))}>
                    {event.status.replace("_", " ")}
                  </span>
                </Link>
              ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Priority Tasks</h2>
            <span className="text-xs text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {pendingTasks} pending
            </span>
          </div>
          <div className="space-y-2">
            {demoTasks
              .filter((t) => t.status !== "completed")
              .slice(0, 5)
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5 shrink-0",
                    task.priority === "urgent" ? "bg-red-500" :
                    task.priority === "high" ? "bg-amber-500" :
                    task.priority === "medium" ? "bg-blue-500" : "bg-slate-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500">{task.assignee}</span>
                      <span className="text-[10px] text-slate-600">·</span>
                      <span className={cn("text-[10px]", new Date(task.dueDate) < new Date() ? "text-red-400" : "text-slate-500")}>
                        Due {task.dueDate}
                      </span>
                    </div>
                  </div>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", getStatusColor(task.status))}>
                    {task.status.replace("_", " ")}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Activity Feed + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
            <Activity className="w-4 h-4 text-slate-500" />
          </div>
          <div className="space-y-0">
            {demoActivities.map((activity, idx) => (
              <div key={activity.id} className="flex items-start gap-3 py-3 border-b border-slate-200 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500/20 to-purple-500/20 flex items-center justify-center shrink-0 text-xs font-bold text-teal-600">
                  {getInitials(activity.user)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">
                    <span className="font-medium text-slate-800">{activity.user}</span>{" "}
                    <span className="text-slate-500">{activity.action}</span>{" "}
                    <span className="text-slate-400">{activity.entity}</span>{" "}
                    <span className="text-teal-600 font-medium">{activity.entityName}</span>
                  </p>
                  {activity.detail && (
                    <p className="text-xs text-slate-500 mt-0.5">{activity.detail}</p>
                  )}
                  <p className="text-[10px] text-slate-600 mt-1">{formatRelativeTime(activity.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-card p-5">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            {[
              { label: "Events This Month", value: "5", icon: Calendar, color: "text-teal-600", bg: "bg-teal-50" },
              { label: "Guests Managed", value: "2,450", icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
              { label: "Vendors Active", value: "24", icon: UserCheck, color: "text-cyan-400", bg: "bg-cyan-500/10" },
              { label: "Check-in Rate", value: "94.2%", icon: Zap, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Avg Event Rating", value: "4.8/5", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" },
              { label: "Revenue Growth", value: "+18.2%", icon: BarChart3, color: "text-pink-400", bg: "bg-pink-500/10" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
                <p className="text-sm font-bold text-slate-800">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
