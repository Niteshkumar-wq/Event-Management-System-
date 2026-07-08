"use client";

import { Plane } from "lucide-react";
import HospitalityModulePage from "@/components/hospitality/HospitalityModulePage";
import { demoTravelBookings } from "@/lib/demo-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function TravelPage() {
  return (
    <HospitalityModulePage
      title="Travel Management"
      subtitle="Book and track flights and travel for guests"
      icon={Plane}
      data={demoTravelBookings}
      searchKeys={["guestName", "eventName", "route", "carrier"]}
      addLabel="Book Travel"
      columns={[
        { key: "guestName", label: "Guest" },
        { key: "eventName", label: "Event" },
        { key: "type", label: "Type" },
        { key: "carrier", label: "Carrier" },
        { key: "route", label: "Route" },
        { key: "departureTime", label: "Departure", render: (r) => formatDateTime(r.departureTime) },
        { key: "cost", label: "Cost", render: (r) => formatCurrency(r.cost) },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
