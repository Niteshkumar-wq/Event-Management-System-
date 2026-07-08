"use client";

import { Crown } from "lucide-react";
import HospitalityModulePage from "@/components/hospitality/HospitalityModulePage";
import { demoVipServices } from "@/lib/demo-data";

export default function VipPage() {
  return (
    <HospitalityModulePage
      title="VIP Services"
      subtitle="Personalized services for VIP guests"
      icon={Crown}
      data={demoVipServices}
      searchKeys={["guestName", "eventName", "service", "assignedTo"]}
      addLabel="Add VIP Service"
      columns={[
        { key: "guestName", label: "Guest" },
        { key: "eventName", label: "Event" },
        { key: "service", label: "Service" },
        { key: "details", label: "Details" },
        { key: "assignedTo", label: "Assigned To" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
