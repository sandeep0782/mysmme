"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  Pencil,
  Check,
  X,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateUserMutation } from "@/store/api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setUser } from "@/store/slice/userSlice";
import toast from "react-hot-toast";
import { UserData } from "@/types/product";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const { register, handleSubmit, reset } = useForm<UserData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  useEffect(() => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    });
  }, [user, reset]);

  const handleProfileEdit = async (data: UserData) => {
    if (!user?._id) return;

    try {
      const result = await updateUser({
        userId: user._id,
        userData: {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
        },
      }).unwrap();

      if (result.success && result.data) {
        dispatch(setUser(result.data));
        setIsEditing(false);

        toast.success(result.message || "Profile updated successfully");
      } else {
        throw new Error(result.message || "Unable to update profile");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  const handleCancel = () => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    });

    setIsEditing(false);
  };

  const getInitials = () => {
    if (!user?.name) return "U";

    return user.name
      .split(" ")
      .map((name: any) => name.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 md:px-6">
      {/* Profile Header */}
      <Card className="overflow-hidden border-gray-200 shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* User information */}
            <div className="flex min-w-0 items-center gap-4">
              {/* Avatar */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 text-2xl font-bold text-pink-600 ring-1 ring-pink-100 sm:h-24 sm:w-24 sm:text-3xl">
                {getInitials()}
              </div>

              {/* Details */}
              <div className="min-w-0">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-pink-500">
                  My Profile
                </p>

                <h1 className="truncate text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  {user?.name || "Your Name"}
                </h1>

                <p className="mt-1 truncate text-sm text-gray-500">
                  {user?.email || "your@email.com"}
                </p>

                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Active account
                </div>
              </div>
            </div>

            {/* Edit button */}
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-gray-900 text-white shadow-sm hover:bg-gray-800 sm:w-auto"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b bg-gray-50/70 px-5 py-5 sm:px-8">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
              <User className="h-5 w-5" />
            </div>

            <div>
              <CardTitle className="text-lg font-semibold">
                Personal Information
              </CardTitle>

              <CardDescription className="mt-1">
                Manage your personal details and contact information.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit(handleProfileEdit)}>
          <CardContent className="space-y-6 px-5 py-6 sm:px-8">
            {/* Name */}
            <ProfileField
              icon={<User className="h-4 w-4" />}
              label="Full Name"
              value={user?.name || ""}
              isEditing={isEditing}
            >
              <Input
                id="name"
                placeholder="John Doe"
                disabled={!isEditing}
                {...register("name")}
                className="h-11 border-gray-200 bg-white focus-visible:ring-pink-500"
              />
            </ProfileField>

            {/* Email */}
            <ProfileField
              icon={<Mail className="h-4 w-4" />}
              label="Email Address"
              value={user?.email || ""}
              isEditing={isEditing}
            >
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                disabled={!isEditing}
                {...register("email")}
                className="h-11 border-gray-200 bg-white focus-visible:ring-pink-500"
              />
            </ProfileField>

            {/* Phone */}
            <ProfileField
              icon={<Phone className="h-4 w-4" />}
              label="Phone Number"
              value={user?.phoneNumber || ""}
              isEditing={isEditing}
            >
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+91 98765 43210"
                disabled={!isEditing}
                {...register("phoneNumber")}
                className="h-11 border-gray-200 bg-white focus-visible:ring-pink-500"
              />
            </ProfileField>
          </CardContent>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex flex-col-reverse gap-3 border-t bg-gray-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm hover:from-pink-600 hover:to-rose-600 sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </Card>

      {/* Account & Security */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Account Card */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="px-5 pb-3 sm:px-6">
            <CardTitle className="text-base font-semibold">Account</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 px-5 pb-6 sm:px-6">
            <InfoRow
              label="Account status"
              value="Active"
              valueClass="text-green-600"
            />

            <InfoRow label="Account type" value="Personal" />
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="px-5 pb-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <CardTitle className="text-base font-semibold">
                  Security
                </CardTitle>
                <CardDescription>Keep your account secure</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-5 pb-6 sm:px-6">
            <div className="flex items-center justify-between rounded-xl border bg-gray-50 p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Account protected
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Your account is currently secure.
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <Check className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                  */
/* -------------------------------------------------------------------------- */

function ProfileField({
  icon,
  label,
  value,
  isEditing,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isEditing: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[180px_1fr] sm:items-center">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
          {icon}
        </div>

        <Label htmlFor={label} className="text-sm font-medium text-gray-600">
          {label}
        </Label>
      </div>

      {isEditing ? (
        <div>{children}</div>
      ) : (
        <div className="rounded-lg bg-gray-50 px-4 py-3">
          <p className="text-sm font-medium text-gray-900">
            {value || "Not provided"}
          </p>
        </div>
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueClass = "text-gray-900",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-gray-500">{label}</span>

      <span className={`text-sm font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}
