"use client";

import {
  createProperty,
  updateProperty,
} from "@/app/actions/properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { setCoverImage } from "@/app/actions/properties";
import { deletePropertyImage } from "@/app/actions/properties";

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

    owner_name: string | null;
    owner_mobile: string | null;
    owner_alternate_mobile: string | null;
    owner_type: string | null;

    images?: {
      id: string;
      image_url: string;
      is_cover?: boolean | null;
      sort_order: number | null;
    }[];
  };
}

export function PropertyForm({
  property,
}: PropertyFormProps) {

  const [
    selectedImages,
    setSelectedImages,
  ] = useState<File[]>([]);

  const fileInputRef =
    useRef<HTMLInputElement>(
      null
    );

  const hasExistingCover =
  property?.images?.some(
    (img) => img.is_cover
  ) ?? false;

  return (
    <form
      action={
        property
          ? updateProperty.bind(null, property.id)
          : createProperty
      }
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">

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

      {/* Owner Information */}
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-medium">
          Owner Information
        </h3>

        {/* Owner Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Owner Name *
          </label>

          <Input
            name="owner_name"
            required
            placeholder="e.g. Rajesh Patel"
            defaultValue={
              property?.owner_name ?? ""
            }
            onInvalid={(e) =>
              e.currentTarget.setCustomValidity(
                "Owner name is required"
              )
            }
            onInput={(e) =>
              e.currentTarget.setCustomValidity("")
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3">

          {/* Owner Mobile */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Owner Mobile *
            </label>

            <Input
              name="owner_mobile"
              type="tel"
              required
              placeholder="9876543210"
              defaultValue={
                property?.owner_mobile ?? ""
              }
              pattern="[0-9]{10}"
              onInvalid={(e) =>
                e.currentTarget.setCustomValidity(
                  "Enter valid 10 digit mobile number"
                )
              }
              onInput={(e) =>
                e.currentTarget.setCustomValidity("")
              }
            />
          </div>

          {/* Owner Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Owner Type
            </label>

            <select
              name="owner_type"
              className="w-full rounded-md border p-3"
              defaultValue={
                property?.owner_type ?? "owner"
              }
            >
              <option value="owner">
                Owner
              </option>

              <option value="broker">
                Broker
              </option>

              <option value="builder">
                Builder
              </option>

              <option value="tenant">
                Tenant
              </option>

              <option value="other">
                Other
              </option>
            </select>
          </div>

        </div>

        {/* Alternate Mobile */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Alternate Mobile
          </label>

          <Input
            name="owner_alternate_mobile"
            type="tel"
            placeholder="Optional"
            defaultValue={
              property?.owner_alternate_mobile ??
              ""
            }
          />
        </div>
      </div>
      

      <div className="grid grid-cols-2 gap-3">

        {/* Price */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Price *
          </label>

          <Input
            name="price"
            type="number"
            required
            placeholder="8500000"
            defaultValue={
              property?.price ?? ""
            }
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
          Area (Sq. Yards)
        </label>

        <Input
          name="area"
          type="number"
          placeholder="e.g. 2000 sq.yards"
          defaultValue={
            property?.area_value ?? ""
          }
        />
      </div>

      {/* Property Photos */}
      <div className="space-y-3">
        {/* Existing Property Images */}
        {property?.images &&
          property.images.length >
            0 && (
            <div className="space-y-3 rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  Existing Photos
                </h3>

                <span className="text-xs text-muted-foreground">
                  {
                    property.images
                      .length
                  }{" "}
                  uploaded
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {property.images.map(
                  (image) => (
                    <div
                      key={image.id}
                      className="overflow-hidden rounded-xl border bg-white shadow-sm"
                    >
                      <img
                        src={
                          image.image_url
                        }
                        alt=""
                        className="h-28 w-full object-cover"
                      />

                      <div className="flex items-center justify-between p-2">
                        {image.is_cover ? (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-medium text-green-700">
                            ⭐ Cover
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="text-[10px] text-blue-600"
                            onClick={async () => {
                              if (!property?.id) return;

                              await setCoverImage(
                                image.id,
                                property.id
                              );

                              window.location.reload();
                            }}
                          >
                            Make Cover
                          </button>
                        )}

                        <button
                        type="button"
                        className="text-[10px] text-red-500"
                        onClick={async () => {
                          const confirmed =
                            window.confirm(
                              "Delete this photo?"
                            );

                          if (!confirmed)
                            return;

                          try {
                            await deletePropertyImage(
                              image.id
                            );

                            window.location.reload();
                          } catch (error) {
                            alert(
                              error instanceof Error
                                ? error.message
                                : "Unable to delete image"
                            );
                          }
                        }}
                      >
                        🗑 Delete
                      </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
        )}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            Property Photos
          </label>

          <span className="text-xs text-muted-foreground font-medium">
            {selectedImages.length}/5 selected
            {selectedImages.length < 5 &&
              ` • ${5 - selectedImages.length} remaining`}
          </span>
        </div>

        {/* Hidden Input */}
        <input
          ref={fileInputRef}
          type="file"
          name="property_images"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const newFiles = Array.from(
              e.target.files || []
            );

            const validFiles =
              newFiles.filter(
                (file) =>
                  file.size <=
                  3 * 1024 * 1024
              );

            const updatedFiles = [
              ...selectedImages,
              ...validFiles,
            ].slice(0, 5);

            setSelectedImages(
              updatedFiles
            );

            // Sync files back to the native input
            const dataTransfer =
              new DataTransfer();

            updatedFiles.forEach(
              (file) =>
                dataTransfer.items.add(
                  file
                )
            );

            if (
              fileInputRef.current
            ) {
              fileInputRef.current.files =
                dataTransfer.files;
            }
          }}
        />

        {/* Add Button */}
        <button
          type="button"
          onClick={() =>
            fileInputRef.current?.click()
          }
          disabled={
            selectedImages.length >= 5
          }
          className="w-full rounded-xl border-2 border-dashed border-gray-300 py-6 px-4 text-center transition hover:bg-gray-50 disabled:opacity-50"
        >
          <div className="space-y-2">
            <div className="text-2xl">
              📷
            </div>

            <div className="font-semibold">
              Add Property Photos
            </div>

            <div className="text-xs text-muted-foreground">
              Tap to select one or more photos
            </div>

            <div className="text-[11px] text-muted-foreground">
              JPG, PNG, WEBP • Max 3 MB each
            </div>
          </div>
        </button>
          
        {/* Preview Grid */}
        {selectedImages.length >
          0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {selectedImages.map(
              (
                file,
                index
              ) => (
                <div
                  key={`${file.name}-${index}`}
                  className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
                >
                  <img
                    src={URL.createObjectURL(
                      file
                    )}
                    alt=""
                    className="h-28 w-full object-cover"
                  />

                  <div className="p-2 space-y-1">
                    <div className="flex items-center justify-between">
                      {!hasExistingCover &&
                        index === 0 && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-[10px] font-medium text-green-700">
                          ⭐ Cover Photo
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                      const updated =
                        selectedImages.filter(
                          (_, i) =>
                            i !== index
                        );

                      setSelectedImages(
                        updated
                      );

                      const dataTransfer =
                        new DataTransfer();

                      updated.forEach(
                        (file) =>
                          dataTransfer.items.add(
                            file
                          )
                      );

                      if (
                        fileInputRef.current
                      ) {
                        fileInputRef.current.files =
                          dataTransfer.files;
                      }
                    }}
                        className="text-red-500 text-xs font-medium hover:underline"
                        >
                          🗑 Remove
                      </button>
                    </div>

                    <p
                      className="text-xs font-medium truncate"
                      title={file.name}
                    >
                      {file.name}
                    </p>

                    <p className="text-[11px] text-muted-foreground">
                      {(
                        file.size /
                        1024 /
                        1024
                      ).toFixed(
                        1
                      )}{" "}
                      MB
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Upload up to 5 photos. You can add photos one by one or select multiple at once.
        </p>
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