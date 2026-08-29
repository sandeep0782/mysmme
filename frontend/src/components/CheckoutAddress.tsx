"use client";

import { Address } from "@/types/product";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import Spinner from "@/lib/Spinner";

import {
  useAddOrUpdateAddressMutation,
  useGetAddressQuery,
} from "@/store/api/addressApi";

/* -------------------------------------------------------------------------- */
/* Form Schema                                                               */
/* -------------------------------------------------------------------------- */

const addressFormSchema = zod.object({
  phoneNumber: zod
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits"),

  addressLine1: zod
    .string()
    .min(5, "Address line 1 must be at least 5 characters"),

  addressLine2: zod.string().optional(),

  city: zod.string().min(2, "City must be at least 2 characters"),

  state: zod.string().min(2, "State must be at least 2 characters"),

  pincode: zod
    .string()
    .min(6, "Pincode must be 6 digits")
    .max(6, "Pincode must be 6 digits"),
});

type AddressFormValues = zod.infer<typeof addressFormSchema>;

/* -------------------------------------------------------------------------- */
/* API Response                                                              */
/* -------------------------------------------------------------------------- */

/*
  IMPORTANT:

  Your actual API response is:

  {
    success: true,
    message: "Addresses fetched successfully",
    data: [
      address1,
      address2,
      address3,
      address4
    ]
  }

  Therefore data is directly Address[].
*/

interface AddressResponse {
  success: boolean;
  message: string;
  data: Address[];
}

/* -------------------------------------------------------------------------- */
/* Props                                                                     */
/* -------------------------------------------------------------------------- */

interface CheckoutAddressProps {
  onAddressSelect: (address: Address) => void;
  selectedAddressId?: string;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                 */
/* -------------------------------------------------------------------------- */

const CheckoutAddress: React.FC<CheckoutAddressProps> = ({
  onAddressSelect,
  selectedAddressId,
}) => {
  const {
    data: addressData,
    isLoading,
    isError,
  } = useGetAddressQuery() as {
    data: AddressResponse | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  const [addOrUpdateAddress, { isLoading: isSaving }] =
    useAddOrUpdateAddressMutation();

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  /* ------------------------------------------------------------------------ */
  /* IMPORTANT FIX                                                            */
  /* ------------------------------------------------------------------------ */

  // Your backend returns:
  //
  // data: [address1, address2, ...]
  //
  // NOT:
  //
  // data: { addresses: [...] }

  const addresses: Address[] = Array.isArray(addressData?.data)
    ? addressData.data
    : [];

  console.log("Checkout Address API response:", addressData);
  console.log("Checkout addresses:", addresses);

  /* ------------------------------------------------------------------------ */
  /* Form                                                                     */
  /* ------------------------------------------------------------------------ */

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),

    defaultValues: {
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  /* ------------------------------------------------------------------------ */
  /* Edit Address                                                             */
  /* ------------------------------------------------------------------------ */

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);

    form.reset({
      phoneNumber: address.phoneNumber || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
    });

    setShowAddressForm(true);
  };

  /* ------------------------------------------------------------------------ */
  /* Add Address                                                              */
  /* ------------------------------------------------------------------------ */

  const handleAddAddress = () => {
    setEditingAddress(null);

    form.reset({
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
    });

    setShowAddressForm(true);
  };

  /* ------------------------------------------------------------------------ */
  /* Submit Address                                                           */
  /* ------------------------------------------------------------------------ */

  const onSubmit = async (data: AddressFormValues) => {
    try {
      let result;

      if (editingAddress) {
        /*
          UPDATE EXISTING ADDRESS

          Send addressId so backend knows which address
          needs to be updated.
        */

        const updateAddress = {
          ...data,
          addressId: editingAddress._id,
        };

        console.log("Updating address:", updateAddress);

        result = await addOrUpdateAddress(updateAddress).unwrap();
      } else {
        /*
          ADD NEW ADDRESS
        */

        console.log("Adding address:", data);

        result = await addOrUpdateAddress(data).unwrap();
      }

      console.log("Address save response:", result);

      setShowAddressForm(false);
      setEditingAddress(null);

      form.reset();
    } catch (error) {
      console.error("Address save error:", error);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (isLoading) {
    return <Spinner />;
  }

  /* ------------------------------------------------------------------------ */
  /* Error                                                                    */
  /* ------------------------------------------------------------------------ */

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center">
        <p className="text-sm font-medium text-red-600">
          Failed to load addresses.
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* UI                                                                       */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-5">
      {/* ------------------------------------------------------------------ */}
      {/* Saved Addresses                                                    */}
      {/* ------------------------------------------------------------------ */}

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {addresses.map((address: Address) => (
            <Card
              key={address._id}
              className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
                selectedAddressId === address._id
                  ? "border-blue-500 shadow-lg"
                  : "border-gray-200 shadow-md hover:shadow-lg"
              }`}
            >
              <CardContent className="space-y-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <Checkbox
                    checked={selectedAddressId === address._id}
                    onCheckedChange={() => {
                      onAddressSelect(address);
                    }}
                    className="h-5 w-5"
                  />

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEditAddress(address)}
                    disabled={isSaving}
                  >
                    <Pencil className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>

                {/* Address */}
                <div className="text-sm leading-6 text-gray-600">
                  <p>{address.addressLine1}</p>

                  {address.addressLine2 && <p>{address.addressLine2}</p>}

                  <p>
                    {address.city}, {address.state} {address.pincode}
                  </p>

                  {address.phoneNumber && (
                    <p className="mt-2 font-medium">
                      Phone: {address.phoneNumber}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500">No saved addresses found.</p>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Add Address Button                                                 */}
      {/* ------------------------------------------------------------------ */}

      <Dialog
        open={showAddressForm}
        onOpenChange={(open) => {
          setShowAddressForm(open);

          if (!open) {
            setEditingAddress(null);
            form.reset();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={handleAddAddress}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Address
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Phone */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter 10-digit mobile number"
                        inputMode="numeric"
                        maxLength={10}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Line 1 */}
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Street address, House number"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Line 2 */}
              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2 (Optional)</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Apartment, suite, unit, etc."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* City + State */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>

                      <FormControl>
                        <Input placeholder="Enter your city" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>

                      <FormControl>
                        <Input placeholder="Enter your state" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Pincode */}
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter your pincode"
                        inputMode="numeric"
                        maxLength={6}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving
                  ? "Saving..."
                  : editingAddress
                    ? "Update Address"
                    : "Add Address"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutAddress;
