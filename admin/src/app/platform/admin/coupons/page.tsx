"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  TicketPercent,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
  Percent,
  IndianRupee,
  Users,
  CalendarDays,
  Copy,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";

type DiscountType = "fixed" | "percentage";

type CommissionType = "fixed" | "percentage";

type Freelancer = {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
};

type Coupon = {
  _id: string;

  code: string;
  name: string;
  description?: string;

  discountType: DiscountType;
  discountValue: number;

  minimumOrderAmount: number;
  maximumDiscountAmount?: number;

  startsAt: string;
  expiresAt: string;

  usageLimit?: number;
  usageCount: number;

  usageLimitPerUser: number;

  firstOrderOnly: boolean;

  appliesTo: "all" | "products" | "categories" | "brands";

  assignedFreelancer?: Freelancer | string | null;

  commissionType?: CommissionType;

  commissionValue?: number;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
};

type StatusFilter = "all" | "active" | "inactive";

type TypeFilter = "all" | DiscountType;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const emptyForm = {
  code: "",
  name: "",
  description: "",

  discountType: "fixed" as DiscountType,

  discountValue: "",

  minimumOrderAmount: "",
  maximumDiscountAmount: "",

  startsAt: "",
  expiresAt: "",

  usageLimit: "",
  usageLimitPerUser: "1",

  firstOrderOnly: false,

  assignedFreelancer: "",

  commissionType: "percentage" as CommissionType,

  commissionValue: "",

  isActive: true,
};

const Page = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const [isLoading, setIsLoading] = useState(true);

  const [isError, setIsError] = useState(false);

  const [freelancersLoading, setFreelancersLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [saving, setSaving] = useState(false);

  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState(emptyForm);

  // ============================================================
  // LOAD COUPONS
  // ============================================================

  const loadCoupons = async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      const response = await fetch(`${API_URL}/coupons/admin`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to fetch coupons");
      }

      setCoupons(data?.data || []);
    } catch (error) {
      console.error("COUPON LOAD ERROR:", error);

      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // LOAD FREELANCERS
  // ============================================================

  const loadFreelancers = async () => {
    try {
      setFreelancersLoading(true);

      const response = await fetch(`${API_URL}/coupons/admin/freelancers`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to fetch freelancers");
      }

      setFreelancers(data?.data || []);
    } catch (error) {
      console.error("FREELANCER LOAD ERROR:", error);
    } finally {
      setFreelancersLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
    loadFreelancers();
  }, []);

  // ============================================================
  // STATISTICS
  // ============================================================

  const statistics = useMemo(() => {
    const total = coupons.length;

    const active = coupons.filter((coupon) => coupon.isActive).length;

    const inactive = coupons.filter((coupon) => !coupon.isActive).length;

    const totalUses = coupons.reduce(
      (total, coupon) => total + Number(coupon.usageCount || 0),
      0,
    );

    return {
      total,
      active,
      inactive,
      totalUses,
    };
  }, [coupons]);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredCoupons = useMemo(() => {
    const value = search.trim().toLowerCase();

    return coupons.filter((coupon) => {
      const freelancer =
        typeof coupon.assignedFreelancer === "object"
          ? coupon.assignedFreelancer
          : null;

      const matchesSearch =
        !value ||
        coupon.code.toLowerCase().includes(value) ||
        coupon.name.toLowerCase().includes(value) ||
        coupon.description?.toLowerCase().includes(value) ||
        freelancer?.name?.toLowerCase().includes(value) ||
        freelancer?.email?.toLowerCase().includes(value);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && coupon.isActive) ||
        (statusFilter === "inactive" && !coupon.isActive);

      const matchesType =
        typeFilter === "all" || coupon.discountType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [coupons, search, statusFilter, typeFilter]);

  // ============================================================
  // FORMATTERS
  // ============================================================

  const formatDate = (value?: string) => {
    if (!value) return "—";

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  };

  const toDateTimeLocal = (value?: string) => {
    if (!value) return "";

    const date = new Date(value);

    const timezoneOffset = date.getTimezoneOffset();

    const local = new Date(date.getTime() - timezoneOffset * 60 * 1000);

    return local.toISOString().slice(0, 16);
  };

  const getDiscountLabel = (coupon: Coupon) => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}% OFF`;
    }

    return `₹${coupon.discountValue} OFF`;
  };

  const isExpired = (coupon: Coupon) => new Date(coupon.expiresAt) < new Date();

  const getStatus = (coupon: Coupon) => {
    if (isExpired(coupon)) {
      return {
        label: "Expired",
        wrapper: "bg-orange-50 text-orange-600",
        dot: "bg-orange-500",
      };
    }

    if (coupon.isActive) {
      return {
        label: "Active",
        wrapper: "bg-emerald-50 text-emerald-600",
        dot: "bg-emerald-500",
      };
    }

    return {
      label: "Inactive",
      wrapper: "bg-slate-100 text-slate-500",
      dot: "bg-slate-400",
    };
  };

  // ============================================================
  // FORM
  // ============================================================

  const resetForm = () => {
    setForm(emptyForm);
  };

  const openCreate = () => {
    setEditingCoupon(null);

    resetForm();

    setShowForm(true);
  };

  const getAssignedFreelancerId = (coupon: Coupon) => {
    if (!coupon.assignedFreelancer) {
      return "";
    }

    if (typeof coupon.assignedFreelancer === "string") {
      return coupon.assignedFreelancer;
    }

    return coupon.assignedFreelancer._id || "";
  };

  const startEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);

    setForm({
      code: coupon.code,

      name: coupon.name,

      description: coupon.description || "",

      discountType: coupon.discountType,

      discountValue: String(coupon.discountValue),

      minimumOrderAmount: String(coupon.minimumOrderAmount || 0),

      maximumDiscountAmount:
        coupon.maximumDiscountAmount !== undefined
          ? String(coupon.maximumDiscountAmount)
          : "",

      startsAt: toDateTimeLocal(coupon.startsAt),

      expiresAt: toDateTimeLocal(coupon.expiresAt),

      usageLimit:
        coupon.usageLimit !== undefined ? String(coupon.usageLimit) : "",

      usageLimitPerUser: String(coupon.usageLimitPerUser || 1),

      firstOrderOnly: coupon.firstOrderOnly,

      assignedFreelancer: getAssignedFreelancerId(coupon),

      commissionType: coupon.commissionType || "percentage",

      commissionValue:
        coupon.commissionValue !== undefined
          ? String(coupon.commissionValue)
          : "",

      isActive: coupon.isActive,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);

    setEditingCoupon(null);

    resetForm();
  };

  // ============================================================
  // CREATE / UPDATE
  // ============================================================

  const saveCoupon = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.code.trim() ||
      !form.name.trim() ||
      !form.discountValue ||
      !form.startsAt ||
      !form.expiresAt
    ) {
      alert("Please fill all required fields.");

      return;
    }

    if (new Date(form.expiresAt) <= new Date(form.startsAt)) {
      alert("Expiry date must be after start date.");

      return;
    }

    if (
      form.discountType === "percentage" &&
      Number(form.discountValue) > 100
    ) {
      alert("Percentage discount cannot exceed 100%.");

      return;
    }

    if (form.assignedFreelancer && !form.commissionValue) {
      alert("Please enter freelancer commission.");

      return;
    }

    if (
      form.assignedFreelancer &&
      form.commissionType === "percentage" &&
      Number(form.commissionValue) > 100
    ) {
      alert("Commission percentage cannot exceed 100%.");

      return;
    }

    try {
      setSaving(true);

      const isEditing = Boolean(editingCoupon);

      const endpoint = isEditing
        ? `${API_URL}/coupons/admin/${editingCoupon?._id}`
        : `${API_URL}/coupons/admin`;

      const payload = {
        code: form.code.trim().toUpperCase(),

        name: form.name.trim(),

        description: form.description.trim(),

        discountType: form.discountType,

        discountValue: Number(form.discountValue),

        minimumOrderAmount: Number(form.minimumOrderAmount) || 0,

        maximumDiscountAmount:
          form.discountType === "percentage" && form.maximumDiscountAmount
            ? Number(form.maximumDiscountAmount)
            : null,

        startsAt: form.startsAt,

        expiresAt: form.expiresAt,

        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,

        usageLimitPerUser: Number(form.usageLimitPerUser) || 1,

        firstOrderOnly: form.firstOrderOnly,

        appliesTo: "all",

        assignedFreelancer: form.assignedFreelancer || null,

        commissionType: form.assignedFreelancer ? form.commissionType : null,

        commissionValue:
          form.assignedFreelancer && form.commissionValue
            ? Number(form.commissionValue)
            : null,

        isActive: form.isActive,
      };

      const response = await fetch(endpoint, {
        method: isEditing ? "PATCH" : "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data?.message || "Unable to save coupon.");

        return;
      }

      if (isEditing) {
        setCoupons((current) =>
          current.map((coupon) =>
            coupon._id === data.data._id ? data.data : coupon,
          ),
        );
      } else {
        setCoupons((current) => [data.data, ...current]);
      }

      closeForm();

      // reload so populated
      // freelancer name/email
      // appears correctly
      await loadCoupons();
    } catch (error) {
      console.error("SAVE COUPON ERROR:", error);

      alert("Unable to save coupon.");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const deleteCoupon = async (coupon: Coupon) => {
    const confirmed = window.confirm(`Delete coupon "${coupon.code}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(coupon._id);

      const response = await fetch(`${API_URL}/coupons/admin/${coupon._id}`, {
        method: "DELETE",

        credentials: "include",
      });

      let data: any = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        alert(data?.message || "Unable to delete coupon.");

        return;
      }

      setCoupons((current) =>
        current.filter((item) => item._id !== coupon._id),
      );
    } catch (error) {
      console.error("DELETE COUPON ERROR:", error);

      alert("Unable to delete coupon.");
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================
  // COPY
  // ============================================================

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      console.error("COPY ERROR:", error);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-600" />

              <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Marketing
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Manage Coupons
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Create, edit, assign and manage MYSMME coupons.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Create Coupon
          </button>
        </div>

        {/* STATISTICS */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Coupons"
            value={isLoading ? "—" : statistics.total}
            icon={<TicketPercent className="h-5 w-5" />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Active"
            value={statistics.active}
            icon={<CheckCircle2 className="h-5 w-5" />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Coupon Uses"
            value={statistics.totalUses}
            icon={<Users className="h-5 w-5" />}
            iconClass="bg-violet-50 text-violet-600"
          />

          <StatCard
            title="Inactive"
            value={statistics.inactive}
            icon={<XCircle className="h-5 w-5" />}
            iconClass="bg-red-50 text-red-500"
          />
        </div>

        {/* FILTER */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search coupon, freelancer..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="all">All Status</option>

                <option value="active">Active</option>

                <option value="inactive">Inactive</option>
              </select>

              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value as TypeFilter)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="all">All Discount Types</option>

                <option value="fixed">Fixed</option>

                <option value="percentage">Percentage</option>
              </select>
            </div>
          </div>
        </div>

        {/* ERROR */}

        {isError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            Failed to load coupons.
          </div>
        )}

        {/* TABLE */}

        {isLoading ? (
          <Loading />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1300px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <Header>Coupon</Header>

                    <Header>Discount</Header>

                    <Header>Min Order</Header>

                    <Header>Usage</Header>

                    <Header>Validity</Header>

                    <Header>Freelancer</Header>

                    <Header>Commission</Header>

                    <Header>Status</Header>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredCoupons.map((coupon) => {
                    const status = getStatus(coupon);

                    const freelancer =
                      typeof coupon.assignedFreelancer === "object"
                        ? coupon.assignedFreelancer
                        : null;

                    return (
                      <tr key={coupon._id} className="hover:bg-slate-50">
                        <td className="px-6 py-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                              <TicketPercent className="h-5 w-5" />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-slate-900">
                                  {coupon.code}
                                </p>

                                <button onClick={() => copyCode(coupon.code)}>
                                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                                </button>
                              </div>

                              <p className="mt-1 text-sm text-slate-600">
                                {coupon.name}
                              </p>

                              {coupon.firstOrderOnly && (
                                <p className="mt-1 text-xs text-indigo-600">
                                  First order only
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 font-semibold">
                            {coupon.discountType === "percentage" ? (
                              <Percent className="h-4 w-4 text-violet-500" />
                            ) : (
                              <IndianRupee className="h-4 w-4 text-emerald-500" />
                            )}

                            {coupon.discountType === "percentage"
                              ? `${coupon.discountValue}% OFF`
                              : `₹${coupon.discountValue} OFF`}
                          </div>
                        </td>

                        <td className="px-6 py-5 font-semibold">
                          ₹
                          {Number(
                            coupon.minimumOrderAmount || 0,
                          ).toLocaleString("en-IN")}
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-semibold">
                            {coupon.usageCount}

                            {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                          </p>

                          <p className="text-xs text-slate-400">
                            {coupon.usageLimitPerUser} per user
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-slate-400" />

                            {formatDate(coupon.startsAt)}
                          </div>

                          <p className="mt-1 pl-6 text-xs text-slate-400">
                            to {formatDate(coupon.expiresAt)}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          {freelancer ? (
                            <div className="flex items-center gap-2">
                              <UserRound className="h-4 w-4 text-blue-500" />

                              <div>
                                <p className="text-sm font-semibold">
                                  {freelancer.name || "Freelancer"}
                                </p>

                                <p className="text-xs text-slate-400">
                                  {freelancer.email}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                              Not assigned
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          {freelancer &&
                          coupon.commissionValue !== undefined ? (
                            <span className="font-semibold">
                              {coupon.commissionType === "percentage"
                                ? `${coupon.commissionValue}%`
                                : `₹${coupon.commissionValue}`}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${status.wrapper}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                            />

                            {status.label}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => startEdit(coupon)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button
                              disabled={deletingId === coupon._id}
                              onClick={() => deleteCoupon(coupon)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600"
                            >
                              {deletingId === coupon._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL */}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex justify-between border-b bg-white px-6 py-5">
                <div>
                  <h2 className="text-xl font-bold">
                    {editingCoupon ? "Edit Coupon" : "Create Coupon"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Configure discount and freelancer assignment.
                  </p>
                </div>

                <button onClick={closeForm} type="button" className="text-xl">
                  ×
                </button>
              </div>

              <form
                onSubmit={saveCoupon}
                className="grid gap-5 p-6 md:grid-cols-2"
              >
                <Field
                  label="Coupon Code *"
                  value={form.code}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      code: value.toUpperCase(),
                    })
                  }
                  required
                />

                <Field
                  label="Coupon Name *"
                  value={form.name}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      name: value,
                    })
                  }
                  required
                />

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Description
                  </label>

                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 p-3"
                  />
                </div>

                <SelectField
                  label="Discount Type"
                  value={form.discountType}
                  onChange={(value) =>
                    setForm({
                      ...form,

                      discountType: value as DiscountType,

                      maximumDiscountAmount:
                        value === "fixed" ? "" : form.maximumDiscountAmount,
                    })
                  }
                  options={[
                    {
                      value: "fixed",
                      label: "Fixed Amount",
                    },
                    {
                      value: "percentage",
                      label: "Percentage",
                    },
                  ]}
                />

                <NumberField
                  label="Discount Value *"
                  value={form.discountValue}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      discountValue: value,
                    })
                  }
                  required
                />

                <NumberField
                  label="Minimum Order Amount"
                  value={form.minimumOrderAmount}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      minimumOrderAmount: value,
                    })
                  }
                />

                <NumberField
                  label="Maximum Discount"
                  value={form.maximumDiscountAmount}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      maximumDiscountAmount: value,
                    })
                  }
                  disabled={form.discountType !== "percentage"}
                />

                <DateField
                  label="Start Date *"
                  value={form.startsAt}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      startsAt: value,
                    })
                  }
                />

                <DateField
                  label="Expiry Date *"
                  value={form.expiresAt}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      expiresAt: value,
                    })
                  }
                />

                <NumberField
                  label="Total Usage Limit"
                  value={form.usageLimit}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      usageLimit: value,
                    })
                  }
                />

                <NumberField
                  label="Usage Per User"
                  value={form.usageLimitPerUser}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      usageLimitPerUser: value,
                    })
                  }
                />

                {/* FREELANCER */}

                <div className="md:col-span-2 rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-900">
                      Freelancer Assignment
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Leave as Not assigned for general MYSMME coupons.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold">
                        Assign Freelancer
                      </label>

                      <select
                        value={form.assignedFreelancer}
                        onChange={(event) =>
                          setForm({
                            ...form,

                            assignedFreelancer: event.target.value,

                            commissionValue: event.target.value
                              ? form.commissionValue
                              : "",
                          })
                        }
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3"
                      >
                        <option value="">
                          Not assigned — General MYSMME coupon
                        </option>

                        {freelancersLoading ? (
                          <option disabled>Loading freelancers...</option>
                        ) : (
                          freelancers.map((freelancer) => (
                            <option key={freelancer._id} value={freelancer._id}>
                              {freelancer.name || "Freelancer"}{" "}
                              {freelancer.email ? `(${freelancer.email})` : ""}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {form.assignedFreelancer && (
                      <>
                        <SelectField
                          label="Commission Type"
                          value={form.commissionType}
                          onChange={(value) =>
                            setForm({
                              ...form,
                              commissionType: value as CommissionType,
                            })
                          }
                          options={[
                            {
                              value: "percentage",
                              label: "Percentage",
                            },
                            {
                              value: "fixed",
                              label: "Fixed Amount",
                            },
                          ]}
                        />

                        <NumberField
                          label={
                            form.commissionType === "percentage"
                              ? "Commission %"
                              : "Commission Amount ₹"
                          }
                          value={form.commissionValue}
                          onChange={(value) =>
                            setForm({
                              ...form,
                              commissionValue: value,
                            })
                          }
                          required
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* FLAGS */}

                <div className="grid gap-3 md:col-span-2 sm:grid-cols-2">
                  <CheckBox
                    label="First order only"
                    description="Only new customers can use this coupon."
                    checked={form.firstOrderOnly}
                    onChange={(checked) =>
                      setForm({
                        ...form,
                        firstOrderOnly: checked,
                      })
                    }
                  />

                  <CheckBox
                    label="Active"
                    description="Coupon is available for customers."
                    checked={form.isActive}
                    onChange={(checked) =>
                      setForm({
                        ...form,
                        isActive: checked,
                      })
                    }
                  />
                </div>

                <div className="flex justify-end gap-3 border-t pt-5 md:col-span-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="h-10 rounded-lg border px-5 text-sm font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}

                    {saving
                      ? "Saving..."
                      : editingCoupon
                        ? "Update Coupon"
                        : "Create Coupon"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;

// ============================================================
// COMPONENTS
// ============================================================

function StatCard({
  title,
  value,
  icon,
  iconClass,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function Header({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </th>
  );
}

function Loading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-2xl border bg-white">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />

        <p className="mt-3 text-sm text-slate-500">Loading coupons...</p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>

      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-slate-200 px-3"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  required,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>

      <input
        type="number"
        min="0"
        required={required}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-slate-200 px-3 disabled:bg-slate-100"
      />
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>

      <input
        required
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-slate-200 px-3"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckBox({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4"
      />

      <div>
        <p className="text-sm font-semibold">{label}</p>

        <p className="text-xs text-slate-400">{description}</p>
      </div>
    </label>
  );
}
