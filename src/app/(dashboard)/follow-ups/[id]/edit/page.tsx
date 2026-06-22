import { notFound } from "next/navigation";

import { updateFollowUp } from "../../actions";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBroker } from "@/lib/supabase/get-user";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditFollowUpPage({
  params,
}: Props) {
  const { id } = await params;

  const broker = await getCurrentBroker();

  if (!broker) {
    return null;
  }

  const supabase = await createClient();

  const { data: followUp } =
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
      .eq("id", id)
      .eq("user_id", broker.profile.id)
      .single();

  if (!followUp) {
    notFound();
  }

  const dueDate = new Date(
    followUp.due_date
  );

  const dateValue =
    dueDate.toISOString().split("T")[0];

  const timeValue =
    dueDate.toTimeString().slice(0, 5);

  return (
    <div className="space-y-4 pb-24">
      <div>
        <h1 className="text-2xl font-bold">
          Edit Follow-up
        </h1>

        <p className="text-sm text-muted-foreground">
          Update follow-up details
        </p>
      </div>

      <div className="rounded-2xl border p-4">
        <p className="font-semibold">
          👤{" "}
          {
            followUp.requirements
              ?.client_name
          }
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          🏠{" "}
          {
            followUp.requirements
              ?.property_type
          }

          {followUp.requirements
            ?.purpose && (
            <>
              {" "}
              • 🎯{" "}
              {
                followUp
                  .requirements
                  .purpose
              }
            </>
          )}
        </p>
      </div>

      <form
        action={updateFollowUp}
        className="space-y-4"
      >
        <input
          type="hidden"
          name="id"
          value={followUp.id}
        />

        <div>
          <label className="mb-1 block text-sm font-medium">
            Follow-up Type
          </label>

          <select
            name="title"
            defaultValue={followUp.title}
            className="w-full rounded-xl border p-3"
            required
          >
            <option value="Call Client">
              Call Client
            </option>

            <option value="Site Visit">
              Site Visit
            </option>

            <option value="Send Property">
              Send Property
            </option>

            <option value="Meeting">
              Meeting
            </option>

            <option value="Negotiation">
              Negotiation
            </option>

            <option value="Documentation">
              Documentation
            </option>

            <option value="Payment Follow-up">
              Payment Follow-up
            </option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Date
          </label>

          <input
            type="date"
            name="date"
            defaultValue={dateValue}
            required
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Time
          </label>

          <input
            type="time"
            name="time"
            defaultValue={timeValue}
            required
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Status
          </label>

          <select
            name="status"
            defaultValue={followUp.status}
            className="w-full rounded-xl border p-3"
          >
            <option value="pending">
              Pending
            </option>

            <option value="completed">
              Completed
            </option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Notes
          </label>

          <textarea
            name="notes"
            rows={4}
            defaultValue={
              followUp.notes ?? ""
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground"
        >
          Update Follow-up
        </button>
      </form>
    </div>
  );
}