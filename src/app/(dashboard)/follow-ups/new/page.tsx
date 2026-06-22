import { redirect } from "next/navigation";

import { createFollowUp } from "../actions";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBroker } from "@/lib/supabase/get-user";

export default async function NewFollowUpPage({
  searchParams,
}: {
  searchParams: Promise<{
    requirementId?: string;
  }>;
}) {
  const broker = await getCurrentBroker();

  if (!broker) {
    return null;
  }

  const params = await searchParams;

  const requirementId =
    params.requirementId;

  if (!requirementId) {
    redirect("/needs");
  }

  const supabase = await createClient();

  const { data: requirement } =
    await supabase
      .from("requirements")
      .select("*")
      .eq("id", requirementId)
      .eq("user_id", broker.profile.id)
      .single();

  if (!requirement) {
    redirect("/needs");
  }

  return (
    <div className="space-y-4 pb-24">
      <div>
        <h1 className="text-2xl font-bold">
          Add Follow-up
        </h1>

        <p className="text-sm text-muted-foreground">
          Schedule your next action
        </p>
      </div>

      {/* Client Card */}

      <div className="rounded-2xl border p-4">
        <p className="font-semibold">
          👤 {requirement.client_name}
        </p>

        <p className="mt-1 text-sm text-muted-foreground capitalize">
          🏠 {requirement.property_type}
          {(requirement as any).purpose && (
            <>
              {" "}
              • 🎯 {(requirement as any).purpose}
            </>
          )}
        </p>

        {requirement.mobile && (
          <p className="mt-1 text-sm">
            📞 {requirement.mobile}
          </p>
        )}
      </div>

      <form
        action={createFollowUp}
        className="space-y-4"
      >
        <input
          type="hidden"
          name="requirement_id"
          value={requirement.id}
        />

        <div>
          <label className="mb-1 block text-sm font-medium">
            Follow-up Type
          </label>

          <select
            name="title"
            className="w-full rounded-xl border p-3"
            required
          >
            <option value="">
              Select Type
            </option>

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
            required
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Notes
          </label>

          <textarea
            name="notes"
            rows={4}
            placeholder="Discussion summary, next steps..."
            className="w-full rounded-xl border p-3"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground"
        >
          Save Follow-up
        </button>
      </form>
    </div>
  );
}