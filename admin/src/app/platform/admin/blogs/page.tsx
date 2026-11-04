"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  BookOpen,
  CheckCircle2,
  FilePenLine,
  Archive,
  Loader2,
  AlertCircle,
  CalendarDays,
  Upload,
  RotateCcw,
  Star,
} from "lucide-react";

import Pagination from "@/components/Admin/Pagination";

import {
  useGetAllBlogsAdminQuery,
  usePublishBlogMutation,
  useUnpublishBlogMutation,
  useArchiveBlogMutation,
  useDeleteBlogMutation,
  type Blog,
  type BlogStatus,
} from "@/store/api/blogApi";

type StatusFilter = "all" | BlogStatus;
type ActiveFilter = "all" | "active" | "inactive";

const ITEMS_PER_PAGE = 10;

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusStyles: Record<
  BlogStatus,
  { wrapper: string; dot: string; label: string }
> = {
  published: {
    wrapper: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    label: "Published",
  },
  draft: {
    wrapper: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    label: "Draft",
  },
  archived: {
    wrapper: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
    label: "Archived",
  },
};

export default function BlogsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
  const [actionError, setActionError] = useState("");

  // ============================================================
  // API
  // ============================================================

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetAllBlogsAdminQuery({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    });

  console.log("BLOG API ERROR:", error);
  console.log("BLOG API DATA:", data);

  const [publishBlog, { isLoading: isPublishing }] = usePublishBlogMutation();

  const [unpublishBlog, { isLoading: isUnpublishing }] =
    useUnpublishBlogMutation();

  const [archiveBlog, { isLoading: isArchiving }] = useArchiveBlogMutation();

  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const blogs = data?.blogs ?? [];

  const pagination = data?.pagination;

  const totalPages = pagination?.totalPages ?? 0;
  const totalBlogs = pagination?.total ?? 0;

  const isBusy = isPublishing || isUnpublishing || isArchiving || isDeleting;

  // Search and active filters currently apply to the
  // fetched page. Status filtering is server-side.
  const filteredBlogs = blogs.filter((blog) => {
    const value = search.trim().toLowerCase();

    const matchesSearch =
      !value ||
      blog.title.toLowerCase().includes(value) ||
      blog.slug.toLowerCase().includes(value) ||
      blog.category.toLowerCase().includes(value) ||
      blog.author?.toLowerCase().includes(value);

    const matchesActive =
      activeFilter === "all" ||
      (activeFilter === "active" ? blog.isActive : !blog.isActive);

    return matchesSearch && matchesActive;
  });

  // These counts describe the currently fetched page.
  const statistics = {
    total: totalBlogs,
    published: blogs.filter((blog) => blog.status === "published").length,
    draft: blogs.filter((blog) => blog.status === "draft").length,
    archived: blogs.filter((blog) => blog.status === "archived").length,
  };

  // ============================================================
  // ACTIONS
  // ============================================================

  const handleAction = async (
    id: string,
    action: "publish" | "unpublish" | "archive",
  ) => {
    setActionError("");

    try {
      if (action === "publish") {
        await publishBlog(id).unwrap();
      } else if (action === "unpublish") {
        await unpublishBlog(id).unwrap();
      } else {
        await archiveBlog(id).unwrap();
      }
    } catch (error) {
      console.error("Blog action failed:", error);
      setActionError("Unable to update the blog. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setActionError("");

    try {
      await deleteBlog(deleteTarget._id).unwrap();
      setDeleteTarget(null);

      if (blogs.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Delete blog failed:", error);
      setActionError("Unable to delete this blog. Please try again.");
    }
  };

  const changeStatus = (value: StatusFilter) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const changeActive = (value: ActiveFilter) => {
    setActiveFilter(value);
    setCurrentPage(1);
  };

  const statsCards = [
    {
      label: "Total Blogs",
      value: statistics.total,
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600",
      note: "All records",
    },
    {
      label: "Published",
      value: statistics.published,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
      note: "On this page",
    },
    {
      label: "Drafts",
      value: statistics.draft,
      icon: FilePenLine,
      color: "bg-amber-50 text-amber-600",
      note: "On this page",
    },
    {
      label: "Archived",
      value: statistics.archived,
      icon: Archive,
      color: "bg-slate-100 text-slate-600",
      note: "On this page",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#ff3f6c]" />
              <span className="text-sm font-semibold uppercase tracking-wider text-[#ff3f6c]">
                Content Management
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Manage Blogs
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Create, manage, review and publish articles for the MYSMME fashion
              journal.
            </p>
          </div>

          <Link
            href="/platform/admin/blogs/create"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ff3f6c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e6325c]"
          >
            <Plus className="h-4 w-4" />
            Add New Blog
          </Link>
        </div>

        {/* STATISTICS */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statsCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {isLoading ? "—" : stat.value}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{stat.note}</p>
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FILTERS */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search title, category, author, slug..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-[#ff3f6c] focus:bg-white"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={statusFilter}
                onChange={(event) =>
                  changeStatus(event.target.value as StatusFilter)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={activeFilter}
                onChange={(event) =>
                  changeActive(event.target.value as ActiveFilter)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700"
              >
                <option value="all">All Blogs</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                title="Refresh blogs"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <RotateCcw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Showing {filteredBlogs.length} of {totalBlogs} blogs
            </p>
            <p className="text-xs text-slate-400">
              Page {currentPage} of {Math.max(1, totalPages)}
            </p>
          </div>
        </div>

        {/* ERROR */}
        {(isError || actionError) && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>
              {actionError ||
                "Unable to load blogs. Please check your API connection."}
            </p>
          </div>
        )}

        {/* BLOG TABLE */}
        {isLoading ? (
          <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff3f6c]" />
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {[
                      "Blog",
                      "Category",
                      "Author",
                      "Published Date",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 ${
                          heading === "Actions" ? "text-right" : "text-left"
                        }`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredBlogs.map((blog) => {
                    const status = statusStyles[blog.status];

                    return (
                      <tr
                        key={blog._id}
                        className="transition hover:bg-slate-50"
                      >
                        {/* BLOG */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                              {blog.featuredImage ? (
                                <img
                                  src={blog.featuredImage}
                                  alt={blog.imageAlt || blog.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <BookOpen className="h-6 w-6 text-slate-300" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[300px] truncate font-semibold text-slate-900">
                                {blog.title}
                              </p>

                              <p className="mt-1 max-w-[280px] truncate text-xs text-slate-400">
                                /blogs/{blog.slug}
                              </p>

                              <div className="mt-1 flex items-center gap-2">
                                {blog.isFeatured && (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                                    <Star className="h-3 w-3 fill-amber-400" />
                                    Featured
                                  </span>
                                )}
                                <span className="text-xs text-slate-400">
                                  {blog.readTime} min read
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* CATEGORY */}
                        <td className="px-6 py-5">
                          <span className="rounded-full bg-pink-50 px-3 py-1.5 text-xs font-semibold text-[#ff3f6c]">
                            {blog.category}
                          </span>
                        </td>

                        {/* AUTHOR */}
                        <td className="px-6 py-5 text-sm text-slate-700">
                          {blog.author || "MYSMME Editorial Team"}
                        </td>

                        {/* DATE */}
                        <td className="whitespace-nowrap px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                            {formatDate(blog.publishedAt)}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="whitespace-nowrap px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${status.wrapper}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                            />
                            {status.label}
                          </span>

                          <p
                            className={`mt-2 text-xs font-medium ${
                              blog.isActive
                                ? "text-emerald-600"
                                : "text-slate-400"
                            }`}
                          >
                            {blog.isActive ? "Active" : "Inactive"}
                          </p>
                        </td>

                        {/* ACTIONS */}
                        <td className="whitespace-nowrap px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/platform/admin/blogs/${blog._id}`}
                              title="View blog"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>

                            <Link
                              href={`/platform/admin/blogs/${blog._id}/edit`}
                              title="Edit blog"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>

                            {blog.status !== "published" ? (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() =>
                                  handleAction(blog._id, "publish")
                                }
                                title="Publish blog"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50"
                              >
                                <Upload className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() =>
                                  handleAction(blog._id, "unpublish")
                                }
                                title="Unpublish blog"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-100 bg-amber-50 text-amber-600 hover:bg-amber-100 disabled:opacity-50"
                              >
                                <FilePenLine className="h-4 w-4" />
                              </button>
                            )}

                            {blog.status !== "archived" && (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() =>
                                  handleAction(blog._id, "archive")
                                }
                                title="Archive blog"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                              >
                                <Archive className="h-4 w-4" />
                              </button>
                            )}

                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => {
                                setActionError("");
                                setDeleteTarget(blog);
                              }}
                              title="Delete blog"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
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

            <div className="border-t border-slate-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No blogs found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Create your first blog or adjust your filters.
            </p>
            <Link
              href="/platform/admin/blogs/create"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#ff3f6c] px-5 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Create Blog
            </Link>
          </div>
        )}
      </main>

      {/* DELETE CONFIRMATION */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Trash2 className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                Delete Blog?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to permanently delete{" "}
                <strong>{deleteTarget.title}</strong>? This action cannot be
                undone.
              </p>

              {actionError && (
                <p className="mt-4 text-sm text-red-600">{actionError}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 p-4">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setDeleteTarget(null);
                  setActionError("");
                }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete Blog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
