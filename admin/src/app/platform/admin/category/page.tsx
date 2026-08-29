"use client";

import React, {
    useEffect,
    useRef,
    useState,
} from "react";

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
    useAddCategoryMutation,
    useGetCategoriesQuery,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} from "@/store/api/categoryApi";

// ============================================================
// TYPES
// ============================================================

type Category = {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    imagePublicId?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    slug?: string;
};

interface CategoryFormData {
    name: string;
    description: string;
    isActive: "true" | "false";
}

// ============================================================
// IMAGE CONFIG
// ============================================================

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp",
];

// ============================================================
// PAGE
// ============================================================

const Page = () => {
    // ============================================================
    // STATE
    // ============================================================

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] =
        useState(1);

    const [isAddModalOpen, setIsAddModalOpen] =
        useState(false);

    const [
        editingCategory,
        setEditingCategory,
    ] = useState<Category | null>(null);

    const [
        isDeleteModalOpen,
        setIsDeleteModalOpen,
    ] = useState(false);

    const [
        categoryToDelete,
        setCategoryToDelete,
    ] = useState<Category | null>(null);

    const [saveError, setSaveError] =
        useState("");

    const [deleteError, setDeleteError] =
        useState("");

    // Image state
    const [imageFile, setImageFile] =
        useState<File | null>(null);

    const [imagePreview, setImagePreview] =
        useState<string | null>(null);

    const imageInputRef =
        useRef<HTMLInputElement | null>(null);

    const itemsPerPage = 5;

    // ============================================================
    // GET CATEGORIES
    // ============================================================

    const {
        data: categoriesResponse,
        isLoading,
        isError,
    } = useGetCategoriesQuery();

    const categories: Category[] =
        categoriesResponse?.data ?? [];

    // ============================================================
    // ADD CATEGORY
    // ============================================================

    const [
        addCategory,
        { isLoading: isAdding },
    ] = useAddCategoryMutation();

    // ============================================================
    // UPDATE CATEGORY
    // ============================================================

    const [
        updateCategory,
        { isLoading: isUpdating },
    ] = useUpdateCategoryMutation();

    // ============================================================
    // DELETE CATEGORY
    // ============================================================

    const [
        deleteCategory,
        { isLoading: isDeleting },
    ] = useDeleteCategoryMutation();

    const isSaving =
        isAdding || isUpdating;

    // ============================================================
    // FORM
    // ============================================================

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CategoryFormData>({
        defaultValues: {
            name: "",
            description: "",
            isActive: "true",
        },
    });

    // ============================================================
    // BODY SCROLL LOCK
    // ============================================================

    useEffect(() => {
        if (
            !isAddModalOpen &&
            !isDeleteModalOpen
        ) {
            return;
        }

        const originalOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        return () => {
            document.body.style.overflow =
                originalOverflow;
        };
    }, [
        isAddModalOpen,
        isDeleteModalOpen,
    ]);

    // ============================================================
    // IMAGE PREVIEW CLEANUP
    // ============================================================

    useEffect(() => {
        return () => {
            if (
                imagePreview?.startsWith("blob:")
            ) {
                URL.revokeObjectURL(
                    imagePreview
                );
            }
        };
    }, [imagePreview]);

    // ============================================================
    // ESCAPE KEY
    // ============================================================

    useEffect(() => {
        const handleKeyDown = (
            event: KeyboardEvent
        ) => {
            if (event.key !== "Escape") {
                return;
            }

            if (
                isSaving ||
                isDeleting
            ) {
                return;
            }

            if (isDeleteModalOpen) {
                setIsDeleteModalOpen(false);
                setCategoryToDelete(null);
                setDeleteError("");
                return;
            }

            if (isAddModalOpen) {
                closeAddModal();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
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

    const searchValue =
        search.trim().toLowerCase();

    const filteredCategories =
        !searchValue
            ? categories
            : categories.filter(
                (category) => {
                    const name =
                        category.name
                            ?.toLowerCase() ??
                        "";

                    const description =
                        category.description
                            ?.toLowerCase() ??
                        "";

                    return (
                        name.includes(
                            searchValue
                        ) ||
                        description.includes(
                            searchValue
                        )
                    );
                }
            );

    // ============================================================
    // PAGINATION
    // ============================================================

    const totalPages = Math.ceil(
        filteredCategories.length /
        itemsPerPage
    );

    const safeCurrentPage =
        totalPages > 0
            ? Math.min(
                currentPage,
                totalPages
            )
            : 1;

    const startIndex =
        (safeCurrentPage - 1) *
        itemsPerPage;

    const paginatedCategories =
        filteredCategories.slice(
            startIndex,
            startIndex + itemsPerPage
        );

    useEffect(() => {
        if (
            totalPages > 0 &&
            currentPage > totalPages
        ) {
            setCurrentPage(totalPages);
        }

        if (
            totalPages === 0 &&
            currentPage !== 1
        ) {
            setCurrentPage(1);
        }
    }, [
        currentPage,
        totalPages,
    ]);

    // ============================================================
    // STATISTICS
    // ============================================================

    const activeCount =
        categories.filter(
            (category) =>
                category.isActive
        ).length;

    const inactiveCount =
        categories.filter(
            (category) =>
                !category.isActive
        ).length;

    // ============================================================
    // RESET FORM
    // ============================================================

    const resetCategoryForm = () => {
        reset({
            name: "",
            description: "",
            isActive: "true",
        });

        setEditingCategory(null);
        setSaveError("");

        if (
            imagePreview?.startsWith("blob:")
        ) {
            URL.revokeObjectURL(
                imagePreview
            );
        }

        setImageFile(null);
        setImagePreview(null);

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    // ============================================================
    // OPEN ADD MODAL
    // ============================================================

    const openAddModal = () => {
        resetCategoryForm();

        setIsAddModalOpen(true);
    };

    // ============================================================
    // IMAGE CHANGE
    // ============================================================

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file =
            event.target.files?.[0];

        setSaveError("");

        if (!file) {
            return;
        }

        // Validate type
        if (
            !ALLOWED_IMAGE_TYPES.includes(
                file.type
            )
        ) {
            setSaveError(
                "Only PNG, JPG, JPEG, and WebP images are allowed."
            );

            event.target.value = "";

            return;
        }

        // Validate size
        if (
            file.size > MAX_IMAGE_SIZE
        ) {
            setSaveError(
                "Category image must be smaller than 5MB."
            );

            event.target.value = "";

            return;
        }

        // Remove old blob URL
        if (
            imagePreview?.startsWith("blob:")
        ) {
            URL.revokeObjectURL(
                imagePreview
            );
        }

        const previewUrl =
            URL.createObjectURL(file);

        setImageFile(file);
        setImagePreview(previewUrl);
    };

    // ============================================================
    // REMOVE SELECTED IMAGE
    // ============================================================

    const removeSelectedImage = () => {
        if (
            imagePreview?.startsWith("blob:")
        ) {
            URL.revokeObjectURL(
                imagePreview
            );
        }

        setImageFile(null);
        setImagePreview(null);
        setSaveError("");

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    // ============================================================
    // SUBMIT CATEGORY
    // ============================================================

    const onSubmitCategory = async (
        data: CategoryFormData
    ) => {
        setSaveError("");

        try {
            // ====================================================
            // IMAGE REQUIRED WHEN CREATING
            // ====================================================

            if (
                !editingCategory &&
                !imageFile
            ) {
                setSaveError(
                    "Category image is required."
                );

                return;
            }

            const formData =
                new FormData();

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
                String(
                    data.isActive === "true"
                )
            );

            // ====================================================
            // ADD IMAGE ONLY IF NEW IMAGE SELECTED
            // ====================================================

            if (imageFile) {
                formData.append(
                    "image",
                    imageFile
                );
            }

            // ====================================================
            // UPDATE
            // ====================================================

            if (editingCategory) {
                await updateCategory({
                    id: editingCategory._id,
                    data: formData,
                }).unwrap();
            }

            // ====================================================
            // CREATE
            // ====================================================

            else {
                await addCategory(
                    formData
                ).unwrap();
            }

            // ====================================================
            // SUCCESS
            // ====================================================

            resetCategoryForm();

            setCurrentPage(1);

            setIsAddModalOpen(false);
        } catch (error: unknown) {
            console.error(
                "Failed to save category:",
                error
            );

            setSaveError(
                "Failed to save category. Please check your information and try again."
            );
        }
    };

    // ============================================================
    // EDIT CATEGORY
    // ============================================================

    const onEditCategory = (
        category: Category
    ) => {
        setEditingCategory(
            category
        );

        setSaveError("");

        setImageFile(null);

        if (
            imagePreview?.startsWith("blob:")
        ) {
            URL.revokeObjectURL(
                imagePreview
            );
        }

        setImagePreview(null);

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }

        reset({
            name: category.name || "",
            description:
                category.description ||
                "",
            isActive:
                category.isActive
                    ? "true"
                    : "false",
        });

        setIsAddModalOpen(true);
    };

    // ============================================================
    // DELETE MODAL
    // ============================================================

    const openDeleteModal = (
        category: Category
    ) => {
        setCategoryToDelete(
            category
        );

        setDeleteError("");

        setIsDeleteModalOpen(true);
    };

    // ============================================================
    // CLOSE DELETE MODAL
    // ============================================================

    const closeDeleteModal = () => {
        if (isDeleting) {
            return;
        }

        setIsDeleteModalOpen(false);

        setCategoryToDelete(null);

        setDeleteError("");
    };

    // ============================================================
    // DELETE CATEGORY
    // ============================================================

    const onDeleteCategory =
        async () => {
            if (
                !categoryToDelete
            ) {
                return;
            }

            setDeleteError("");

            try {
                await deleteCategory(
                    categoryToDelete._id
                ).unwrap();

                setCategoryToDelete(
                    null
                );

                setIsDeleteModalOpen(
                    false
                );

                setDeleteError("");
            } catch (
            error: unknown
            ) {
                console.error(
                    "Failed to delete category:",
                    error
                );

                setDeleteError(
                    "Failed to delete category. Please try again."
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

        resetCategoryForm();

        setIsAddModalOpen(false);
    };

    // ============================================================
    // RENDER
    // ============================================================

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
                            Manage Categories
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                            Create and manage
                            categories used to
                            organize your
                            product catalog.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={
                            openAddModal
                        }
                        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        <Plus className="h-4 w-4" />
                        Add Category
                    </button>
                </div>

                {/* ========================================================
                    STATISTICS
                ======================================================== */}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                    {/* TOTAL */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total Categories
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {isLoading ? (
                                        <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-200" />
                                    ) : (
                                        categories.length
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
                                    Active Categories
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
                                    Inactive Categories
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
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => {
                                setSearch(
                                    e.target.value
                                );

                                setCurrentPage(
                                    1
                                );
                            }}
                            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <p className="text-sm text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-900">
                                {filteredCategories.length ===
                                    0
                                    ? 0
                                    : startIndex +
                                    1}
                            </span>

                            {" - "}

                            <span className="font-semibold text-slate-900">
                                {Math.min(
                                    startIndex +
                                    itemsPerPage,
                                    filteredCategories.length
                                )}
                            </span>

                            {" of "}

                            <span className="font-semibold text-slate-900">
                                {
                                    filteredCategories.length
                                }
                            </span>

                            {" categories"}
                        </p>
                    </div>
                </div>

                {/* ========================================================
                    FETCH ERROR
                ======================================================== */}

                {isError && (
                    <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-4">
                        <div>
                            <p className="font-semibold text-red-700">
                                Failed to load
                                categories
                            </p>

                            <p className="mt-1 text-sm text-red-600">
                                Something went
                                wrong while
                                fetching
                                categories.
                            </p>
                        </div>
                    </div>
                )}

                {/* ========================================================
                    LOADING / TABLE / EMPTY
                ======================================================== */}

                {isLoading ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex min-h-[350px] items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

                                <p className="text-sm text-slate-500">
                                    Loading
                                    categories...
                                </p>
                            </div>
                        </div>
                    </div>
                ) : filteredCategories.length >
                    0 ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[800px]">

                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Category
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

                                    {paginatedCategories.map(
                                        (
                                            category
                                        ) => (
                                            <tr
                                                key={
                                                    category._id
                                                }
                                                className="group transition hover:bg-slate-50"
                                            >

                                                {/* CATEGORY */}

                                                <td className="whitespace-nowrap px-6 py-5">
                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-blue-600">

                                                            {category.image ? (
                                                                <img
                                                                    src={
                                                                        category.image
                                                                    }
                                                                    alt={`${category.name} category`}
                                                                    className="h-full w-full object-contain p-1"
                                                                />
                                                            ) : (
                                                                <Tag className="h-5 w-5" />
                                                            )}

                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-slate-900">
                                                                {
                                                                    category.name
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 text-xs text-slate-400">
                                                                ID #
                                                                {
                                                                    category._id
                                                                }
                                                            </p>
                                                        </div>

                                                    </div>
                                                </td>

                                                {/* DESCRIPTION */}

                                                <td className="max-w-md px-6 py-5">
                                                    <p className="line-clamp-2 text-sm leading-5 text-slate-500">
                                                        {
                                                            category.description ||
                                                            "—"
                                                        }
                                                    </p>
                                                </td>

                                                {/* STATUS */}

                                                <td className="whitespace-nowrap px-6 py-5">
                                                    <span
                                                        className={`inline-flex w-[88px] items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${category.isActive
                                                                ? "bg-emerald-50 text-emerald-600"
                                                                : "bg-slate-100 text-slate-500"
                                                            }`}
                                                    >
                                                        <span
                                                            className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${category.isActive
                                                                    ? "bg-emerald-500"
                                                                    : "bg-slate-400"
                                                                }`}
                                                        />

                                                        {category.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </td>

                                                {/* CREATED */}

                                                <td className="whitespace-nowrap px-6 py-5">
                                                    <div className="flex items-center gap-2 text-sm text-slate-500">

                                                        <Tag className="h-4 w-4 text-slate-400" />

                                                        {category.createdAt
                                                            ? new Date(
                                                                category.createdAt
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
                                                                onEditCategory(
                                                                    category
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
                                                                    category
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
                                        )
                                    )}

                                </tbody>

                            </table>

                            {/* PAGINATION */}

                            <div className="rounded-b-2xl bg-white">
                                <div className="h-px w-full bg-slate-200" />

                                <Pagination
                                    currentPage={
                                        safeCurrentPage
                                    }
                                    totalPages={
                                        totalPages
                                    }
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
                                ? "No categories found"
                                : "No categories available"}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            {search
                                ? "Try changing your search."
                                : "Create your first category."}
                        </p>

                        {!search && (
                            <button
                                type="button"
                                onClick={
                                    openAddModal
                                }
                                className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                <Plus className="h-4 w-4" />
                                Add Category
                            </button>
                        )}

                    </div>
                )}
            </main>

            {/* ============================================================
                ADD / EDIT CATEGORY MODAL
            ============================================================ */}

            {isAddModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="category-modal-title"
                    onMouseDown={(e) => {
                        if (
                            e.target ===
                            e.currentTarget &&
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
                                        id="category-modal-title"
                                        className="text-lg font-bold text-slate-900"
                                    >
                                        {editingCategory
                                            ? "Edit Category"
                                            : "Add Category"}
                                    </h2>

                                    <p className="mt-0.5 text-sm text-slate-500">
                                        {editingCategory
                                            ? "Update category information"
                                            : "Create a new category"}
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeAddModal
                                }
                                disabled={
                                    isSaving
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>

                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit(
                                onSubmitCategory
                            )}
                        >

                            {/* SAVE ERROR */}

                            {saveError && (
                                <div className="mx-6 mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                                    <p className="text-sm font-medium text-red-700">
                                        {
                                            saveError
                                        }
                                    </p>
                                </div>
                            )}

                            <div className="space-y-5 px-6 py-6">

                                {/* NAME */}

                                <div>
                                    <label
                                        htmlFor="category-name"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Category Name

                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="category-name"
                                        type="text"
                                        placeholder="e.g. Sarees"
                                        disabled={
                                            isSaving
                                        }
                                        {...register(
                                            "name",
                                            {
                                                required:
                                                    "Category name is required",

                                                validate:
                                                    (
                                                        value
                                                    ) =>
                                                        value
                                                            .trim()
                                                            .length >=
                                                        2 ||
                                                        "Category name must be at least 2 characters",

                                                maxLength:
                                                {
                                                    value: 50,
                                                    message:
                                                        "Category name cannot exceed 50 characters",
                                                },
                                            }
                                        )}
                                        className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${errors.name
                                                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                                : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                                            }`}
                                    />

                                    {errors.name && (
                                        <p className="mt-1.5 text-xs font-medium text-red-500">
                                            {
                                                errors
                                                    .name
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* DESCRIPTION */}

                                <div>
                                    <label
                                        htmlFor="category-description"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="category-description"
                                        rows={4}
                                        placeholder="Describe this category..."
                                        disabled={
                                            isSaving
                                        }
                                        {...register(
                                            "description",
                                            {
                                                maxLength:
                                                {
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

                                {/* CATEGORY IMAGE */}

                                <div>
                                    <label
                                        htmlFor="category-image"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Category Image

                                        {!editingCategory && (
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        )}
                                    </label>

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                                        {/* IMAGE PREVIEW */}

                                        <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

                                            {imagePreview ? (
                                                <img
                                                    src={
                                                        imagePreview
                                                    }
                                                    alt="Category image preview"
                                                    className="h-full w-full object-contain p-2"
                                                />
                                            ) : editingCategory?.image ? (
                                                <img
                                                    src={
                                                        editingCategory.image
                                                    }
                                                    alt={`${editingCategory.name} category`}
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
                                                    imageInputRef
                                                }
                                                id="category-image"
                                                type="file"
                                                accept="image/png,image/jpeg,image/webp"
                                                disabled={
                                                    isSaving
                                                }
                                                onChange={
                                                    handleImageChange
                                                }
                                                className="block w-full cursor-pointer rounded-lg border border-slate-200 bg-white text-sm text-slate-600 file:mr-4 file:cursor-pointer file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                                            />

                                            <p className="mt-2 text-xs leading-5 text-slate-400">
                                                PNG, JPG,
                                                JPEG or
                                                WebP.
                                                Maximum
                                                5MB.
                                            </p>

                                            {imageFile && (
                                                <div className="mt-2 flex items-center gap-2">

                                                    <p className="min-w-0 truncate text-xs font-medium text-blue-600">
                                                        Selected:{" "}
                                                        {
                                                            imageFile.name
                                                        }
                                                    </p>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isSaving
                                                        }
                                                        onClick={
                                                            removeSelectedImage
                                                        }
                                                        className="flex-shrink-0 text-xs font-semibold text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Remove
                                                    </button>

                                                </div>
                                            )}

                                            {editingCategory &&
                                                !imageFile && (
                                                    <p className="mt-2 text-xs text-slate-400">
                                                        Leave
                                                        empty
                                                        to keep
                                                        the
                                                        existing
                                                        image.
                                                    </p>
                                                )}

                                        </div>
                                    </div>
                                </div>

                                {/* STATUS */}

                                <div>
                                    <label
                                        htmlFor="category-status"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Status
                                    </label>

                                    <select
                                        id="category-status"
                                        disabled={
                                            isSaving
                                        }
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
                                    disabled={
                                        isSaving
                                    }
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        isSaving
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />

                                            {editingCategory
                                                ? "Updating..."
                                                : "Creating..."}
                                        </>
                                    ) : editingCategory ? (
                                        <>
                                            <Pencil className="h-4 w-4" />

                                            Update
                                            Category
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4" />

                                            Create
                                            Category
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
                categoryToDelete && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-category-title"
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
                                    id="delete-category-title"
                                    className="mt-5 text-xl font-bold text-slate-900"
                                >
                                    Delete Category?
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Are you sure
                                    you want to
                                    delete{" "}
                                    <span className="font-semibold text-slate-900">
                                        {
                                            categoryToDelete.name
                                        }
                                    </span>
                                    ? This action
                                    cannot be
                                    undone.
                                </p>

                                {deleteError && (
                                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                                        <p className="text-sm font-medium text-red-700">
                                            {
                                                deleteError
                                            }
                                        </p>
                                    </div>
                                )}

                            </div>

                            {/* FOOTER */}

                            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

                                <button
                                    type="button"
                                    disabled={
                                        isDeleting
                                    }
                                    onClick={
                                        closeDeleteModal
                                    }
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        isDeleting
                                    }
                                    onClick={
                                        onDeleteCategory
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