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
  const broker = await getCurrentBroker();

  if (!broker) {
    return null;
  }

  const { id } = await params;

  const supabase = await createClient();

  const { data: requirement } = await supabase
    .from("requirements")
    .select("*")
    .eq("id", id)
    .eq("user_id", broker.profile.id)
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
    ) as string;

    const purpose = formData.get(
      "purpose"
    ) as string;

    const area = formData.get(
      "area"
    ) as string;

    const budget = Number(
      formData.get("budget") || 0
    );

    const notes = formData.get(
      "notes"
    ) as string;

    const { error } = await supabase
      .from("requirements")
      .update({
        client_name,
        mobile,
        property_type,
        purpose,
        area,
        budget,
        notes,
      } as any)
      .eq("id", id)
      .eq("user_id", broker.profile.id);

    if (error) {
      console.error(
        "Update need error:",
        error
      );
      return;
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
            requirement.client_name ?? "",
          mobile:
            requirement.mobile ?? "",
          property_type: requirement.property_type ?? undefined,
          purpose:
            (requirement as any).purpose ??
            "buy",
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