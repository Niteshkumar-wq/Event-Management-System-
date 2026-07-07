"use client";

import { useState } from "react";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { demoTravelBookings, demoAccommodations, demoTickets } from "@/lib/demo-data";
import {
  Plane,
  Hotel,
  Car,
  UtensilsCrossed,
  Crown,
  Headphones,
  ArrowRight,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

const modules = [
  {
    title: "Travel Management",
    description: "Book and track flights, trains, and transportation for guests",
    icon: Plane,
    href: "/dashboard/hospitality/travel",
    stats: { total: 12, confirmed: 8, pending: 4 },
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/20",
  },
  {
    title: "Accommodation",
    description: "Manage hotel bookings and room assignments",
    icon: Hotel,
    href: "/dashboard/hospitality/accommodation",
    stats: { total: 18, confirmed: 14, pending: 4 },
    color: "from-purple-500/20 to-purple-600/10",
    iconColor: "text-purple-400",
    borderColor: "border-purple-500/20",
  },
  {
    title: "Transportation",
    description: "Schedule shuttles, cars, and local transport",
    icon: Car,
    href: "/dashboard/hospitality/transportation",
    stats: { total: 8, confirmed: 5, pending: 3 },
    color: "from-cyan-500/20 to-cyan-600/10",
    iconColor: "text-cyan-400",
    borderColor: "border-cyan-500/20",
  },
  {
    title: "Food & Catering",
    description: "Menu planning, vendor coordination, dietary tracking",
    icon: UtensilsCrossed,
    href: "/dashboard/hospitality/catering",
    stats: { total: 6, confirmed: 4, pending: 2 },
    color: "from-amber-500/20 to-amber-600/10",
    iconColor: "text-amber-400",
    borderColor: "border-amber-500/20",
  },
  {
    title: "VIP Services",
    description: "Personalized services for VIP guests",
    icon: Crown,
    href: "/dashboard/hospitality/vip",
    stats: { total: 15, confirmed: 12, pending: 3 },
    color: "from-pink-500/20 to-pink-600/10",
    iconColor: "text-pink-400",
    borderColor: "border-pink-500/20",
  },
  {
    title: "Help Desk",
    description: "Event-day support tickets and issue resolution",
    icon: Headphones,
    href: "/dashboard/hospitality/helpdesk",
    stats: { total: 5, confirmed: 2, pending: 3 },
    color: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
  },
];

export default function HospitalityPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Hospitality Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage travel, accommodation, catering, and guest services
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: "53", icon: Users, color: "text-violet-400", change: "+8 this week" },
          { label: "Confirmed", value: "39", icon: CheckCircle2, color: "text-emerald-400", change: "73.6% rate" },
          { label: "Pending Action", value: "14", icon: Clock, color: "text-amber-400", change: "5 urgent" },
          { label: "Total Spend", value: formatCurrency(48500), icon: TrendingUp, color: "text-pink-400", change: "Under budget" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className="text-xl font-bold text-slate-100 mt-1">{stat.value}</p>
                <p className="text-[10px] text-slate-500 mt-1">{stat.change}</p>
              </div>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
          </div>
        ))}
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod) => (
          <Link
            key={mod.title}
            href={mod.href}
            className={cn(
              "glass-card p-5 group cursor-pointer relative overflow-hidden",
            )}
          >
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", mod.color)} />
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className={cn("p-2.5 rounded-xl bg-slate-800/50", mod.iconColor)}>
                  <mod.icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-base font-semibold text-slate-200 mt-3">{mod.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{mod.description}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-slate-200">{mod.stats.total}</span>
                  <span className="text-[10px] text-slate-500">total</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-emerald-400">{mod.stats.confirmed} confirmed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="text-[10px] text-amber-400">{mod.stats.pending} pending</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Travel */}
        <div className="glass-card p-5">
          <h2 className="text-base font-semibold text-slate-200 mb-4">Recent Travel Bookings</h2>
          <div className="space-y-3">
            {demoTravelBookings.map((booking) => (
              <div key={booking.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/30">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Plane className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">{booking.guestName}</p>
                  <p className="text-xs text-slate-500">{booking.route}</p>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full border",
                    booking.status === "Confirmed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    booking.status === "Booked" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                    "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  )}>
                    {booking.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{formatCurrency(booking.cost)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Desk Tickets */}
        <div className="glass-card p-5">
          <h2 className="text-base font-semibold text-slate-200 mb-4">Active Help Desk Tickets</h2>
          <div className="space-y-3">
            {demoTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/30">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-2 shrink-0",
                  ticket.priority === "urgent" ? "bg-red-500 animate-pulse" : "bg-amber-500"
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">{ticket.subject}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{ticket.eventName} · {ticket.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-600">Reported by: {ticket.reportedBy}</span>
                    {ticket.assignedTo && (
                      <span className="text-[10px] text-slate-600">→ {ticket.assignedTo}</span>
                    )}
                  </div>
                </div>
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full border shrink-0",
                  ticket.status === "Resolved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  ticket.status === "In Progress" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                  "bg-amber-500/10 text-amber-400 border-amber-500/20"
                )}>
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
