import Link from "next/link";
import { getCurrentBroker } from "@/lib/supabase/get-user";
import { createClient } from "@/lib/supabase/server";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    type?: string;
    status?: string;
    purpose?: string;
  }>;
}) {
  const broker = await getCurrentBroker();

  if (!broker) {
    return null;
  }

  const params = await searchParams;

  const search = params.search ?? "";

  const type = params.type as
    | "plot"
    | "flat"
    | "office"
    | "shop"
    | "warehouse"
    | undefined;

  const status = params.status as
    | "available"
    | "sold"
    | "rented"
    | undefined;

  const purpose = params.purpose as
    | "sell"
    | "rent"
    | "lease"
    | undefined;

  const supabase = await createClient();

  let query = supabase
    .from("properties")
    .select("*")
    .eq("user_id", broker.profile.id)
    .is("deleted_at", null);

  if (search) {
    query = query.or(
      `location.ilike.%${search}%,configuration.ilike.%${search}%`
    );
  }

  if (type) {
    query = query.eq(
      "property_type",
      type
    );
  }

  if (status) {
    query = query.eq(
      "status",
      status
    );
  }

  if (purpose) {
    query = query.eq(
      "purpose",
      purpose
    );
  }

  const { data: properties, error } =
    await query.order("created_at", {
      ascending: false,
    });

  const { data: requirements } =
    await supabase
      .from("requirements")
      .select(
        "property_type,purpose,deleted_at"
      )
      .eq("user_id", broker.profile.id)
      .is("deleted_at", null);

  const propertiesWithCounts =
    (properties ?? []).map(
      (property: any) => {
        const matchingPurpose =
          property.purpose === "sell"
            ? "buy"
            : property.purpose;

        const matchCount =
          (requirements ?? []).filter(
            (requirement: any) =>
              requirement.property_type ===
                property.property_type &&
              requirement.purpose ===
                matchingPurpose
          ).length;

        return {
          ...property,
          matchCount,
        };
      }
    );

  if (error) {
    console.error(
      "Properties fetch error:",
      error
    );
  }

  return (
    <div className="space-y-4 pb-24">
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-bold">
            Properties
          </h1>

          <p className="text-sm text-muted-foreground">
            Showing {properties?.length ?? 0} result
            {(properties?.length ?? 0) === 1
              ? ""
              : "s"}
          </p>
        </div>

        <Link
          href="/properties/new"
          className="flex h-12 items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground"
        >
          + Add Property
        </Link>
      </div>

      <form
        action="/properties"
        className="space-y-3"
      >
        <input
          type="text"
          name="search"
          placeholder="Search location..."
          defaultValue={search}
          className="w-full rounded-xl border px-3 py-2"
        />

        {/* Property Type */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/properties"
            className={`rounded-full border px-3 py-2 text-sm ${
              !type
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            All Types
          </Link>

          <Link
            href="/properties?type=plot"
            className={`rounded-full border px-3 py-2 text-sm ${
              type === "plot"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            Plot
          </Link>

          <Link
            href="/properties?type=flat"
            className={`rounded-full border px-3 py-2 text-sm ${
              type === "flat"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            Flat
          </Link>

          <Link
            href="/properties?type=office"
            className={`rounded-full border px-3 py-2 text-sm ${
              type === "office"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            Office
          </Link>

          <Link
            href="/properties?type=shop"
            className={`rounded-full border px-3 py-2 text-sm ${
              type === "shop"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            Shop
          </Link>

          <Link
            href="/properties?type=warehouse"
            className={`rounded-full border px-3 py-2 text-sm ${
              type === "warehouse"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            Warehouse
          </Link>
        </div>

        {/* Purpose */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/properties"
            className={`rounded-full border px-3 py-2 text-sm ${
              !purpose
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            All Purpose
          </Link>

          <Link
            href="/properties?purpose=sell"
            className={`rounded-full border px-3 py-2 text-sm ${
              purpose === "sell"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            Sell
          </Link>

          <Link
            href="/properties?purpose=rent"
            className={`rounded-full border px-3 py-2 text-sm ${
              purpose === "rent"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            Rent
          </Link>

          <Link
            href="/properties?purpose=lease"
            className={`rounded-full border px-3 py-2 text-sm ${
              purpose === "lease"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            Lease
          </Link>
        </div>

        {/* Status */}
        <select
          name="status"
          defaultValue={status ?? ""}
          className="w-full rounded-xl border px-3 py-2"
        >
          <option value="">
            All Status
          </option>

          <option value="available">
            Available
          </option>

          <option value="sold">
            Sold
          </option>

          <option value="rented">
            Rented
          </option>
        </select>
      </form>

      {!properties?.length ? (
        <div className="rounded-xl border p-6 text-center">
          <p className="text-muted-foreground">
            No properties found.
          </p>

          {(search ||
            type ||
            status ||
            purpose) && (
            <Link
              href="/properties"
              className="mt-3 inline-flex rounded-lg border px-3 py-2 text-sm"
            >
              Clear Filters
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {propertiesWithCounts.map(
            (property: any) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="block rounded-xl border p-4 active:bg-muted"
            >
              <div className="font-semibold capitalize">
                🏠 {property.property_type}

                {property.purpose && (
                  <span className="text-muted-foreground">
                    {" "}
                    •{" "}
                    {property.purpose === "sell"
                      ? "For Sell"
                      : property.purpose ===
                        "rent"
                      ? "For Rent"
                      : "For Lease"}
                  </span>
                )}
              </div>

              <div className="mt-2 text-sm text-muted-foreground">
                📍 {property.location}
              </div>

              {property.owner_name && (
                <div className="mt-2 text-sm font-medium">
                  👤 {property.owner_name}
                </div>
              )}

              {property.owner_mobile && (
                <div className="text-sm text-muted-foreground">
                  📞 {property.owner_mobile}
                </div>
              )}

              {property.configuration && (
                <div className="mt-2 text-sm text-muted-foreground">
                  🏡 {property.configuration}
                </div>
              )}
              <div className="mt-2 text-base font-semibold">
                💰 ₹{" "}
                {property.price?.toLocaleString(
                  "en-IN"
                )}
              </div>

              {property.area_value != null && (
                <p className="text-sm">
                  📐 {Number(
                    property.area_value
                  ).toLocaleString("en-IN")} sqft
                </p>
              )}

              {property.matchCount > 0 && (
                <div className="mt-2 text-sm font-medium text-green-600">
                  🎯 {property.matchCount} matching
                  {property.matchCount === 1
                    ? " need"
                    : " needs"}
                </div>
              )}

              <div className="mt-2">
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 capitalize">
                  {property.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
