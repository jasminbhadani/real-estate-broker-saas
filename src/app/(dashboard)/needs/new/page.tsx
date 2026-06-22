import { redirect } from "next/navigation";

import { NeedForm } from "@/components/needs/need-form";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBroker } from "@/lib/supabase/get-user";

export default function NewNeedPage() {
  async function createNeed(
    formData: FormData
  ) {
    "use server";

    console.log("CREATE NEED STARTED");

    const broker = await getCurrentBroker();

    if (!broker) {
      return;
    }

    const supabase = await createClient();

    const client_name = formData.get(
      "client_name"
    ) as string;

    const mobile = formData.get(
      "mobile"
    ) as string;

    const property_type = formData.get(
        "property_type"
        ) as
        | "plot"
        | "flat"
        | "office"
        | "shop"
        | "warehouse";

    const purpose = formData.get(
        "purpose"
        ) as
        | "buy"
        | "rent"
        | "sell";

    const area = formData.get(
      "area"
    ) as string;

    const budget = Number(
      formData.get("budget") || 0
    );

    const notes = formData.get(
      "notes"
    ) as string;
    
    console.log({
    client_name,
    mobile,
    property_type,
    purpose,
    area,
    budget,
    notes,
    });

    console.log("BROKER:", broker.profile.id);
    const { data, error } = await supabase
    .from("requirements")
    .insert({
        user_id: broker.profile.id,
        client_name,
        mobile,
        property_type,
        purpose,
        area,
        budget,
        notes,
    } as any)
    .select();

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      console.error(
        "Create need error:",
        error
      );
      return;
    }

    redirect("/needs");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Add Need
      </h1>

      <NeedForm action={createNeed} />
    </div>
  );
}