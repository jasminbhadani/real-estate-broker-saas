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
    purpose?: "buy" | "rent" | "sell";
    area?: string;
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
      <div>
        <label className="mb-1 block text-sm font-medium">
          Client Name
        </label>

        <input
          name="client_name"
          required
          defaultValue={defaultValues?.client_name}
          className="w-full rounded-xl border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Mobile
        </label>

        <input
          name="mobile"
          defaultValue={defaultValues?.mobile}
          className="w-full rounded-xl border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Property Type
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

      <div>
        <label className="mb-1 block text-sm font-medium">
          Purpose
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

          <option value="sell">
            Sell
          </option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Area
        </label>

        <input
          name="area"
          defaultValue={defaultValues?.area}
          className="w-full rounded-xl border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Budget
        </label>

        <input
          type="number"
          name="budget"
          defaultValue={defaultValues?.budget}
          className="w-full rounded-xl border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Notes
        </label>

        <textarea
          name="notes"
          rows={4}
          defaultValue={defaultValues?.notes}
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