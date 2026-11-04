"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  BookOpen,
  CalendarDays,
  Clock3,
  UserRound,
  Tag,
  Star,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import { useGetBlogByIdAdminQuery } from "@/store/api/blogApi";

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function BlogDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const {
    data: blog,
    isLoading,
    isError,
    refetch,
  } = useGetBlogByIdAdminQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-[#ff3f6c]" />
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-100 bg-white p-10 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load blog
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The blog could not be found or the request failed.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => refetch()}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Retry
            </button>

            <Link
              href="/platform/admin/blogs"
              className="rounded-lg bg-[#ff3f6c] px-4 py-2 text-sm text-white"
            >
              Back to Blogs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const statusClass =
    blog.status === "published"
      ? "bg-emerald-50 text-emerald-700"
      : blog.status === "draft"
        ? "bg-amber-50 text-amber-700"
        : "bg-slate-100 text-slate-600";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/platform/admin/blogs"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#ff3f6c]"
            >
              <ArrowLeft size={17} />
              Back to Blogs
            </Link>

            <h1 className="text-3xl font-bold text-slate-900">Blog Details</h1>

            <p className="mt-1 text-sm text-slate-500">
              Review your blog content and publishing information.
            </p>
          </div>

          <Link
            href={`/platform/admin/blogs/${blog._id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg bg-[#ff3f6c] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e6325c]"
          >
            <Pencil size={17} />
            Edit Blog
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {blog.featuredImage ? (
                <img
                  src={blog.featuredImage}
                  alt={blog.imageAlt || blog.title}
                  className="aspect-[16/9] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-slate-100">
                  <BookOpen className="h-16 w-16 text-slate-300" />
                </div>
              )}

              <div className="p-6 sm:p-8">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-[#ff3f6c]">
                    {blog.category}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}
                  >
                    {blog.status}
                  </span>

                  {blog.isFeatured && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                      <Star size={14} />
                      Featured
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                  {blog.title}
                </h2>

                <div className="mt-5 flex flex-wrap gap-5 border-b border-slate-100 pb-6 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <UserRound size={16} />
                    {blog.author || "MYSMME Editorial Team"}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={16} />
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Clock3 size={16} />
                    {blog.readTime} min read
                  </span>
                </div>

                <p className="mt-6 text-base leading-7 text-slate-600">
                  {blog.excerpt}
                </p>
              </div>
            </section>

            {/* Blog content */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="mb-5 text-lg font-bold text-slate-900">
                Blog Content
              </h3>

              <iframe
                title="Blog content preview"
                sandbox=""
                srcDoc={`<!DOCTYPE html>
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1" />
                      <style>
                        body {
                          font-family: system-ui, sans-serif;
                          color: #334155;
                          font-size: 15px;
                          line-height: 1.8;
                          overflow-wrap: anywhere;
                          margin: 0;
                        }
                        img { max-width: 100%; height: auto; }
                        h1, h2, h3 { color: #0f172a; line-height: 1.35; }
                        a { color: #ff3f6c; }
                        blockquote {
                          border-left: 3px solid #ff3f6c;
                          padding-left: 16px;
                          margin-left: 0;
                        }
                      </style>
                    </head>
                    <body>${blog.content || ""}</body>
                  </html>`}
                className="h-[600px] w-full rounded-lg border-0"
                referrerPolicy="no-referrer"
              />
            </section>

            {/* Tags */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                <Tag size={18} className="text-[#ff3f6c]" />
                Blog Tags
              </h3>

              <div className="flex flex-wrap gap-2">
                {blog.tags?.length ? (
                  blog.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No tags added.</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-bold text-slate-900">
                Publishing Details
              </h3>

              <div className="space-y-4 text-sm">
                <Info label="Status" value={blog.status} />
                <Info
                  label="Visibility"
                  value={blog.isActive ? "Active" : "Inactive"}
                />
                <Info label="Category" value={blog.category} />
                <Info label="Read Time" value={`${blog.readTime} minutes`} />
                <Info label="Created" value={formatDate(blog.createdAt)} />
                <Info label="Updated" value={formatDate(blog.updatedAt)} />
                <Info label="Published" value={formatDate(blog.publishedAt)} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-bold text-slate-900">
                SEO Information
              </h3>

              <div className="space-y-5">
                <Info label="SEO Title" value={blog.seoTitle || blog.title} />

                <Info
                  label="SEO Description"
                  value={blog.seoDescription || blog.excerpt}
                />

                <Info label="URL Slug" value={blog.slug} />

                <Info
                  label="Image Alt Text"
                  value={blog.imageAlt || "Not specified"}
                />

                <Info
                  label="Canonical URL"
                  value={blog.canonicalUrl || "Not specified"}
                />
              </div>
            </section>

            {blog.status === "published" && blog.isActive && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-3 font-bold text-slate-900">Public Blog</h3>

                <p className="mb-4 text-sm text-slate-500">
                  Open the published blog on the customer website.
                </p>

                <Link
                  href={`/blogs/${blog.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff3f6c]"
                >
                  View Public Blog
                  <ExternalLink size={15} />
                </Link>
                <p className="mt-2 text-xs text-slate-400">
                  Uses the current site. Change the link if your customer
                  website runs on another domain.
                </p>
              </section>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="break-words text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}
