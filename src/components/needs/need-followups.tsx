import Link from "next/link";

interface Props {
  requirementId: string;
  followUps: any[];
}

export function NeedFollowups({
  requirementId,
  followUps,
}: Props) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">
            Follow-ups
          </h2>

          <p className="text-sm text-muted-foreground">
            {followUps.length} activities
          </p>
        </div>

        <Link
          href={`/follow-ups/new?requirementId=${requirementId}`}
          className="rounded-xl border px-3 py-2 text-sm"
        >
          + Add
        </Link>
      </div>

      {followUps.length === 0 ? (
        <div className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
          No follow-ups yet.
        </div>
      ) : (
        <div className="space-y-3">
          {followUps.map(
            (followUp: any) => (
              <Link
                key={followUp.id}
                href={`/follow-ups/${followUp.id}`}
                className="block rounded-xl border p-3 hover:bg-muted"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {followUp.title}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {followUp.status}
                  </div>
                </div>

                {followUp.notes && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {followUp.notes}
                  </div>
                )}

                <div className="mt-2 text-xs text-muted-foreground">
                  {new Date(
                    followUp.due_date
                  ).toLocaleString(
                    "en-IN"
                  )}
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}