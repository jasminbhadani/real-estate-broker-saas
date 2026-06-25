import { redirect } from "next/navigation";

import { NeedForm } from "@/components/needs/need-form";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBroker } from "@/lib/supabase/get-user";

export default async function EditNeedPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const broker =
    await getCurrentBroker();

  if (!broker) {
    return null;
  }

  const { id } = await params;

  const supabase =
    await createClient();

  const { data: requirement } =
    await supabase
      .from("requirements")
      .select("*")
      .eq("id", id)
      .eq(
        "user_id",
        broker.profile.id
      )
      .single();

  if (!requirement) {
    return (
      <div>
        Need not found.
      </div>
    );
  }

  async function updateNeed(
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
        .update({
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
        } as any)
        .eq("id", id)
        .eq(
          "user_id",
          broker.profile.id
        );

    if (error) {
      console.error(
        "Update need error:",
        error
      );

      throw new Error(
        error.message
      );
    }

    redirect(`/needs/${id}`);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Edit Need
      </h1>

      <NeedForm
        action={updateNeed}
        defaultValues={{
          client_name:
            requirement.client_name ??
            "",
          mobile:
            requirement.mobile ??
            "",
          property_type:
            requirement.property_type ??
            undefined,
          location:
            requirement.location ??
            "",
          purpose:
            (requirement as any)
              .purpose ?? "buy",
          configuration:
            requirement.configuration ??
            "",
          area:
            requirement.area ?? "",
          budget:
            requirement.budget ?? 0,
          notes:
            requirement.notes ?? "",
        }}
      />
    </div>
  );
}