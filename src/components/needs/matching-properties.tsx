import Link from "next/link";

interface Props {
  matchingProperties: any[];
}

export function MatchingProperties({
  matchingProperties,
}: Props) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="mb-4">
        <h2 className="font-semibold">
          Matching Properties
        </h2>

        <p className="text-sm text-muted-foreground">
          {matchingProperties.length > 0
            ? `${matchingProperties.length} match${
                matchingProperties.length > 1
                  ? "es"
                  : ""
              } found`
            : "No matches found"}
        </p>
      </div>

      {matchingProperties.length === 0 ? (
        <div className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
          No matching properties found.
        </div>
      ) : (
        <div className="space-y-2">
          {matchingProperties.map(
            (property: any) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="block rounded-xl border p-3 transition hover:bg-muted/50"
              >
                <div className="font-medium capitalize">
                  🏠 {property.property_type}

                  {property.purpose && (
                    <span className="text-muted-foreground">
                      {" "}
                      •{" "}
                      {property.purpose ===
                      "sell"
                        ? "For Sell"
                        : property.purpose ===
                          "rent"
                        ? "For Rent"
                        : "For Lease"}
                    </span>
                  )}
                </div>

                {property.configuration?.trim() && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    🏡{" "}
                    {property.configuration}
                  </div>
                )}

                {property.location?.trim() && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    📍{" "}
                    {property.location}
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between">
                  <div className="font-semibold">
                    💰 ₹{" "}
                    {Number(
                      property.price ?? 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </div>

                  {property.score >
                    0 && (
                    <div className="text-xs font-medium text-green-600">
                      ⭐{" "}
                      {
                        property.score
                      } pts
                    </div>
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