"use client";

import React, { useEffect, useState } from "react";
import {
  Upload,
  Search,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Download,
} from "lucide-react";

import Pagination from "@/components/Admin/Pagination";

import {
  useGetProductImportsQuery,
  useDeleteProductImportMutation,
  // useDownloadProductImportErrorsMutation,
} from "@/store/api/productImportApi";
import { BASE_URL } from "@/store/api";

type UploadedBy = {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

type ProductImport = {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  totalRows: number;
  successRows: number;
  failedRows: number;
  status: "uploaded" | "processing" | "completed" | "failed";
  importErrors: unknown[];
  uploadedBy: UploadedBy;
  createdAt: string;
  updatedAt: string;
};

const Page = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [importToDelete, setImportToDelete] = useState<ProductImport | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState("");

  const itemsPerPage = 10;

  const {
    data: importsResponse,
    isLoading,
    isError,
  } = useGetProductImportsQuery();

  // const [downloadProductImportErrors, { isLoading: isDownloadingErrors }] =
  //   useDownloadProductImportErrorsMutation();

  const imports: ProductImport[] = importsResponse?.data ?? [];

  const [deleteProductImport, { isLoading: isDeleting }] =
    useDeleteProductImportMutation();

  // ============================================================
  // SEARCH + FILTER
  // ============================================================

  const searchValue = search.trim().toLowerCase();

  const filteredImports = imports.filter((item) => {
    if (searchValue) {
      const fileName = item.fileName?.toLowerCase() ?? "";
      const uploadedBy =
        item.uploadedBy?.name?.toLowerCase() ??
        item.uploadedBy?.email?.toLowerCase() ??
        "";
      const status = item.status?.toLowerCase() ?? "";

      const matchesSearch =
        fileName.includes(searchValue) ||
        uploadedBy.includes(searchValue) ||
        status.includes(searchValue);

      if (!matchesSearch) {
        return false;
      }
    }

    if (statusFilter !== "all" && item.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.ceil(filteredImports.length / itemsPerPage);

  const safeCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  const paginatedImports = filteredImports.slice(
    startIndex,
    startIndex + itemsPerPage,
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

  const totalImports = imports.length;

  const completedCount = imports.filter(
    (item) => item.status === "completed",
  ).length;

  const failedCount = imports.filter((item) => item.status === "failed").length;

  const processingCount = imports.filter(
    (item) => item.status === "processing",
  ).length;

  // ============================================================
  // DELETE
  // ============================================================

  const openDeleteModal = (item: ProductImport) => {
    setImportToDelete(item);
    setDeleteError("");
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setImportToDelete(null);
    setDeleteError("");
  };
  const [downloadingImportId, setDownloadingImportId] = useState<string | null>(
    null,
  );

  const onDeleteImport = async () => {
    if (!importToDelete) {
      return;
    }

    setDeleteError("");

    try {
      await deleteProductImport(importToDelete._id).unwrap();

      setIsDeleteModalOpen(false);
      setImportToDelete(null);
      setDeleteError("");
    } catch (error: unknown) {
      console.error("Failed to delete product import:", error);

      setDeleteError("Failed to delete import. Please try again.");
    }
  };

  // ============================================================
  // FORMAT FILE SIZE
  // ============================================================

  const formatFileSize = (size: number) => {
    if (!size) {
      return "0 B";
    }

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const handleDownloadErrors = async (item: ProductImport) => {
    try {
      setDownloadingImportId(item._id);

      const response = await fetch(
        `${BASE_URL}/product-imports/${item._id}/errors/download`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const text = await response.text();

        throw new Error(
          text || `Download failed with status ${response.status}`,
        );
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `import-errors-${item.fileName.replace(
        /\.(xlsx|xls)$/i,
        "",
      )}.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download import errors:", error);
    } finally {
      setDownloadingImportId(null);
    }
  };

  const formatDate = (date: string) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ============================================================
  // STATUS
  // ============================================================

  const getStatus = (status: ProductImport["status"]) => {
    if (status === "completed") {
      return {
        label: "Completed",
        className: "bg-emerald-50 text-emerald-600",
        dotClassName: "bg-emerald-500",
      };
    }

    if (status === "failed") {
      return {
        label: "Failed",
        className: "bg-red-50 text-red-600",
        dotClassName: "bg-red-500",
      };
    }

    if (status === "processing") {
      return {
        label: "Processing",
        className: "bg-amber-50 text-amber-600",
        dotClassName: "bg-amber-500",
      };
    }

    return {
      label: "Uploaded",
      className: "bg-blue-50 text-blue-600",
      dotClassName: "bg-blue-500",
    };
  };

  // ============================================================
  // ESCAPE KEY
  // ============================================================

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || isDeleting) {
        return;
      }

      if (isDeleteModalOpen) {
        closeDeleteModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDeleteModalOpen, isDeleting]);

  // ============================================================
  // BODY SCROLL LOCK
  // ============================================================

  useEffect(() => {
    if (!isDeleteModalOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isDeleteModalOpen]);

  // const handleDownloadErrors = async (item: ProductImport) => {
  //   try {
  //     const blob = await downloadProductImportErrors(item._id).unwrap();

  //     const url = window.URL.createObjectURL(blob);

  //     const link = document.createElement("a");

  //     link.href = url;

  //     link.download = `import-errors-${item.fileName.replace(
  //       /\.(xlsx|xls)$/i,
  //       "",
  //     )}.xlsx`;

  //     document.body.appendChild(link);

  //     link.click();

  //     link.remove();

  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Failed to download import errors:", error);
  //   }
  // };

  return (
    <div className="h-full bg-slate-50">
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-600" />

              <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Catalog Management
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Product Imports
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage uploaded Excel files and monitor product import status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/platform/admin/catalogue/import";
            }}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <Upload className="h-4 w-4" />
            Import Products
          </button>
        </div>

        {/* STATISTICS */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Imports
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {isLoading ? (
                    <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-200" />
                  ) : (
                    totalImports
                  )}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Completed</p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {isLoading ? (
                    <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-200" />
                  ) : (
                    completedCount
                  )}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Processing</p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {isLoading ? (
                    <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-200" />
                  ) : (
                    processingCount
                  )}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Failed</p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {isLoading ? (
                    <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-200" />
                  ) : (
                    failedCount
                  )}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <XCircle className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH + FILTERS */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search file name, status..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Status</option>
              <option value="uploaded">Uploaded</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filteredImports.length === 0 ? 0 : startIndex + 1}
              </span>{" "}
              -{" "}
              <span className="font-semibold text-slate-900">
                {Math.min(startIndex + itemsPerPage, filteredImports.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {filteredImports.length}
              </span>{" "}
              imports
            </p>
          </div>
        </div>

        {/* ERROR */}

        {isError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4">
            <p className="font-semibold text-red-700">
              Failed to load product imports
            </p>

            <p className="mt-1 text-sm text-red-600">
              Something went wrong while fetching product imports.
            </p>
          </div>
        )}

        {/* LOADING */}

        {isLoading ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

                <p className="text-sm text-slate-500">
                  Loading product imports...
                </p>
              </div>
            </div>
          </div>
        ) : filteredImports.length > 0 ? (
          /* TABLE */

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      File
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Size
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Rows
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Successful
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Failed
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Uploaded By
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Created
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Errors
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {paginatedImports.map((item) => {
                    const status = getStatus(item.status);

                    return (
                      <tr
                        key={item._id}
                        className="group transition hover:bg-slate-50"
                      >
                        <td className="whitespace-nowrap px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                              <FileSpreadsheet className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[280px] truncate font-semibold text-slate-900">
                                {item.fileName}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                ID #{item._id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-slate-700">
                          {formatFileSize(item.fileSize)}
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-slate-700">
                          {item.totalRows}
                        </td>

                        <td className="whitespace-nowrap px-6 py-5">
                          <span className="font-semibold text-emerald-600">
                            {item.successRows}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5">
                          <span className="font-semibold text-red-600">
                            {item.failedRows}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5">
                          <span
                            className={`inline-flex w-[100px] items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${status.dotClassName}`}
                            />

                            {status.label}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5">
                          <span className="text-sm font-medium text-slate-700">
                            {item.uploadedBy?.name ||
                              [
                                item.uploadedBy?.firstName,
                                item.uploadedBy?.lastName,
                              ]
                                .filter(Boolean)
                                .join(" ") ||
                              item.uploadedBy?.email ||
                              "—"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5">
                          <span className="text-sm text-slate-500">
                            {formatDate(item.createdAt)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-5">
                          {item.failedRows > 0 && (
                            <button
                              type="button"
                              onClick={() => handleDownloadErrors(item)}
                              disabled={downloadingImportId === item._id}
                              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {downloadingImportId === item._id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Download className="h-4 w-4" />
                                  Errors
                                </>
                              )}
                            </button>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openDeleteModal(item)}
                              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
          /* EMPTY */

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <FileSpreadsheet className="h-7 w-7 text-slate-400" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {search || statusFilter !== "all"
                ? "No imports found"
                : "No product imports available"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search || statusFilter !== "all"
                ? "Try changing your search or filter."
                : "Upload your first Excel file to get started."}
            </p>
          </div>
        )}
      </main>

      {/* DELETE MODAL */}

      {isDeleteModalOpen && importToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-import-title"
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

              <h2
                id="delete-import-title"
                className="mt-5 text-xl font-bold text-slate-900"
              >
                Delete Import?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-900">
                  {importToDelete.fileName}
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
                onClick={onDeleteImport}
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
