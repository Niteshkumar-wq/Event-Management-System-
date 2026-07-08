"use client";

import { UtensilsCrossed } from "lucide-react";
import HospitalityModulePage from "@/components/hospitality/HospitalityModulePage";
import { demoCatering } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export default function CateringPage() {
  return (
    <HospitalityModulePage
      title="Food & Catering"
      subtitle="Menu planning, vendor coordination, and dietary tracking"
      icon={UtensilsCrossed}
      data={demoCatering}
      searchKeys={["eventName", "mealType", "menu", "vendor"]}
      addLabel="Add Menu"
      columns={[
        { key: "eventName", label: "Event" },
        { key: "mealType", label: "Meal Type" },
        { key: "menu", label: "Menu" },
        { key: "servings", label: "Servings" },
        { key: "vendor", label: "Vendor" },
        { key: "dietaryNotes", label: "Dietary Notes" },
        { key: "cost", label: "Cost", render: (r) => formatCurrency(r.cost) },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
