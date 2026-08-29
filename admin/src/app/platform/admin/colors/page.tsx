"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Palette,
    CheckCircle2,
    XCircle,
    X,
    Loader2,
} from "lucide-react";

import Pagination from "@/components/Admin/Pagination";

import {
    useAddColorMutation,
    useGetColorsQuery,
    useUpdateColorMutation,
    useDeleteColorMutation,
} from "@/store/api/colorApi";

type Color = {
    _id: string;
    name: string;
    hexCode: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};

interface ColorFormData {
    name: string;
    hexCode: string;
    isActive: "true" | "false";
}

const Page = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingColor, setEditingColor] = useState<Color | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [colorToDelete, setColorToDelete] = useState<Color | null>(null);

    const [saveError, setSaveError] = useState("");
    const [deleteError, setDeleteError] = useState("");

    const itemsPerPage = 5;

    // ============================================================
    // GET COLORS
    // ============================================================

    const {
        data: colorsResponse,
        isLoading,
        isError,
    } = useGetColorsQuery();

    const colors: Color[] = colorsResponse?.data ?? [];

    // ============================================================
    // ADD COLOR
    // ============================================================

    const [addColor, { isLoading: isAdding }] =
        useAddColorMutation();

    // ============================================================
    // UPDATE COLOR
    // ============================================================

    const [updateColor, { isLoading: isUpdating }] =
        useUpdateColorMutation();

    // ============================================================
    // DELETE COLOR
    // ============================================================

    const [deleteColor, { isLoading: isDeleting }] =
        useDeleteColorMutation();

    const isSaving = isAdding || isUpdating;

    // ============================================================
    // FORM
    // ============================================================

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<ColorFormData>({
        defaultValues: {
            name: "",
            hexCode: "#000000",
            isActive: "true",
        },
    });

    const selectedHexCode = watch("hexCode");

    // ============================================================
    // BODY SCROLL LOCK
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
    // ESCAPE KEY
    // ============================================================

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;

            if (isSaving || isDeleting) return;

            if (isDeleteModalOpen) {
                setIsDeleteModalOpen(false);
                setColorToDelete(null);
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

    const filteredColors = !searchValue
        ? colors
        : colors.filter((color) => {
            const name = color.name?.toLowerCase() ?? "";
            const hexCode = color.hexCode?.toLowerCase() ?? "";

            return (
                name.includes(searchValue) ||
                hexCode.includes(searchValue)
            );
        });

    // ============================================================
    // PAGINATION
    // ============================================================

    const totalPages = Math.ceil(
        filteredColors.length / itemsPerPage
    );

    const safeCurrentPage =
        totalPages > 0
            ? Math.min(currentPage, totalPages)
            : 1;

    const startIndex =
        (safeCurrentPage - 1) * itemsPerPage;

    const paginatedColors = filteredColors.slice(
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

    const activeCount = colors.filter(
        (color) => color.isActive
    ).length;

    const inactiveCount = colors.filter(
        (color) => !color.isActive
    ).length;

    // ============================================================
    // RESET FORM
    // ============================================================

    const resetColorForm = () => {
        reset({
            name: "",
            hexCode: "#000000",
            isActive: "true",
        });

        setEditingColor(null);
        setSaveError("");
    };

    // ============================================================
    // OPEN ADD MODAL
    // ============================================================

    const openAddModal = () => {
        resetColorForm();
        setIsAddModalOpen(true);
    };

    // ============================================================
    // CREATE / UPDATE COLOR
    // ============================================================

    const onSubmitColor = async (data: ColorFormData) => {
        setSaveError("");

        try {
            const payload = {
                name: data.name.trim(),
                hexCode: data.hexCode.trim().toUpperCase(),
                isActive: data.isActive === "true",
            };

            if (editingColor) {
                await updateColor({
                    id: editingColor._id,
                    data: payload,
                }).unwrap();
            } else {
                await addColor(payload).unwrap();
            }

            resetColorForm();

            setCurrentPage(1);
            setIsAddModalOpen(false);
        } catch (error: unknown) {
            console.error(
                "Failed to save color:",
                error
            );

            setSaveError(
                "Failed to save color. Please check your information and try again."
            );
        }
    };

    // ============================================================
    // EDIT COLOR
    // ============================================================

    const onEditColor = (color: Color) => {
        setEditingColor(color);

        setSaveError("");

        reset({
            name: color.name || "",
            hexCode: color.hexCode || "#000000",
            isActive: color.isActive
                ? "true"
                : "false",
        });

        setIsAddModalOpen(true);
    };

    // ============================================================
    // DELETE COLOR
    // ============================================================

    const openDeleteModal = (color: Color) => {
        setColorToDelete(color);
        setDeleteError("");
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        if (isDeleting) {
            return;
        }

        setIsDeleteModalOpen(false);
        setColorToDelete(null);
        setDeleteError("");
    };

    const onDeleteColor = async () => {
        if (!colorToDelete) {
            return;
        }

        setDeleteError("");

        try {
            await deleteColor(
                colorToDelete._id
            ).unwrap();

            setColorToDelete(null);
            setIsDeleteModalOpen(false);
            setDeleteError("");
        } catch (error: unknown) {
            console.error(
                "Failed to delete color:",
                error
            );

            setDeleteError(
                "Failed to delete color. Please try again."
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

        resetColorForm();

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
                            Manage Colors
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                            Create and manage colors used
                            throughout your product catalog.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        <Plus className="h-4 w-4" />
                        Add Color
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
                                    Total Colors
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {isLoading ? (
                                        <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-200" />
                                    ) : (
                                        colors.length
                                    )}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Palette className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* ACTIVE */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Active Colors
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
                                    Inactive Colors
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
                            placeholder="Search colors..."
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
                                {filteredColors.length === 0
                                    ? 0
                                    : startIndex + 1}
                            </span>

                            {" - "}

                            <span className="font-semibold text-slate-900">
                                {Math.min(
                                    startIndex + itemsPerPage,
                                    filteredColors.length
                                )}
                            </span>

                            {" of "}

                            <span className="font-semibold text-slate-900">
                                {filteredColors.length}
                            </span>

                            {" colors"}
                        </p>
                    </div>
                </div>

                {/* ============================================================
                    ERROR
                ============================================================ */}

                {isError && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4">
                        <p className="font-semibold text-red-700">
                            Failed to load colors
                        </p>

                        <p className="mt-1 text-sm text-red-600">
                            Something went wrong while
                            fetching colors.
                        </p>
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
                                    Loading colors...
                                </p>
                            </div>
                        </div>
                    </div>
                ) : filteredColors.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[700px]">

                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Color
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Hex Code
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

                                    {paginatedColors.map((color) => (
                                        <tr
                                            key={color._id}
                                            className="group transition hover:bg-slate-50"
                                        >

                                            {/* COLOR */}

                                            <td className="whitespace-nowrap px-6 py-5">
                                                <div className="flex items-center gap-3">

                                                    <div
                                                        className="h-11 w-11 flex-shrink-0 rounded-xl border border-slate-200 shadow-sm"
                                                        style={{
                                                            backgroundColor:
                                                                color.hexCode ||
                                                                "#000000",
                                                        }}
                                                    />

                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            {color.name}
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-slate-400">
                                                            ID #{color._id}
                                                        </p>
                                                    </div>

                                                </div>
                                            </td>

                                            {/* HEX CODE */}

                                            <td className="whitespace-nowrap px-6 py-5">
                                                <div className="flex items-center gap-3">

                                                    <div
                                                        className="h-7 w-7 rounded-md border border-slate-200"
                                                        style={{
                                                            backgroundColor:
                                                                color.hexCode ||
                                                                "#000000",
                                                        }}
                                                    />

                                                    <code className="rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-slate-700">
                                                        {color.hexCode ||
                                                            "—"}
                                                    </code>

                                                </div>
                                            </td>

                                            {/* STATUS */}

                                            <td className="whitespace-nowrap px-6 py-5">

                                                <span
                                                    className={`inline-flex w-[88px] items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${color.isActive
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : "bg-slate-100 text-slate-500"
                                                        }`}
                                                >

                                                    <span
                                                        className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${color.isActive
                                                                ? "bg-emerald-500"
                                                                : "bg-slate-400"
                                                            }`}
                                                    />

                                                    {color.isActive
                                                        ? "Active"
                                                        : "Inactive"}

                                                </span>

                                            </td>

                                            {/* CREATED */}

                                            <td className="whitespace-nowrap px-6 py-5">
                                                <div className="text-sm text-slate-500">
                                                    {color.createdAt
                                                        ? new Date(
                                                            color.createdAt
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
                                                            onEditColor(
                                                                color
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
                                                                color
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
                                    onPageChange={setCurrentPage}
                                />
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                            <Palette className="h-7 w-7 text-slate-400" />
                        </div>

                        <h3 className="mt-4 text-lg font-semibold text-slate-900">
                            {search
                                ? "No colors found"
                                : "No colors available"}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            {search
                                ? "Try changing your search."
                                : "Create your first color."}
                        </p>

                        {!search && (
                            <button
                                type="button"
                                onClick={openAddModal}
                                className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                <Plus className="h-4 w-4" />
                                Add Color
                            </button>
                        )}

                    </div>
                )}
            </main>

            {/* ============================================================
                ADD / EDIT COLOR MODAL
            ============================================================ */}

            {isAddModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="color-modal-title"
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
                                    <Palette className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2
                                        id="color-modal-title"
                                        className="text-lg font-bold text-slate-900"
                                    >
                                        {editingColor
                                            ? "Edit Color"
                                            : "Add Color"}
                                    </h2>

                                    <p className="mt-0.5 text-sm text-slate-500">
                                        {editingColor
                                            ? "Update color information"
                                            : "Create a new color"}
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={closeAddModal}
                                disabled={isSaving}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X className="h-5 w-5" />
                            </button>

                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit(
                                onSubmitColor
                            )}
                        >

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
                                        htmlFor="color-name"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Color Name
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="color-name"
                                        type="text"
                                        placeholder="e.g. Red"
                                        disabled={isSaving}
                                        {...register("name", {
                                            required:
                                                "Color name is required",

                                            validate: (value) =>
                                                value.trim().length >=
                                                2 ||
                                                "Color name must be at least 2 characters",

                                            maxLength: {
                                                value: 50,
                                                message:
                                                    "Color name cannot exceed 50 characters",
                                            },
                                        })}
                                        className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${errors.name
                                                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                                : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                                            }`}
                                    />

                                    {errors.name && (
                                        <p className="mt-1.5 text-xs font-medium text-red-500">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                {/* HEX CODE */}

                                <div>
                                    <label
                                        htmlFor="color-hex"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Hex Code
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <div className="flex items-center gap-3">

                                        {/* COLOR PICKER */}

                                        <input
                                            type="color"
                                            value={
                                                /^#([0-9A-F]{6})$/i.test(
                                                    selectedHexCode
                                                )
                                                    ? selectedHexCode
                                                    : "#000000"
                                            }
                                            disabled={isSaving}
                                            onChange={(e) => {
                                                reset(
                                                    {
                                                        name:
                                                            watch(
                                                                "name"
                                                            ),
                                                        hexCode:
                                                            e.target
                                                                .value
                                                                .toUpperCase(),
                                                        isActive:
                                                            watch(
                                                                "isActive"
                                                            ),
                                                    },
                                                    {
                                                        keepErrors:
                                                            true,
                                                    }
                                                );
                                            }}
                                            className="h-11 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 disabled:cursor-not-allowed"
                                        />

                                        <input
                                            id="color-hex"
                                            type="text"
                                            placeholder="#FF0000"
                                            maxLength={7}
                                            disabled={isSaving}
                                            {...register(
                                                "hexCode",
                                                {
                                                    required:
                                                        "Hex code is required",

                                                    pattern: {
                                                        value: /^#([0-9A-F]{3}){1,2}$/i,
                                                        message:
                                                            "Enter a valid hex code, e.g. #FF0000",
                                                    },
                                                }
                                            )}
                                            className={`h-11 flex-1 rounded-lg border bg-white px-3 text-sm font-medium uppercase text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${errors.hexCode
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                                                }`}
                                        />

                                    </div>

                                    {errors.hexCode && (
                                        <p className="mt-1.5 text-xs font-medium text-red-500">
                                            {
                                                errors.hexCode
                                                    .message
                                            }
                                        </p>
                                    )}

                                    {/* PREVIEW */}

                                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">

                                        <div
                                            className="h-12 w-12 rounded-lg border border-slate-200 shadow-sm"
                                            style={{
                                                backgroundColor:
                                                    /^#([0-9A-F]{3}){1,2}$/i.test(
                                                        selectedHexCode
                                                    )
                                                        ? selectedHexCode
                                                        : "#000000",
                                            }}
                                        />

                                        <div>
                                            <p className="text-xs font-medium text-slate-500">
                                                Color Preview
                                            </p>

                                            <p className="mt-0.5 text-sm font-semibold uppercase text-slate-900">
                                                {selectedHexCode ||
                                                    "#000000"}
                                            </p>
                                        </div>

                                    </div>
                                </div>

                                {/* STATUS */}

                                <div>
                                    <label
                                        htmlFor="color-status"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Status
                                    </label>

                                    <select
                                        id="color-status"
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
                                    onClick={closeAddModal}
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

                                            {editingColor
                                                ? "Updating..."
                                                : "Creating..."}
                                        </>
                                    ) : editingColor ? (
                                        <>
                                            <Pencil className="h-4 w-4" />
                                            Update Color
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4" />
                                            Create Color
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
                colorToDelete && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-color-title"
                        onMouseDown={(e) => {
                            if (
                                e.target === e.currentTarget &&
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
                                    id="delete-color-title"
                                    className="mt-5 text-xl font-bold text-slate-900"
                                >
                                    Delete Color?
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Are you sure you want to
                                    delete{" "}
                                    <span className="font-semibold text-slate-900">
                                        {colorToDelete.name}
                                    </span>
                                    ? This action cannot be
                                    undone.
                                </p>

                                <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">

                                    <div
                                        className="h-10 w-10 rounded-lg border border-slate-200"
                                        style={{
                                            backgroundColor:
                                                colorToDelete.hexCode,
                                        }}
                                    />

                                    <code className="text-sm font-semibold text-slate-700">
                                        {colorToDelete.hexCode}
                                    </code>

                                </div>

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
                                    onClick={closeDeleteModal}
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={isDeleting}
                                    onClick={onDeleteColor}
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