"use client";

import { useState } from "react";
import Link from "next/link";
import { cn, formatCurrency, getStatusColor } from "@/lib/utils";
import { useEvents } from "@/lib/data-store";
import {
  Search, Plus, LayoutGrid, Calendar as CalIcon, Filter,
  MapPin, Users, DollarSign, Clock, ChevronLeft, ChevronRight,
} from "lucide-react";

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function EventsPage() {
  const { events } = useEvents();
  const [view, setView] = useState<"grid" | "calendar">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [calMonth, setCalMonth] = useState(6); // July
  const [calYear] = useState(2026);

  const filtered = events.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const activeCount = filtered.filter((e) => ["planning", "pre_event", "live"].includes(e.status)).length;
  const totalRevenue = filtered.reduce((s, e) => s + e.totalBudget, 0);

  // Simple calendar grid
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Events</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage all your events in one place</p>
        </div>
        <Link href="/dashboard/events/new" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30">
          <Plus className="w-4 h-4" /> Create Event
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: filtered.length.toString(), color: "text-teal-600" },
          { label: "Active Events", value: activeCount.toString(), color: "text-emerald-600" },
          { label: "Upcoming", value: filtered.filter((e) => e.status === "planning").length.toString(), color: "text-amber-600" },
          { label: "Total Budget", value: formatCurrency(totalRevenue), color: "text-pink-600" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={cn("text-xl font-bold mt-1", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-violet-500/50" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-500/50">
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="planning">Planning</option>
            <option value="pre_event">Pre-Event</option>
            <option value="live">Live</option>
            <option value="post_event">Post-Event</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
          <button onClick={() => setView("grid")} className={cn("p-1.5 rounded-md transition-colors", view === "grid" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white")}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setView("calendar")} className={cn("p-1.5 rounded-md transition-colors", view === "calendar" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white")}>
            <CalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((event) => {
            const budgetPercent = event.totalBudget > 0 ? Math.round((event.spentAmount / event.totalBudget) * 100) : 0;
            return (
              <Link key={event.id} href={`/dashboard/events/${event.id}`} className="glass-card overflow-hidden group cursor-pointer">
                {/* Cover gradient */}
                <div className="h-32 bg-gradient-to-br from-teal-600/30 via-purple-600/20 to-pink-600/10 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", getStatusColor(event.status))}>
                        {event.status === "live" && <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse" />}
                        {event.status.replace("_", " ")}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{event.type}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-slate-800 group-hover:text-teal-700 transition-colors line-clamp-1">{event.name}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><CalIcon className="w-3 h-3" />{event.startDate}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venueName?.split(",")[0]}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs">
                    <span className="flex items-center gap-1 text-slate-400"><Users className="w-3 h-3" />{event.expectedGuests}</span>
                    <span className="flex items-center gap-1 text-slate-400"><DollarSign className="w-3 h-3" />{formatCurrency(event.totalBudget)}</span>
                  </div>
                  {/* Budget progress */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-slate-500">Budget spent</span>
                      <span className={cn(budgetPercent > 90 ? "text-red-600" : "text-slate-400")}>{budgetPercent}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all", budgetPercent > 90 ? "bg-red-500" : budgetPercent > 70 ? "bg-amber-500" : "bg-violet-500")}
                        style={{ width: `${Math.min(budgetPercent, 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-200">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-[8px] font-bold text-white">
                      {event.manager ? event.manager[0] : "?"}
                    </div>
                    <span className="text-[10px] text-slate-500">{event.manager}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Calendar View */}
      {view === "calendar" && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCalMonth((p) => Math.max(0, p - 1))} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
            <h3 className="text-lg font-semibold text-slate-800">{months[calMonth]} {calYear}</h3>
            <button onClick={() => setCalMonth((p) => Math.min(11, p + 1))} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-px">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs text-slate-500 font-medium py-2">{d}</div>
            ))}
            {calDays.map((day, i) => {
              const dayEvents = day ? events.filter((e) => {
                const d = new Date(e.startDate);
                return d.getMonth() === calMonth && d.getDate() === day;
              }) : [];
              return (
                <div key={i} className={cn("min-h-[80px] p-1 border border-slate-100 rounded-md", day ? "bg-slate-50" : "bg-transparent")}>
                  {day && (
                    <>
                      <span className={cn("text-xs", day === new Date().getDate() && calMonth === new Date().getMonth() ? "text-teal-600 font-bold" : "text-slate-500")}>{day}</span>
                      {dayEvents.map((e) => (
                        <Link key={e.id} href={`/dashboard/events/${e.id}`} className="block mt-1 text-[9px] bg-violet-500/20 text-teal-700 px-1 py-0.5 rounded truncate hover:bg-teal-600/30 transition-colors">
                          {e.name}
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
