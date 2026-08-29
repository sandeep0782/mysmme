"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    CalendarDays,
    CheckCircle2,
    XCircle,
    X,
    Loader2,
    RefreshCw,
} from "lucide-react";

import Pagination from "@/components/Admin/Pagination";
import {
    useAddSeasonMutation,
    useGetSeasonsQuery,
    useUpdateSeasonMutation,
    useDeleteSeasonMutation,
} from "@/store/api/seasonApi";

type Season = {
    _id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    slug?: string;
};

interface SeasonFormData {
    name: string;
    description: string;
    isActive: "true" | "false";
}

const Page = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [editingSeason, setEditingSeason] = useState<Season | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [seasonToDelete, setSeasonToDelete] = useState<Season | null>(null);

    const itemsPerPage = 5;

    // GET SEASONS
    const {
        data: seasonsResponse,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useGetSeasonsQuery({});

    const seasons: Season[] = seasonsResponse?.data ?? [];

    // ADD SEASON
    const [addSeason, { isLoading: isAdding }] =
        useAddSeasonMutation();

    // ADD UPDATE
    const [updateSeason, { isLoading: isUpdating }] =
        useUpdateSeasonMutation();


    // DELETE SEASON
    const [deleteSeason, { isLoading: isDeleting }] =
        useDeleteSeasonMutation();

    const isSaving = isAdding || isUpdating;


    // ============================================================
    // FORM
    // ============================================================

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SeasonFormData>({
        defaultValues: {
            name: "",
            description: "",
            isActive: "true",
        },
    });

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredSeasons = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        if (!searchValue) {
            return seasons;
        }

        return seasons.filter((season) =>
            season.name.toLowerCase().includes(searchValue)
        );
    }, [seasons, search]);

    // ============================================================
    // PAGINATION
    // ============================================================

    const totalPages = Math.ceil(
        filteredSeasons.length / itemsPerPage
    );

    const startIndex =
        (currentPage - 1) * itemsPerPage;

    const paginatedSeasons = filteredSeasons.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    // If current page becomes invalid after searching/deleting
    useEffect(() => {
        if (
            totalPages > 0 &&
            currentPage > totalPages
        ) {
            setCurrentPage(totalPages);
        }

        if (totalPages === 0 && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    // ============================================================
    // STATISTICS
    // ============================================================

    const activeCount = seasons.filter(
        (season) => season.isActive
    ).length;

    const inactiveCount = seasons.filter(
        (season) => !season.isActive
    ).length;

    // ============================================================
    // ADD SEASON
    // ============================================================

    const onSubmitSeason = async (data: SeasonFormData) => {
        try {
            const payload = {
                name: data.name.trim(),
                description: data.description.trim(),
                isActive: data.isActive === "true",
            };

            if (editingSeason) {
                await updateSeason({
                    id: editingSeason._id,
                    data: payload,
                }).unwrap();
            } else {
                await addSeason(payload).unwrap();
            }

            reset({
                name: "",
                description: "",
                isActive: "true",
            });

            setEditingSeason(null);
            setCurrentPage(1);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Season save error:", error);
        }
    };
    const onEditSeason = (season: Season) => {
        setEditingSeason(season);

        reset({
            name: season.name || "",
            description: season.description || "",
            isActive: season.isActive ? "true" : "false",
        });

        setIsAddModalOpen(true);
    };

    const onDeleteSeason = async () => {
        if (!seasonToDelete) return;

        try {
            await deleteSeason(seasonToDelete._id).unwrap();

            setSeasonToDelete(null);
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Failed to delete season:", error);
        }
    };
    // ============================================================
    // CLOSE MODAL
    // ============================================================

    const closeAddModal = () => {
        if (isSaving) return;

        reset({
            name: "",
            description: "",
            isActive: "true",
        });

        setEditingSeason(null);
        setIsAddModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="px-4 py-6 sm:px-6 lg:px-8">

                {/* ========================================================
                    HEADER
                ======================================================== */}

                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-600" />

                            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                Catalog Management
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Manage Seasons
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                            Create and manage seasons used to organize
                            and categorize your product catalog.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setIsAddModalOpen(true)
                        }
                        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        <Plus className="h-4 w-4" />

                        Add Season
                    </button>
                </div>

                {/* ========================================================
                    STATISTICS
                ======================================================== */}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                    {/* Total */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total Seasons
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {isLoading ? (
                                        <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-200" />
                                    ) : (
                                        seasons.length
                                    )}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <CalendarDays className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Active */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Active Seasons
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

                    {/* Inactive */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Inactive Seasons
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

                {/* ========================================================
                    SEARCH
                ======================================================== */}

                <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            placeholder="Search seasons..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        {isFetching && !isLoading && (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        )}

                        <p className="text-sm text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-900">
                                {filteredSeasons.length === 0
                                    ? 0
                                    : startIndex + 1}
                            </span>

                            {" - "}

                            <span className="font-semibold text-slate-900">
                                {Math.min(
                                    startIndex + itemsPerPage,
                                    filteredSeasons.length
                                )}
                            </span>

                            {" of "}

                            <span className="font-semibold text-slate-900">
                                {filteredSeasons.length}
                            </span>

                            {" seasons"}
                        </p>
                    </div>
                </div>

                {/* ========================================================
                    ERROR
                ======================================================== */}

                {isError && (
                    <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-4">
                        <div>
                            <p className="font-semibold text-red-700">
                                Failed to load seasons
                            </p>

                            <p className="mt-1 text-sm text-red-600">
                                Something went wrong while fetching seasons.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Retry
                        </button>
                    </div>
                )}

                {/* ========================================================
                    LOADING
                ======================================================== */}

                {isLoading ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex min-h-[350px] items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

                                <p className="text-sm text-slate-500">
                                    Loading seasons...
                                </p>
                            </div>
                        </div>
                    </div>
                ) : filteredSeasons.length > 0 ? (

                    /* =====================================================
                        TABLE
                    ===================================================== */

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[800px]">

                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Season
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

                                    {paginatedSeasons.map((season) => (
                                        <tr
                                            key={season._id}
                                            className="group transition hover:bg-slate-50"
                                        >

                                            {/* Season */}
                                            <td className="whitespace-nowrap px-6 py-5">
                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                        <CalendarDays className="h-5 w-5" />
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            {season.name}
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-slate-400">
                                                            ID #{season._id}
                                                        </p>
                                                    </div>

                                                </div>
                                            </td>

                                            {/* Description */}
                                            <td className="max-w-md px-6 py-5">
                                                <p className="line-clamp-2 text-sm leading-5 text-slate-500">
                                                    {season.description || "—"}
                                                </p>
                                            </td>

                                            {/* Status */}
                                            <td className="whitespace-nowrap px-6 py-5">
                                                <span
                                                    className={`inline-flex w-[88px] items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${season.isActive
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : "bg-slate-100 text-slate-500"
                                                        }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${season.isActive
                                                            ? "bg-emerald-500"
                                                            : "bg-slate-400"
                                                            }`}
                                                    />

                                                    {season.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            {/* Created */}
                                            <td className="whitespace-nowrap px-6 py-5">
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <CalendarDays className="h-4 w-4 text-slate-400" />

                                                    {season.createdAt
                                                        ? new Date(
                                                            season.createdAt
                                                        ).toLocaleDateString()
                                                        : "—"}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="whitespace-nowrap px-6 py-5">
                                                <div className="flex items-center justify-end gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() => onEditSeason(season)}
                                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSeasonToDelete(season);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 cursor-pointer"
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

                            {/* Pagination */}
                            <div className="rounded-b-2xl bg-white">
                                <div className="h-px w-full bg-slate-200" />

                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>

                        </div>
                    </div>

                ) : (

                    /* =====================================================
                        EMPTY STATE
                    ===================================================== */

                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                            <CalendarDays className="h-7 w-7 text-slate-400" />
                        </div>

                        <h3 className="mt-4 text-lg font-semibold text-slate-900">
                            {search
                                ? "No seasons found"
                                : "No seasons available"}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            {search
                                ? "Try changing your search."
                                : "Create your first catalog season."}
                        </p>

                        {!search && (
                            <button
                                type="button"
                                onClick={() =>
                                    setIsAddModalOpen(true)
                                }
                                className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                <Plus className="h-4 w-4" />
                                Add Season
                            </button>
                        )}

                    </div>
                )}
            </main>

            {/* ============================================================
                ADD SEASON MODAL
            ============================================================ */}

            {isAddModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeAddModal();
                        }
                    }}
                >

                    <div
                        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onMouseDown={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* Modal Header */}
                        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                    <CalendarDays className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        {editingSeason ? "Edit Season" : "Add Season"}
                                    </h2>

                                    <p className="mt-0.5 text-sm text-slate-500">
                                        {editingSeason
                                            ? "Update season information"
                                            : "Create a new catalog season"}
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={closeAddModal}
                                disabled={isAdding}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>

                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmitSeason)}>

                            <div className="space-y-5 px-6 py-6">

                                {/* Name */}
                                <div>

                                    <label
                                        htmlFor="season-name"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Season Name

                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="season-name"
                                        type="text"
                                        placeholder="e.g. Spring"
                                        disabled={isAdding}
                                        {...register("name", {
                                            required:
                                                "Season name is required",

                                            validate: (value) =>
                                                value.trim()
                                                    .length >= 2 ||
                                                "Season name must be at least 2 characters",

                                            maxLength: {
                                                value: 50,
                                                message:
                                                    "Season name cannot exceed 50 characters",
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

                                {/* Description */}
                                <div>

                                    <label
                                        htmlFor="season-description"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="season-description"
                                        rows={4}
                                        placeholder="Describe this season..."
                                        disabled={isAdding}
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
                                                errors.description
                                                    .message
                                            }
                                        </p>
                                    )}

                                </div>

                                {/* Status */}
                                <div>

                                    <label
                                        htmlFor="season-status"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Status
                                    </label>

                                    <select
                                        id="season-status"
                                        disabled={isSaving}
                                        {...register("isActive")}
                                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>

                                </div>

                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

                                <button
                                    type="button"
                                    onClick={closeAddModal}
                                    disabled={isAdding}
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
                                            {editingSeason ? "Updating..." : "Creating..."}
                                        </>
                                    ) : (
                                        <>
                                            {editingSeason ? (
                                                <>
                                                    <Pencil className="h-4 w-4" />
                                                    Update Season
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="h-4 w-4" />
                                                    Create Season
                                                </>
                                            )}
                                        </>
                                    )}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}
            {isDeleteModalOpen && seasonToDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget && !isDeleting) {
                            setIsDeleteModalOpen(false);
                            setSeasonToDelete(null);
                        }
                    }}
                >
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                <Trash2 className="h-6 w-6" />
                            </div>

                            <h2 className="mt-5 text-xl font-bold text-slate-900">
                                Delete Season?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Are you sure you want to delete{" "}
                                <span className="font-semibold text-slate-900">
                                    {seasonToDelete.name}
                                </span>
                                ? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setSeasonToDelete(null);
                                }}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={onDeleteSeason}
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