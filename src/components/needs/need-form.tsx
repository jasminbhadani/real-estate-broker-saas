type NeedFormProps = {
  defaultValues?: {
    client_name?: string;
    mobile?: string;
    property_type?:
      | "plot"
      | "flat"
      | "office"
      | "shop"
      | "warehouse";
    purpose?: "buy" | "rent" | "lease";
    deal_status?:
      | "new_inquiry"
      | "properties_shared"
      | "site_visit_planned"
      | "site_visit_done"
      | "negotiation"
      | "token_received"
      | "closed"
      | "lost";
    area?: string;
    location?: string;
    configuration?: string;
    budget?: number;
    notes?: string;
  };
  action: (formData: FormData) => Promise<void>;
};

export function NeedForm({
  defaultValues,
  action,
}: NeedFormProps) {
  return (
    <form action={action} className="space-y-4">

      {/* Client Name */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Client Name *
        </label>

        <input
          name="client_name"
          required
          defaultValue={defaultValues?.client_name}
          placeholder="e.g. Jignesh Patel"
          className="w-full rounded-xl border px-3 py-2"
        />
      </div>

      {/* Mobile */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Mobile *
        </label>

        <input
          name="mobile"
          required
          pattern="[0-9]{10}"
          maxLength={10}
          defaultValue={defaultValues?.mobile}
          placeholder="e.g. 9876543210"
          className="w-full rounded-xl border px-3 py-2"
        />
      </div>

      {/* Deal Status */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Deal Status
          </label>

          <select
            name="deal_status"
            defaultValue={
              defaultValues?.deal_status ?? "new_inquiry"
            }
            className="w-full rounded-xl border px-3 py-2"
          >
            <option value="new_inquiry">
              🟢 New Inquiry
            </option>

            <option value="properties_shared">
              📤 Properties Shared
            </option>

            <option value="site_visit_planned">
              📅 Site Visit Planned
            </option>

            <option value="site_visit_done">
              🏠 Site Visit Done
            </option>

            <option value="negotiation">
              🤝 Negotiation
            </option>

            <option value="token_received">
              💰 Token Received
            </option>

            <option value="closed">
              ✅ Closed
            </option>

            <option value="lost">
              ❌ Lost
            </option>
          </select>
        </div>

      {/* Property Type */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Property Type *
        </label>

        <select
          name="property_type"
          required
          defaultValue={
            defaultValues?.property_type ?? ""
          }
          className="w-full rounded-xl border px-3 py-2"
        >
          <option value="">
            Select Type
          </option>

          <option value="plot">
            Plot
          </option>

          <option value="flat">
            Flat
          </option>

          <option value="office">
            Office
          </option>

          <option value="shop">
            Shop
          </option>

          <option value="warehouse">
            Warehouse
          </option>
        </select>
      </div>

      {/* Purpose */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Purpose *
        </label>

        <select
          name="purpose"
          required
          defaultValue={
            defaultValues?.purpose ?? ""
          }
          className="w-full rounded-xl border px-3 py-2"
        >
          <option value="">
            Select Purpose
          </option>

          <option value="buy">
            Buy
          </option>

          <option value="rent">
            Rent
          </option>

          <option value="lease">
            Lease
          </option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Location *
        </label>

        <input
          name="location"
          required
          defaultValue={defaultValues?.location}
          placeholder="e.g. Satellite, Bopal, Gota"
          className="w-full rounded-xl border px-3 py-2"
        />
      </div>

      {/* Budget */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Budget *
        </label>

        <input
          type="number"
          name="budget"
          required
          defaultValue={defaultValues?.budget}
          placeholder="e.g. 8500000"
          className="w-full rounded-xl border px-3 py-2"
        />
      </div>

      {/* Configuration */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Configuration
        </label>

        <input
          name="configuration"
          defaultValue={defaultValues?.configuration}
          placeholder="e.g. 2 BHK, 3 BHK, Furnished"
          className="w-full rounded-xl border px-3 py-2"
        />
      </div>

      {/* Area */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Area (Sq. Ft.)
        </label>

        <input
          name="area"
          defaultValue={defaultValues?.area}
          placeholder="e.g. 1200 sq.ft."
          className="w-full rounded-xl border px-3 py-2"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Notes
        </label>

        <textarea
          name="notes"
          rows={4}
          defaultValue={defaultValues?.notes}
          placeholder="Additional details..."
          className="w-full rounded-xl border px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-primary py-3 text-primary-foreground"
      >
        Save Need
      </button>
    </form>
  );
}