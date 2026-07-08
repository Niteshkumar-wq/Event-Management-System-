"use client";

import { useCallback, useEffect, useState } from "react";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "eventpro-event-data";
export const EVENT_DATA_CHANGED = "eventpro-event-data-changed";

export interface EventTimelineItem {
  id: string;
  eventId: string;
  time: string;
  title: string;
  location: string;
  status: "pending" | "in_progress" | "completed";
}

export interface EventTaskItem {
  id: string;
  eventId: string;
  title: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed";
}

export interface EventRiskItem {
  id: string;
  eventId: string;
  risk: string;
  likelihood: "Low" | "Medium" | "High";
  impact: "Low" | "Medium" | "High";
  mitigation: string;
  status: "Open" | "Mitigated";
}

interface EventData {
  timeline: EventTimelineItem[];
  tasks: EventTaskItem[];
  risks: EventRiskItem[];
}

type Store = Record<string, EventData>;

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
  window.dispatchEvent(new Event(EVENT_DATA_CHANGED));
}

export function getEventData(eventId: string): EventData {
  const store = readStore();
  if (!store[eventId]) {
    store[eventId] = { timeline: [], tasks: [], risks: [] };
    writeStore(store);
  }
  return store[eventId];
}

function saveEventData(eventId: string, data: EventData) {
  const store = readStore();
  store[eventId] = data;
  writeStore(store);
}

export function useEventData(eventId: string) {
  const [data, setData] = useState<EventData>({ timeline: [], tasks: [], risks: [] });

  const refresh = useCallback(() => setData(getEventData(eventId)), [eventId]);

  useEffect(() => {
    refresh();
    window.addEventListener(EVENT_DATA_CHANGED, refresh);
    return () => window.removeEventListener(EVENT_DATA_CHANGED, refresh);
  }, [refresh]);

  const addTimelineItem = useCallback((form: Omit<EventTimelineItem, "id" | "eventId">) => {
    const current = getEventData(eventId);
    current.timeline.push({ ...form, id: `tl-${generateId()}`, eventId });
    current.timeline.sort((a, b) => a.time.localeCompare(b.time));
    saveEventData(eventId, current);
    refresh();
  }, [eventId, refresh]);

  const addTask = useCallback((form: Omit<EventTaskItem, "id" | "eventId" | "status">) => {
    const current = getEventData(eventId);
    current.tasks.unshift({ ...form, id: `task-${generateId()}`, eventId, status: "pending" });
    saveEventData(eventId, current);
    refresh();
  }, [eventId, refresh]);

  const addRisk = useCallback((form: Omit<EventRiskItem, "id" | "eventId">) => {
    const current = getEventData(eventId);
    current.risks.unshift({ ...form, id: `risk-${generateId()}`, eventId });
    saveEventData(eventId, current);
    refresh();
  }, [eventId, refresh]);

  const updateTaskStatus = useCallback((taskId: string, status: EventTaskItem["status"]) => {
    const current = getEventData(eventId);
    const task = current.tasks.find((t) => t.id === taskId);
    if (task) task.status = status;
    saveEventData(eventId, current);
    refresh();
  }, [eventId, refresh]);

  return { ...data, addTimelineItem, addTask, addRisk, updateTaskStatus, refresh };
}
