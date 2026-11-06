import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Clock3 } from "lucide-react";

type Blog = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  featuredImage?: string;
  imageAlt?: string;
  readTime: number;
  publishedAt?: string | null;
};

type BlogsResponse = {
  blogs: Blog[];
  totalPages: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL; // adjust to your backend base URL
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://mysmme.com"
).replace(/\/+$/, "");

async function getBlogs(page: number): Promise<BlogsResponse | null> {
  try {
    const res = await fetch(`${API_URL}/blogs?page=${page}&limit=9`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;

    const json = await res.json();
    const root = json?.data ?? json; // handles { data: { ... } } and flat responses

    const blogs: Blog[] =
      root?.blogs ?? root?.items ?? (Array.isArray(root) ? root : []);
    const totalPages: number =
      root?.pagination?.totalPages ??
      root?.totalPages ??
      json?.pagination?.totalPages ??
      1;

    return { blogs, totalPages };
  } catch {
    return null;
  }
}

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

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);

  const title =
    current > 1
      ? `Saree Styling Tips & Fashion Journal - Page ${current} | MYSMME`
      : "Saree Styling Tips & Fashion Journal | MYSMME";
  const description =
    "Saree styling ideas, fabric guides, blouse tips and ethnic fashion trends from MYSMME, India's dedicated saree marketplace.";
  const url =
    current > 1 ? `${SITE_URL}/blogs?page=${current}` : `${SITE_URL}/blogs`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: "MYSMME",
      locale: "en_IN",
      // images: [{ url: "https://.../blog-og.jpg", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);

  const data = await getBlogs(current);
  const blogs = data?.blogs ?? [];
  const totalPages = data?.totalPages ?? 0;
  
  return (
    <main className="min-h-screen bg-[#faf9f8]">
      <section className="border-b border-pink-100 bg-gradient-to-b from-pink-50 to-white px-4 py-16 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#ff3f6c]">
          MYSMME Journal
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Saree Styling Tips &amp; Fashion Journal
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
          Explore saree styling ideas, fabric guides and fashion trends. Ready
          to shop? Browse our{" "}
          <Link
            href="/sarees"
            className="font-semibold text-[#ff3f6c] underline"
          >
            sarees
          </Link>{" "}
          or{" "}
          <Link
            href="/category"
            className="font-semibold text-[#ff3f6c] underline"
          >
            shop by category
          </Link>
          .
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {!data ? (
          <div className="rounded-2xl bg-white p-12 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              Unable to load articles right now
            </h2>
            <p className="mt-2 text-slate-500">
              Please try again in a few minutes.
            </p>
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
                        <time dateTime={blog.publishedAt ?? undefined}>
                          {formatDate(blog.publishedAt)}
                        </time>
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
              <nav
                aria-label="Blog pagination"
                className="mt-12 flex items-center justify-center gap-4"
              >
                {current > 1 ? (
                  <Link
                    href={
                      current - 1 === 1
                        ? "/blogs"
                        : `/blogs?page=${current - 1}`
                    }
                    rel="prev"
                    className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium opacity-40">
                    Previous
                  </span>
                )}

                <span className="text-sm text-slate-500">
                  Page {current} of {totalPages}
                </span>

                {current < totalPages ? (
                  <Link
                    href={`/blogs?page=${current + 1}`}
                    rel="next"
                    className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium opacity-40">
                    Next
                  </span>
                )}
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}
