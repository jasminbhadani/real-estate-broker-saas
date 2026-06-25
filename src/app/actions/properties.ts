"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentBroker } from "@/lib/supabase/get-user";

type PropertyType =
  | "plot"
  | "flat"
  | "office"
  | "shop"
  | "warehouse";

type PropertyStatus =
  | "available"
  | "sold"
  | "rented";

export async function createProperty(
  formData: FormData
) {
  const broker =
    await getCurrentBroker();

  if (!broker) {
    throw new Error("Unauthorized");
  }

  const supabase =
    await createClient();

  const property_type =
    formData.get(
      "property_type"
    ) as PropertyType;

  const location = String(
    formData.get("location") ?? ""
  );

  const configuration = String(
    formData.get(
      "configuration"
    ) ?? ""
  );

  const area = String(
    formData.get("area") ?? ""
  );

  const price = formData.get("price");

  const status = formData.get(
    "status"
  ) as PropertyStatus;

  const notes = String(
    formData.get("notes") ?? ""
  );

  const purpose = String(
    formData.get("purpose") ?? ""
  );

  // Validation
  if (!location.trim()) {
    throw new Error(
      "Location is required"
    );
  }

  if (!price) {
    throw new Error(
      "Price is required"
    );
  }

  if (!purpose) {
    throw new Error(
      "Purpose is required"
    );
  }

  if (!status) {
    throw new Error(
      "Status is required"
    );
  }

  const { error } =
    await supabase
      .from("properties")
      .insert({
        user_id:
          broker.profile.id,
        property_type,
        location:
          location.trim(),
        configuration:
          configuration.trim() ||
          null,
        purpose,
        area_value: area
          ? Number(area)
          : null,
        area_unit: "sqft",
        price: Number(price),
        status,
        notes:
          notes.trim() || null,
      });

  if (error) {
    console.error(
      "Create property error:",
      error
    );

    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/properties"
  );
  revalidatePath(
    "/dashboard"
  );

  redirect("/properties");
}

export async function updateProperty(
  id: string,
  formData: FormData
) {
  const broker =
    await getCurrentBroker();

  if (!broker) {
    throw new Error("Unauthorized");
  }

  const supabase =
    await createClient();

  const property_type =
    formData.get(
      "property_type"
    ) as PropertyType;

  const location = String(
    formData.get("location") ?? ""
  );

  const configuration = String(
    formData.get(
      "configuration"
    ) ?? ""
  );

  const area = String(
    formData.get("area") ?? ""
  );

  const price = formData.get("price");

  const status = formData.get(
    "status"
  ) as PropertyStatus;

  const notes = String(
    formData.get("notes") ?? ""
  );

  const purpose = String(
    formData.get("purpose") ?? ""
  );

  // Validation
  if (!location.trim()) {
    throw new Error(
      "Location is required"
    );
  }

  if (!price) {
    throw new Error(
      "Price is required"
    );
  }

  if (!purpose) {
    throw new Error(
      "Purpose is required"
    );
  }

  if (!status) {
    throw new Error(
      "Status is required"
    );
  }

  const { error } =
    await supabase
      .from("properties")
      .update({
        property_type,
        location:
          location.trim(),
        configuration:
          configuration.trim() ||
          null,
        area_value: area
          ? Number(area)
          : null,
        price: Number(price),
        status,
        purpose,
        notes:
          notes.trim() || null,
      })
      .eq("id", id)
      .eq(
        "user_id",
        broker.profile.id
      );

  if (error) {
    console.error(
      "Update property error:",
      error
    );

    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/properties"
  );
  revalidatePath(
    `/properties/${id}`
  );

  redirect(
    `/properties/${id}`
  );
}

export async function archiveProperty(
  id: string
) {
  const broker =
    await getCurrentBroker();

  if (!broker) {
    throw new Error("Unauthorized");
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from("properties")
      .update({
        deleted_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .eq(
        "user_id",
        broker.profile.id
      );

  if (error) {
    console.error(
      "Archive property error:",
      error
    );

    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/properties"
  );
  revalidatePath(
    "/dashboard"
  );

  redirect("/properties");
}