"use client";

import { Car } from "lucide-react";
import HospitalityModulePage from "@/components/hospitality/HospitalityModulePage";
import { demoTransportation } from "@/lib/demo-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function TransportationPage() {
  return (
    <HospitalityModulePage
      title="Transportation"
      subtitle="Schedule shuttles, cars, and local transport"
      icon={Car}
      data={demoTransportation}
      searchKeys={["guestName", "eventName", "route", "driver", "vehicleType"]}
      addLabel="Schedule Transport"
      columns={[
        { key: "guestName", label: "Guest" },
        { key: "eventName", label: "Event" },
        { key: "vehicleType", label: "Vehicle" },
        { key: "route", label: "Route" },
        { key: "pickupTime", label: "Pickup", render: (r) => formatDateTime(r.pickupTime) },
        { key: "driver", label: "Driver" },
        { key: "cost", label: "Cost", render: (r) => (r.cost ? formatCurrency(r.cost) : "Complimentary") },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
