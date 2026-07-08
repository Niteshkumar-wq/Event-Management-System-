// ==========================================
// DEMO DATA FOR ALL MODULES
// Realistic data for the Event Management Platform
// ==========================================

import { generateId } from "@/lib/utils";

// ---- LEADS ----
export const demoLeads = [
  {
    id: "lead-1",
    title: "Annual Corporate Gala 2026",
    clientName: "Sarah Mitchell",
    clientEmail: "sarah@techcorp.com",
    clientPhone: "+1 (555) 123-4567",
    clientCompany: "TechCorp Industries",
    source: "Website" as const,
    status: "proposal_sent" as const,
    priority: "high" as const,
    eventType: "Corporate Event",
    estimatedBudget: 85000,
    estimatedGuests: 300,
    eventDate: "2026-09-15",
    eventLocation: "Grand Ballroom, Marriott Downtown",
    nextFollowUp: "2026-07-10",
    assignedTo: "John Smith",
    createdAt: "2026-06-20",
  },
  {
    id: "lead-2",
    title: "Williams-Chen Wedding",
    clientName: "Emily Williams",
    clientEmail: "emily.w@gmail.com",
    clientPhone: "+1 (555) 234-5678",
    clientCompany: "",
    source: "Referral" as const,
    status: "requirement_gathered" as const,
    priority: "medium" as const,
    eventType: "Wedding",
    estimatedBudget: 120000,
    estimatedGuests: 200,
    eventDate: "2026-11-22",
    eventLocation: "Sunset Gardens Estate",
    nextFollowUp: "2026-07-08",
    assignedTo: "Lisa Park",
    createdAt: "2026-06-25",
  },
  {
    id: "lead-3",
    title: "Global Tech Summit 2026",
    clientName: "David Nakamura",
    clientEmail: "d.nakamura@innovate.io",
    clientPhone: "+1 (555) 345-6789",
    clientCompany: "Innovate.io",
    source: "Cold Call" as const,
    status: "inquiry_received" as const,
    priority: "urgent" as const,
    eventType: "Conference",
    estimatedBudget: 250000,
    estimatedGuests: 1500,
    eventDate: "2026-10-05",
    eventLocation: "Convention Center",
    nextFollowUp: "2026-07-09",
    assignedTo: "John Smith",
    createdAt: "2026-07-01",
  },
  {
    id: "lead-4",
    title: "Charity Fundraiser Gala",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@hopefoundation.org",
    clientPhone: "+1 (555) 456-7890",
    clientCompany: "Hope Foundation",
    source: "Partner" as const,
    status: "budget_discussed" as const,
    priority: "medium" as const,
    eventType: "Fundraiser",
    estimatedBudget: 65000,
    estimatedGuests: 250,
    eventDate: "2026-12-01",
    eventLocation: "Riverside Pavilion",
    nextFollowUp: "2026-07-12",
    assignedTo: "Lisa Park",
    createdAt: "2026-06-28",
  },
  {
    id: "lead-5",
    title: "Product Launch - Series X",
    clientName: "Alex Turner",
    clientEmail: "alex.t@nexgen.co",
    clientPhone: "+1 (555) 567-8901",
    clientCompany: "NexGen Electronics",
    source: "Social Media" as const,
    status: "approved" as const,
    priority: "high" as const,
    eventType: "Product Launch",
    estimatedBudget: 180000,
    estimatedGuests: 500,
    eventDate: "2026-08-20",
    eventLocation: "The Grand Exhibit Hall",
    nextFollowUp: "2026-07-08",
    assignedTo: "John Smith",
    createdAt: "2026-06-15",
  },
  {
    id: "lead-6",
    title: "Leadership Summit 2026",
    clientName: "Patricia Wong",
    clientEmail: "p.wong@enterprise.com",
    clientPhone: "+1 (555) 678-9012",
    clientCompany: "Enterprise Solutions",
    source: "Email" as const,
    status: "meeting_scheduled" as const,
    priority: "low" as const,
    eventType: "Seminar",
    estimatedBudget: 45000,
    estimatedGuests: 100,
    eventDate: "2026-11-10",
    eventLocation: "Business Center Auditorium",
    nextFollowUp: "2026-07-15",
    assignedTo: "Lisa Park",
    createdAt: "2026-07-03",
  },
  {
    id: "lead-7",
    title: "New Year's Eve Celebration",
    clientName: "James Morrison",
    clientEmail: "james@eliteevents.com",
    clientPhone: "+1 (555) 789-0123",
    clientCompany: "Elite Social Club",
    source: "Walk-in" as const,
    status: "negotiation" as const,
    priority: "high" as const,
    eventType: "Gala Dinner",
    estimatedBudget: 150000,
    estimatedGuests: 400,
    eventDate: "2026-12-31",
    eventLocation: "Skyline Rooftop Venue",
    nextFollowUp: "2026-07-11",
    assignedTo: "John Smith",
    createdAt: "2026-06-22",
  },
];

// ---- EVENTS ----
export const demoEvents = [
  {
    id: "evt-1",
    name: "NexGen Series X Launch",
    type: "Product Launch",
    status: "planning" as const,
    startDate: "2026-08-20",
    endDate: "2026-08-20",
    venueName: "The Grand Exhibit Hall",
    venueCapacity: 600,
    manager: "John Smith",
    expectedGuests: 500,
    actualGuests: 0,
    totalBudget: 180000,
    spentAmount: 45000,
    coverImage: "",
    tags: ["Tech", "Launch", "VIP"],
    createdAt: "2026-06-15",
  },
  {
    id: "evt-2",
    name: "TechCorp Annual Gala 2025",
    type: "Corporate Event",
    status: "completed" as const,
    startDate: "2025-09-15",
    endDate: "2025-09-15",
    venueName: "Grand Ballroom, Marriott Downtown",
    venueCapacity: 350,
    manager: "Lisa Park",
    expectedGuests: 280,
    actualGuests: 265,
    totalBudget: 75000,
    spentAmount: 72500,
    coverImage: "",
    tags: ["Corporate", "Annual"],
    createdAt: "2025-06-10",
  },
  {
    id: "evt-3",
    name: "Summer Music Festival",
    type: "Festival",
    status: "pre_event" as const,
    startDate: "2026-07-25",
    endDate: "2026-07-27",
    venueName: "Lakeside Park Amphitheater",
    venueCapacity: 5000,
    manager: "John Smith",
    expectedGuests: 3000,
    actualGuests: 0,
    totalBudget: 350000,
    spentAmount: 280000,
    coverImage: "",
    tags: ["Music", "Outdoor", "Festival"],
    createdAt: "2026-01-15",
  },
  {
    id: "evt-4",
    name: "Green Energy Conference",
    type: "Conference",
    status: "planning" as const,
    startDate: "2026-09-10",
    endDate: "2026-09-12",
    venueName: "Innovation Hub Center",
    venueCapacity: 800,
    manager: "Lisa Park",
    expectedGuests: 600,
    actualGuests: 0,
    totalBudget: 200000,
    spentAmount: 35000,
    coverImage: "",
    tags: ["Conference", "Green", "Energy"],
    createdAt: "2026-04-20",
  },
  {
    id: "evt-5",
    name: "Elite Awards Night 2026",
    type: "Award Ceremony",
    status: "live" as const,
    startDate: "2026-07-07",
    endDate: "2026-07-07",
    venueName: "Crystal Ballroom, The Ritz",
    venueCapacity: 400,
    manager: "John Smith",
    expectedGuests: 350,
    actualGuests: 310,
    totalBudget: 120000,
    spentAmount: 118000,
    coverImage: "",
    tags: ["Awards", "Gala", "VIP"],
    createdAt: "2026-02-01",
  },
];

// ---- GUESTS ----
export const demoGuests = [
  { id: "guest-1", firstName: "Robert", lastName: "Anderson", email: "r.anderson@techcorp.com", phone: "+1 555-1001", company: "TechCorp", title: "Mr.", category: "VIP", dietaryReqs: "None", tags: ["Speaker", "VIP"] },
  { id: "guest-2", firstName: "Jennifer", lastName: "Liu", email: "j.liu@innovate.io", phone: "+1 555-1002", company: "Innovate.io", title: "Ms.", category: "VIP", dietaryReqs: "Vegetarian", tags: ["VIP", "Board Member"] },
  { id: "guest-3", firstName: "Michael", lastName: "O'Brien", email: "m.obrien@gmail.com", phone: "+1 555-1003", company: "StartupHub", title: "Mr.", category: "Regular", dietaryReqs: "Gluten-free", tags: ["Attendee"] },
  { id: "guest-4", firstName: "Priya", lastName: "Sharma", email: "priya.s@enterprise.com", phone: "+1 555-1004", company: "Enterprise Solutions", title: "Dr.", category: "Speaker", dietaryReqs: "Vegan", tags: ["Speaker", "Panelist"] },
  { id: "guest-5", firstName: "Carlos", lastName: "Mendez", email: "c.mendez@media.com", phone: "+1 555-1005", company: "MediaOne", title: "Mr.", category: "Media", dietaryReqs: "None", tags: ["Press", "Media"] },
  { id: "guest-6", firstName: "Aisha", lastName: "Patel", email: "a.patel@design.co", phone: "+1 555-1006", company: "DesignCo", title: "Ms.", category: "Regular", dietaryReqs: "Halal", tags: ["Attendee"] },
  { id: "guest-7", firstName: "Thomas", lastName: "Wagner", email: "t.wagner@finance.de", phone: "+49 555-1007", company: "Deutsche Finance", title: "Mr.", category: "VIP", dietaryReqs: "None", tags: ["VIP", "International"] },
  { id: "guest-8", firstName: "Sophie", lastName: "Martin", email: "s.martin@luxury.fr", phone: "+33 555-1008", company: "Luxury Events Paris", title: "Mme.", category: "VIP", dietaryReqs: "Lactose-free", tags: ["VIP", "Partner"] },
  { id: "guest-9", firstName: "Kenji", lastName: "Tanaka", email: "k.tanaka@tech.jp", phone: "+81 555-1009", company: "TechJapan", title: "Mr.", category: "Speaker", dietaryReqs: "None", tags: ["Speaker", "Keynote"] },
  { id: "guest-10", firstName: "Emma", lastName: "Wilson", email: "e.wilson@corp.com", phone: "+1 555-1010", company: "CorpWorld", title: "Ms.", category: "Regular", dietaryReqs: "None", tags: ["Attendee"] },
];

// ---- VENDORS ----
export const demoVendors = [
  { id: "vendor-1", name: "Gourmet Delights Catering", category: "Catering", contactPerson: "Chef Antonio Rossi", email: "info@gourmetdelights.com", phone: "+1 555-2001", rating: 4.8, isPreferred: true, tags: ["Premium", "International Cuisine"] },
  { id: "vendor-2", name: "Bloom & Petal Florals", category: "Florist", contactPerson: "Maya Chen", email: "maya@bloompetal.com", phone: "+1 555-2002", rating: 4.9, isPreferred: true, tags: ["Luxury", "Custom Arrangements"] },
  { id: "vendor-3", name: "SoundWave Productions", category: "Audio/Visual", contactPerson: "Jake Morrison", email: "jake@soundwave.pro", phone: "+1 555-2003", rating: 4.6, isPreferred: false, tags: ["AV", "Live Sound"] },
  { id: "vendor-4", name: "Lens & Light Photography", category: "Photography", contactPerson: "Aria Nakamura", email: "aria@lenslight.com", phone: "+1 555-2004", rating: 4.9, isPreferred: true, tags: ["Award Winning", "Editorial"] },
  { id: "vendor-5", name: "DreamScape Decor", category: "Decoration", contactPerson: "Isabella Cruz", email: "isabella@dreamscape.com", phone: "+1 555-2005", rating: 4.7, isPreferred: false, tags: ["Luxury", "Themed"] },
  { id: "vendor-6", name: "SecureEvent Services", category: "Security", contactPerson: "Mark Thompson", email: "mark@secureevent.com", phone: "+1 555-2006", rating: 4.5, isPreferred: true, tags: ["VIP Security", "Crowd Management"] },
  { id: "vendor-7", name: "LuxeRide Transportation", category: "Transportation", contactPerson: "Daniel Park", email: "daniel@luxeride.com", phone: "+1 555-2007", rating: 4.4, isPreferred: false, tags: ["Limo", "Shuttle"] },
  { id: "vendor-8", name: "SparkLight Entertainment", category: "Entertainment", contactPerson: "Nina Vasquez", email: "nina@sparklight.com", phone: "+1 555-2008", rating: 4.8, isPreferred: true, tags: ["Live Band", "DJ"] },
];

// ---- TEAM MEMBERS ----
export const demoTeam = [
  { id: "user-1", name: "John Smith", email: "john@eventpro.com", role: "EVENT_DIRECTOR", avatar: "", phone: "+1 555-3001", isActive: true },
  { id: "user-2", name: "Lisa Park", email: "lisa@eventpro.com", role: "EVENT_MANAGER", avatar: "", phone: "+1 555-3002", isActive: true },
  { id: "user-3", name: "Miguel Santos", email: "miguel@eventpro.com", role: "OPERATIONS_MANAGER", avatar: "", phone: "+1 555-3003", isActive: true },
  { id: "user-4", name: "Rachel Green", email: "rachel@eventpro.com", role: "HOSPITALITY_MANAGER", avatar: "", phone: "+1 555-3004", isActive: true },
  { id: "user-5", name: "David Kim", email: "david@eventpro.com", role: "VENDOR_MANAGER", avatar: "", phone: "+1 555-3005", isActive: true },
  { id: "user-6", name: "Sophia Laurent", email: "sophia@eventpro.com", role: "GUEST_MANAGER", avatar: "", phone: "+1 555-3006", isActive: true },
  { id: "user-7", name: "Omar Hassan", email: "omar@eventpro.com", role: "FINANCE_MANAGER", avatar: "", phone: "+1 555-3007", isActive: true },
  { id: "user-8", name: "Amy Chen", email: "amy@eventpro.com", role: "TEAM_LEADER", avatar: "", phone: "+1 555-3008", isActive: true },
  { id: "user-9", name: "Brandon Lee", email: "brandon@eventpro.com", role: "STAFF_MEMBER", avatar: "", phone: "+1 555-3009", isActive: true },
  { id: "user-10", name: "Olivia Taylor", email: "olivia@eventpro.com", role: "STAFF_MEMBER", avatar: "", phone: "+1 555-3010", isActive: false },
];

// ---- INVOICES ----
export const demoInvoices = [
  { id: "inv-1", invoiceNumber: "INV-2026-001", clientName: "TechCorp Industries", clientEmail: "finance@techcorp.com", eventName: "NexGen Series X Launch", items: 5, subtotal: 180000, tax: 16200, total: 196200, amountPaid: 98100, status: "partially_paid" as const, dueDate: "2026-08-01", issuedDate: "2026-07-01" },
  { id: "inv-2", invoiceNumber: "INV-2026-002", clientName: "Hope Foundation", clientEmail: "billing@hopefoundation.org", eventName: "Charity Fundraiser Gala", items: 3, subtotal: 65000, tax: 5850, total: 70850, amountPaid: 0, status: "sent" as const, dueDate: "2026-08-15", issuedDate: "2026-07-05" },
  { id: "inv-3", invoiceNumber: "INV-2025-048", clientName: "TechCorp Industries", clientEmail: "finance@techcorp.com", eventName: "TechCorp Annual Gala 2025", items: 8, subtotal: 75000, tax: 6750, total: 81750, amountPaid: 81750, status: "paid" as const, dueDate: "2025-10-01", issuedDate: "2025-08-15" },
  { id: "inv-4", invoiceNumber: "INV-2026-003", clientName: "Elite Social Club", clientEmail: "james@eliteevents.com", eventName: "New Year's Eve Celebration", items: 6, subtotal: 150000, tax: 13500, total: 163500, amountPaid: 0, status: "draft" as const, dueDate: "2026-11-01", issuedDate: "" },
  { id: "inv-5", invoiceNumber: "INV-2026-004", clientName: "Innovate.io", clientEmail: "accounts@innovate.io", eventName: "Global Tech Summit 2026", items: 10, subtotal: 250000, tax: 22500, total: 272500, amountPaid: 0, status: "overdue" as const, dueDate: "2026-06-30", issuedDate: "2026-06-01" },
];

// ---- TASKS ----
export const demoTasks = [
  { id: "task-1", eventId: "evt-1", title: "Finalize venue contract", status: "completed" as const, priority: "high" as const, assignee: "John Smith", dueDate: "2026-07-05", category: "Venue" },
  { id: "task-2", eventId: "evt-1", title: "Confirm AV equipment list", status: "in_progress" as const, priority: "high" as const, assignee: "Miguel Santos", dueDate: "2026-07-10", category: "AV/Tech" },
  { id: "task-3", eventId: "evt-1", title: "Send VIP invitations", status: "pending" as const, priority: "urgent" as const, assignee: "Sophia Laurent", dueDate: "2026-07-08", category: "Guests" },
  { id: "task-4", eventId: "evt-3", title: "Coordinate food vendors", status: "in_progress" as const, priority: "medium" as const, assignee: "Rachel Green", dueDate: "2026-07-15", category: "Catering" },
  { id: "task-5", eventId: "evt-3", title: "Finalize performer schedule", status: "pending" as const, priority: "high" as const, assignee: "Lisa Park", dueDate: "2026-07-12", category: "Entertainment" },
  { id: "task-6", eventId: "evt-4", title: "Book keynote speakers", status: "in_progress" as const, priority: "urgent" as const, assignee: "John Smith", dueDate: "2026-07-20", category: "Speakers" },
  { id: "task-7", eventId: "evt-5", title: "Final venue walkthrough", status: "completed" as const, priority: "high" as const, assignee: "Lisa Park", dueDate: "2026-07-06", category: "Venue" },
  { id: "task-8", eventId: "evt-1", title: "Design event branding materials", status: "pending" as const, priority: "medium" as const, assignee: "Amy Chen", dueDate: "2026-07-18", category: "Design" },
  { id: "task-9", eventId: "evt-4", title: "Set up registration portal", status: "pending" as const, priority: "medium" as const, assignee: "Brandon Lee", dueDate: "2026-08-01", category: "Technology" },
  { id: "task-10", eventId: "evt-3", title: "Arrange security detail", status: "completed" as const, priority: "high" as const, assignee: "Miguel Santos", dueDate: "2026-07-05", category: "Security" },
];

// ---- INVENTORY ----
export const demoInventory = [
  { id: "inv-item-1", name: "Round Banquet Tables (8-seat)", category: "Furniture", totalQuantity: 50, availableQty: 35, unit: "pieces", condition: "Good", location: "Warehouse A", costPerUnit: 75 },
  { id: "inv-item-2", name: "Chiavari Chairs - Gold", category: "Furniture", totalQuantity: 400, availableQty: 250, unit: "pieces", condition: "Good", location: "Warehouse A", costPerUnit: 15 },
  { id: "inv-item-3", name: "LED Par Lights (RGBW)", category: "Lighting", totalQuantity: 80, availableQty: 45, unit: "pieces", condition: "Good", location: "Warehouse B", costPerUnit: 120 },
  { id: "inv-item-4", name: "Wireless Microphone System", category: "AV Equipment", totalQuantity: 20, availableQty: 12, unit: "sets", condition: "Good", location: "Warehouse B", costPerUnit: 350 },
  { id: "inv-item-5", name: "Projector - 5000 Lumens", category: "AV Equipment", totalQuantity: 8, availableQty: 3, unit: "pieces", condition: "Good", location: "Warehouse B", costPerUnit: 800 },
  { id: "inv-item-6", name: "Stage Platform Sections (4x4)", category: "Staging", totalQuantity: 24, availableQty: 16, unit: "pieces", condition: "Good", location: "Warehouse C", costPerUnit: 200 },
  { id: "inv-item-7", name: "White Linen Tablecloths", category: "Linens", totalQuantity: 100, availableQty: 60, unit: "pieces", condition: "Good", location: "Warehouse A", costPerUnit: 25 },
  { id: "inv-item-8", name: "Portable Bar Station", category: "Furniture", totalQuantity: 6, availableQty: 2, unit: "pieces", condition: "Fair", location: "Warehouse A", costPerUnit: 500 },
];

// ---- NOTIFICATIONS ----
export const demoNotifications = [
  { id: "notif-1", title: "New Lead Received", message: "David Nakamura from Innovate.io submitted an inquiry for Global Tech Summit 2026", type: "info", isRead: false, createdAt: "2026-07-07T10:30:00" },
  { id: "notif-2", title: "Task Overdue", message: "\"Send VIP invitations\" for NexGen Series X Launch is past due", type: "warning", isRead: false, createdAt: "2026-07-07T09:00:00" },
  { id: "notif-3", title: "Payment Received", message: "TechCorp Industries paid $98,100 for INV-2026-001", type: "success", isRead: false, createdAt: "2026-07-06T16:45:00" },
  { id: "notif-4", title: "Event Going Live", message: "Elite Awards Night 2026 is starting today! 310 guests checked in.", type: "info", isRead: true, createdAt: "2026-07-07T08:00:00" },
  { id: "notif-5", title: "Low Inventory Alert", message: "Portable Bar Stations are running low (2 remaining)", type: "warning", isRead: true, createdAt: "2026-07-05T14:20:00" },
  { id: "notif-6", title: "Proposal Accepted", message: "Alex Turner (NexGen Electronics) accepted your proposal for Series X Launch", type: "success", isRead: true, createdAt: "2026-07-04T11:00:00" },
];

// ---- ACTIVITY LOG ----
export const demoActivities = [
  { id: "act-1", user: "John Smith", action: "created", entity: "Lead", entityName: "Global Tech Summit 2026", createdAt: "2026-07-07T10:30:00" },
  { id: "act-2", user: "Lisa Park", action: "updated", entity: "Event", entityName: "Elite Awards Night 2026", detail: "Status changed to Live", createdAt: "2026-07-07T08:00:00" },
  { id: "act-3", user: "Sophia Laurent", action: "sent", entity: "Invitation", entityName: "250 invitations for Summer Music Festival", createdAt: "2026-07-06T15:30:00" },
  { id: "act-4", user: "Omar Hassan", action: "created", entity: "Invoice", entityName: "INV-2026-002 for Hope Foundation", createdAt: "2026-07-05T11:20:00" },
  { id: "act-5", user: "David Kim", action: "booked", entity: "Vendor", entityName: "Gourmet Delights for NexGen Launch", createdAt: "2026-07-04T14:00:00" },
  { id: "act-6", user: "Rachel Green", action: "completed", entity: "Task", entityName: "Arrange security detail for Summer Festival", createdAt: "2026-07-05T09:45:00" },
  { id: "act-7", user: "Miguel Santos", action: "allocated", entity: "Inventory", entityName: "45 LED lights for Elite Awards Night", createdAt: "2026-07-06T10:00:00" },
  { id: "act-8", user: "Amy Chen", action: "uploaded", entity: "Document", entityName: "Floor plan for NexGen Launch", createdAt: "2026-07-06T16:00:00" },
];

// ---- COMMUNICATION LOG ----
export const demoCommunications = [
  { id: "comm-1", type: "Email", subject: "Welcome to NexGen Series X Launch!", recipients: 500, status: "Delivered", sentAt: "2026-07-01T10:00:00", eventName: "NexGen Series X Launch" },
  { id: "comm-2", type: "SMS", subject: "RSVP Reminder", recipients: 150, status: "Delivered", sentAt: "2026-07-05T09:00:00", eventName: "Summer Music Festival" },
  { id: "comm-3", type: "Email", subject: "Your invitation to Elite Awards Night", recipients: 350, status: "Delivered", sentAt: "2026-06-15T14:00:00", eventName: "Elite Awards Night 2026" },
  { id: "comm-4", type: "WhatsApp", subject: "VIP Welcome Package Details", recipients: 25, status: "Sent", sentAt: "2026-07-06T11:00:00", eventName: "Elite Awards Night 2026" },
  { id: "comm-5", type: "Email", subject: "Vendor Booking Confirmation", recipients: 8, status: "Delivered", sentAt: "2026-07-04T16:30:00", eventName: "NexGen Series X Launch" },
];

// ---- DOCUMENTS ----
export const demoDocuments = [
  { id: "doc-1", name: "NexGen Launch Floor Plan v3.pdf", type: "Floorplan", size: "2.4 MB", uploadedBy: "Amy Chen", eventName: "NexGen Series X Launch", createdAt: "2026-07-06" },
  { id: "doc-2", name: "Vendor Contract - Gourmet Delights.pdf", type: "Contract", size: "850 KB", uploadedBy: "David Kim", eventName: "NexGen Series X Launch", createdAt: "2026-07-04" },
  { id: "doc-3", name: "Elite Awards Night Run Sheet.docx", type: "Run Sheet", size: "320 KB", uploadedBy: "Lisa Park", eventName: "Elite Awards Night 2026", createdAt: "2026-07-05" },
  { id: "doc-4", name: "Summer Festival Site Map.pdf", type: "Floorplan", size: "4.1 MB", uploadedBy: "Miguel Santos", eventName: "Summer Music Festival", createdAt: "2026-06-20" },
  { id: "doc-5", name: "Insurance Certificate 2026.pdf", type: "Insurance", size: "1.2 MB", uploadedBy: "Omar Hassan", eventName: "", createdAt: "2026-01-15" },
  { id: "doc-6", name: "Brand Guidelines - EventPro.pdf", type: "Branding", size: "8.5 MB", uploadedBy: "John Smith", eventName: "", createdAt: "2026-01-01" },
];

// ---- HOSPITALITY: TRAVEL ----
export const demoTravelBookings = [
  { id: "travel-1", guestName: "Kenji Tanaka", eventName: "NexGen Series X Launch", type: "Flight", carrier: "United Airlines", route: "Tokyo → San Francisco", departureTime: "2026-08-18T10:00:00", arrivalTime: "2026-08-18T06:00:00", status: "Confirmed", cost: 2400 },
  { id: "travel-2", guestName: "Thomas Wagner", eventName: "NexGen Series X Launch", type: "Flight", carrier: "Lufthansa", route: "Frankfurt → San Francisco", departureTime: "2026-08-19T08:00:00", arrivalTime: "2026-08-19T11:00:00", status: "Booked", cost: 1800 },
  { id: "travel-3", guestName: "Sophie Martin", eventName: "NexGen Series X Launch", type: "Flight", carrier: "Air France", route: "Paris → San Francisco", departureTime: "2026-08-19T09:30:00", arrivalTime: "2026-08-19T12:00:00", status: "Pending", cost: 1950 },
];

// ---- HOSPITALITY: ACCOMMODATION ----
export const demoAccommodations = [
  { id: "accom-1", guestName: "Kenji Tanaka", eventName: "NexGen Series X Launch", hotelName: "The Ritz-Carlton", roomType: "Executive Suite", checkIn: "2026-08-18", checkOut: "2026-08-21", costPerNight: 450, status: "Confirmed" },
  { id: "accom-2", guestName: "Thomas Wagner", eventName: "NexGen Series X Launch", hotelName: "The Ritz-Carlton", roomType: "Deluxe King", checkIn: "2026-08-19", checkOut: "2026-08-21", costPerNight: 320, status: "Confirmed" },
  { id: "accom-3", guestName: "Sophie Martin", eventName: "NexGen Series X Launch", hotelName: "Four Seasons", roomType: "Premier Suite", checkIn: "2026-08-19", checkOut: "2026-08-22", costPerNight: 550, status: "Pending" },
];

// ---- HELPDESK TICKETS ----
export const demoTickets = [
  { id: "ticket-1", eventName: "Elite Awards Night 2026", reportedBy: "Guest - Table 12", category: "Technical", subject: "Microphone not working at podium", priority: "urgent" as const, status: "In Progress", assignedTo: "Miguel Santos", createdAt: "2026-07-07T19:15:00" },
  { id: "ticket-2", eventName: "Elite Awards Night 2026", reportedBy: "VIP - Jennifer Liu", category: "Logistics", subject: "Need wheelchair access to VIP lounge", priority: "high" as const, status: "Resolved", assignedTo: "Rachel Green", createdAt: "2026-07-07T18:30:00" },
  { id: "ticket-3", eventName: "Summer Music Festival", reportedBy: "Staff - Section B", category: "Medical", subject: "First aid kit needed at Stage 2", priority: "urgent" as const, status: "Open", assignedTo: "", createdAt: "2026-07-07T14:00:00" },
];

export const demoTransportation = [
  { id: "trans-1", guestName: "Robert Anderson", eventName: "Elite Awards Night 2026", vehicleType: "Luxury Sedan", route: "SFO Airport → Grand Hyatt", pickupTime: "2026-07-07T16:00:00", driver: "James Carter", status: "Confirmed", cost: 120 },
  { id: "trans-2", guestName: "Jennifer Liu", eventName: "Elite Awards Night 2026", vehicleType: "VIP Shuttle", route: "Hotel → Venue", pickupTime: "2026-07-07T18:30:00", driver: "Maria Lopez", status: "Scheduled", cost: 0 },
  { id: "trans-3", guestName: "Priya Sharma", eventName: "NexGen Series X Launch", vehicleType: "SUV", route: "Airport → Convention Center", pickupTime: "2026-08-19T09:00:00", driver: "Unassigned", status: "Pending", cost: 95 },
];

export const demoCatering = [
  { id: "cat-1", eventName: "Elite Awards Night 2026", mealType: "Gala Dinner", menu: "3-course plated dinner", servings: 350, vendor: "Gourmet Events Co.", dietaryNotes: "12 vegan, 8 gluten-free", status: "Confirmed", cost: 18500 },
  { id: "cat-2", eventName: "NexGen Series X Launch", mealType: "Welcome Reception", menu: "Canapés & cocktails", servings: 200, vendor: "Fresh Bites Catering", dietaryNotes: "5 nut-free", status: "In Review", cost: 6200 },
  { id: "cat-3", eventName: "Summer Music Festival", mealType: "Artist Hospitality", menu: "Backstage buffet", servings: 80, vendor: "Local Eats LLC", dietaryNotes: "All vegetarian options", status: "Confirmed", cost: 3400 },
];

export const demoVipServices = [
  { id: "vip-1", guestName: "Robert Anderson", eventName: "Elite Awards Night 2026", service: "Personal Concierge", details: "Airport meet & greet, luggage handling", assignedTo: "Rachel Green", status: "Active" },
  { id: "vip-2", guestName: "Jennifer Liu", eventName: "Elite Awards Night 2026", service: "Green Room Access", details: "Private lounge with refreshments", assignedTo: "Miguel Santos", status: "Scheduled" },
  { id: "vip-3", guestName: "Kenji Tanaka", eventName: "NexGen Series X Launch", service: "Interpreter", details: "Japanese-English simultaneous translation", assignedTo: "Unassigned", status: "Pending" },
];

export const demoVendorContracts = [
  { id: "con-1", vendorName: "Gourmet Events Co.", eventName: "Elite Awards Night 2026", type: "Catering", value: 18500, startDate: "2026-06-01", endDate: "2026-07-08", status: "Active" },
  { id: "con-2", vendorName: "SoundWave AV", eventName: "NexGen Series X Launch", type: "AV Equipment", value: 12000, startDate: "2026-07-15", endDate: "2026-08-22", status: "Active" },
  { id: "con-3", vendorName: "Floral Dreams", eventName: "Elite Awards Night 2026", type: "Decor", value: 8500, startDate: "2026-05-20", endDate: "2026-07-08", status: "Completed" },
  { id: "con-4", vendorName: "SecureGuard Services", eventName: "Summer Music Festival", type: "Security", value: 15000, startDate: "2026-06-01", endDate: "2026-07-15", status: "Pending Signature" },
];
