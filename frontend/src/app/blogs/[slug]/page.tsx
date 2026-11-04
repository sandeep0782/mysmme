"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  UserRound,
  BookOpen,
  Share2,
  Check,
  Loader2,
  AlertCircle,
  Tag,
} from "lucide-react";

import { useGetBlogBySlugQuery } from "@/store/api/blogApi";

const formatDate = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [copied, setCopied] = useState(false);

  const {
    data: blog,
    isLoading,
    isError,
    refetch,
  } = useGetBlogBySlugQuery(slug, {
    skip: !slug,
  });

  const handleShare = async () => {
    if (!blog) return;

    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-[#ff3f6c]" />
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <main className="min-h-screen bg-[#faf9f8] px-4 py-20">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Article unavailable
          </h1>

          <p className="mt-3 text-slate-500">
            This article may have been removed or is not published.
          </p>

          <div className="mt-7 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold"
            >
              Retry
            </button>

            <Link
              href="/blogs"
              className="rounded-lg bg-[#ff3f6c] px-5 py-2.5 text-sm font-semibold text-white"
            >
              All Articles
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const articleHtml = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 16px;
    line-height: 1.85;
    color: #475569;
    overflow-wrap: anywhere;
  }
  h1, h2, h3, h4 {
    color: #0f172a;
    line-height: 1.35;
    margin-top: 1.5em;
  }
  p { margin: 0 0 1.25em; }
  img { max-width: 100%; height: auto; border-radius: 12px; }
  a { color: #ff3f6c; }
  blockquote {
    border-left: 4px solid #ff3f6c;
    padding: 12px 20px;
    margin: 20px 0;
    background: #fff1f4;
    border-radius: 0 8px 8px 0;
  }
  ul, ol { padding-left: 24px; margin-bottom: 20px; }
  li { margin-bottom: 8px; }
  table { border-collapse: collapse; width: 100%; }
  td, th { border: 1px solid #e2e8f0; padding: 10px; }
</style>
</head>
<body>${blog.content || ""}</body>
</html>`;

  return (
    <main className="min-h-screen bg-[#faf9f8]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/blogs"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#ff3f6c]"
        >
          <ArrowLeft size={17} />
          Back to Journal
        </Link>

        <article>
          <header className="mb-8 text-center">
            <span className="inline-flex rounded-full bg-pink-50 px-4 py-1.5 text-sm font-semibold text-[#ff3f6c]">
              {blog.category}
            </span>

            <h1 className="mx-auto mt-5 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {blog.title}
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-500 sm:text-lg">
              {blog.excerpt}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-5 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <UserRound size={16} />
                {blog.author || "MYSMME Editorial Team"}
              </span>

              <span className="inline-flex items-center gap-2">
                <CalendarDays size={16} />
                {formatDate(blog.publishedAt)}
              </span>

              <span className="inline-flex items-center gap-2">
                <Clock3 size={16} />
                {blog.readTime} min read
              </span>
            </div>
          </header>

          <div className="mb-9 overflow-hidden rounded-2xl bg-pink-50">
            {blog.featuredImage ? (
              <img
                src={blog.featuredImage}
                alt={blog.imageAlt || blog.title}
                className="aspect-[16/9] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center">
                <BookOpen className="h-16 w-16 text-pink-200" />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
            <iframe
              title={`${blog.title} article content`}
              sandbox=""
              srcDoc={articleHtml}
              className="h-[800px] w-full border-0"
              referrerPolicy="no-referrer"
            />

            {blog.tags?.length > 0 && (
              <div className="mt-8 border-t border-slate-100 pt-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag size={17} className="text-[#ff3f6c]" />

                  {blog.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#ff3f6c]"
              >
                <ArrowLeft size={16} />
                All Articles
              </Link>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-lg bg-pink-50 px-4 py-2.5 text-sm font-semibold text-[#ff3f6c] hover:bg-pink-100"
              >
                {copied ? <Check size={17} /> : <Share2 size={17} />}
                {copied ? "Link Copied" : "Share Article"}
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
