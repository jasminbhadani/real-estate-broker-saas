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

  const owner_name = String(
    formData.get("owner_name") ?? ""
  );

  const owner_mobile = String(
    formData.get("owner_mobile") ?? ""
  );

  const owner_alternate_mobile = String(
    formData.get(
      "owner_alternate_mobile"
    ) ?? ""
  );

  const owner_type = String(
    formData.get("owner_type") ?? ""
  );

  const images = formData.getAll(
    "property_images"
  ) as File[];

      console.log(
      "Images received:",
      images.length,
      images.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      }))
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

  if (!owner_name.trim()) {
  throw new Error(
    "Owner name is required"
  );
}

if (!owner_mobile.trim()) {
  throw new Error(
    "Owner mobile is required"
  );
}
  const {
    data: property,
    error,
  } = await supabase
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

      area_unit: "sqyd",

      price:
        Number(price),

      status,

      notes:
        notes.trim() ||
        null,

      owner_name:
        owner_name.trim(),

      owner_mobile:
        owner_mobile.trim(),

      owner_alternate_mobile:
        owner_alternate_mobile.trim() ||
        null,

      owner_type:
        owner_type.trim() ||
        null,
    })
    .select()
    .single();

  if (error) {
    console.error(
      "Create property error:",
      error
    );

    throw new Error(
      error.message
    );
  }

  const validImages = images.filter(
    (file) =>
      file instanceof File &&
      file.size > 0
  );

  console.log(
    "Valid images:",
    validImages.length
  );

  if (validImages.length > 0) {
    for (
      let index = 0;
      index < validImages.length &&
      index < 5;
      index++
    ) {
      const image =
        validImages[index];

      // Size validation (3 MB)
      if (
        image.size >
        3 * 1024 * 1024
      ) {
        console.log(
          `${image.name} exceeds 3 MB limit`
        );
        continue;
      }

      const filePath =
        `${broker.profile.id}/${property.id}/${Date.now()}-${index}-${image.name}`;

      const {
        data,
        error: uploadError,
      } = await supabase.storage
        .from("property-images")
        .upload(
          filePath,
          image
        );

      console.log(
        "Upload result:",
        data,
        uploadError
      );

      if (
        !uploadError &&
        data
      ) {
        const publicUrl =
          supabase.storage
            .from(
              "property-images"
            )
            .getPublicUrl(
              data.path
            ).data.publicUrl;

        const {
          error: imageError,
        } = await supabase
          .from(
            "property_images"
          )
          .insert({
            property_id:
              property.id,

            image_url:
              publicUrl,

            sort_order:
              index + 1,

            is_cover:
              index === 0,
          });

        console.log(
          `Image ${index + 1} DB insert:`,
          imageError
        );
      }
    }
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

  const owner_name = String(
    formData.get("owner_name") ?? ""
  );

  const owner_mobile = String(
    formData.get("owner_mobile") ?? ""
  );

  const owner_alternate_mobile = String(
    formData.get(
      "owner_alternate_mobile"
    ) ?? ""
  );

  const owner_type = String(
    formData.get("owner_type") ?? ""
  );

  const images = formData.getAll(
  "property_images"
) as File[];

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

  if (!owner_name.trim()) {
    throw new Error(
      "Owner name is required"
    );
  }

  if (!owner_mobile.trim()) {
    throw new Error(
      "Owner mobile is required"
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

        owner_name:
          owner_name.trim(),

        owner_mobile:
          owner_mobile.trim(),

        owner_alternate_mobile:
          owner_alternate_mobile.trim() ||
          null,

        owner_type:
          owner_type.trim() || null,
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

  const validImages = images.filter(
  (file) =>
    file instanceof File &&
    file.size > 0
);

if (validImages.length > 0) {
  const {
    data: existingImages,
  } = await supabase
    .from("property_images")
    .select("id")
    .eq("property_id", id);

  const existingCount =
    existingImages?.length ?? 0;

  for (
    let index = 0;
    index < validImages.length &&
    existingCount + index < 5;
    index++
  ) {
    const image =
      validImages[index];

    if (
      image.size >
      3 * 1024 * 1024
    ) {
      continue;
    }

    const filePath =
      `${broker.profile.id}/${id}/${Date.now()}-${index}-${image.name}`;

    const {
      data,
      error: uploadError,
    } = await supabase.storage
      .from("property-images")
      .upload(
        filePath,
        image
      );

    if (
      uploadError ||
      !data
    ) {
      continue;
    }

    const publicUrl =
      supabase.storage
        .from(
          "property-images"
        )
        .getPublicUrl(
          data.path
        ).data.publicUrl;

    await supabase
      .from(
        "property_images"
      )
      .insert({
        property_id: id,

        image_url:
          publicUrl,

        sort_order:
          existingCount +
          index +
          1,

        is_cover:
          existingCount ===
            0 && index === 0,
      });
  }
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

export async function deletePropertyImage(
  imageId: string
) {
  const broker =
    await getCurrentBroker();

  if (!broker) {
    throw new Error(
      "Unauthorized"
    );
  }

  const supabase =
    await createClient();

  const {
    data: image,
  } = await supabase
    .from("property_images")
    .select("*")
    .eq("id", imageId)
    .single();

  if (!image) {
    throw new Error(
      "Image not found"
    );
  }

  const {
    data: property,
  } = await supabase
    .from("properties")
    .select("id")
    .eq(
      "id",
      image.property_id
    )
    .eq(
      "user_id",
      broker.profile.id
    )
    .single();

  if (!property) {
    throw new Error(
      "Unauthorized"
    );
  }

  const {
    data: images,
  } = await supabase
    .from("property_images")
    .select("*")
    .eq(
      "property_id",
      image.property_id
    );

  // If deleting cover image,
  // assign another image as cover
  if (image.is_cover) {
    const replacement =
      (images ?? []).find(
        (img) =>
          img.id !== imageId
      );

    if (replacement) {
      await supabase
        .from(
          "property_images"
        )
        .update({
          is_cover: true,
        })
        .eq(
          "id",
          replacement.id
        );
    }
  }

  await supabase
    .from(
      "property_images"
    )
    .delete()
    .eq(
      "id",
      imageId
    );

  revalidatePath(
    "/properties"
  );

  revalidatePath(
    `/properties/${image.property_id}`
  );

  revalidatePath(
    `/properties/${image.property_id}/edit`
  );
}

export async function setCoverImage(
  imageId: string,
  propertyId: string
) {
  const broker =
    await getCurrentBroker();

  if (!broker) {
    throw new Error(
      "Unauthorized"
    );
  }

  const supabase =
    await createClient();

  const {
    data: property,
  } = await supabase
    .from("properties")
    .select("id")
    .eq(
      "id",
      propertyId
    )
    .eq(
      "user_id",
      broker.profile.id
    )
    .single();

  if (!property) {
    throw new Error(
      "Unauthorized"
    );
  }

  await supabase
    .from(
      "property_images"
    )
    .update({
      is_cover: false,
    })
    .eq(
      "property_id",
      propertyId
    );

  await supabase
    .from(
      "property_images"
    )
    .update({
      is_cover: true,
    })
    .eq("id", imageId);

  revalidatePath(
    `/properties/${propertyId}`
  );

  revalidatePath(
    `/properties/${propertyId}/edit`
  );

  revalidatePath(
    "/properties"
  );
}