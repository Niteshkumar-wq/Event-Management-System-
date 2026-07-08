"use client";

import { Headphones } from "lucide-react";
import HospitalityModulePage from "@/components/hospitality/HospitalityModulePage";
import { demoTickets } from "@/lib/demo-data";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function HelpdeskPage() {
  return (
    <HospitalityModulePage
      title="Help Desk"
      subtitle="Event-day support tickets and issue resolution"
      icon={Headphones}
      data={demoTickets}
      searchKeys={["subject", "eventName", "category", "reportedBy", "assignedTo"]}
      addLabel="New Ticket"
      columns={[
        { key: "subject", label: "Subject" },
        { key: "eventName", label: "Event" },
        { key: "category", label: "Category" },
        { key: "reportedBy", label: "Reported By" },
        { key: "assignedTo", label: "Assigned To", render: (r) => r.assignedTo || "Unassigned" },
        {
          key: "priority",
          label: "Priority",
          render: (r) => (
            <span className={cn(
              "inline-flex px-2.5 py-1 rounded-full text-xs font-medium border capitalize",
              r.priority === "urgent" ? "bg-red-500/10 text-red-700 border-red-500/20" : "bg-amber-500/10 text-amber-700 border-amber-500/20"
            )}>
              {r.priority}
            </span>
          ),
        },
        { key: "createdAt", label: "Created", render: (r) => formatDateTime(r.createdAt) },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
