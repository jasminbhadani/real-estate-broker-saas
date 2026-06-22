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
      <select
        name="property_type"
        className="w-full rounded-md border p-3"
        defaultValue={property?.property_type ?? "plot"}
      >
        <option value="plot">Plot</option>
        <option value="flat">Flat</option>
        <option value="office">Office</option>
        <option value="shop">Shop</option>
        <option value="warehouse">Warehouse</option>
      </select>

      {/* Purpose */}
      <select
        name="purpose"
        className="w-full rounded-md border p-3"
        defaultValue={property?.purpose ?? "sell"}
      >
        <option value="sell">
          For Sale
        </option>

        <option value="rent">
          For Rent
        </option>

        <option value="lease">
          For Lease
        </option>
      </select>

      {/* Location */}
      <Input
        name="location"
        placeholder="Location (e.g. Shela)"
        defaultValue={property?.location ?? ""}
      />

      {/* Area */}
      <Input
        name="area"
        type="number"
        placeholder="Area (e.g. 2000)"
        defaultValue={property?.area_value ?? ""}
      />

      {/* Price */}
      <Input
        name="price"
        type="number"
        placeholder="Price"
        defaultValue={property?.price ?? ""}
      />

      {/* Status */}
      <select
        name="status"
        className="w-full rounded-md border p-3"
        defaultValue={property?.status ?? "available"}
      >
        <option value="available">Available</option>
        <option value="sold">Sold</option>
        <option value="rented">Rented</option>
      </select>

      {/* Notes */}
      <Textarea
        name="notes"
        placeholder="Notes"
        rows={4}
        defaultValue={property?.notes ?? ""}
      />

      <Button type="submit" className="w-full">
        {property ? "Update Property" : "Save Property"}
      </Button>
    </form>
  );
}