import Link from "next/link";

import { getCurrentBroker } from "@/lib/supabase/get-user";
import { createClient } from "@/lib/supabase/server";

function getDealStatusLabel(
  status?: string | null
) {
  switch (status) {
    case "properties_shared":
      return "📤 Properties Shared";

    case "site_visit_planned":
      return "📅 Site Visit Planned";

    case "site_visit_done":
      return "🏠 Site Visit Done";

    case "negotiation":
      return "🤝 Negotiation";

    case "token_received":
      return "💰 Token Received";

    case "closed":
      return "✅ Closed";

    case "lost":
      return "❌ Lost";

    default:
      return "🟢 New Inquiry";
  }
}

export default async function NeedsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    type?: string;
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

  const purpose = params.purpose as
    | "buy"
    | "rent"
    | "sell"
    | undefined;

  const supabase = await createClient();

  let query = supabase
    .from("requirements")
    .select("*")
    .eq("user_id", broker.profile.id)
    .is("deleted_at", null);

  if (search) {
    query = query.or(
      `client_name.ilike.%${search}%,
      mobile.ilike.%${search}%,
      area.ilike.%${search}%,
      location.ilike.%${search}%,
      configuration.ilike.%${search}%`
    );
  }

  if (type) {
    query = query.eq(
      "property_type",
      type
    );
  }

  if (purpose) {
    query = query.eq(
      "purpose",
      purpose
    );
  }

  const { data: requirements, error } =
      await query.order("created_at", {
        ascending: false,
      });

    const { data: properties } =
      await supabase
        .from("properties")
        .select(
          "property_type,purpose,status,deleted_at"
        )
        .eq("user_id", broker.profile.id)
        .is("deleted_at", null);

    const requirementsWithCounts =
      (requirements ?? []).map(
        (requirement: any) => {
          const matchingPurpose =
            requirement.purpose === "buy"
              ? "sell"
              : requirement.purpose;

          const matchCount =
            (properties ?? []).filter(
              (property: any) =>
                property.property_type ===
                  requirement.property_type &&
                property.purpose ===
                  matchingPurpose &&
                property.status ===
                  "available"
            ).length;

          return {
            ...requirement,
            matchCount,
          };
        }
      );

  if (error) {
    console.error(
      "Needs fetch error:",
      error
    );
  }

  return (
    <div className="space-y-4 pb-24">
      <div>
        <h1 className="text-2xl font-bold">
          Needs
        </h1>

        <p className="text-sm text-muted-foreground">
          Showing {requirements?.length ?? 0} result
          {(requirements?.length ?? 0) === 1
            ? ""
            : "s"}
        </p>
      </div>

      <Link
        href="/needs/new"
        className="flex h-12 items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground"
      >
        + Add Need
      </Link>

      <form
        action="/needs"
        className="space-y-3"
      >
        <input
          type="text"
          name="search"
          placeholder="Search client, mobile or area..."
          defaultValue={search}
          className="w-full rounded-xl border px-3 py-2"
        />

        <div className="flex flex-wrap gap-2">
          <Link
            href="/needs"
            className={`rounded-full border px-3 py-2 text-sm ${
              !type
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            All
          </Link>

          <Link
            href="/needs?type=plot"
            className={`rounded-full border px-3 py-2 text-sm ${
              type === "plot"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            Plot
          </Link>

          <Link
            href="/needs?type=flat"
            className={`rounded-full border px-3 py-2 text-sm ${
              type === "flat"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            Flat
          </Link>

          <Link
            href="/needs?type=office"
            className={`rounded-full border px-3 py-2 text-sm ${
              type === "office"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            Office
          </Link>

          <Link
            href="/needs?type=shop"
            className={`rounded-full border px-3 py-2 text-sm ${
              type === "shop"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            Shop
          </Link>

          <Link
            href="/needs?type=warehouse"
            className={`rounded-full border px-3 py-2 text-sm ${
              type === "warehouse"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            Warehouse
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={
              type
                ? `/needs?type=${type}`
                : "/needs"
            }
            className={`rounded-full border px-3 py-2 text-sm ${
              !purpose
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            All Purpose
          </Link>

          <Link
            href={`/needs?purpose=buy${
              type ? `&type=${type}` : ""
            }`}
            className={`rounded-full border px-3 py-2 text-sm ${
              purpose === "buy"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            Buy
          </Link>

          <Link
            href={`/needs?purpose=rent${
              type ? `&type=${type}` : ""
            }`}
            className={`rounded-full border px-3 py-2 text-sm ${
              purpose === "rent"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            Rent
          </Link>

          <Link
            href={`/needs?purpose=sell${
              type ? `&type=${type}` : ""
            }`}
            className={`rounded-full border px-3 py-2 text-sm ${
              purpose === "sell"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            Lease
          </Link>
        </div>
      </form>

      {!requirements?.length ? (
        <div className="rounded-xl border p-6 text-center">
          <p className="text-muted-foreground">
            No needs found.
          </p>

          {(search ||
            type ||
            purpose) && (
            <Link
              href="/needs"
              className="mt-3 inline-flex rounded-lg border px-3 py-2 text-sm"
            >
              Clear Filters
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {requirementsWithCounts.map(
              (requirement: any) => (
                <div
                  key={requirement.id}
                  className="rounded-xl border p-4"
                >
                  <Link
                    href={`/needs/${requirement.id}`}
                    className="block"
                  >
                    <div className="font-semibold text-base">
                      👤 {requirement.client_name}
                    </div>

                    <div className="mt-1 text-sm text-muted-foreground">
                      📞 {requirement.mobile}
                    </div>

                    <div className="mt-2 text-sm font-medium capitalize">
                      🏠 {requirement.property_type}

                      {requirement.purpose && (
                        <>
                          {" "}
                          • 🎯 {requirement.purpose}
                        </>
                      )}
                    </div>

                    {requirement.configuration?.trim() && (
                      <div className="mt-1 text-sm text-muted-foreground">
                        🏡 {requirement.configuration}
                      </div>
                    )}

                    <>
                      {requirement.location?.trim() && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          📍 {requirement.location}
                        </div>
                      )}

                      {requirement.area?.trim() && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          📐 {requirement.area}
                        </div>
                      )}
                    </>

                    <div className="mt-3 text-lg font-semibold">
                      💰 ₹{" "}
                      {Number(
                        requirement.budget ?? 0
                      ).toLocaleString("en-IN")}
                    </div>
                    
                    <div className="mt-2 text-sm font-medium">
                      {getDealStatusLabel(
                        requirement.deal_status
                      )}
                    </div>
                    
                    {requirement.matchCount > 0 && (
                      <div className="mt-2 text-sm font-medium text-green-600">
                        🎯 {requirement.matchCount} matching
                        {requirement.matchCount === 1
                          ? " property"
                          : " properties"}
                      </div>
                    )}
                    
                  </Link>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <a
                      href={`tel:${requirement.mobile}`}
                      className="flex h-10 items-center justify-center rounded-lg border text-sm"
                    >
                      📞 Call
                    </a>

                    <a
                      href={`https://wa.me/91${requirement.mobile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 items-center justify-center rounded-lg bg-green-600 text-sm text-white"
                    >
                      WhatsApp
                    </a>

                    <Link
                      href={`/follow-ups/new?requirementId=${requirement.id}`}
                      className="flex h-10 items-center justify-center rounded-lg border text-sm"
                    >
                      ➕ Follow-up
                    </Link>
                  </div>
                </div>
              )
            )}
        </div>
      )}
    </div>
  );
}