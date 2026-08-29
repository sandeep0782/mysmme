"use client";

import { useState } from "react";
import { MapPin, Plus, Pencil, Home, Phone, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  useGetAddressQuery,
  useAddOrUpdateAddressMutation,
} from "@/store/api/addressApi";

import BookLoader from "@/lib/Spinner";
import NoData from "@/lib/NoData";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface Address {
  _id: string;
  user: string;
  addressLine1: string;
  addressLine2?: string;
  phoneNumber?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  pickupLocation?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AddressFormData {
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  pickupLocation: string;
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AddressesPage() {
  const { data: addressResponse, isLoading, isError } = useGetAddressQuery();

  const [addOrUpdateAddress, { isLoading: isSaving }] =
    useAddOrUpdateAddressMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: {
      addressLine1: "",
      addressLine2: "",
      phoneNumber: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      pickupLocation: "",
    },
  });

  /*
   * Backend response:
   *
   * response(
   *   res,
   *   200,
   *   "Addresses fetched successfully",
   *   user.addresses || []
   * )
   *
   * Therefore:
   *
   * addressResponse.data = [address1, address2, ...]
   *
   * NOT:
   *
   * addressResponse.data.addresses
   */

  const addresses: Address[] = addressResponse?.data || [];
  console.log("Address API response:", addressResponse);
  console.log("Addresses:", addresses);

  /* ------------------------------------------------------------------------ */
  /* Open Add Form                                                            */
  /* ------------------------------------------------------------------------ */

  const openAddForm = () => {
    setEditingAddress(null);

    reset({
      addressLine1: "",
      addressLine2: "",
      phoneNumber: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      pickupLocation: "",
    });

    setShowForm(true);
  };

  /* ------------------------------------------------------------------------ */
  /* Open Edit Form                                                           */
  /* ------------------------------------------------------------------------ */

  const openEditForm = (address: Address) => {
    setEditingAddress(address);

    reset({
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      phoneNumber: address.phoneNumber || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      country: address.country || "India",
      pickupLocation: address.pickupLocation || "",
    });

    setShowForm(true);
  };

  /* ------------------------------------------------------------------------ */
  /* Close Form                                                               */
  /* ------------------------------------------------------------------------ */

  const closeForm = () => {
    setShowForm(false);
    setEditingAddress(null);

    reset({
      addressLine1: "",
      addressLine2: "",
      phoneNumber: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      pickupLocation: "",
    });
  };

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                   */
  /* ------------------------------------------------------------------------ */

  const onSubmit = async (data: AddressFormData) => {
    try {
      const payload = {
        addressLine1: data.addressLine1.trim(),
        addressLine2: data.addressLine2?.trim() || "",
        phoneNumber: data.phoneNumber?.trim() || "",
        city: data.city.trim(),
        state: data.state.trim(),
        pincode: data.pincode.trim(),
        country: data.country?.trim() || "India",
        pickupLocation: data.pickupLocation?.trim() || "",

        ...(editingAddress?._id
          ? {
              addressId: editingAddress._id,
            }
          : {}),
      };

      console.log("Saving address:", payload);

      const result = await addOrUpdateAddress(payload).unwrap();

      console.log("Save address response:", result);

      if (result?.success) {
        toast.success(
          editingAddress
            ? "Address updated successfully"
            : "Address added successfully",
        );

        closeForm();
      } else {
        toast.error(result?.message || "Unable to save address");
      }
    } catch (error: any) {
      console.error("Save address error:", error);

      toast.error(
        error?.data?.message || error?.message || "Failed to save address",
      );
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (isLoading) {
    return <BookLoader />;
  }

  /* ------------------------------------------------------------------------ */
  /* Error                                                                    */
  /* ------------------------------------------------------------------------ */

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-700">
          Unable to load your addresses.
        </p>

        <p className="mt-1 text-xs text-red-500">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* UI                                                                       */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-5">
      {/* ==================================================================== */}
      {/* HEADER                                                               */}
      {/* ==================================================================== */}

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <MapPin className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              My Addresses
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Manage your saved delivery addresses
            </p>
          </div>
        </div>

        {!showForm && (
          <Button
            onClick={openAddForm}
            className="gap-2 bg-orange-500 text-white hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            Add New Address
          </Button>
        )}
      </div>

      {/* ==================================================================== */}
      {/* ADD / EDIT FORM                                                       */}
      {/* ==================================================================== */}

      {showForm && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Form Header */}
          <div className="flex items-start justify-between border-b bg-slate-50/70 px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>

              <p className="mt-0.5 text-xs text-slate-500">
                Fields marked with * are required.
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={closeForm}
              disabled={isSaving}
              className="text-slate-400 hover:bg-white hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              {/* Address Line 1 */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="addressLine1">
                  Address Line 1 <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="addressLine1"
                  {...register("addressLine1", {
                    required: "Address line is required",
                  })}
                  placeholder="House / Flat / Street / Area"
                  className={`h-11 ${
                    errors.addressLine1
                      ? "border-red-400 focus-visible:ring-red-400"
                      : ""
                  }`}
                />

                {errors.addressLine1 && (
                  <p className="text-xs text-red-500">
                    {errors.addressLine1.message}
                  </p>
                )}
              </div>

              {/* Address Line 2 */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>

                <Input
                  id="addressLine2"
                  {...register("addressLine2")}
                  placeholder="Apartment, locality, landmark (optional)"
                  className="h-11"
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="city"
                  {...register("city", {
                    required: "City is required",
                  })}
                  placeholder="Enter city"
                  className={`h-11 ${
                    errors.city
                      ? "border-red-400 focus-visible:ring-red-400"
                      : ""
                  }`}
                />

                {errors.city && (
                  <p className="text-xs text-red-500">{errors.city.message}</p>
                )}
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">
                  State <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="state"
                  {...register("state", {
                    required: "State is required",
                  })}
                  placeholder="Enter state"
                  className={`h-11 ${
                    errors.state
                      ? "border-red-400 focus-visible:ring-red-400"
                      : ""
                  }`}
                />

                {errors.state && (
                  <p className="text-xs text-red-500">{errors.state.message}</p>
                )}
              </div>

              {/* Pincode */}
              <div className="space-y-2">
                <Label htmlFor="pincode">
                  Pincode <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="pincode"
                  {...register("pincode", {
                    required: "Pincode is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "Enter a valid 6-digit pincode",
                    },
                  })}
                  placeholder="Enter 6-digit pincode"
                  inputMode="numeric"
                  maxLength={6}
                  className={`h-11 ${
                    errors.pincode
                      ? "border-red-400 focus-visible:ring-red-400"
                      : ""
                  }`}
                />

                {errors.pincode && (
                  <p className="text-xs text-red-500">
                    {errors.pincode.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    id="phoneNumber"
                    {...register("phoneNumber")}
                    placeholder="Enter phone number"
                    className="h-11 pl-9"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>

                <Input id="country" {...register("country")} className="h-11" />
              </div>

              {/* Pickup Location */}
              <div className="space-y-2">
                <Label htmlFor="pickupLocation">Pickup Location</Label>

                <Input
                  id="pickupLocation"
                  {...register("pickupLocation")}
                  placeholder="Optional pickup location"
                  className="h-11"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse gap-3 border-t bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeForm}
                disabled={isSaving}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingAddress ? (
                  "Update Address"
                ) : (
                  "Save Address"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ==================================================================== */}
      {/* NO ADDRESSES                                                         */}
      {/* ==================================================================== */}

      {!showForm && addresses.length === 0 && (
        <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-slate-200 bg-white">
          <NoData
            imageUrl="/images/no-address.png"
            message="No addresses saved"
            description="Add your delivery address to make checkout faster and easier."
            buttonText="Add Address"
            onClick={openAddForm}
          />
        </div>
      )}

      {/* ==================================================================== */}
      {/* SAVED ADDRESSES                                                      */}
      {/* ==================================================================== */}

      {!showForm && addresses.length > 0 && (
        <div className="space-y-4">
          {/* Section Header */}
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Saved Addresses
              </h3>

              <p className="mt-0.5 text-xs text-slate-500">
                {addresses.length}{" "}
                {addresses.length === 1 ? "address" : "addresses"} saved
              </p>
            </div>
          </div>

          {/* Address Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={() => openEditForm(address)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* ADDRESS CARD                                                               */
/* ========================================================================== */

function AddressCard({
  address,
  onEdit,
}: {
  address: Address;
  onEdit: () => void;
}) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-orange-200 hover:shadow-md">
      {/* Card Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Home className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Delivery Address
            </p>

            <p className="text-xs text-slate-400">
              {address.country || "India"}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="text-slate-400 hover:bg-orange-50 hover:text-orange-600"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      {/* Address Content */}
      <div className="space-y-2">
        <p className="text-sm leading-6 text-slate-700">
          {address.addressLine1}
          {address.addressLine2 && (
            <>
              <br />
              {address.addressLine2}
            </>
          )}
          <br />
          {address.city}, {address.state} - {address.pincode}
        </p>

        {/* Pickup Location */}
        {address.pickupLocation && (
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-xs text-slate-500">
              <span className="font-medium text-slate-700">
                Pickup location:
              </span>{" "}
              {address.pickupLocation}
            </p>
          </div>
        )}

        {/* Phone */}
        {address.phoneNumber && (
          <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
            <Phone className="h-3.5 w-3.5" />
            <span>{address.phoneNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
}
