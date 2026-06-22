"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getCurrentBroker } from "@/lib/supabase/get-user";

export async function archiveNeed(
  needId: string
) {
  const broker = await getCurrentBroker();

  if (!broker) {
    return;
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("requirements")
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", needId)
    .eq("user_id", broker.profile.id);

  if (error) {
    console.error(
      "Archive need error:",
      error
    );
    return;
  }

  revalidatePath("/needs");
}