"use client";

import { useState } from "react";
import Link from "next/link";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useSidebar } from "@/app/dashboard/layout";
import { demoNotifications } from "@/lib/demo-data";
import {
  Bell, Search, ChevronDown, LogOut, User, Settings, HelpCircle,
  X, Info, AlertTriangle, CheckCircle2, Command, Plus, Menu,
} from "lucide-react";

export function Topbar() {
  const { setMobileOpen } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const unreadCount = demoNotifications.filter((n) => !n.isRead).length;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      {/* Left: mobile menu + search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-all shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className={cn(
          "relative flex-1 max-w-md transition-all duration-300",
          searchFocused && "max-w-lg"
        )}>
          <Search className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
            searchFocused ? "text-teal-500" : "text-slate-400"
          )} />
          <input
            type="text"
            placeholder="Search events, guests, vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
            <kbd className="items-center gap-0.5 text-[9px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </div>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 sm:right-14 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors" />
            </button>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-2">
        <Link
          href="/dashboard/events/new"
          className="p-2 rounded-xl text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-all"
          title="Quick Create"
        >
          <Plus className="w-5 h-5" />
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-[min(380px,calc(100vw-2rem))] bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-slide-up">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                  <p className="text-[10px] text-slate-400">{unreadCount} unread</p>
                </div>
                <button className="text-[10px] text-teal-600 hover:text-teal-700 transition-colors uppercase tracking-wider font-semibold">
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {demoNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      "flex gap-3 px-5 py-3.5 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer",
                      !notif.isRead && "bg-teal-50/50"
                    )}
                  >
                    <div className="mt-0.5 shrink-0">{getNotifIcon(notif.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-slate-800 leading-snug">{notif.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{notif.message}</p>
                      <p className="text-[9px] text-slate-400 mt-1.5 uppercase tracking-wider">{formatRelativeTime(notif.createdAt)}</p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
              <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50">
                <button className="w-full text-center text-[11px] text-teal-600 hover:text-teal-700 py-1 font-medium transition-colors">
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-7 bg-slate-200 mx-1 hidden sm:block" />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              JS
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[13px] font-medium text-slate-800 leading-tight">John Smith</p>
              <p className="text-[10px] text-slate-400">Event Director</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-slide-up">
              <div className="px-4 py-3.5 border-b border-slate-100">
                <p className="text-[13px] font-medium text-slate-800">John Smith</p>
                <p className="text-[11px] text-slate-500">john@eventpro.com</p>
              </div>
              <div className="py-1.5 px-1.5">
                {[
                  { icon: User, label: "Profile", href: "/dashboard/settings" },
                  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
                  { icon: HelpCircle, label: "Help & Support", href: "#" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all rounded-lg"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-slate-100 py-1.5 px-1.5">
                <button className="flex items-center gap-3 px-3 py-2 text-[13px] text-red-500 hover:text-red-600 hover:bg-red-50 transition-all rounded-lg w-full">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {(notifOpen || profileOpen) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => { setNotifOpen(false); setProfileOpen(false); }}
        />
      )}
    </header>
  );
}
