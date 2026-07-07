// ==========================================
// CONSTANTS FOR THE EVENT MANAGEMENT PLATFORM
// ==========================================

export const APP_NAME = "EventPro";
export const APP_DESCRIPTION = "Professional Event Management Platform";

// Navigation items for sidebar
export const SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    roles: ["all"],
  },
  {
    title: "CRM",
    href: "/dashboard/crm",
    icon: "Users",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "EVENT_DIRECTOR", "EVENT_MANAGER"],
    children: [
      { title: "Leads", href: "/dashboard/crm" },
      { title: "New Lead", href: "/dashboard/crm/new" },
    ],
  },
  {
    title: "Events",
    href: "/dashboard/events",
    icon: "Calendar",
    roles: ["all"],
    children: [
      { title: "All Events", href: "/dashboard/events" },
      { title: "New Event", href: "/dashboard/events/new" },
    ],
  },
  {
    title: "Guests",
    href: "/dashboard/guests",
    icon: "UserCheck",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "EVENT_DIRECTOR", "EVENT_MANAGER", "GUEST_MANAGER"],
    children: [
      { title: "Guest Database", href: "/dashboard/guests" },
      { title: "Invitations", href: "/dashboard/guests/invitations" },
      { title: "RSVP Tracking", href: "/dashboard/guests/rsvp" },
      { title: "Seating", href: "/dashboard/guests/seating" },
      { title: "Check-in", href: "/dashboard/guests/checkin" },
    ],
  },
  {
    title: "Hospitality",
    href: "/dashboard/hospitality",
    icon: "Hotel",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "EVENT_DIRECTOR", "EVENT_MANAGER", "HOSPITALITY_MANAGER"],
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
    title: "Vendors",
    href: "/dashboard/vendors",
    icon: "Store",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "EVENT_DIRECTOR", "EVENT_MANAGER", "VENDOR_MANAGER"],
    children: [
      { title: "Directory", href: "/dashboard/vendors" },
      { title: "Contracts", href: "/dashboard/vendors/contracts" },
    ],
  },
  {
    title: "Teams",
    href: "/dashboard/teams",
    icon: "UsersRound",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "EVENT_DIRECTOR", "EVENT_MANAGER", "OPERATIONS_MANAGER", "TEAM_LEADER"],
  },
  {
    title: "Inventory",
    href: "/dashboard/inventory",
    icon: "Package",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "EVENT_DIRECTOR", "EVENT_MANAGER", "OPERATIONS_MANAGER"],
  },
  {
    title: "Finance",
    href: "/dashboard/finance",
    icon: "DollarSign",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "EVENT_DIRECTOR", "FINANCE_MANAGER"],
    children: [
      { title: "Overview", href: "/dashboard/finance" },
      { title: "Invoices", href: "/dashboard/finance/invoices" },
      { title: "Payments", href: "/dashboard/finance/payments" },
      { title: "Expenses", href: "/dashboard/finance/expenses" },
      { title: "Budgets", href: "/dashboard/finance/budgets" },
    ],
  },
  {
    title: "Communication",
    href: "/dashboard/communication",
    icon: "MessageSquare",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "EVENT_DIRECTOR", "EVENT_MANAGER"],
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
    icon: "FileText",
    roles: ["all"],
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: "BarChart3",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "EVENT_DIRECTOR", "EVENT_MANAGER", "FINANCE_MANAGER"],
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: "TrendingUp",
    roles: ["SUPER_ADMIN", "ORG_ADMIN", "EVENT_DIRECTOR"],
  },
  {
    title: "AI Assistant",
    href: "/dashboard/ai-assistant",
    icon: "Sparkles",
    roles: ["all"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "Settings",
    roles: ["SUPER_ADMIN", "ORG_ADMIN"],
  },
] as const;

// Event types
export const EVENT_TYPES = [
  "Wedding",
  "Corporate Event",
  "Conference",
  "Exhibition",
  "Concert",
  "Gala Dinner",
  "Product Launch",
  "Award Ceremony",
  "Festival",
  "Seminar",
  "Workshop",
  "Team Building",
  "Birthday Party",
  "Anniversary",
  "Fundraiser",
  "Other",
] as const;

// Lead sources
export const LEAD_SOURCES = [
  "Website",
  "Referral",
  "Social Media",
  "Cold Call",
  "Email",
  "Walk-in",
  "Partner",
  "Other",
] as const;

// Budget categories
export const BUDGET_CATEGORIES = [
  "Venue",
  "Catering",
  "Decoration",
  "Entertainment",
  "Photography",
  "Videography",
  "Audio/Visual",
  "Lighting",
  "Transportation",
  "Accommodation",
  "Printing",
  "Gifts/Favors",
  "Security",
  "Staffing",
  "Marketing",
  "Insurance",
  "Permits",
  "Miscellaneous",
] as const;

// Vendor categories
export const VENDOR_CATEGORIES = [
  "Catering",
  "Decoration",
  "Photography",
  "Videography",
  "Audio/Visual",
  "Lighting",
  "Entertainment",
  "Florist",
  "Furniture Rental",
  "Transportation",
  "Security",
  "Printing",
  "Staffing",
  "Technology",
  "Other",
] as const;

// Meal types
export const MEAL_TYPES = [
  "Breakfast",
  "Brunch",
  "Lunch",
  "High Tea",
  "Dinner",
  "Cocktails",
  "Snacks",
  "Full Service",
] as const;

// User roles
export const USER_ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ORG_ADMIN", label: "Organization Admin" },
  { value: "EVENT_DIRECTOR", label: "Event Director" },
  { value: "EVENT_MANAGER", label: "Event Manager" },
  { value: "HOSPITALITY_MANAGER", label: "Hospitality Manager" },
  { value: "GUEST_MANAGER", label: "Guest Manager" },
  { value: "FINANCE_MANAGER", label: "Finance Manager" },
  { value: "VENDOR_MANAGER", label: "Vendor Manager" },
  { value: "OPERATIONS_MANAGER", label: "Operations Manager" },
  { value: "TEAM_LEADER", label: "Team Leader" },
  { value: "STAFF_MEMBER", label: "Staff Member" },
  { value: "CLIENT_PORTAL_USER", label: "Client Portal User" },
] as const;
