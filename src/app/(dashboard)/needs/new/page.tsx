import { redirect } from "next/navigation";

import { NeedForm } from "@/components/needs/need-form";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBroker } from "@/lib/supabase/get-user";

export default function NewNeedPage() {
  async function createNeed(
    formData: FormData
  ) {
    "use server";

    const broker =
      await getCurrentBroker();

    if (!broker) {
      throw new Error(
        "Unauthorized"
      );
    }

    const supabase =
      await createClient();

    const client_name = String(
      formData.get(
        "client_name"
      ) ?? ""
    );

    const mobile = String(
      formData.get("mobile") ?? ""
    );

    const property_type =
      formData.get(
        "property_type"
      ) as
        | "plot"
        | "flat"
        | "office"
        | "shop"
        | "warehouse";

    const purpose =
      formData.get(
        "purpose"
      ) as
        | "buy"
        | "rent"
        | "lease";

    const area = String(
      formData.get("area") ?? ""
    );

    const location = String(
      formData.get("location") ?? ""
    );

    const configuration = String(
      formData.get(
        "configuration"
      ) ?? ""
    );

    const budget = Number(
      formData.get("budget") || 0
    );

    const notes = String(
      formData.get("notes") ?? ""
    );

    // Validation

    if (!client_name.trim()) {
      throw new Error(
        "Client name is required"
      );
    }

    if (!mobile.trim()) {
      throw new Error(
        "Mobile number is required"
      );
    }

    if (!property_type) {
      throw new Error(
        "Property type is required"
      );
    }

    if (!purpose) {
      throw new Error(
        "Purpose is required"
      );
    }

    if (!location.trim()) {
      throw new Error(
        "Location is required"
      );
    }

    if (!budget) {
      throw new Error(
        "Budget is required"
      );
    }

    const { error } =
      await supabase
        .from("requirements")
        .insert({
          user_id:
            broker.profile.id,
          client_name:
            client_name.trim(),
          mobile:
            mobile.trim(),
          property_type,
          location:
            location.trim(),
          purpose,
          configuration:
            configuration.trim() ||
            null,
          area:
            area.trim() || null,
          budget,
          notes:
            notes.trim() || null,
        } as any);

    if (error) {
      console.error(
        "Create need error:",
        error
      );

      throw new Error(
        error.message
      );
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