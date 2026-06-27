import Link from "next/link";
import { redirect } from "next/navigation";

import { archiveNeed } from "@/app/(dashboard)/needs/actions";
import { ArchiveNeedButton } from "@/components/needs/archive-need-button";
import { getCurrentBroker } from "@/lib/supabase/get-user";
import { createClient } from "@/lib/supabase/server";
import { DealProgressCard } from "@/components/needs/deal-progress-card";
import { MatchingProperties } from "@/components/needs/matching-properties";
import { NeedFollowups } from "@/components/needs/need-followups";

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

    {/* CLIENT + DEAL CARD */}
    <div className="rounded-2xl border bg-card p-5">
      <div className="space-y-4">

        <div className="text-lg font-medium">
          📞 {requirement.mobile}
        </div>

        {/* QUICK ACTIONS */}
        <div className="sticky bottom-16 z-10 grid grid-cols-2 gap-3 bg-background py-2">
          <a
            href={`tel:${requirement.mobile}`}
            className="flex h-11 items-center justify-center rounded-xl border font-medium"
          >
            📞 Call
          </a>

          <a
            href={`https://wa.me/91${requirement.mobile}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center rounded-xl bg-green-600 font-medium text-white"
          >
            💬 WhatsApp
          </a>
        </div>

        {/* DEAL PROGRESS */}
        <DealProgressCard
          needId={requirement.id}
          dealStatus={requirement.deal_status}
        />

        {/* PROPERTY TYPE */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-muted px-3 py-1 text-sm capitalize">
            🏠 {requirement.property_type}
          </span>

          <span className="rounded-full bg-muted px-3 py-1 text-sm capitalize">
            🎯 {requirement.purpose || "Not Set"}
          </span>
        </div>

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

        {requirement.area?.trim() && (
          <div>
            <p className="text-sm text-muted-foreground">
              Area Requirement
            </p>

            <p className="font-medium">
              📐 {requirement.area}
            </p>
          </div>
        )}

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

        {requirement.notes?.trim() && (
          <div>
            <p className="text-sm text-muted-foreground">
              Notes
            </p>

            <div className="mt-2 rounded-xl bg-muted p-3 text-sm">
              {requirement.notes}
            </div>
          </div>
        )}

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

    {/* FOLLOWUPS FIRST */}
    <NeedFollowups
      requirementId={requirement.id}
      followUps={followUps ?? []}
    />

    {/* MATCHING PROPERTIES */}
    <MatchingProperties
      matchingProperties={
        matchingProperties
      }
    />

    {/* BOTTOM ACTIONS */}
    <div className="sticky bottom-16 z-10 grid grid-cols-2 gap-3 bg-background py-2">
      <Link
        href={`/needs/${requirement.id}/edit`}
        className="flex h-12 items-center justify-center rounded-xl bg-primary font-medium text-primary-foreground"
      >
        Edit
      </Link>

      <form action={archiveAction}>
        <ArchiveNeedButton />
      </form>
    </div>
  </div>
);
}
  
    