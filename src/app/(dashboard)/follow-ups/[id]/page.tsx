import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentBroker } from "@/lib/supabase/get-user";
import { snoozeFollowUp } from "../actions";

interface Props {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    success?: string;
  }>;
}

export default async function FollowUpDetailPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const query = await searchParams;

  const broker = await getCurrentBroker();

  if (!broker) {
    return null;
  }

  const supabase = await createClient();

  const { data: followUp } = await supabase
    .from("follow_ups")
    .select(`
      *,
      requirements (
        id,
        client_name,
        mobile,
        property_type,
        purpose,
        area,
        budget
      )
    `)
    .eq("id", id)
    .eq("user_id", broker.profile.id)
    .single();

  if (!followUp) {
    notFound();
  }

  return (
    <div className="space-y-4 pb-24">
      <Link
        href="/follow-ups"
        className="text-sm text-muted-foreground"
      >
        ← Back to Follow-ups
      </Link>

      <div>
        <h1 className="text-2xl font-bold">
          {followUp.title}
        </h1>

        {query.success === "snoozed" && (
          <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            ✅ Follow-up rescheduled successfully
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Follow-up Details
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border p-5">
        <div>
          <p className="text-sm text-muted-foreground">
            Status
          </p>

          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs ${
              followUp.status === "completed"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {followUp.status}
          </span>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Due Date
          </p>

          <p>
            {new Date(
              followUp.due_date
            ).toLocaleString("en-IN")}
          </p>
        </div>

        {followUp.notes && (
          <div>
            <p className="text-sm text-muted-foreground">
              Notes
            </p>

            <div className="rounded-xl bg-muted p-3">
              {followUp.notes}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-2xl border p-5">
        <h2 className="font-semibold">
          Client Requirement
        </h2>

        <p>
          👤{" "}
          {
            followUp.requirements
              ?.client_name
          }
        </p>

        <p>
          📞{" "}
          {
            followUp.requirements
              ?.mobile
          }
        </p>

        <p>
          🏠{" "}
          {
            followUp.requirements
              ?.property_type
          }
        </p>

        <p>
          🎯{" "}
          {
            followUp.requirements
              ?.purpose
          }
        </p>

        <p>
          📍{" "}
          {
            followUp.requirements
              ?.area
          }
        </p>

        <p>
          💰 ₹{" "}
          {Number(
            followUp.requirements
              ?.budget ?? 0
          ).toLocaleString("en-IN")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={`tel:${followUp.requirements?.mobile}`}
          className="flex h-12 items-center justify-center rounded-xl border"
        >
          Call
        </a>

        <a
          href={`https://wa.me/91${followUp.requirements?.mobile}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center rounded-xl bg-green-600 text-white"
        >
          WhatsApp
        </a>
      </div>

      {followUp.status !== "completed" && (
        <div className="grid grid-cols-2 gap-3">
          <form
            action={async () => {
              "use server";
              await snoozeFollowUp(
                followUp.id,
                1
              );
            }}
          >
            <button
              type="submit"
              className="h-12 w-full rounded-xl border"
            >
              ⏰ Snooze 1 Day
            </button>
          </form>

          <form
            action={async () => {
              "use server";
              await snoozeFollowUp(
                followUp.id,
                3
              );
            }}
          >
            <button
              type="submit"
              className="h-12 w-full rounded-xl border"
            >
              ⏰ Snooze 3 Days
            </button>
          </form>
        </div>
      )}

      <Link
        href={`/follow-ups/${followUp.id}/edit`}
        className="flex h-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"
      >
        Edit Follow-up
      </Link>
    </div>
  );
}