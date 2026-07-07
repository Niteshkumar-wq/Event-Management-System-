"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Calendar, UserCheck, Hotel, Store,
  UsersRound, Package, DollarSign, MessageSquare, FileText,
  BarChart3, TrendingUp, Sparkles, Settings, ChevronDown,
  ChevronLeft, ChevronRight, Zap,
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
      { title: "Travel", href: "/dashboard/hospitality/travel" },
      { title: "Accommodation", href: "/dashboard/hospitality/accommodation" },
      { title: "Transportation", href: "/dashboard/hospitality/transportation" },
      { title: "Catering", href: "/dashboard/hospitality/catering" },
      { title: "VIP Services", href: "/dashboard/hospitality/vip" },
      { title: "Help Desk", href: "/dashboard/hospitality/helpdesk" },
    ],
  },
  {
    title: "Vendors", href: "/dashboard/vendors", icon: "Store",
    children: [
      { title: "Directory", href: "/dashboard/vendors" },
      { title: "Contracts", href: "/dashboard/vendors/contracts" },
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
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-slate-800/40 transition-all duration-300 ease-in-out flex flex-col",
        "bg-[#060c1a]/90 backdrop-blur-xl",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800/40 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-violet-600 to-purple-700 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-lg font-bold gradient-text tracking-tight">EventPro</span>
            <span className="text-[10px] text-slate-600 -mt-0.5 tracking-wider uppercase">Management Suite</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-0.5">
        {/* Section labels */}
        {!collapsed && <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600 px-3 pb-2">Main Menu</p>}

        {navItems.slice(0, 3).map((item) => renderNavItem(item, pathname, collapsed, expandedItems, toggleExpand, isActive))}

        {!collapsed && <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600 px-3 pt-4 pb-2">Management</p>}

        {navItems.slice(3, 10).map((item) => renderNavItem(item, pathname, collapsed, expandedItems, toggleExpand, isActive))}

        {!collapsed && <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600 px-3 pt-4 pb-2">Intelligence</p>}

        {navItems.slice(10).map((item) => renderNavItem(item, pathname, collapsed, expandedItems, toggleExpand, isActive))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-slate-800/40 p-2.5 shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-slate-800/30 transition-all text-xs"
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
  isActive: (href: string) => boolean
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
          if (hasChildren && !collapsed) {
            toggleExpand(item.title);
          }
        }}
      >
        {hasChildren && !collapsed ? (
          <>
            <Icon
              className={cn(
                "w-[18px] h-[18px] shrink-0 transition-colors",
                active ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"
              )}
            />
            <span
              className={cn(
                "text-[13px] font-medium flex-1 transition-colors",
                active ? "text-violet-300" : "text-slate-400 group-hover:text-slate-200"
              )}
            >
              {item.title}
            </span>
            {item.badge && (
              <span className="text-[9px] font-bold bg-violet-500/15 text-violet-400 px-1.5 py-0.5 rounded-md min-w-[18px] text-center">
                {item.badge}
              </span>
            )}
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-slate-600 transition-transform duration-200",
                expanded && "rotate-180"
              )}
            />
          </>
        ) : (
          <Link href={item.href} className="flex items-center gap-3 w-full">
            <Icon
              className={cn(
                "w-[18px] h-[18px] shrink-0 transition-colors",
                active ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"
              )}
            />
            {!collapsed && (
              <>
                <span
                  className={cn(
                    "text-[13px] font-medium flex-1 transition-colors",
                    active ? "text-violet-300" : "text-slate-400 group-hover:text-slate-200"
                  )}
                >
                  {item.title}
                </span>
                {item.badge && (
                  <span className="text-[9px] font-bold bg-violet-500/15 text-violet-400 px-1.5 py-0.5 rounded-md min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        )}
      </div>

      {/* Sub-items */}
      {hasChildren && expanded && !collapsed && (
        <div className="ml-[30px] mt-0.5 space-y-0.5 border-l border-slate-800/30 pl-3 py-0.5">
          {item.children!.map((child) => {
            const childActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block text-[12px] py-1.5 px-2.5 rounded-lg transition-all",
                  childActive
                    ? "text-violet-400 bg-violet-500/10 font-medium"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/20"
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
