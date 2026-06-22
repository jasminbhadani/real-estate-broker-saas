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

export async function createProperty(formData: FormData) {
const broker = await getCurrentBroker();

if (!broker) {
throw new Error("Unauthorized");
}

const supabase = await createClient();

const property_type = formData.get(
"property_type"
) as PropertyType;

const location = formData.get(
"location"
) as string;

const area = formData.get(
"area"
) as string;

const price = formData.get("price");

const status = formData.get(
"status"
) as PropertyStatus;

const notes = formData.get(
"notes"
) as string;

const purpose = String(
  formData.get("purpose") ?? ""
);

const { error } = await supabase
    .from("properties")
    .insert({
    user_id: broker.profile.id,
    property_type,
    location,
    purpose,
    area_value: area ? Number(area) : null,
    area_unit: "sqft",
    price: price ? Number(price) : null,
    status,
    notes,
});

if (error) {
console.error("Create property error:", error);
throw new Error(error.message);
}

revalidatePath("/properties");
revalidatePath("/dashboard");

redirect("/properties");
}

export async function updateProperty(
id: string,
formData: FormData
) {
const broker = await getCurrentBroker();

if (!broker) {
throw new Error("Unauthorized");
}

const supabase = await createClient();

const property_type = formData.get(
"property_type"
) as PropertyType;

const location = formData.get(
"location"
) as string;

const area = formData.get(
"area"
) as string;

const price = formData.get("price");

const status = formData.get(
"status"
) as PropertyStatus;

const notes = formData.get(
"notes"
) as string;

const purpose = String(
  formData.get("purpose") ?? ""
);

const { error } = await supabase
.from("properties")
.update({
property_type,
location,
area_value: area ? Number(area) : null,
price: price ? Number(price) : null,
status,
purpose,
notes,
})
.eq("id", id)
.eq("user_id", broker.profile.id);

if (error) {
console.error("Update property error:", error);
throw new Error(error.message);
}

revalidatePath("/properties");
revalidatePath(`/properties/${id}`);

redirect(`/properties/${id}`);
}

export async function archiveProperty(id: string) {
const broker = await getCurrentBroker();

if (!broker) {
throw new Error("Unauthorized");
}

const supabase = await createClient();

const { error } = await supabase
.from("properties")
.update({
deleted_at: new Date().toISOString(),
})
.eq("id", id)
.eq("user_id", broker.profile.id);

if (error) {
console.error("Archive property error:", error);
throw new Error(error.message);
}

revalidatePath("/properties");
revalidatePath("/dashboard");

redirect("/properties");
}
