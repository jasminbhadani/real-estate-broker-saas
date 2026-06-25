"use client";

import {
  createProperty,
  updateProperty,
} from "@/app/actions/properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PropertyFormProps {
  property?: {
    id: string;
    property_type: string;
    configuration: string | null;
    location: string;
    area_value: number | null;
    price: number | null;
    purpose: string | null;
    status: string | null;
    notes: string | null;
  };
}

export function PropertyForm({
  property,
}: PropertyFormProps) {
  return (
    <form
      action={
        property
          ? updateProperty.bind(null, property.id)
          : createProperty
      }
      className="space-y-4"
    >
      {/* Property Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Property Type *
        </label>

        <select
          name="property_type"
          required
          className="w-full rounded-md border p-3"
          defaultValue={
            property?.property_type ?? "plot"
          }
        >
          <option value="plot">Plot</option>
          <option value="flat">Flat</option>
          <option value="office">Office</option>
          <option value="shop">Shop</option>
          <option value="warehouse">
            Warehouse
          </option>
        </select>
      </div>

      {/* Purpose */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Purpose *
        </label>

        <select
          name="purpose"
          required
          className="w-full rounded-md border p-3"
          defaultValue={
            property?.purpose ?? "sell"
          }
        >
          <option value="sell">
            For Sell
          </option>

          <option value="rent">
            For Rent
          </option>

          <option value="lease">
            For Lease
          </option>
        </select>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Location *
        </label>

        <Input
          name="location"
          required
          placeholder="e.g. Shela"
          defaultValue={property?.location ?? ""}
          onInvalid={(e) =>
            e.currentTarget.setCustomValidity(
              "Location is required"
            )
          }
          onInput={(e) =>
            e.currentTarget.setCustomValidity("")
          }
        />
      </div>

      {/* Price */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Price *
        </label>

        <Input
          name="price"
          type="number"
          required
          placeholder="e.g. 8500000"
          defaultValue={property?.price ?? ""}
          onInvalid={(e) =>
            e.currentTarget.setCustomValidity(
              "Price is required"
            )
          }
          onInput={(e) =>
            e.currentTarget.setCustomValidity("")
          }
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Status *
        </label>

        <select
          name="status"
          required
          className="w-full rounded-md border p-3"
          defaultValue={
            property?.status ??
            "available"
          }
        >
          <option value="available">
            Available
          </option>

          <option value="sold">
            Sold
          </option>

          <option value="rented">
            Rented
          </option>
        </select>
      </div>
      
      {/* Configuration */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Configuration
        </label>

        <Input
          name="configuration"
          placeholder="e.g. 3 BHK, Furnished, Commercial Plot"
          defaultValue={
            property?.configuration ?? ""
          }
        />
      </div>

      {/* Area */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Area (Sq. Ft.)
        </label>

        <Input
          name="area"
          type="number"
          placeholder="e.g. 2000 sq.ft."
          defaultValue={
            property?.area_value ?? ""
          }
        />
      </div>

      
      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Notes
        </label>

        <Textarea
          name="notes"
          placeholder="Additional details..."
          rows={4}
          defaultValue={
            property?.notes ?? ""
          }
        />
      </div>

      <Button
        type="submit"
        className="w-full"
      >
        {property
          ? "Update Property"
          : "Save Property"}
      </Button>
    </form>
  );
}