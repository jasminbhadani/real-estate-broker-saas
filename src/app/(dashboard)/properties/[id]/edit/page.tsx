import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentBroker } from "@/lib/supabase/get-user";
import { PropertyForm } from "@/components/properties/property-form";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const broker = await getCurrentBroker();

  if (!broker) {
    return null;
  }

  const supabase = await createClient();

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("user_id", broker.profile.id)
    .single();

  if (!property) {
    notFound();
  }

  return (
    <div className="space-y-4 pb-24">
      <h1 className="text-2xl font-bold">
        Edit Property
      </h1>

      <PropertyForm property={property} />
    </div>
  );
}