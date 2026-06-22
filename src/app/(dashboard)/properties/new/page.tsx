// app/(dashboard)/properties/new/page.tsx

import { PropertyForm } from "@/components/properties/property-form";

export default function NewPropertyPage() {
  return (
    <div className="space-y-4 pb-24">
      <h1 className="text-2xl font-bold">
        Add Property
      </h1>

      <PropertyForm />
    </div>
  );
}