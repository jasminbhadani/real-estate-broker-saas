import Link from "next/link";
import { redirect } from "next/navigation";

import { archiveNeed } from "@/app/(dashboard)/needs/actions";
import { ArchiveNeedButton } from "@/components/needs/archive-need-button";
import { getCurrentBroker } from "@/lib/supabase/get-user";
import { createClient } from "@/lib/supabase/server";

export default async function NeedDetailPage({
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
    .is("deleted_at", null)
    .single();

  const { data: followUps } = await supabase
    .from("follow_ups")
    .select("*")
    .eq("requirement_id", id)
    .is("deleted_at", null)
    .order("due_date", {
      ascending: false,
    });

  if (!requirement) {
    return (
      <div className="rounded-xl border p-6 text-center">
        Need not found.
      </div>
    );
  }

  const matchingPurpose:
    "sell" | "rent" | "lease" =
    requirement.purpose === "buy"
      ? "sell"
      : requirement.purpose === "rent"
      ? "rent"
      : "lease";

  const { data: candidateProperties } =
  await supabase
    .from("properties")
    .select("*")
    .eq("user_id", broker.profile.id)
    .eq("property_type", requirement.property_type ?? "plot")
    .eq("purpose", matchingPurpose)
    .eq("status", "available")
    .is("deleted_at", null)
    .lte("price", requirement.budget ?? 0);
    
    const matchingProperties =
  (candidateProperties ?? [])
    .map((property) => {
      let score = 0;

      // mandatory matches
      score += 50; // property type
      score += 30; // purpose

      // configuration exact match
      if (
        requirement.configuration &&
        property.configuration &&
        requirement.configuration
          .trim()
          .toLowerCase() ===
          property.configuration
            .trim()
            .toLowerCase()
      ) {
        score += 20;
      }

      // location exact match
      if (
        requirement.location &&
        property.location &&
        requirement.location
          .trim()
          .toLowerCase() ===
          property.location
            .trim()
            .toLowerCase()
      ) {
        score += 15;
      }

      // location partial match
      else if (
        requirement.location &&
        property.location &&
        property.location
          .toLowerCase()
          .includes(
            requirement.location.toLowerCase()
          )
      ) {
        score += 10;
      }

      // budget close match
      const budget =
        Number(requirement.budget ?? 0);

      const price =
        Number(property.price ?? 0);

      if (
        budget > 0 &&
        Math.abs(budget - price) <=
          budget * 0.1
      ) {
        score += 5;
      }

      return {
        ...property,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

    async function archiveAction() {
      "use server";

      await archiveNeed(id);

      redirect("/needs");
    }

  return (
    <div className="space-y-4 pb-24">
      <Link
        href="/needs"
        className="inline-flex text-sm text-muted-foreground"
      >
        ← Back to Needs
      </Link>

      <div>
        <h1 className="text-2xl font-bold">
          {requirement.client_name}
        </h1>

        <p className="text-sm text-muted-foreground">
          Client Requirement
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Client Name
            </p>

            <p className="text-lg font-semibold">
              👤 {requirement.client_name}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Mobile Number
            </p>

            <a
              href={`tel:${requirement.mobile}`}
              className="font-medium text-primary"
            >
              📞 {requirement.mobile}
            </a>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-muted px-3 py-1 text-sm capitalize">
              🏠 {requirement.property_type}
            </span>

            <span className="rounded-full bg-muted px-3 py-1 text-sm capitalize">
              🎯 {requirement.purpose || "Not Set"}
            </span>
          </div>

          <>
            {requirement.configuration?.trim() && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Configuration
                </p>

                <p className="font-medium">
                  🏡 {requirement.configuration}
                </p>
              </div>
            )}

            {requirement.location?.trim() && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Location
                </p>

                <p className="font-medium">
                  📍 {requirement.location}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground">
                Area Requirement
              </p>

              <p className="font-medium">
                📐 {requirement.area || "-"}
              </p>
            </div>
          </>

          <div>
            <p className="text-sm text-muted-foreground">
              Budget
            </p>

            <p className="text-3xl font-bold">
              ₹{" "}
              {Number(
                requirement.budget ?? 0
              ).toLocaleString("en-IN")}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Notes
            </p>

            <div className="mt-2 rounded-xl bg-muted p-3 text-sm">
              {requirement.notes?.trim()
                ? requirement.notes
                : "No notes added"}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Added On
            </p>

            <p>
              {requirement.created_at
                ? new Date(
                    requirement.created_at
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "-"}
            </p>
          </div>
        </div>
      </div>
      
      <div className="rounded-2xl border bg-card p-5">
        <div className="mb-4">
          <h2 className="font-semibold">
            Matching Properties
          </h2>

          <p className="text-sm text-muted-foreground">
            {matchingProperties?.length ?? 0} match
            {(matchingProperties?.length ?? 0) === 1
              ? ""
              : "es"}{" "}
            found
          </p>
        </div>

        {!matchingProperties?.length ? (
          <div className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
            No matching properties found.
          </div>
        ) : (
          <div className="space-y-3">
            {matchingProperties.map(
              (property: any) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="block rounded-xl border p-3 hover:bg-muted"
                >
                  <div className="font-medium capitalize">
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

                  {property.configuration?.trim() && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      🏡 {property.configuration}
                    </div>
                  )}

                  {property.location?.trim() && (
                    <div className="mt-1 text-sm text-muted-foreground">
                      📍 {property.location}
                    </div>
                  )}

                  {property.area_value && (
                    <div className="mt-1 text-sm">
                      📐 {property.area_value} {property.area_unit}
                    </div>
                  )}

                  <div className="mt-2 font-semibold">
                    💰 ₹{" "}
                    {Number(
                      property.price ?? 0
                    ).toLocaleString("en-IN")}
                  </div>
                </Link>
              )
            )}
          </div>
        )}
      </div>

      {/* Follow-ups */}

      <div className="rounded-2xl border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">
              Follow-ups
            </h2>

            <p className="text-sm text-muted-foreground">
              {followUps?.length ?? 0} activities
            </p>
          </div>

          <Link
            href={`/follow-ups/new?requirementId=${requirement.id}`}
            className="rounded-xl border px-3 py-2 text-sm"
          >
            + Add
          </Link>
        </div>

        {!followUps?.length ? (
          <div className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
            No follow-ups yet.
          </div>
        ) : (
          <div className="space-y-3">
            {followUps.map((followUp: any) => {
              const dueDate = new Date(
                followUp.due_date
              );

              const isOverdue =
                followUp.status ===
                  "pending" &&
                dueDate < new Date();

              return (
                <Link
                  key={followUp.id}
                  href={`/follow-ups/${followUp.id}`}
                  className="block rounded-xl border p-3 hover:bg-muted"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {followUp.title}
                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        followUp.status ===
                        "completed"
                          ? "bg-green-100 text-green-700"
                          : isOverdue
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {isOverdue
                        ? "overdue"
                        : followUp.status}
                    </span>
                  </div>

                  <div className="mt-1 text-sm text-muted-foreground">
                    🕒{" "}
                    {dueDate.toLocaleString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    )}
                  </div>

                  {followUp.notes && (
                    <div className="mt-2 text-sm">
                      {followUp.notes}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Link
          href={`/needs/${requirement.id}/edit`}
          className="flex h-12 items-center justify-center rounded-xl bg-primary font-medium text-primary-foreground"
        >
          Edit
        </Link>

        <a
          href={`tel:${requirement.mobile}`}
          className="flex h-12 items-center justify-center rounded-xl border font-medium"
        >
          Call
        </a>

        <a
          href={`https://wa.me/91${requirement.mobile}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center rounded-xl bg-green-600 font-medium text-white"
        >
          WhatsApp
        </a>
      </div>

      <form action={archiveAction}>
        <ArchiveNeedButton />
      </form>
    </div>
  );
}