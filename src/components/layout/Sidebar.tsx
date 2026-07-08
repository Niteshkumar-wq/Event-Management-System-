"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/app/dashboard/layout";
import {
  LayoutDashboard, Users, Calendar, UserCheck, Hotel, Store,
  UsersRound, Package, DollarSign, MessageSquare, FileText,
  BarChart3, TrendingUp, Sparkles, Settings, ChevronDown,
  ChevronLeft, ChevronRight, Zap, X,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Users, Calendar, UserCheck, Hotel, Store,
  UsersRound, Package, DollarSign, MessageSquare, FileText,
  BarChart3, TrendingUp, Sparkles, Settings,
};

interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  {
    title: "CRM", href: "/dashboard/crm", icon: "Users", badge: "5",
    children: [
      { title: "Lead Pipeline", href: "/dashboard/crm" },
      { title: "New Lead", href: "/dashboard/crm/new" },
    ],
  },
  {
    title: "Events", href: "/dashboard/events", icon: "Calendar", badge: "3",
    children: [
      { title: "All Events", href: "/dashboard/events" },
      { title: "Create Event", href: "/dashboard/events/new" },
    ],
  },
  {
    title: "Guests", href: "/dashboard/guests", icon: "UserCheck",
    children: [
      { title: "Guest Database", href: "/dashboard/guests" },
      { title: "Invitations", href: "/dashboard/guests/invitations" },
      { title: "RSVP Tracking", href: "/dashboard/guests/rsvp" },
      { title: "Seating", href: "/dashboard/guests/seating" },
      { title: "Check-in", href: "/dashboard/guests/checkin" },
    ],
  },
  {
    title: "Hospitality", href: "/dashboard/hospitality", icon: "Hotel",
    children: [
      { title: "Overview", href: "/dashboard/hospitality" },
    ],
  },
  {
    title: "Vendors", href: "/dashboard/vendors", icon: "Store",
    children: [
      { title: "Directory", href: "/dashboard/vendors" },
    ],
  },
  { title: "Teams", href: "/dashboard/teams", icon: "UsersRound" },
  { title: "Inventory", href: "/dashboard/inventory", icon: "Package" },
  {
    title: "Finance", href: "/dashboard/finance", icon: "DollarSign",
    children: [
      { title: "Overview", href: "/dashboard/finance" },
      { title: "Invoices", href: "/dashboard/finance/invoices" },
      { title: "Payments", href: "/dashboard/finance/payments" },
      { title: "Expenses", href: "/dashboard/finance/expenses" },
    ],
  },
  { title: "Communication", href: "/dashboard/communication", icon: "MessageSquare" },
  { title: "Documents", href: "/dashboard/documents", icon: "FileText" },
  { title: "Reports", href: "/dashboard/reports", icon: "BarChart3" },
  { title: "Analytics", href: "/dashboard/analytics", icon: "TrendingUp" },
  { title: "AI Assistant", href: "/dashboard/ai-assistant", icon: "Sparkles" },
  { title: "Settings", href: "/dashboard/settings", icon: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children?.some((c) => pathname.startsWith(c.href) || pathname === item.href)) {
        setExpandedItems((prev) => prev.includes(item.title) ? prev : [...prev, item.title]);
      }
    });
  }, [pathname]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col bg-white shadow-sm",
        collapsed ? "w-[72px]" : "w-[260px]",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between gap-3 px-4 h-16 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shrink-0 shadow-md shadow-teal-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-lg font-bold gradient-text tracking-tight">EventPro</span>
              <span className="text-[10px] text-slate-400 -mt-0.5 tracking-wider uppercase">Management Suite</span>
            </div>
          )}
        </div>
        <button
          onClick={closeMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-0.5">
        {!collapsed && <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-3 pb-2">Main Menu</p>}
        {navItems.slice(0, 3).map((item) => renderNavItem(item, pathname, collapsed, expandedItems, toggleExpand, isActive, closeMobile))}

        {!collapsed && <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-3 pt-4 pb-2">Management</p>}
        {navItems.slice(3, 10).map((item) => renderNavItem(item, pathname, collapsed, expandedItems, toggleExpand, isActive, closeMobile))}

        {!collapsed && <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-3 pt-4 pb-2">Intelligence</p>}
        {navItems.slice(10).map((item) => renderNavItem(item, pathname, collapsed, expandedItems, toggleExpand, isActive, closeMobile))}
      </nav>

      {/* Collapse toggle — desktop only */}
      <div className="border-t border-slate-200 p-2.5 shrink-0 hidden lg:block">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all text-xs font-medium"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

function renderNavItem(
  item: NavItem,
  pathname: string,
  collapsed: boolean,
  expandedItems: string[],
  toggleExpand: (title: string) => void,
  isActive: (href: string) => boolean,
  closeMobile: () => void
) {
  const Icon = iconMap[item.icon] || LayoutDashboard;
  const active = isActive(item.href);
  const expanded = expandedItems.includes(item.title);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div key={item.title}>
      <div
        className={cn(
          "sidebar-item flex items-center gap-3 cursor-pointer group",
          active && "active"
        )}
        onClick={() => {
          if (hasChildren && !collapsed) toggleExpand(item.title);
        }}
      >
        {hasChildren && !collapsed ? (
          <>
            <Icon className={cn("w-[18px] h-[18px] shrink-0 transition-colors", active ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600")} />
            <span className={cn("text-[13px] font-medium flex-1 transition-colors", active ? "text-teal-700" : "text-slate-600 group-hover:text-slate-900")}>
              {item.title}
            </span>
            {item.badge && (
              <span className="text-[9px] font-bold bg-teal-50 text-teal-600 px-1.5 py-0.5 rounded-md min-w-[18px] text-center border border-teal-100">
                {item.badge}
              </span>
            )}
            <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", expanded && "rotate-180")} />
          </>
        ) : (
          <Link href={item.href} className="flex items-center gap-3 w-full" onClick={closeMobile}>
            <Icon className={cn("w-[18px] h-[18px] shrink-0 transition-colors", active ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600")} />
            {!collapsed && (
              <>
                <span className={cn("text-[13px] font-medium flex-1 transition-colors", active ? "text-teal-700" : "text-slate-600 group-hover:text-slate-900")}>
                  {item.title}
                </span>
                {item.badge && (
                  <span className="text-[9px] font-bold bg-teal-50 text-teal-600 px-1.5 py-0.5 rounded-md min-w-[18px] text-center border border-teal-100">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        )}
      </div>

      {hasChildren && expanded && !collapsed && (
        <div className="ml-[30px] mt-0.5 space-y-0.5 border-l border-slate-200 pl-3 py-0.5">
          {item.children!.map((child) => {
            const childActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={closeMobile}
                className={cn(
                  "block text-[12px] py-1.5 px-2.5 rounded-lg transition-all",
                  childActive
                    ? "text-teal-700 bg-teal-50 font-medium"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                {child.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}