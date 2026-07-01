import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBroker } from "@/lib/supabase/get-user";
import { archiveProperty } from "@/app/actions/properties";
import Link from "next/link";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function PropertyDetailPage({
  params,
}: Props) {
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

  const {
    data: propertyImages,
  } = await supabase
    .from(
      "property_images"
    )
    .select("*")
    .eq(
      "property_id",
      property.id
    )
    .order(
      "sort_order",
      {
        ascending: true,
      }
    );

  const coverImage =
    propertyImages?.find(
      (img) =>
        img.is_cover
    ) ??
    propertyImages?.[0];

  const matchingPurpose =
  property.purpose === "sell"
    ? "buy"
    : property.purpose ?? "";

  const { data: candidateRequirements } =
    await supabase
      .from("requirements")
      .select("*")
      .eq("user_id", broker.profile.id)
      .eq(
        "property_type",
        property.property_type
      )
      .eq(
        "purpose",
        matchingPurpose
      )
      .is("deleted_at", null)
      .gte(
        "budget",
        property.price ?? 0
      );

      const matchingRequirements =
      (candidateRequirements ?? [])
        .map((requirement) => {
          let score = 0;

          // mandatory matches
          score += 50;
          score += 30;

          // configuration exact match
          if (
            property.configuration &&
            requirement.configuration &&
            property.configuration
              .trim()
              .toLowerCase() ===
              requirement.configuration
                .trim()
                .toLowerCase()
          ) {
            score += 20;
          }

      // location exact match
      if (
        property.location &&
        requirement.location &&
        property.location
          .trim()
          .toLowerCase() ===
          requirement.location
            .trim()
            .toLowerCase()
      ) {
        score += 15;
      }

      // partial location
      else if (
        property.location &&
        requirement.location &&
        (
          property.location
            .toLowerCase()
            .includes(
              requirement.location.toLowerCase()
            ) ||
          requirement.location
            .toLowerCase()
            .includes(
              property.location.toLowerCase()
            )
        )
      ) {
        score += 10;
      }

      const budget = Number(
        requirement.budget ?? 0
      );

      const price = Number(
        property.price ?? 0
      );

      if (
        budget > 0 &&
        Math.abs(budget - price) <=
          budget * 0.1
      ) {
        score += 5;
      }

      return {
        ...requirement,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

const shareText = [
  "━━━━━━━━━━━━━━",
  `PROPERTY FOR ${property.purpose?.toUpperCase() ?? ""}`,
  "━━━━━━━━━━━━━━",
  "",

  `Type: ${property.property_type ?? "-"}`,

  property.configuration
    ? `Configuration: ${property.configuration}`
    : null,

  property.location
    ? `Location: ${property.location}`
    : null,

  property.area_value
    ? `Area: ${property.area_value} ${property.area_unit ?? "sq yd"}`
    : null,

  property.price
    ? `Price: ₹${Number(property.price).toLocaleString("en-IN")}`
    : null,

  property.status
    ? `Status: ${property.status}`
    : null,

  "",

  "Contact:",
  property.owner_mobile ?? "",
]
  .filter(Boolean)
  .join("\n");

return (
  <div className="w-full space-y-4 pb-24">
    <Link
      href="/properties"
      className="inline-flex text-sm text-muted-foreground"
    >
      ← Back to Properties
    </Link>

    <div>
  <h1 className="text-2xl font-bold capitalize">
    🏠 {property.property_type}
  </h1>

  <p className="text-sm text-muted-foreground">
    Property Details
  </p>
</div>

{/* Property Images */}
{propertyImages &&
  propertyImages.length >
    0 && (
    <div className="space-y-3">

      {/* Cover Image */}
      <div className="overflow-hidden rounded-2xl border">
        <img
          src={
            coverImage?.image_url
          }
          alt="Property"
          className="h-48 md:h-56 w-full object-cover"
        />
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {propertyImages
          .filter(
            (image) =>
              !image.is_cover
          )
          .map(
            (image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-lg border"
            >
              <a
                href={image.image_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={image.image_url}
                  alt=""
                  className="h-20 w-full object-cover cursor-pointer"
                />
              </a>

              {image.is_cover && (
                <div className="bg-green-100 py-1 text-center text-[10px] font-medium text-green-700">
                  ⭐ Cover
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
)}

<div className="w-full rounded-2xl border bg-card p-5">
      <div className="space-y-4">
        <div className="w-full rounded-2xl border bg-card p-5">
          <div className="space-y-4">

            {/* Owner Information */}
            <div className="rounded-xl border p-3">
              <p className="mb-3 text-sm font-medium">
                Owner Information
              </p>

              <div className="space-y-1.5">
                <div className="font-medium">
                  👤 {property.owner_name ?? "-"}
                </div>

                <div>
                  📞 {property.owner_mobile ?? "-"}
                </div>

                {property.owner_alternate_mobile && (
                  <div>
                    📞 {property.owner_alternate_mobile}
                  </div>
                )}

                {property.owner_type && (
                  <div>
                    🏢 {
                      property.owner_type
                        .charAt(0)
                        .toUpperCase() +
                      property.owner_type.slice(1)
                    }
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${property.owner_mobile}`}
                  className="flex h-10 items-center justify-center rounded-lg border"
                >
                  📞 Call
                </a>

                <a
                  href={`https://wa.me/91${property.owner_mobile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 items-center justify-center rounded-lg bg-green-600 text-white"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>

            {/* Location */}
            <div>
              <p className="text-sm text-muted-foreground">
                Location
              </p>

              <p className="font-medium">
                📍 {property.location}
              </p>
            </div>

            {/* Purpose + Status */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <p className="text-sm text-muted-foreground">
                  Purpose
                </p>

                <p className="font-medium">
                  🏷{" "}
                  {property.purpose === "sell"
                    ? "For Sell"
                    : property.purpose === "rent"
                    ? "For Rent"
                    : property.purpose === "lease"
                    ? "For Lease"
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Status
                </p>

                <span className="inline-flex rounded-full bg-muted px-3 py-1 text-sm capitalize">
                  {property.status}
                </span>
              </div>

            </div>

            {/* Configuration + Area */}
            {(property.configuration?.trim() ||
              property.area_value) && (
              <div className="grid grid-cols-2 gap-4">

                {property.configuration?.trim() && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Configuration
                    </p>

                    <p className="font-medium">
                      🏡 {property.configuration}
                    </p>
                  </div>
                )}

                {property.area_value && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Area
                    </p>

                    <p className="font-medium">
                      📐 {property.area_value} Sq. Yards
                    </p>
                  </div>
                )}

              </div>
            )}

            {/* Price */}
            <div className="py-2">
              <p className="text-sm text-muted-foreground">
                Price
              </p>

              <p className="text-3xl font-bold">
                ₹{" "}
                {Number(
                  property.price ?? 0
                ).toLocaleString("en-IN")}
              </p>
            </div>

            {/* Notes */}
            {property.notes?.trim() && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Notes
                </p>

                <div className="mt-2 rounded-xl bg-muted p-3 text-sm">
                  {property.notes}
                </div>
              </div>
            )}

          </div>
        </div>
        
      </div>
    </div>

    <div className="w-full rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">
            Follow-ups
          </h2>

          <p className="text-sm text-muted-foreground">
            Track activity for this property
          </p>
        </div>

        <Link
          href={`/follow-ups/new?propertyId=${property.id}`}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          + Add
        </Link>
      </div>

      <div className="mt-4 rounded-xl bg-muted p-3 text-sm text-muted-foreground">
        No follow-ups yet.
      </div>
    </div>

    {matchingRequirements.length > 0 && (
      <div className="rounded-2xl border bg-card p-5">
        <h2 className="font-semibold">
          Matching Requirements
        </h2>

        <p className="text-sm text-muted-foreground">
          {matchingRequirements.length} matches found
        </p>

        <div className="mt-4 space-y-3">
          {matchingRequirements.map(
            (requirement) => (
              <Link
                key={requirement.id}
                href={`/needs/${requirement.id}`}
                className="block rounded-xl border p-4"
              >
                <div className="font-medium">
                  👤{" "}
                  {requirement.client_name ||
                    "Unknown Client"}
                </div>

                <div className="mt-2 text-sm text-muted-foreground">
                  📱 {requirement.mobile}
                </div>

                <div className="mt-1 text-sm">
                  📍 {requirement.location}
                </div>

                <div className="mt-1 text-sm">
                  💰 ₹{" "}
                  {Number(
                    requirement.budget ?? 0
                  ).toLocaleString("en-IN")}
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    )}

    <div className="grid grid-cols-2 gap-3">
      <Link
        href={`/properties/${property.id}/edit`}
        className="flex h-12 items-center justify-center rounded-xl bg-primary font-medium text-primary-foreground"
      >
        Edit
      </Link>

      <a
        href={`https://wa.me/?text=${encodeURIComponent(
          shareText
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 items-center justify-center rounded-xl bg-green-600 font-medium text-white"
      >
        Share Property
      </a>
    </div>

    <form
      action={archiveProperty.bind(
        null,
        property.id
      )}
    >
      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center rounded-xl border border-red-200 text-red-600"
      >
        Archive Property
      </button>
    </form>
  </div>
);


}