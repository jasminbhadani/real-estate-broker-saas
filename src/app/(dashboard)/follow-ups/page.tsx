import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { getCurrentBroker } from "@/lib/supabase/get-user";
import { completeFollowUp } from "./actions";

export default async function FollowUpsPage() {
  const broker = await getCurrentBroker();

  if (!broker) {
    return null;
  }

  const supabase = await createClient();

  const { data: followUps, error } =
    await supabase
      .from("follow_ups")
      .select(`
        *,
        requirements (
          id,
          client_name,
          mobile,
          property_type,
          purpose
        )
      `)
      .eq("user_id", broker.profile.id)
      .is("deleted_at", null)
      .order("due_date", {
        ascending: true,
      });

  if (error) {
    console.error(
      "Follow-ups fetch error:",
      error
    );
  }

  const now = new Date();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const overdue =
    followUps?.filter((f: any) => {
      const due = new Date(f.due_date);

      return (
        f.status === "pending" &&
        due < startOfToday
      );
    }) ?? [];

  const today =
    followUps?.filter((f: any) => {
      const due = new Date(f.due_date);

      return (
        f.status === "pending" &&
        due >= startOfToday &&
        due <= endOfToday
      );
    }) ?? [];

  const upcoming =
    followUps?.filter((f: any) => {
      const due = new Date(f.due_date);

      return (
        f.status === "pending" &&
        due > endOfToday
      );
    }) ?? [];

  const completed =
    followUps?.filter(
      (f: any) =>
        f.status === "completed"
    ) ?? [];

  function Section({
    title,
    count,
    items,
    color,
  }: {
    title: string;
    count: number;
    items: any[];
    color: string;
  }) {
    if (!items.length) {
      return null;
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2
            className={`text-lg font-semibold ${color}`}
          >
            {title}
          </h2>

          <span className="rounded-full bg-muted px-3 py-1 text-xs">
            {count}
          </span>
        </div>

        {items.map((followUp) => {
          const dueDate = new Date(
            followUp.due_date
          );

          return (
            <div
              key={followUp.id}
              className={`rounded-2xl border p-4 ${
                title === "🔥 Overdue"
                  ? "border-red-300 bg-red-50"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    {followUp.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    🕒{" "}
                    {dueDate.toLocaleString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    followUp.status ===
                    "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {followUp.status}
                </span>
              </div>

              <div className="mt-3 rounded-xl bg-muted p-3">
                <div className="font-medium">
                  👤{" "}
                  {
                    followUp.requirements
                      ?.client_name
                  }
                </div>

                <div className="text-sm text-muted-foreground">
                  🏠{" "}
                  {
                    followUp.requirements
                      ?.property_type
                  }

                  {followUp.requirements
                    ?.purpose && (
                    <>
                      {" "}
                      •{" "}
                      {
                        followUp
                          .requirements
                          .purpose
                      }
                    </>
                  )}
                </div>
              </div>

              {followUp.notes && (
                <div className="mt-3 rounded-xl bg-muted p-3 text-sm">
                  📝 {followUp.notes}
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href={`/follow-ups/${followUp.id}`}
                  className="flex h-10 items-center justify-center rounded-xl border text-sm font-medium"
                >
                  View
                </Link>

                {followUp.status !==
                  "completed" && (
                  <form
                    action={async () => {
                        "use server";
                        await completeFollowUp(followUp.id);
                    }}
                    >
                    <button
                        type="submit"
                        className="h-10 w-full rounded-xl bg-primary text-sm font-medium text-primary-foreground"
                    >
                        Complete
                    </button>
                </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold">
          Follow-ups
        </h1>

        <p className="text-sm text-muted-foreground">
          Manage your daily broker tasks
        </p>
      </div>

      {!followUps?.length ? (
        <div className="rounded-2xl border p-8 text-center">
          No follow-ups found.
        </div>
      ) : (
        <>
          <Section
            title="🔥 Overdue"
            count={overdue.length}
            items={overdue}
            color="text-red-600"
          />

          <Section
            title="📅 Today"
            count={today.length}
            items={today}
            color="text-blue-600"
          />

          <Section
            title="⏳ Upcoming"
            count={upcoming.length}
            items={upcoming}
            color="text-amber-600"
          />

          <Section
            title="✅ Completed"
            count={completed.length}
            items={completed}
            color="text-green-600"
          />
        </>
      )}
    </div>
  );
}