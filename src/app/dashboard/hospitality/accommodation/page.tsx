"use client";

import { Hotel } from "lucide-react";
import HospitalityModulePage from "@/components/hospitality/HospitalityModulePage";
import { demoAccommodations } from "@/lib/demo-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AccommodationPage() {
  return (
    <HospitalityModulePage
      title="Accommodation"
      subtitle="Manage hotel bookings and room assignments"
      icon={Hotel}
      data={demoAccommodations}
      searchKeys={["guestName", "eventName", "hotelName", "roomType"]}
      addLabel="Book Room"
      columns={[
        { key: "guestName", label: "Guest" },
        { key: "eventName", label: "Event" },
        { key: "hotelName", label: "Hotel" },
        { key: "roomType", label: "Room Type" },
        { key: "checkIn", label: "Check In", render: (r) => formatDate(r.checkIn) },
        { key: "checkOut", label: "Check Out", render: (r) => formatDate(r.checkOut) },
        { key: "costPerNight", label: "Per Night", render: (r) => formatCurrency(r.costPerNight) },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
