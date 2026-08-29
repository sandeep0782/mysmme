"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Tag,
    CheckCircle2,
    XCircle,
    X,
    Loader2,
} from "lucide-react";

import Pagination from "@/components/Admin/Pagination";

import {
    useAddBrandMutation,
    useGetBrandsQuery,
    useUpdateBrandMutation,
    useDeleteBrandMutation,
} from "@/store/api/brandApi";

type Brand = {
    _id: string;
    name: string;
    description?: string;
    logo?: string;
    isActive: boolean;
    createdAt?: string;
};

interface BrandFormData {
    name: string;
    description: string;
    isActive: "true" | "false";
}

const MAX_LOGO_SIZE = 5 * 1024 * 1024;

const ALLOWED_LOGO_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp",
];

const Page = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);


    const [saveError, setSaveError] = useState("");
    const [deleteError, setDeleteError] = useState("");

    const logoInputRef = useRef<HTMLInputElement | null>(null);

    const itemsPerPage = 5;

    // ============================================================
    // GET BRANDS
    // ============================================================

    const {
        data: brandsResponse,
        isLoading,
        isError,
    } = useGetBrandsQuery();

    const brands: Brand[] = brandsResponse?.data ?? [];

    // ============================================================
    // ADD BRAND
    // ============================================================

    const [addBrand, { isLoading: isAdding }] =
        useAddBrandMutation();

    // ============================================================
    // UPDATE BRAND
    // ============================================================

    const [updateBrand, { isLoading: isUpdating }] =
        useUpdateBrandMutation();

    // ============================================================
    // DELETE BRAND
    // ============================================================

    const [deleteBrand, { isLoading: isDeleting }] =
        useDeleteBrandMutation();

    const isSaving = isAdding || isUpdating;

    // ============================================================
    // FORM
    // ============================================================

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BrandFormData>({
        defaultValues: {
            name: "",
            description: "",
            isActive: "true",
        },
    });

    // ============================================================
    // BODY SCROLL LOCK WHEN MODAL IS OPEN
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
    // CLEANUP LOGO PREVIEW URL
    // ============================================================

    useEffect(() => {
        return () => {
            if (logoPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(logoPreview);
            }
        };
    }, [logoPreview]);

    // ============================================================
    // ESCAPE KEY FOR MODALS
    // ============================================================

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;

            if (isSaving || isDeleting) return;

            if (isDeleteModalOpen) {
                setIsDeleteModalOpen(false);
                setBrandToDelete(null);
                setDeleteError("");
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
    }, [
        isAddModalOpen,
        isDeleteModalOpen,
        isSaving,
        isDeleting,
    ]);

    // ============================================================
    // SEARCH
    // ============================================================

    const searchValue = search.trim().toLowerCase();

    const filteredBrands = !searchValue
        ? brands
        : brands.filter((brand) => {
            const name = brand.name?.toLowerCase() ?? "";
            const description =
                brand.description?.toLowerCase() ?? "";

            return (
                name.includes(searchValue) ||
                description.includes(searchValue)
            );
        });
    // ============================================================
    // PAGINATION
    // ============================================================

    const totalPages = Math.ceil(
        filteredBrands.length / itemsPerPage
    );

    const safeCurrentPage =
        totalPages > 0
            ? Math.min(currentPage, totalPages)
            : 1;

    const startIndex =
        (safeCurrentPage - 1) * itemsPerPage;

    const paginatedBrands = filteredBrands.slice(
        startIndex,
        startIndex + itemsPerPage
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
    // STATISTICS
    // ============================================================

    const activeCount = brands.filter(
        (brand) => brand.isActive
    ).length;

    const inactiveCount = brands.filter(
        (brand) => !brand.isActive
    ).length;

    // ============================================================
    // RESET FORM
    // ============================================================

    const resetBrandForm = () => {
        reset({
            name: "",
            description: "",
            isActive: "true",
        });

        setEditingBrand(null);
        setSaveError("");
        setLogoFile(null);
        setLogoPreview(null);

        if (logoInputRef.current) {
            logoInputRef.current.value = "";
        }
    };

    // ============================================================
    // OPEN ADD MODAL
    // ============================================================

    const openAddModal = () => {
        resetBrandForm();

        setIsAddModalOpen(true);
    };

    // ============================================================
    // LOGO CHANGE
    // ============================================================

    const handleLogoChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        setSaveError("");

        if (!file) {
            return;
        }

        if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
            setSaveError(
                "Only PNG, JPG, JPEG, and WebP images are allowed."
            );

            event.target.value = "";

            return;
        }

        if (file.size > MAX_LOGO_SIZE) {
            setSaveError(
                "Logo image must be smaller than 5MB."
            );

            event.target.value = "";

            return;
        }

        if (logoPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(logoPreview);
        }

        const previewUrl = URL.createObjectURL(file);

        setLogoFile(file);
        setLogoPreview(previewUrl);
    };

    // ============================================================
    // REMOVE SELECTED LOGO
    // ============================================================

    const removeSelectedLogo = () => {
        if (logoPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(logoPreview);
        }

        setLogoFile(null);
        setLogoPreview(null);
        setSaveError("");

        if (logoInputRef.current) {
            logoInputRef.current.value = "";
        }
    };

    // ============================================================
    // CREATE / UPDATE BRAND
    // ============================================================

    const onSubmitBrand = async (data: BrandFormData) => {
        setSaveError("");

        try {
            // Logo is mandatory when creating
            if (!editingBrand && !logoFile) {
                setSaveError("Brand logo is required.");
                return;
            }

            const formData = new FormData();

            formData.append(
                "name",
                data.name.trim()
            );

            formData.append(
                "description",
                data.description.trim()
            );

            formData.append(
                "isActive",
                String(data.isActive === "true")
            );

            // Only send logo when a new logo was selected.
            // During edit, this keeps the existing logo.
            if (logoFile) {
                formData.append("logo", logoFile);
            }

            if (editingBrand) {
                await updateBrand({
                    id: editingBrand._id,
                    data: formData,
                }).unwrap();
            } else {
                await addBrand(formData).unwrap();
            }

            resetBrandForm();

            setCurrentPage(1);
            setIsAddModalOpen(false);
        } catch (error: unknown) {
            console.error(
                "Failed to save brand:",
                error
            );

            setSaveError(
                "Failed to save brand. Please check your information and try again."
            );
        }
    };

    // ============================================================
    // EDIT BRAND
    // ============================================================

    const onEditBrand = (brand: Brand) => {
        setEditingBrand(brand);

        setSaveError("");

        setLogoFile(null);
        setLogoPreview(null);

        if (logoInputRef.current) {
            logoInputRef.current.value = "";
        }

        reset({
            name: brand.name || "",
            description: brand.description || "",
            isActive: brand.isActive
                ? "true"
                : "false",
        });

        setIsAddModalOpen(true);
    };

    // ============================================================
    // DELETE BRAND
    // ============================================================

    const openDeleteModal = (brand: Brand) => {
        setBrandToDelete(brand);
        setDeleteError("");
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        if (isDeleting) {
            return;
        }

        setIsDeleteModalOpen(false);
        setBrandToDelete(null);
        setDeleteError("");
    };

    const onDeleteBrand = async () => {
        if (!brandToDelete) {
            return;
        }

        setDeleteError("");

        try {
            await deleteBrand(
                brandToDelete._id
            ).unwrap();

            setBrandToDelete(null);
            setIsDeleteModalOpen(false);
            setDeleteError("");
        } catch (error: unknown) {
            console.error(
                "Failed to delete brand:",
                error
            );

            setDeleteError(
                "Failed to delete brand. Please try again."
            );
        }
    };

    // ============================================================
    // CLOSE ADD / EDIT MODAL
    // ============================================================

    const closeAddModal = () => {
        if (isSaving) {
            return;
        }

        resetBrandForm();

        setIsAddModalOpen(false);
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="px-4 py-6 sm:px-6 lg:px-8">

                {/* ============================================================
                    HEADER
                ============================================================ */}

                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-600" />

                            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                Catalog Management
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Manage Brands
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                            Create and manage brands used to
                            organize and categorize your
                            product catalog.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        <Plus className="h-4 w-4" />
                        Add Brand
                    </button>
                </div>

                {/* ============================================================
                    STATISTICS
                ============================================================ */}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                    {/* TOTAL */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total Brands
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {isLoading ? (
                                        <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-200" />
                                    ) : (
                                        brands.length
                                    )}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Tag className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* ACTIVE */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Active Brands
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {isLoading ? (
                                        <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-200" />
                                    ) : (
                                        activeCount
                                    )}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* INACTIVE */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Inactive Brands
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {isLoading ? (
                                        <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-200" />
                                    ) : (
                                        inactiveCount
                                    )}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                                <XCircle className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ============================================================
                    SEARCH
                ============================================================ */}

                <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            placeholder="Search brands..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <p className="text-sm text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-900">
                                {filteredBrands.length === 0
                                    ? 0
                                    : startIndex + 1}
                            </span>

                            {" - "}

                            <span className="font-semibold text-slate-900">
                                {Math.min(
                                    startIndex +
                                    itemsPerPage,
                                    filteredBrands.length
                                )}
                            </span>

                            {" of "}

                            <span className="font-semibold text-slate-900">
                                {filteredBrands.length}
                            </span>

                            {" brands"}
                        </p>
                    </div>
                </div>

                {/* ============================================================
                    FETCH ERROR
                ============================================================ */}

                {isError && (
                    <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-4">
                        <div>
                            <p className="font-semibold text-red-700">
                                Failed to load brands
                            </p>

                            <p className="mt-1 text-sm text-red-600">
                                Something went wrong while
                                fetching brands.
                            </p>
                        </div>
                    </div>
                )}

                {/* ============================================================
                    LOADING / TABLE / EMPTY
                ============================================================ */}

                {isLoading ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex min-h-[350px] items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

                                <p className="text-sm text-slate-500">
                                    Loading brands...
                                </p>
                            </div>
                        </div>
                    </div>
                ) : filteredBrands.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[800px]">

                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Brand
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Description
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Created
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Actions
                                        </th>

                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {paginatedBrands.map((brand) => (
                                        <tr
                                            key={brand._id}
                                            className="group transition hover:bg-slate-50"
                                        >

                                            {/* BRAND */}

                                            <td className="whitespace-nowrap px-6 py-5">
                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-blue-600">

                                                        {brand.logo ? (
                                                            <img
                                                                src={brand.logo}
                                                                alt={`${brand.name} logo`}
                                                                className="h-full w-full object-contain"
                                                            />
                                                        ) : (
                                                            <Tag className="h-5 w-5" />
                                                        )}

                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            {brand.name}
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-slate-400">
                                                            ID #{brand._id}
                                                        </p>
                                                    </div>

                                                </div>
                                            </td>

                                            {/* DESCRIPTION */}

                                            <td className="max-w-md px-6 py-5">
                                                <p className="line-clamp-2 text-sm leading-5 text-slate-500">
                                                    {brand.description ||
                                                        "—"}
                                                </p>
                                            </td>

                                            {/* STATUS */}

                                            <td className="whitespace-nowrap px-6 py-5">
                                                <span
                                                    className={`inline-flex w-[88px] items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${brand.isActive
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : "bg-slate-100 text-slate-500"
                                                        }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${brand.isActive
                                                            ? "bg-emerald-500"
                                                            : "bg-slate-400"
                                                            }`}
                                                    />

                                                    {brand.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            {/* CREATED */}

                                            <td className="whitespace-nowrap px-6 py-5">
                                                <div className="flex items-center gap-2 text-sm text-slate-500">

                                                    <Tag className="h-4 w-4 text-slate-400" />
                                                    {brand.createdAt
                                                        ? new Date(
                                                            brand.createdAt
                                                        ).toLocaleDateString()
                                                        : "—"}
                                                </div>
                                            </td>

                                            {/* ACTIONS */}

                                            <td className="whitespace-nowrap px-6 py-5">
                                                <div className="flex items-center justify-end gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onEditBrand(
                                                                brand
                                                            )
                                                        }
                                                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                brand
                                                            )
                                                        }
                                                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                            <div className="rounded-b-2xl bg-white">
                                <div className="h-px w-full bg-slate-200" />

                                <Pagination
                                    currentPage={safeCurrentPage}
                                    totalPages={totalPages}
                                    onPageChange={
                                        setCurrentPage
                                    }
                                />
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                            <Tag className="h-7 w-7 text-slate-400" />
                        </div>

                        <h3 className="mt-4 text-lg font-semibold text-slate-900">
                            {search
                                ? "No brands found"
                                : "No brands available"}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            {search
                                ? "Try changing your search."
                                : "Create your first brand."}
                        </p>

                        {!search && (
                            <button
                                type="button"
                                onClick={openAddModal}
                                className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                <Plus className="h-4 w-4" />
                                Add Brand
                            </button>
                        )}

                    </div>
                )}
            </main>

            {/* ============================================================
                ADD / EDIT BRAND MODAL
            ============================================================ */}

            {isAddModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="brand-modal-title"
                    onMouseDown={(e) => {
                        if (
                            e.target === e.currentTarget &&
                            !isSaving
                        ) {
                            closeAddModal();
                        }
                    }}
                >
                    <div
                        className="max-h-[calc(100vh-3rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
                        onMouseDown={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* HEADER */}

                        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                    <Tag className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2
                                        id="brand-modal-title"
                                        className="text-lg font-bold text-slate-900"
                                    >
                                        {editingBrand
                                            ? "Edit Brand"
                                            : "Add Brand"}
                                    </h2>

                                    <p className="mt-0.5 text-sm text-slate-500">
                                        {editingBrand
                                            ? "Update brand information"
                                            : "Create a new brand"}
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={closeAddModal}
                                disabled={isSaving}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>

                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit(
                                onSubmitBrand
                            )}
                        >

                            {/* SAVE ERROR */}

                            {saveError && (
                                <div className="mx-6 mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                                    <p className="text-sm font-medium text-red-700">
                                        {saveError}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-5 px-6 py-6">

                                {/* NAME */}

                                <div>
                                    <label
                                        htmlFor="brand-name"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Brand Name

                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="brand-name"
                                        type="text"
                                        placeholder="e.g. Nike"
                                        disabled={isSaving}
                                        {...register("name", {
                                            required:
                                                "Brand name is required",

                                            validate: (value) =>
                                                value.trim()
                                                    .length >=
                                                2 ||
                                                "Brand name must be at least 2 characters",

                                            maxLength: {
                                                value: 50,
                                                message:
                                                    "Brand name cannot exceed 50 characters",
                                            },
                                        })}
                                        className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${errors.name
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                            : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                                            }`}
                                    />

                                    {errors.name && (
                                        <p className="mt-1.5 text-xs font-medium text-red-500">
                                            {
                                                errors.name
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* DESCRIPTION */}

                                <div>
                                    <label
                                        htmlFor="brand-description"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="brand-description"
                                        rows={4}
                                        placeholder="Describe this brand..."
                                        disabled={isSaving}
                                        {...register(
                                            "description",
                                            {
                                                maxLength: {
                                                    value: 500,
                                                    message:
                                                        "Description cannot exceed 500 characters",
                                                },
                                            }
                                        )}
                                        className={`w-full resize-none rounded-lg border bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${errors.description
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                            : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                                            }`}
                                    />

                                    {errors.description && (
                                        <p className="mt-1.5 text-xs font-medium text-red-500">
                                            {
                                                errors
                                                    .description
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* BRAND LOGO */}

                                <div>
                                    <label
                                        htmlFor="brand-logo"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Brand Logo

                                        {!editingBrand && (
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        )}
                                    </label>

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                                        {/* LOGO PREVIEW */}

                                        <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

                                            {logoPreview ? (
                                                <img
                                                    src={logoPreview}
                                                    alt="Brand logo preview"
                                                    className="h-full w-full object-contain p-2"
                                                />
                                            ) : editingBrand?.logo ? (
                                                <img
                                                    src={
                                                        editingBrand.logo
                                                    }
                                                    alt={`${editingBrand.name} logo`}
                                                    className="h-full w-full object-contain p-2"
                                                />
                                            ) : (
                                                <Tag className="h-8 w-8 text-slate-300" />
                                            )}

                                        </div>

                                        {/* UPLOAD */}

                                        <div className="min-w-0 flex-1">

                                            <input
                                                ref={
                                                    logoInputRef
                                                }
                                                id="brand-logo"
                                                type="file"
                                                accept="image/png,image/jpeg,image/webp"
                                                disabled={isSaving}
                                                onChange={
                                                    handleLogoChange
                                                }
                                                className="block w-full cursor-pointer rounded-lg border border-slate-200 bg-white text-sm text-slate-600 file:mr-4 file:cursor-pointer file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                                            />

                                            <p className="mt-2 text-xs leading-5 text-slate-400">
                                                PNG, JPG, JPEG or
                                                WebP. Maximum
                                                5MB.
                                            </p>

                                            {logoFile && (
                                                <div className="mt-2 flex items-center gap-2">
                                                    <p className="min-w-0 truncate text-xs font-medium text-blue-600">
                                                        Selected:{" "}
                                                        {
                                                            logoFile.name
                                                        }
                                                    </p>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isSaving
                                                        }
                                                        onClick={
                                                            removeSelectedLogo
                                                        }
                                                        className="flex-shrink-0 text-xs font-semibold text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}

                                            {editingBrand &&
                                                !logoFile && (
                                                    <p className="mt-2 text-xs text-slate-400">
                                                        Leave empty to
                                                        keep the
                                                        existing logo.
                                                    </p>
                                                )}

                                        </div>
                                    </div>
                                </div>

                                {/* STATUS */}

                                <div>
                                    <label
                                        htmlFor="brand-status"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Status
                                    </label>

                                    <select
                                        id="brand-status"
                                        disabled={isSaving}
                                        {...register(
                                            "isActive"
                                        )}
                                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                    >
                                        <option value="true">
                                            Active
                                        </option>

                                        <option value="false">
                                            Inactive
                                        </option>
                                    </select>
                                </div>

                            </div>

                            {/* FOOTER */}

                            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

                                <button
                                    type="button"
                                    onClick={
                                        closeAddModal
                                    }
                                    disabled={isSaving}
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />

                                            {editingBrand
                                                ? "Updating..."
                                                : "Creating..."}
                                        </>
                                    ) : editingBrand ? (
                                        <>
                                            <Pencil className="h-4 w-4" />
                                            Update Brand
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4" />
                                            Create Brand
                                        </>
                                    )}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================
                DELETE MODAL
            ============================================================ */}

            {isDeleteModalOpen &&
                brandToDelete && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-brand-title"
                        onMouseDown={(e) => {
                            if (
                                e.target ===
                                e.currentTarget &&
                                !isDeleting
                            ) {
                                closeDeleteModal();
                            }
                        }}
                    >
                        <div
                            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
                            onMouseDown={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="p-6">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                    <Trash2 className="h-6 w-6" />
                                </div>

                                <h2
                                    id="delete-brand-title"
                                    className="mt-5 text-xl font-bold text-slate-900"
                                >
                                    Delete Brand?
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Are you sure you want to
                                    delete{" "}
                                    <span className="font-semibold text-slate-900">
                                        {
                                            brandToDelete.name
                                        }
                                    </span>
                                    ? This action cannot be
                                    undone.
                                </p>

                                {deleteError && (
                                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                                        <p className="text-sm font-medium text-red-700">
                                            {deleteError}
                                        </p>
                                    </div>
                                )}

                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

                                <button
                                    type="button"
                                    disabled={isDeleting}
                                    onClick={
                                        closeDeleteModal
                                    }
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={isDeleting}
                                    onClick={
                                        onDeleteBrand
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4" />
                                            Delete
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