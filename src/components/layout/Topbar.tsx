"use client";

import { useState } from "react";
import Link from "next/link";
import { cn, formatRelativeTime } from "@/lib/utils";
import { demoNotifications } from "@/lib/demo-data";
import {
  Bell, Search, ChevronDown, LogOut, User, Settings, HelpCircle,
  X, Info, AlertTriangle, CheckCircle2, Command, Plus,
} from "lucide-react";

export function Topbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const unreadCount = demoNotifications.filter((n) => !n.isRead).length;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#060c1a]/80 backdrop-blur-xl border-b border-slate-800/30 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className={cn(
          "relative max-w-md w-full transition-all duration-300",
          searchFocused && "max-w-lg"
        )}>
          <Search className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
            searchFocused ? "text-violet-400" : "text-slate-600"
          )} />
          <input
            type="text"
            placeholder="Search events, guests, vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full bg-slate-900/40 border border-slate-800/40 rounded-xl pl-10 pr-20 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:flex items-center gap-0.5 text-[9px] text-slate-600 bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-700/30">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </div>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-14 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 transition-colors" />
            </button>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        {/* Quick action */}
        <Link href="/dashboard/events/new" className="p-2 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/5 transition-all" title="Quick Create">
          <Plus className="w-5 h-5" />
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/40 transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-br from-red-500 to-rose-600 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-lg shadow-red-500/30">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-[380px] bg-[#0a1128]/95 backdrop-blur-2xl rounded-2xl border border-slate-800/40 shadow-2xl shadow-black/50 overflow-hidden animate-slide-up">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/30">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Notifications</h3>
                  <p className="text-[10px] text-slate-600">{unreadCount} unread</p>
                </div>
                <button className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-wider font-semibold">
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {demoNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      "flex gap-3 px-5 py-3.5 border-b border-slate-800/20 hover:bg-slate-800/20 transition-colors cursor-pointer",
                      !notif.isRead && "bg-violet-500/[0.03]"
                    )}
                  >
                    <div className="mt-0.5 shrink-0">{getNotifIcon(notif.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-slate-200 leading-snug">{notif.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{notif.message}</p>
                      <p className="text-[9px] text-slate-600 mt-1.5 uppercase tracking-wider">{formatRelativeTime(notif.createdAt)}</p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-2 shrink-0 shadow-sm shadow-violet-500/50" />
                    )}
                  </div>
                ))}
              </div>
              <div className="px-5 py-2.5 border-t border-slate-800/30 bg-slate-900/20">
                <button className="w-full text-center text-[11px] text-violet-400 hover:text-violet-300 py-1 font-medium transition-colors">
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-7 bg-slate-800/40 mx-1.5" />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-800/20 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 via-violet-600 to-purple-700 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-violet-500/20">
              JS
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[13px] font-medium text-slate-200 leading-tight">John Smith</p>
              <p className="text-[10px] text-slate-600">Event Director</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-600 hidden md:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-[#0a1128]/95 backdrop-blur-2xl rounded-2xl border border-slate-800/40 shadow-2xl shadow-black/50 overflow-hidden animate-slide-up">
              <div className="px-4 py-3.5 border-b border-slate-800/30">
                <p className="text-[13px] font-medium text-slate-200">John Smith</p>
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
                    className="flex items-center gap-3 px-3 py-2 text-[13px] text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-all rounded-lg"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-slate-800/30 py-1.5 px-1.5">
                <button className="flex items-center gap-3 px-3 py-2 text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all rounded-lg w-full">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside handler */}
      {(notifOpen || profileOpen) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => { setNotifOpen(false); setProfileOpen(false); }}
        />
      )}
    </header>
  );
}
