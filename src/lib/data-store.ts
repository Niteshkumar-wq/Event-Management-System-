"use client";

import { useCallback, useEffect, useState } from "react";
import { demoLeads, demoEvents, demoGuests } from "@/lib/demo-data";
import { generateId } from "@/lib/utils";

export type LeadStatus =
  | "inquiry_received" | "meeting_scheduled" | "requirement_gathered"
  | "budget_discussed" | "proposal_sent" | "negotiation" | "approved" | "rejected" | "on_hold";

export type Lead = {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany: string;
  source: string;
  status: LeadStatus;
  priority: "low" | "medium" | "high" | "urgent";
  eventType: string;
  estimatedBudget: number;
  estimatedGuests: number;
  eventDate: string;
  eventLocation: string;
  nextFollowUp: string;
  assignedTo: string;
  createdAt: string;
};

export type EventItem = {
  id: string;
  name: string;
  type: string;
  status: "draft" | "planning" | "pre_event" | "live" | "post_event" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  venueName: string;
  venueCapacity: number;
  manager: string;
  expectedGuests: number;
  actualGuests: number;
  totalBudget: number;
  spentAmount: number;
  coverImage: string;
  tags: string[];
  createdAt: string;
};

export type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  category: string;
  dietaryReqs: string;
  tags: string[];
};

const EXTRA_GUESTS: Guest[] = [
  { id: "guest-11", firstName: "Liam", lastName: "Crawford", email: "l.crawford@venturelab.com", phone: "+1 555-1011", company: "VentureLab", title: "Mr.", category: "Regular", dietaryReqs: "Kosher", tags: ["Attendee", "Startup"] },
  { id: "guest-12", firstName: "Natasha", lastName: "Ivanova", email: "n.ivanova@globex.ru", phone: "+7 555-1012", company: "Globex Corp", title: "Ms.", category: "VIP", dietaryReqs: "None", tags: ["VIP", "International"] },
  { id: "guest-13", firstName: "Daniel", lastName: "Brooks", email: "d.brooks@mediahub.com", phone: "+1 555-1013", company: "MediaHub", title: "Mr.", category: "Media", dietaryReqs: "Vegetarian", tags: ["Press", "Blogger"] },
  { id: "guest-14", firstName: "Fatima", lastName: "Al-Rashid", email: "f.alrashid@greentech.ae", phone: "+971 555-1014", company: "GreenTech UAE", title: "Dr.", category: "Speaker", dietaryReqs: "Halal", tags: ["Speaker", "Keynote", "International"] },
  { id: "guest-15", firstName: "Oliver", lastName: "Hayes", email: "o.hayes@cloudnine.io", phone: "+1 555-1015", company: "CloudNine", title: "Mr.", category: "Regular", dietaryReqs: "Gluten-free", tags: ["Attendee"] },
];

const BASE_GUESTS: Guest[] = [...demoGuests, ...EXTRA_GUESTS];

const LEADS_KEY = "eventpro-custom-leads";
const EVENTS_KEY = "eventpro-custom-events";
const GUESTS_KEY = "eventpro-custom-guests";
const DELETED_GUESTS_KEY = "eventpro-deleted-guest-ids";
const DATA_CHANGED = "eventpro-data-changed";

function readStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeStorage<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new Event(DATA_CHANGED));
}

function readStringSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function writeStringSet(key: string, ids: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...ids]));
  window.dispatchEvent(new Event(DATA_CHANGED));
}

export function getCustomLeads(): Lead[] {
  return readStorage<Lead>(LEADS_KEY);
}

export function getCustomEvents(): EventItem[] {
  return readStorage<EventItem>(EVENTS_KEY);
}

export function getAllLeads(): Lead[] {
  const custom = getCustomLeads();
  const demoIds = new Set(demoLeads.map((l) => l.id));
  return [...custom, ...demoLeads.filter((l) => !custom.some((c) => c.id === l.id))];
}

export function getAllEvents(): EventItem[] {
  const custom = getCustomEvents();
  const customIds = new Set(custom.map((e) => e.id));
  return [...custom, ...demoEvents.filter((e) => !customIds.has(e.id))];
}

export function getLeadById(id: string): Lead | undefined {
  return getAllLeads().find((l) => l.id === id);
}

export function getEventById(id: string): EventItem | undefined {
  return getAllEvents().find((e) => e.id === id);
}

export function getCustomGuests(): Guest[] {
  return readStorage<Guest>(GUESTS_KEY);
}

export function getDeletedGuestIds(): Set<string> {
  return readStringSet(DELETED_GUESTS_KEY);
}

export function getAllGuests(): Guest[] {
  const custom = getCustomGuests();
  const deleted = getDeletedGuestIds();
  const customIds = new Set(custom.map((g) => g.id));
  const base = BASE_GUESTS.filter((g) => !deleted.has(g.id) && !customIds.has(g.id));
  return [...custom, ...base];
}

export interface NewGuestForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  category: string;
  dietaryReqs: string;
  tags: string;
}

export function createGuestFromForm(form: NewGuestForm): Guest {
  return {
    id: `guest-${generateId()}`,
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    company: form.company.trim(),
    title: form.title.trim(),
    category: form.category || "Regular",
    dietaryReqs: form.dietaryReqs || "None",
    tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
  };
}

export function saveGuest(guest: Guest): Guest {
  const custom = getCustomGuests();
  writeStorage(GUESTS_KEY, [guest, ...custom.filter((g) => g.id !== guest.id)]);
  return guest;
}

export function deleteGuests(ids: string[]) {
  const custom = getCustomGuests();
  const deleted = getDeletedGuestIds();
  const idSet = new Set(ids);

  writeStorage(GUESTS_KEY, custom.filter((g) => !idSet.has(g.id)));
  ids.forEach((id) => {
    if (BASE_GUESTS.some((g) => g.id === id)) deleted.add(id);
  });
  writeStringSet(DELETED_GUESTS_KEY, deleted);
}

export interface NewLeadForm {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  estimatedGuests: string;
  estimatedBudget: string;
  source: string;
  priority: string;
  notes: string;
}

export interface NewEventForm {
  name: string;
  type: string;
  description: string;
  startDate: string;
  endDate: string;
  venueName: string;
  venueAddress: string;
  venueCapacity: string;
  totalBudget: string;
  budgetNotes: string;
  manager: string;
  team: string;
}

export function createLeadFromForm(form: NewLeadForm): Lead {
  const today = new Date().toISOString().slice(0, 10);
  const title =
    form.eventType && form.clientName
      ? `${form.eventType} — ${form.clientName}`
      : form.clientName
        ? `${form.clientName}'s Event`
        : "New Lead";

  return {
    id: `lead-${generateId()}`,
    title,
    clientName: form.clientName.trim(),
    clientEmail: form.clientEmail.trim(),
    clientPhone: form.clientPhone.trim(),
    clientCompany: form.clientCompany.trim(),
    source: form.source || "Website",
    status: "inquiry_received",
    priority: (form.priority || "medium") as Lead["priority"],
    eventType: form.eventType || "Other",
    estimatedBudget: Number(form.estimatedBudget) || 0,
    estimatedGuests: Number(form.estimatedGuests) || 0,
    eventDate: form.eventDate || today,
    eventLocation: form.eventLocation.trim(),
    nextFollowUp: today,
    assignedTo: "John Smith",
    createdAt: today,
  };
}

export function createEventFromForm(form: NewEventForm): EventItem {
  const today = new Date().toISOString().slice(0, 10);

  return {
    id: `evt-${generateId()}`,
    name: form.name.trim(),
    type: form.type || "Other",
    status: "planning",
    startDate: form.startDate || today,
    endDate: form.endDate || form.startDate || today,
    venueName: form.venueName.trim() || form.venueAddress.trim() || "TBD",
    venueCapacity: Number(form.venueCapacity) || 0,
    manager: form.manager.trim() || "John Smith",
    expectedGuests: Number(form.venueCapacity) || 0,
    actualGuests: 0,
    totalBudget: Number(form.totalBudget) || 0,
    spentAmount: 0,
    coverImage: "",
    tags: form.type ? [form.type] : [],
    createdAt: today,
  };
}

export function saveLead(lead: Lead): Lead {
  const custom = getCustomLeads();
  writeStorage(LEADS_KEY, [lead, ...custom.filter((l) => l.id !== lead.id)]);
  return lead;
}

export function saveEvent(event: EventItem): EventItem {
  const custom = getCustomEvents();
  writeStorage(EVENTS_KEY, [event, ...custom.filter((e) => e.id !== event.id)]);
  return event;
}

export function updateLead(updated: Lead): Lead {
  const custom = getCustomLeads();
  const isCustom = custom.some((l) => l.id === updated.id);
  if (isCustom) {
    writeStorage(LEADS_KEY, custom.map((l) => (l.id === updated.id ? updated : l)));
  } else {
    writeStorage(LEADS_KEY, [updated, ...custom]);
  }
  return updated;
}

export function deleteLead(id: string) {
  const custom = getCustomLeads();
  writeStorage(LEADS_KEY, custom.filter((l) => l.id !== id));
}

export function convertLeadToEvent(lead: Lead): EventItem {
  const event = createEventFromForm({
    name: lead.title,
    type: lead.eventType || "Other",
    description: `Converted from lead: ${lead.title}`,
    startDate: lead.eventDate,
    endDate: lead.eventDate,
    venueName: lead.eventLocation || "TBD",
    venueAddress: lead.eventLocation || "",
    venueCapacity: String(lead.estimatedGuests || 0),
    totalBudget: String(lead.estimatedBudget || 0),
    budgetNotes: "",
    manager: lead.assignedTo || "John Smith",
    team: "",
  });
  saveEvent(event);
  updateLead({ ...lead, status: "approved" });
  return event;
}

export function useGuests() {
  const [guests, setGuests] = useState<Guest[]>([]);

  const refresh = useCallback(() => setGuests(getAllGuests()), []);

  useEffect(() => {
    refresh();
    window.addEventListener(DATA_CHANGED, refresh);
    return () => window.removeEventListener(DATA_CHANGED, refresh);
  }, [refresh]);

  const addGuest = useCallback((form: NewGuestForm) => {
    const guest = createGuestFromForm(form);
    saveGuest(guest);
    refresh();
    return guest;
  }, [refresh]);

  const removeGuests = useCallback((ids: string[]) => {
    deleteGuests(ids);
    refresh();
  }, [refresh]);

  return { guests, addGuest, removeGuests, refresh };
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);

  const refresh = useCallback(() => setLeads(getAllLeads()), []);

  useEffect(() => {
    refresh();
    window.addEventListener(DATA_CHANGED, refresh);
    return () => window.removeEventListener(DATA_CHANGED, refresh);
  }, [refresh]);

  const addLead = useCallback((form: NewLeadForm) => {
    const lead = createLeadFromForm(form);
    saveLead(lead);
    refresh();
    return lead;
  }, [refresh]);

  return { leads, addLead, refresh };
}

export function useEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);

  const refresh = useCallback(() => setEvents(getAllEvents()), []);

  useEffect(() => {
    refresh();
    window.addEventListener(DATA_CHANGED, refresh);
    return () => window.removeEventListener(DATA_CHANGED, refresh);
  }, [refresh]);

  const addEvent = useCallback((form: NewEventForm) => {
    const event = createEventFromForm(form);
    saveEvent(event);
    refresh();
    return event;
  }, [refresh]);

  return { events, addEvent, refresh };
}

export function useLead(id: string) {
  const [lead, setLead] = useState<Lead | undefined>(undefined);

  useEffect(() => {
    const refresh = () => setLead(getLeadById(id));
    refresh();
    window.addEventListener(DATA_CHANGED, refresh);
    return () => window.removeEventListener(DATA_CHANGED, refresh);
  }, [id]);

  return lead;
}

export function useEvent(id: string) {
  const [event, setEvent] = useState<EventItem | undefined>(undefined);

  useEffect(() => {
    const refresh = () => setEvent(getEventById(id));
    refresh();
    window.addEventListener(DATA_CHANGED, refresh);
    return () => window.removeEventListener(DATA_CHANGED, refresh);
  }, [id]);

  return event;
}
