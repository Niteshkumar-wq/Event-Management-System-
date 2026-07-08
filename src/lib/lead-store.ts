"use client";

import { useCallback, useEffect, useState } from "react";
import { generateId } from "@/lib/utils";
import type { Lead } from "@/lib/data-store";

const STORAGE_KEY = "eventpro-lead-crm";
export const LEAD_CRM_CHANGED = "eventpro-lead-crm-changed";

export interface LeadMeeting {
  id: string;
  leadId: string;
  title: string;
  date: string;
  type: string;
  duration: string;
  outcome: string;
  createdAt: string;
}

export interface LeadProposal {
  id: string;
  leadId: string;
  version: number;
  title: string;
  total: number;
  status: "Draft" | "Sent" | "Revised" | "Accepted" | "Rejected";
  date: string;
  notes: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  action: string;
  user: string;
  date: string;
}

export interface LeadCrmData {
  meetings: LeadMeeting[];
  proposals: LeadProposal[];
  activities: LeadActivity[];
}

type Store = Record<string, LeadCrmData>;

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function writeStore(data: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(LEAD_CRM_CHANGED));
}

function defaultData(lead: Lead): LeadCrmData {
  return {
    meetings: [],
    proposals: [],
    activities: [
      {
        id: `act-${generateId()}`,
        leadId: lead.id,
        action: `Lead created from ${lead.source || "inquiry"}`,
        user: "System",
        date: new Date(lead.createdAt + "T09:00:00").toISOString(),
      },
    ],
  };
}

export function getLeadCrmData(leadId: string, lead?: Lead): LeadCrmData {
  const store = readStore();
  if (!store[leadId]) {
    if (!lead) return { meetings: [], proposals: [], activities: [] };
    store[leadId] = defaultData(lead);
    writeStore(store);
  }
  return store[leadId];
}

function saveLeadCrmData(leadId: string, data: LeadCrmData) {
  const store = readStore();
  store[leadId] = data;
  writeStore(store);
}

function addActivity(leadId: string, action: string, user = "John Smith") {
  const data = getLeadCrmData(leadId);
  data.activities.unshift({
    id: `act-${generateId()}`,
    leadId,
    action,
    user,
    date: new Date().toISOString(),
  });
  saveLeadCrmData(leadId, data);
}

export function useLeadCrm(leadId: string, lead: Lead | undefined) {
  const [data, setData] = useState<LeadCrmData>({ meetings: [], proposals: [], activities: [] });

  const refresh = useCallback(() => {
    if (lead) setData(getLeadCrmData(leadId, lead));
  }, [leadId, lead]);

  useEffect(() => {
    refresh();
    window.addEventListener(LEAD_CRM_CHANGED, refresh);
    return () => window.removeEventListener(LEAD_CRM_CHANGED, refresh);
  }, [refresh]);

  const scheduleMeeting = useCallback(
    (form: { title: string; date: string; type: string; duration: string; outcome: string }) => {
      if (!lead) return;
      const current = getLeadCrmData(leadId, lead);
      const meeting: LeadMeeting = {
        id: `mtg-${generateId()}`,
        leadId,
        title: form.title.trim(),
        date: form.date,
        type: form.type,
        duration: form.duration,
        outcome: form.outcome.trim() || "Scheduled",
        createdAt: new Date().toISOString(),
      };
      current.meetings.unshift(meeting);
      current.activities.unshift({
        id: `act-${generateId()}`,
        leadId,
        action: `Meeting scheduled: ${meeting.title}`,
        user: "John Smith",
        date: new Date().toISOString(),
      });
      saveLeadCrmData(leadId, current);
      refresh();
      return meeting;
    },
    [leadId, lead, refresh]
  );

  const createProposal = useCallback(
    (form: { title: string; total: number; notes: string }) => {
      if (!lead) return;
      const current = getLeadCrmData(leadId, lead);
      const version = current.proposals.length + 1;
      const proposal: LeadProposal = {
        id: `prop-${generateId()}`,
        leadId,
        version,
        title: form.title.trim() || `Proposal v${version}`,
        total: form.total,
        status: "Draft",
        date: new Date().toISOString().slice(0, 10),
        notes: form.notes.trim(),
      };
      current.proposals.unshift(proposal);
      current.activities.unshift({
        id: `act-${generateId()}`,
        leadId,
        action: `Proposal created: ${proposal.title} (${formatCurrency(proposal.total)})`,
        user: "John Smith",
        date: new Date().toISOString(),
      });
      saveLeadCrmData(leadId, current);
      refresh();
      return proposal;
    },
    [leadId, lead, refresh]
  );

  const sendProposal = useCallback(
    (proposalId: string) => {
      if (!lead) return;
      const current = getLeadCrmData(leadId, lead);
      const proposal = current.proposals.find((p) => p.id === proposalId);
      if (!proposal) return;
      proposal.status = "Sent";
      current.activities.unshift({
        id: `act-${generateId()}`,
        leadId,
        action: `Proposal sent to client: ${proposal.title}`,
        user: "John Smith",
        date: new Date().toISOString(),
      });
      saveLeadCrmData(leadId, current);
      refresh();
    },
    [leadId, lead, refresh]
  );

  const logCall = useCallback(
    (notes: string) => {
      if (!lead) return;
      addActivity(leadId, `Call logged with ${lead.clientName}${notes ? `: ${notes}` : ""}`);
      refresh();
    },
    [leadId, lead, refresh]
  );

  const sendEmail = useCallback(
    (subject: string, body: string) => {
      if (!lead) return;
      addActivity(leadId, `Email sent to ${lead.clientEmail}: "${subject}"`);
      refresh();
      return { to: lead.clientEmail, subject, body };
    },
    [leadId, lead, refresh]
  );

  const logCustomActivity = useCallback(
    (action: string) => {
      addActivity(leadId, action);
      refresh();
    },
    [leadId, refresh]
  );

  return {
    ...data,
    scheduleMeeting,
    createProposal,
    sendProposal,
    logCall,
    sendEmail,
    logCustomActivity,
    refresh,
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}
