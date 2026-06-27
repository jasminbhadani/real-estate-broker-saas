import { updateDealStatus } from "@/app/(dashboard)/needs/actions";

interface Props {
  needId: string;
  dealStatus?: string | null;
}

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

function getNextStatus(
  status?: string | null
) {
  switch (status) {
    case "new_inquiry":
    case null:
    case undefined:
      return "properties_shared";

    case "properties_shared":
      return "site_visit_planned";

    case "site_visit_planned":
      return "site_visit_done";

    case "site_visit_done":
      return "negotiation";

    case "negotiation":
      return "token_received";

    case "token_received":
      return "closed";

    default:
      return null;
  }
}

export function DealProgressCard({
  needId,
  dealStatus,
}: Props) {
  const nextStatus =
    getNextStatus(dealStatus);

  async function moveToNext() {
    "use server";

    if (!nextStatus) {
      return;
    }

    await updateDealStatus(
      needId,
      nextStatus
    );
  }

  return (
    <div className="rounded-xl border p-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">
          {getDealStatusLabel(
            dealStatus
          )}
        </div>

        {nextStatus && (
          <form action={moveToNext}>
            <button
              type="submit"
              className="rounded-lg border px-3 py-1 text-sm"
            >
              Move →
            </button>
          </form>
        )}
      </div>

      {nextStatus && (
        <div className="mt-2 text-sm text-muted-foreground">
          Next:{" "}
          <span className="font-medium">
            {getDealStatusLabel(
              nextStatus
            )}
          </span>
        </div>
      )}
    </div>
  );
}