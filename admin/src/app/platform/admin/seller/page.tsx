"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  CalendarDays,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Mail,
  Phone,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";

import Pagination from "@/components/Admin/Pagination";

import {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateSingleUserMutation,
} from "@/store/api/userApi";
import { useRouter } from "next/navigation";

// ============================================================
// TYPES
// ============================================================

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  role?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: "true" | "false";
  password?: string;
}

type GstBusinessData = {
  gstin: string;
  legal_name: string;
  trade_name: string;
  status: string;
  constitution: string;
  taxpayer_type: string;
  registration_date: string;
  state: string;
  pan: string;
  address: string;
  nature_of_business: string[];
};

type GstVerifyResponse = {
  success: boolean;
  cached?: boolean;
  credits_remaining?: number;
  data?: GstBusinessData;
  message?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type StatusFilter = "all" | "active" | "inactive";

const ITEMS_PER_PAGE = 8;
// ============================================================
// HELPERS
// ============================================================

const formatDate = (date?: string) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name: string) => {
  return (
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "U"
  );
};

const formatRole = (role?: string) => {
  if (!role) return "Seller";

  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

// ============================================================
// PAGE
// ============================================================

const Page = () => {
  // ============================================================
  // STATE
  // ============================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [currentPage, setCurrentPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [saveError, setSaveError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [gstin, setGstin] = useState("");
  const [gstError, setGstError] = useState("");
  const [isVerifyingGst, setIsVerifyingGst] = useState(false);
  const [verifiedGst, setVerifiedGst] = useState<GstBusinessData | null>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const router = useRouter();
  // ============================================================
  // API
  // ============================================================

  const { data: usersResponse, isLoading, isError } = useGetUsersQuery({});

  const users: User[] = usersResponse?.data ?? [];

  // Seller page: only show accounts whose role is seller.
  const sellers = useMemo(
    () => users.filter((user) => user.role?.toLowerCase() === "seller"),
    [users],
  );

  const [addUser, { isLoading: isAdding }] = useAddUserMutation();

  const [updateUser, { isLoading: isUpdating }] = useUpdateSingleUserMutation();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const isSaving = isAdding || isUpdating;
  const isModalBusy = isSaving || isVerifyingGst;

  // ============================================================
  // FORM
  // ============================================================

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "seller",
      isActive: "true",
      password: "",
    },
  });

  // ============================================================
  // STATISTICS
  // ============================================================

  const activeCount = useMemo(
    () => sellers.filter((seller) => seller.isActive).length,
    [sellers],
  );

  const inactiveCount = useMemo(
    () => sellers.filter((seller) => !seller.isActive).length,
    [sellers],
  );

  const newSellerCount = useMemo(() => {
    const now = new Date();
    return sellers.filter((seller) => {
      if (!seller.createdAt) return false;
      const created = new Date(seller.createdAt);
      return (
        created.getFullYear() === now.getFullYear() &&
        created.getMonth() === now.getMonth()
      );
    }).length;
  }, [sellers]);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return sellers.filter((user) => {
      const phone = user.phone || user.phoneNumber || "";

      const matchesSearch =
        !searchValue ||
        user.name?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue) ||
        phone.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [sellers, search, statusFilter]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const safeCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }

    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // ============================================================
  // BODY LOCK
  // ============================================================

  useEffect(() => {
    if (!isAddModalOpen && !isDeleteModalOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isAddModalOpen, isDeleteModalOpen]);

  // ============================================================
  // CLOSE ACTION MENU
  // ============================================================

  useEffect(() => {
    const handleClick = () => {
      setOpenActionId(null);
      setIsFilterOpen(false);
    };

    if (openActionId || isFilterOpen) {
      document.addEventListener("click", handleClick);
    }

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [openActionId, isFilterOpen]);

  // ============================================================
  // ESCAPE
  // ============================================================

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (isModalBusy || isDeleting) return;

      setOpenActionId(null);
      setIsFilterOpen(false);

      if (isDeleteModalOpen) {
        closeDeleteModal();
        return;
      }

      if (isAddModalOpen) {
        closeAddModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAddModalOpen, isDeleteModalOpen, isModalBusy, isDeleting]);

  // ============================================================
  // RESET FORM
  // ============================================================

  const resetUserForm = () => {
    reset({
      name: "",
      email: "",
      phone: "",
      role: "seller",
      isActive: "true",
      password: "",
    });

    setEditingUser(null);
    setSaveError("");
    setGstin("");
    setGstError("");
    setVerifiedGst(null);
  };

  // ============================================================
  // OPEN ADD MODAL
  // ============================================================

  const openAddModal = () => {
    resetUserForm();
    setIsAddModalOpen(true);
  };

  // ============================================================
  // CLOSE ADD / EDIT MODAL
  // ============================================================

  const closeAddModal = () => {
    if (isModalBusy) return;

    resetUserForm();
    setIsAddModalOpen(false);
  };

  // ============================================================
  // GST VERIFICATION / ADD SELLER
  // ============================================================

  const normalizeGstin = (value: string) =>
    value.toUpperCase().replace(/\s+/g, "").slice(0, 15);

  const verifyGst = async () => {
    const normalizedGstin = normalizeGstin(gstin);

    setGstError("");
    setSaveError("");
    setVerifiedGst(null);

    if (
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(normalizedGstin)
    ) {
      setGstError("Please enter a valid 15-character GSTIN.");
      return;
    }

    try {
      setIsVerifyingGst(true);

      const response = await fetch(
        `${API_URL}/v1/gst-verification/${encodeURIComponent(
          normalizedGstin,
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result: GstVerifyResponse = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message || "GST verification failed.");
      }

      if (result.data.status?.toLowerCase() !== "active") {
        setGstError(
          `GSTIN is ${result.data.status || "not active"}. Only active GST registrations can be added.`,
        );
        return;
      }

      setGstin(result.data.gstin || normalizedGstin);
      setVerifiedGst(result.data);
    } catch (error: any) {
      setGstError(
        error?.message || "Unable to verify GSTIN. Please try again.",
      );
    } finally {
      setIsVerifyingGst(false);
    }
  };

  const addVerifiedSeller = async () => {
    if (!verifiedGst) {
      setGstError("Verify the GSTIN before adding the seller.");
      return;
    }

    setSaveError("");

    try {
      const sellerData = {
        name: verifiedGst.trade_name || verifiedGst.legal_name,
        role: "seller",
        isActive: true,
        gstin: verifiedGst.gstin,
        legal_name: verifiedGst.legal_name,
        trade_name: verifiedGst.trade_name,
        gst_status: verifiedGst.status,
        constitution: verifiedGst.constitution,
        taxpayer_type: verifiedGst.taxpayer_type,
        registration_date: verifiedGst.registration_date,
        state: verifiedGst.state,
        pan: verifiedGst.pan,
        address: verifiedGst.address,
        nature_of_business: verifiedGst.nature_of_business,
      };

      await addUser(sellerData).unwrap();

      setIsAddModalOpen(false);
      resetUserForm();
    } catch (error: any) {
      setSaveError(
        error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add seller.",
      );
    }
  };

  // ============================================================
  // SUBMIT USER
  // ============================================================

  const onSubmitUser = async (data: UserFormData) => {
    setSaveError("");

    try {
      // ========================================================
      // UPDATE USER
      // ========================================================

      if (editingUser) {
        if (!editingUser._id) {
          setSaveError("Seller ID is missing.");
          return;
        }

        const userData: Record<string, any> = {
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
          role: "seller",
          isActive: data.isActive === "true",
        };

        // Password is optional while editing
        if (data.password?.trim()) {
          userData.password = data.password.trim();
        }

        console.log("Updating seller:", {
          userId: editingUser._id,
          userData,
        });

        await updateUser({
          userId: editingUser._id,
          userData,
        }).unwrap();

        // Close modal
        setIsAddModalOpen(false);

        // Reset state
        resetUserForm();

        return;
      }

      // New sellers are created through GST verification, not this form.
      return;
    } catch (error: any) {
      console.error("Failed to save seller:", error);
      console.error("Error JSON:", JSON.stringify(error, null, 2));
      console.error("Error message:", error?.message);
      console.error("Error response:", error?.response);
      console.error("Error data:", error?.data);

      setSaveError(
        error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to save seller",
      );
    }
  };

  // ============================================================
  // EDIT USER
  // ============================================================

  const onEditUser = (user: User) => {
    setOpenActionId(null);

    if (!user?._id) {
      setSaveError("Seller ID is missing.");
      return;
    }

    console.log("Editing seller:", user);

    setEditingUser(user);

    setSaveError("");

    reset({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? user.phoneNumber ?? "",
      role: "seller",
      isActive: user.isActive ? "true" : "false",
      password: "",
    });

    setIsAddModalOpen(true);
  };

  // ============================================================
  // OPEN DELETE MODAL
  // ============================================================

  const openDeleteModal = (user: User) => {
    setOpenActionId(null);

    if (!user?._id) {
      setDeleteError("Seller ID is missing.");
      return;
    }

    setUserToDelete(user);
    setDeleteError("");
    setIsDeleteModalOpen(true);
  };

  // ============================================================
  // CLOSE DELETE MODAL
  // ============================================================

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setIsDeleteModalOpen(false);
    setUserToDelete(null);
    setDeleteError("");
  };

  // ============================================================
  // DELETE USER
  // ============================================================

  const onDeleteUser = async () => {
    if (!userToDelete?._id) {
      setDeleteError("Seller ID is missing.");
      return;
    }

    setDeleteError("");

    try {
      console.log("Deleting seller:", userToDelete._id);

      await deleteUser(userToDelete._id).unwrap();

      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      console.error("Failed to delete user:", error);

      setDeleteError(
        error?.data?.message ||
          error?.data?.error ||
          error?.message ||
          "Failed to delete seller. Please try again.",
      );
    }
  };

  // ============================================================
  // SEARCH / FILTER
  // ============================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100">
                  <Users className="h-4 w-4 text-rose-600" />
                </span>

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-rose-600">
                  Management
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Sellers
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Create and manage seller accounts, roles, status, and access
                from one place.{" "}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Add Seller */}
              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-700"
              >
                <Plus className="h-4 w-4" />
                Add Seller
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* TOTAL */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-blue-50" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Sellers
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {isLoading ? (
                    <span className="inline-block h-9 w-14 animate-pulse rounded-lg bg-slate-200" />
                  ) : (
                    sellers.length
                  )}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  All registered sellers
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* ACTIVE */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-emerald-50" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active Sellers
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {isLoading ? (
                    <span className="inline-block h-9 w-14 animate-pulse rounded-lg bg-slate-200" />
                  ) : (
                    activeCount
                  )}
                </p>

                <p className="mt-1 text-xs text-emerald-600">
                  Currently active
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* INACTIVE */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-slate-100" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Inactive Sellers
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {isLoading ? (
                    <span className="inline-block h-9 w-14 animate-pulse rounded-lg bg-slate-200" />
                  ) : (
                    inactiveCount
                  )}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Currently disabled
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <XCircle className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* ADMINS */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-purple-50" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  New Sellers
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {isLoading ? (
                    <span className="inline-block h-9 w-14 animate-pulse rounded-lg bg-slate-200" />
                  ) : (
                    newSellerCount
                  )}
                </p>

                <p className="mt-1 text-xs text-purple-600">
                  Joined this month
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            TOOLBAR
        ===================================================== */}

        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search sellers by name, email or phone..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 outline-none focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFilterOpen((value) => !value);
                  }}
                  className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Filter className="h-4 w-4 text-slate-400" />
                  Filters
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {isFilterOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-12 z-30 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
                  >
                    <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </p>

                    {(
                      [
                        ["all", "All Status"],
                        ["active", "Active"],
                        ["inactive", "Inactive"],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(value);
                          setCurrentPage(1);
                        }}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                          statusFilter === value
                            ? "bg-rose-50 font-semibold text-rose-600"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {label}

                        {statusFilter === value && (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </button>
                    ))}

                    <div className="my-2 border-t border-slate-100" />
                  </div>
                )}
              </div>

              <div className="hidden h-11 items-center rounded-xl bg-slate-50 px-4 text-sm text-slate-500 sm:flex">
                <span className="font-semibold text-slate-900">
                  {filteredUsers.length}
                </span>

                <span className="ml-1.5">sellers</span>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {isError && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-red-100">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>

            <div>
              <p className="font-semibold text-red-800">
                Failed to load sellers
              </p>

              <p className="mt-1 text-sm text-red-600">
                Something went wrong while fetching sellers.
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
            CONTENT
        ===================================================== */}

        {isLoading ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex min-h-[420px] flex-col items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
                <Loader2 className="h-7 w-7 animate-spin text-rose-600" />
              </div>

              <p className="mt-4 font-semibold text-slate-800">
                Loading sellers
              </p>

              <p className="mt-1 text-sm text-slate-400">Please wait...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Users className="h-7 w-7 text-slate-400" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              {search || statusFilter !== "all"
                ? "No matching sellers"
                : "No sellers yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search || statusFilter !== "all"
                ? "Try changing your search or filters."
                : "Create your first seller to start managing seller accounts."}
            </p>

            {search || statusFilter !== "all" ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Clear Filters
              </button>
            ) : (
              <button
                type="button"
                onClick={openAddModal}
                className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                <Plus className="h-4 w-4" />
                Create Seller
              </button>
            )}
          </div>
        ) : (
          <>
            {/* =================================================
                DESKTOP TABLE
            ================================================= */}

            <div className="hidden overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        User
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        Contact
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        Role
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        Created
                      </th>

                      <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {paginatedUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="group transition-colors hover:bg-slate-50/70"
                      >
                        {/* USER */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-rose-50 text-sm font-bold text-rose-600">
                              {getInitials(user.name)}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900">
                                {user.name}
                              </p>

                              <p className="mt-1 truncate text-xs text-slate-400">
                                ID: {user._id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CONTACT */}
                        <td className="px-6 py-5">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail className="h-3.5 w-3.5 text-slate-400" />

                              <span className="max-w-[220px] truncate">
                                {user.email}
                              </span>
                            </div>

                            {(user.phone || user.phoneNumber) && (
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Phone className="h-3.5 w-3.5" />

                                {user.phone || user.phoneNumber}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* ROLE */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                              user.role?.toLowerCase() === "admin"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />

                            {formatRole(user.role)}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                              user.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                user.isActive
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                              }`}
                            />

                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* CREATED */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays className="h-4 w-4 text-slate-400" />

                            {formatDate(user.createdAt)}
                          </div>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => onEditUser(user)}
                              disabled={isSaving || isDeleting}
                              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => openDeleteModal(user)}
                              disabled={isSaving || isDeleting}
                              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 text-sm font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-slate-200">
                <Pagination
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>

            {/* =================================================
                MOBILE
            ================================================= */}

            <div className="space-y-3 md:hidden">
              {paginatedUsers.map((user) => (
                <div
                  key={user._id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-rose-50 text-sm font-bold text-rose-600">
                      {getInitials(user.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-900">
                            {user.name}
                          </h3>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            {user.email}
                          </p>

                          {(user.phone || user.phoneNumber) && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                              <Phone className="h-3 w-3" />
                              {user.phone || user.phoneNumber}
                            </p>
                          )}
                        </div>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();

                              setOpenActionId((value) =>
                                value === user._id ? null : user._id,
                              );
                            }}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>

                          {openActionId === user._id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-9 z-20 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
                            >
                              <button
                                type="button"
                                onClick={() => onEditUser(user)}
                                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Pencil className="h-4 w-4" />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => openDeleteModal(user)}
                                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              user.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                user.isActive
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                              }`}
                            />

                            {user.isActive ? "Active" : "Inactive"}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              user.role?.toLowerCase() === "admin"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {formatRole(user.role)}
                          </span>
                        </div>

                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <Pagination
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </>
        )}
      </main>

      {/* =========================================================
          ADD / EDIT MODAL
      ========================================================= */}

      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isModalBusy) {
              closeAddModal();
            }
          }}
        >
          <div
            className="flex max-h-[calc(100vh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50">
                  <Users className="h-5 w-5 text-rose-600" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    {editingUser ? "Edit Seller" : "Add Seller"}
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {editingUser
                      ? "Update seller account information"
                      : "Verify GSTIN and add a registered seller"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeAddModal}
                disabled={isModalBusy}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM */}

            {editingUser ? (
              <form
                onSubmit={handleSubmit(onSubmitUser)}
                className="flex min-h-0 flex-1 flex-col"
              >
                <div className="overflow-y-auto px-6 py-6">
                  {saveError && (
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                      <p className="text-sm font-medium leading-5 text-red-700">
                        {saveError}
                      </p>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="user-name"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Seller Name
                      </label>
                      <input
                        id="user-name"
                        type="text"
                        disabled={isSaving}
                        {...register("name", { required: "Name is required" })}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="user-email"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Email Address
                      </label>
                      <input
                        id="user-email"
                        type="email"
                        disabled={isSaving}
                        {...register("email")}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="user-phone"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Phone Number
                      </label>
                      <input
                        id="user-phone"
                        type="tel"
                        disabled={isSaving}
                        {...register("phone")}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="user-password"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Password
                      </label>
                      <input
                        id="user-password"
                        type="password"
                        placeholder="Leave empty to keep current password"
                        disabled={isSaving}
                        {...register("password", {
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10"
                      />
                      {errors.password && (
                        <p className="mt-1.5 text-xs font-medium text-red-500">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <input
                      type="hidden"
                      value="seller"
                      {...register("role")}
                      readOnly
                    />

                    <div>
                      <label
                        htmlFor="user-status"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Status
                      </label>
                      <select
                        id="user-status"
                        disabled={isSaving}
                        {...register("isActive")}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    disabled={isSaving}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Pencil className="h-4 w-4" />
                        Update Seller
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="overflow-y-auto px-6 py-6">
                  {saveError && (
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                      <p className="text-sm font-medium leading-5 text-red-700">
                        {saveError}
                      </p>
                    </div>
                  )}

                  <label
                    htmlFor="seller-gstin"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    GSTIN <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <FileSpreadsheet className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="seller-gstin"
                        value={gstin}
                        onChange={(event) => {
                          setGstin(normalizeGstin(event.target.value));
                          setGstError("");
                          setVerifiedGst(null);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            void verifyGst();
                          }
                        }}
                        maxLength={15}
                        autoComplete="off"
                        placeholder="27AAAAA0000A1Z5"
                        disabled={isModalBusy}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 font-mono text-sm uppercase tracking-wide text-slate-900 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 disabled:bg-slate-50"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={verifyGst}
                      disabled={isModalBusy || gstin.length !== 15}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isVerifyingGst ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          Verify GST
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Enter the seller's 15-character GSTIN. Business details will
                    be fetched automatically.
                  </p>

                  {gstError && (
                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                      <p className="text-sm font-medium text-red-700">
                        {gstError}
                      </p>
                    </div>
                  )}

                  {verifiedGst && (
                    <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/40">
                      <div className="flex items-start gap-3 border-b border-emerald-100 bg-emerald-50 px-5 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-900">
                            GST verified successfully
                          </p>
                          <p className="mt-0.5 text-xs text-emerald-700">
                            The seller's registered GST details are shown below.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-x-6 gap-y-4 bg-white p-5 sm:grid-cols-2">
                        {[
                          ["GSTIN", verifiedGst.gstin],
                          ["Status", verifiedGst.status],
                          ["Legal Name", verifiedGst.legal_name],
                          ["Trade Name", verifiedGst.trade_name || "—"],
                          ["Constitution", verifiedGst.constitution],
                          ["Taxpayer Type", verifiedGst.taxpayer_type],
                          ["Registration Date", verifiedGst.registration_date],
                          ["State", verifiedGst.state],
                          ["PAN", verifiedGst.pan],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {label}
                            </p>
                            <p className="mt-1 break-words text-sm font-medium text-slate-800">
                              {value || "—"}
                            </p>
                          </div>
                        ))}

                        <div className="sm:col-span-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Registered Address
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-700">
                            {verifiedGst.address || "—"}
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Nature of Business
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(verifiedGst.nature_of_business || []).length ? (
                              verifiedGst.nature_of_business.map((item) => (
                                <span
                                  key={item}
                                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                                >
                                  {item}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-slate-400">—</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    disabled={isModalBusy}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  {verifiedGst && (
                    <button
                      type="button"
                      onClick={addVerifiedSeller}
                      disabled={isAdding}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-700 disabled:opacity-60"
                    >
                      {isAdding ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Adding Seller...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Add Verified Seller
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          DELETE MODAL
      ========================================================= */}

      {isDeleteModalOpen && userToDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) {
              closeDeleteModal();
            }
          }}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-950">
                Delete Seller?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-900">
                  {userToDelete.name}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-rose-50 text-sm font-bold text-rose-600">
                  {getInitials(userToDelete.name)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {userToDelete.name}
                  </p>

                  <p className="truncate text-xs text-slate-400">
                    {userToDelete.email}
                  </p>
                </div>
              </div>

              {deleteError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    {deleteError}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isDeleting}
                onClick={closeDeleteModal}
                className="h-11 cursor-pointer rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={onDeleteUser}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Seller
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
