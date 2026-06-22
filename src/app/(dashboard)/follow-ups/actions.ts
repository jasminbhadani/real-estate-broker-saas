"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentBroker } from "@/lib/supabase/get-user";

export async function createFollowUp(
  formData: FormData
) {
  const broker = await getCurrentBroker();

  if (!broker) {
    throw new Error("Unauthorized");
  }

  const requirementId = String(
    formData.get("requirement_id") ?? ""
  );

  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const date = String(
    formData.get("date") ?? ""
  );

  const time = String(
    formData.get("time") ?? ""
  );

  const notes = String(
    formData.get("notes") ?? ""
  ).trim();

  if (
    !requirementId ||
    !title ||
    !date ||
    !time
  ) {
    throw new Error(
      "Please fill all required fields."
    );
  }

  const dueDate = new Date(
    `${date}T${time}:00`
  );

  const supabase = await createClient();

  const { error } = await supabase
    .from("follow_ups")
    .insert({
      user_id: broker.profile.id,
      requirement_id: requirementId,
      title,
      notes,
      due_date: dueDate.toISOString(),
      status: "pending",
    });

  if (error) {
    console.error(
      "Create follow-up error:",
      error
    );

    throw new Error(
      "Failed to create follow-up."
    );
  }

  revalidatePath("/needs");
  revalidatePath("/follow-ups");
  revalidatePath("/dashboard");

  redirect("/follow-ups");
}

export async function completeFollowUp(
  id: string
) {
  const broker = await getCurrentBroker();

  if (!broker) {
    throw new Error("Unauthorized");
  }

  const supabase = await createClient();

  const now = new Date().toISOString();

    const { error } = await supabase
    .from("follow_ups")
    .update({
        status: "completed",
        completed_at: now,
        updated_at: now,
    })
    .eq("id", id)
    .eq("user_id", broker.profile.id);

  if (error) {
    console.error(
      "Complete follow-up error:",
      error
    );

    throw new Error(error.message);
  }

  revalidatePath("/follow-ups");
  revalidatePath(`/follow-ups/${id}`);
  revalidatePath("/dashboard");
}

export async function updateFollowUp(
  formData: FormData
) {
  const broker = await getCurrentBroker();

  if (!broker) {
    throw new Error("Unauthorized");
  }

  const id = String(
    formData.get("id") ?? ""
  );

  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const date = String(
    formData.get("date") ?? ""
  );

  const time = String(
    formData.get("time") ?? ""
  );

  const notes = String(
    formData.get("notes") ?? ""
  ).trim();

  const status =
  (formData.get("status") ??
    "pending") as
    | "pending"
    | "completed";

  if (
    !id ||
    !title ||
    !date ||
    !time
  ) {
    throw new Error(
      "Please fill all required fields."
    );
  }

  const dueDate = new Date(
    `${date}T${time}:00`
  );

  const now = new Date().toISOString();

  const supabase = await createClient();

  const { error } = await supabase
    .from("follow_ups")
    .update({
      title,
      notes,
      due_date: dueDate.toISOString(),
      status,
      completed_at:
        status === "completed"
          ? now
          : null,
      updated_at: now,
    })
    .eq("id", id)
    .eq("user_id", broker.profile.id);

  if (error) {
    console.error(
      "Update follow-up error:",
      error
    );

    throw new Error(error.message);
  }

  revalidatePath("/follow-ups");
  revalidatePath(`/follow-ups/${id}`);
  revalidatePath("/dashboard");

  redirect(`/follow-ups/${id}`);
}

export async function snoozeFollowUp(
  id: string,
  days: number
) {
  const broker = await getCurrentBroker();

  if (!broker) {
    throw new Error("Unauthorized");
  }

  const supabase = await createClient();

  const { data: followUp, error: fetchError } =
    await supabase
      .from("follow_ups")
      .select("id, due_date")
      .eq("id", id)
      .eq("user_id", broker.profile.id)
      .single();

  if (fetchError || !followUp) {
    throw new Error(
      "Follow-up not found."
    );
  }

  const dueDate = new Date(
    followUp.due_date
  );

  dueDate.setDate(
    dueDate.getDate() + days
  );

  const now = new Date().toISOString();

  const { error } = await supabase
    .from("follow_ups")
    .update({
      due_date:
        dueDate.toISOString(),
      status: "pending",
      updated_at: now,
    })
    .eq("id", id)
    .eq("user_id", broker.profile.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/follow-ups");
  revalidatePath(`/follow-ups/${id}`);
  revalidatePath("/dashboard");

  redirect(
    `/follow-ups/${id}?success=snoozed`
  );
}