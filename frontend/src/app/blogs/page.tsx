"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { useGetPublishedBlogsQuery } from "@/store/api/blogApi";

const formatDate = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function BlogsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetPublishedBlogsQuery({
      page,
      limit: 9,
    });

  const blogs = data?.blogs ?? [];
  const totalPages = data?.pagination.totalPages ?? 0;

  return (
    <main className="min-h-screen bg-[#faf9f8]">
      <section className="border-b border-pink-100 bg-gradient-to-b from-pink-50 to-white px-4 py-16 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#ff3f6c]">
          MYSMME Journal
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Fashion, Style & Stories
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
          Explore saree styling tips, fashion trends, fabric knowledge and
          inspiration from MYSMME.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 className="h-9 w-9 animate-spin text-[#ff3f6c]" />
          </div>
        ) : isError ? (
          <div className="rounded-2xl bg-white p-12 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              Unable to load blogs
            </h2>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-lg bg-[#ff3f6c] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="rounded-2xl bg-white p-16 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              No articles available yet
            </h2>
            <p className="mt-2 text-slate-500">
              New fashion stories are coming soon.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blogs/${blog.slug}`}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-pink-50">
                    {blog.featuredImage ? (
                      <img
                        src={blog.featuredImage}
                        alt={blog.imageAlt || blog.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-12 w-12 text-pink-200" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-[#ff3f6c]">
                      {blog.category}
                    </span>

                    <h2 className="mt-4 line-clamp-2 text-xl font-bold leading-snug text-slate-900 group-hover:text-[#ff3f6c]">
                      {blog.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                      {blog.excerpt}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {formatDate(blog.publishedAt)}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock3 size={14} />
                        {blog.readTime} min read
                      </span>
                    </div>

                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#ff3f6c]">
                      Read Article
                      <ArrowRight
                        size={16}
                        className="transition group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm text-slate-500">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages || isFetching}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
