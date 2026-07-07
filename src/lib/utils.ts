import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Lead statuses
    inquiry_received: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    meeting_scheduled: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    requirement_gathered: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    budget_discussed: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    proposal_sent: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    negotiation: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    on_hold: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    // Event statuses
    draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    planning: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    pre_event: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    live: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    post_event: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    // Task statuses
    pending: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    in_progress: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    blocked: "bg-red-500/10 text-red-400 border-red-500/20",
    // RSVP
    accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    declined: "bg-red-500/10 text-red-400 border-red-500/20",
    maybe: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    no_response: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    // Invoice
    paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    overdue: "bg-red-500/10 text-red-400 border-red-500/20",
    sent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    partially_paid: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    // Generic
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    inactive: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    open: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    resolved: "bg-green-500/10 text-green-400 border-green-500/20",
    closed: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };
  return colors[status.toLowerCase().replace(/[\s-]/g, "_")] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    medium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    urgent: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return colors[priority.toLowerCase()] || colors.medium;
}
