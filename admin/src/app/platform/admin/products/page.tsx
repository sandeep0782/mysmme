"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Package,
  CheckCircle2,
  XCircle,
  Clock3,
  AlertCircle,
  Loader2,
  MessageCircle,
  Star,
} from "lucide-react";

import Pagination from "@/components/Admin/Pagination";

// Change this import to your actual product API
import { useGetProductsQuery } from "@/store/api/productApi";

type Product = {
  _id: string;

  title: string;
  slug: string;
  description: string;

  brand?: {
    _id: string;
    name: string;
  };

  category?: {
    _id: string;
    name: string;
  };

  color?: {
    _id: string;
    name: string;
  };

  price: number;
  finalPrice: number;
  mrp: number;

  inventory: number;
  reservedInventory: number;

  images: string[];

  productId?: string;
  styleId?: string;
  skuId?: string;
  groupId?: string;

  isActive: boolean;

  publishStatus: "draft" | "pending" | "approved" | "rejected";

  rejectionReason?: string;

  rating: number;
  numReviews: number;

  sareeFabric?: string;
  sareeLengthSize?: number;
  occasion?: string;

  createdAt?: string;
};

type StatusFilter = "all" | "approved" | "pending" | "draft" | "rejected";

const ITEMS_PER_PAGE = 10;

const Page = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const [deleteError, setDeleteError] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);

  // ============================================================
  // PRODUCTS
  // ============================================================

  const { data: productsResponse, isLoading, isError } = useGetProductsQuery();

  const products: Product[] = productsResponse?.data ?? [];

  // ============================================================
  // STATISTICS
  // ============================================================

  const statistics = useMemo(() => {
    const total = products.length;

    const approved = products.filter(
      (product) => product.publishStatus === "approved",
    ).length;

    const pending = products.filter(
      (product) => product.publishStatus === "pending",
    ).length;

    const draft = products.filter(
      (product) => product.publishStatus === "draft",
    ).length;

    const rejected = products.filter(
      (product) => product.publishStatus === "rejected",
    ).length;

    const active = products.filter((product) => product.isActive).length;

    const lowStock = products.filter(
      (product) => product.inventory > 0 && product.inventory <= 5,
    ).length;

    const outOfStock = products.filter(
      (product) => product.inventory <= 0,
    ).length;

    return {
      total,
      approved,
      pending,
      draft,
      rejected,
      active,
      lowStock,
      outOfStock,
    };
  }, [products]);

  // ============================================================
  // SEARCH + FILTER
  // ============================================================

  const filteredProducts = useMemo(() => {
    const value = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !value ||
        product.title?.toLowerCase().includes(value) ||
        product.productId?.toLowerCase().includes(value) ||
        product.skuId?.toLowerCase().includes(value) ||
        product.styleId?.toLowerCase().includes(value) ||
        product.brand?.name?.toLowerCase().includes(value) ||
        product.category?.name?.toLowerCase().includes(value);

      const matchesStatus =
        statusFilter === "all" || product.publishStatus === statusFilter;

      const matchesActive =
        activeFilter === "all" ||
        (activeFilter === "active" ? product.isActive : !product.isActive);

      return matchesSearch && matchesStatus && matchesActive;
    });
  }, [products, search, statusFilter, activeFilter]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const safeCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const paginatedProducts = filteredProducts.slice(
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
  // DISCOUNT
  // ============================================================

  const getDiscountPercentage = (product: Product) => {
    if (!product.mrp || product.mrp <= product.finalPrice) {
      return 0;
    }

    return Math.round(((product.mrp - product.finalPrice) / product.mrp) * 100);
  };

  // ============================================================
  // STATUS
  // ============================================================

  const getStatusStyles = (status: Product["publishStatus"]) => {
    switch (status) {
      case "approved":
        return {
          wrapper: "bg-emerald-50 text-emerald-600",
          dot: "bg-emerald-500",
          label: "Approved",
        };

      case "pending":
        return {
          wrapper: "bg-amber-50 text-amber-600",
          dot: "bg-amber-500",
          label: "Pending",
        };

      case "rejected":
        return {
          wrapper: "bg-red-50 text-red-600",
          dot: "bg-red-500",
          label: "Rejected",
        };

      default:
        return {
          wrapper: "bg-slate-100 text-slate-500",
          dot: "bg-slate-400",
          label: "Draft",
        };
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const openDeleteModal = (product: Product) => {
    setDeleteProduct(product);
    setDeleteError("");
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setDeleteProduct(null);
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;

    setDeleteError("");

    try {
      setIsDeleting(true);

      // TODO:
      // Connect your deleteProductMutation here.
      //
      // await deleteProductMutation(
      //     deleteProduct._id
      // ).unwrap();

      await new Promise((resolve) => setTimeout(resolve, 800));

      setDeleteProduct(null);
    } catch (error) {
      console.error("Failed to delete product:", error);

      setDeleteError("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ============================================================
  // RESET PAGE WHEN FILTER CHANGES
  // ============================================================

  const resetPagination = () => {
    setCurrentPage(1);
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
              Manage Products
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Create, manage, review and publish products in your catalog.
            </p>
          </div>

          <Link
            href="/platform/admin/products/create"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>

        {/* ========================================================
                    STATISTICS
                ======================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Products
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {isLoading ? (
                    <span className="inline-block h-8 w-16 animate-pulse rounded bg-slate-200" />
                  ) : (
                    statistics.total
                  )}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Package className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* APPROVED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Approved</p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {isLoading ? (
                    <span className="inline-block h-8 w-16 animate-pulse rounded bg-slate-200" />
                  ) : (
                    statistics.approved
                  )}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* PENDING */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending Review
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {isLoading ? (
                    <span className="inline-block h-8 w-16 animate-pulse rounded bg-slate-200" />
                  ) : (
                    statistics.pending
                  )}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock3 className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* LOW STOCK */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Low Stock</p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {isLoading ? (
                    <span className="inline-block h-8 w-16 animate-pulse rounded bg-slate-200" />
                  ) : (
                    statistics.lowStock
                  )}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
                    SEARCH + FILTERS
                ======================================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {/* SEARCH */}

            <div className="relative w-full xl:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search title, SKU, product ID, brand..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  resetPagination();
                }}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* FILTERS */}

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as StatusFilter);
                  resetPagination();
                }}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Status</option>

                <option value="approved">Approved</option>

                <option value="pending">Pending</option>

                <option value="draft">Draft</option>

                <option value="rejected">Rejected</option>
              </select>

              <select
                value={activeFilter}
                onChange={(event) => {
                  setActiveFilter(
                    event.target.value as "all" | "active" | "inactive",
                  );
                  resetPagination();
                }}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Products</option>

                <option value="active">Active</option>

                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filteredProducts.length === 0 ? 0 : startIndex + 1}
              </span>
              {" - "}
              <span className="font-semibold text-slate-900">
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}
              </span>
              {" of "}
              <span className="font-semibold text-slate-900">
                {filteredProducts.length}
              </span>
              {" products"}
            </p>

            <p className="hidden text-xs text-slate-400 sm:block">
              {statistics.active} active
            </p>
          </div>
        </div>

        {/* ========================================================
                    ERROR
                ======================================================== */}

        {isError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-500" />

              <div>
                <p className="font-semibold text-red-700">
                  Failed to load products
                </p>

                <p className="mt-1 text-sm text-red-600">
                  Something went wrong while fetching your products.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
                    LOADING
                ======================================================== */}

        {isLoading ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

                <p className="text-sm text-slate-500">Loading products...</p>
              </div>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Inventory
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Publish
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Rating
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {paginatedProducts.map((product) => {
                    const discount = getDiscountPercentage(product);

                    const status = getStatusStyles(product.publishStatus);

                    return (
                      <tr
                        key={product._id}
                        className="group transition hover:bg-slate-50"
                      >
                        {/* PRODUCT */}

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                              {product.images?.length > 0 ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Package className="h-6 w-6 text-slate-300" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[300px] truncate font-semibold text-slate-900">
                                {product.title}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                SKU: {product.skuId || "—"}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                Brand: {product.brand?.name || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CATEGORY */}

                        <td className="px-6 py-5">
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {product.category?.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {product.sareeFabric || "Saree"}
                            </p>
                          </div>
                        </td>

                        {/* PRICE */}

                        <td className="whitespace-nowrap px-6 py-5">
                          <p className="font-semibold text-slate-900">
                            ₹{product.finalPrice?.toLocaleString("en-IN")}
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-slate-400 line-through">
                              ₹{product.mrp?.toLocaleString("en-IN")}
                            </span>

                            {discount > 0 && (
                              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
                                {discount}% OFF
                              </span>
                            )}
                          </div>
                        </td>

                        {/* INVENTORY */}

                        <td className="whitespace-nowrap px-6 py-5">
                          <p
                            className={`text-sm font-semibold ${
                              product.inventory <= 0
                                ? "text-red-600"
                                : product.inventory <= 5
                                  ? "text-amber-600"
                                  : "text-slate-900"
                            }`}
                          >
                            {product.inventory} units
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {product.reservedInventory} reserved
                          </p>
                        </td>

                        {/* PUBLISH STATUS */}

                        <td className="whitespace-nowrap px-6 py-5">
                          <span
                            className={`inline-flex w-[100px] items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${status.wrapper}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                            />

                            {status.label}
                          </span>

                          <div className="mt-2">
                            <span
                              className={`text-xs font-medium ${
                                product.isActive
                                  ? "text-emerald-600"
                                  : "text-slate-400"
                              }`}
                            >
                              {product.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </td>

                        {/* RATING */}

                        <td className="whitespace-nowrap px-6 py-5">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

                            <span className="text-sm font-semibold text-slate-900">
                              {product.rating}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-slate-400">
                            {product.numReviews} reviews
                          </p>
                        </td>

                        {/* ACTIONS */}

                        <td className="whitespace-nowrap px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            {/* VIEW */}

                            <Link
                              href={`/platform/admin/products/${product._id}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                              title="View product"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>

                            {/* EDIT */}

                            <Link
                              href={`/platform/admin/products/${product._id}/edit`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                              title="Edit product"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>

                            {/* WHATSAPP */}

                            <button
                              type="button"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                              title="Share on WhatsApp"
                              onClick={() => {
                                const productUrl = `${window.location.origin}/products/${product.slug}`;

                                const message = `Check out ${product.title} ₹${product.finalPrice}. ${productUrl}`;

                                window.open(
                                  `https://wa.me/?text=${encodeURIComponent(
                                    message,
                                  )}`,
                                  "_blank",
                                );
                              }}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() => openDeleteModal(product)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100"
                              title="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}

            <div className="border-t border-slate-200 bg-white">
              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        ) : (
          /* ====================================================
                       EMPTY
                    ==================================================== */

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Package className="h-7 w-7 text-slate-400" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {search || statusFilter !== "all" || activeFilter !== "all"
                ? "No products found"
                : "No products available"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search || statusFilter !== "all" || activeFilter !== "all"
                ? "Try changing your search or filters."
                : "Create your first product to get started."}
            </p>

            {!search && statusFilter === "all" && activeFilter === "all" && (
              <Link
                href="/platform/admin/products/create"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Link>
            )}
          </div>
        )}
      </main>

      {/* ============================================================
                DELETE MODAL
            ============================================================ */}

      {deleteProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) {
              closeDeleteModal();
            }
          }}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Trash2 className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                Delete Product?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-900">
                  {deleteProduct.title}
                </span>
                ? This action cannot be undone.
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
                onClick={closeDeleteModal}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
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
