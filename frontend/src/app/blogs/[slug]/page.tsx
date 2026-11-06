import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import sanitizeHtml from "sanitize-html";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CalendarDays, Clock3, UserRound, Tag } from "lucide-react";
import ShareButton from "./ShareButton";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://mysmme.com"
).replace(/\/+$/, "");
const API_URL = process.env.NEXT_PUBLIC_API_URL; // adjust to your backend base URL

type Blog = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  imageAlt?: string;
  category: string;
  tags: string[];
  author?: string;
  readTime: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  publishedAt?: string | null;
  updatedAt?: string;
};

// cache() means generateMetadata and the page share one fetch
const getBlog = cache(async (slug: string): Promise<Blog | null> => {
  const url = `${API_URL}/blogs/slug/${encodeURIComponent(slug)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) {
      console.error("[getBlog] failed:", res.status, url);
      return null;
    }
    const json = await res.json();
    const blog = json?.blog ?? json?.data?.blog ?? json?.data ?? json;
    return blog?.slug ? (blog as Blog) : null;
  } catch (e) {
    console.error("[getBlog] error:", e, url);
    return null;
  }
});

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

const isHtml = (s: string) => /<(p|h[1-6]|ul|ol|li|table|div|br)[\s>/]/i.test(s);

const cleanHtml = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog)
    return {
      title: { absolute: "Article not found | MYSMME" },
      robots: { index: false },
    };

  const title = blog.seoTitle || `${blog.title} | MYSMME`;
  const description = blog.seoDescription || blog.excerpt;
  const url = `${SITE_URL}/blogs/${blog.slug}`;
  const images = blog.featuredImage
    ? [{ url: blog.featuredImage, alt: blog.imageAlt || blog.title }]
    : undefined;

  return {
    title: { absolute: title },
    description,
    keywords: null, // stops the site-wide keywords tag on blog posts
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: "MYSMME",
      locale: "en_IN",
      images,
      publishedTime: blog.publishedAt ?? undefined,
      modifiedTime: blog.updatedAt ?? undefined,
      authors: [blog.author || "MYSMME Editorial Team"],
      tags: blog.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images?.map((i) => i.url),
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  const url = `${SITE_URL}/blogs/${blog.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blog.title,
      description: blog.seoDescription || blog.excerpt,
      image: blog.featuredImage ? [blog.featuredImage] : undefined,
      datePublished: blog.publishedAt ?? undefined,
      dateModified: blog.updatedAt ?? blog.publishedAt ?? undefined,
      author: {
        "@type": "Organization",
        name: blog.author || "MYSMME Editorial Team",
      },
      publisher: { "@type": "Organization", name: "MYSMME", url: SITE_URL },
      mainEntityOfPage: url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Journal",
          item: `${SITE_URL}/blogs`,
        },
        { "@type": "ListItem", position: 3, name: blog.title, item: url },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#faf9f8]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-500">
          <Link href="/" className="hover:text-[#ff3f6c]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blogs" className="hover:text-[#ff3f6c]">
            Journal
          </Link>
        </nav>

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
                <time dateTime={blog.publishedAt ?? undefined}>
                  {formatDate(blog.publishedAt)}
                </time>
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 size={16} />
                {blog.readTime} min read
              </span>
            </div>
          </header>

          {blog.featuredImage && (
            <div className="mb-9 overflow-hidden rounded-2xl bg-pink-50">
              <img
                src={blog.featuredImage}
                alt={blog.imageAlt || blog.title}
                fetchPriority="high"
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          )}

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
            <div className="blog-content">
              {isHtml(blog.content || "") ? (
                <div dangerouslySetInnerHTML={{ __html: cleanHtml(blog.content || "") }} />
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content || ""}</ReactMarkdown>
              )}
            </div>

            {blog.tags?.length > 0 && (
              <div className="mt-8 border-t border-slate-100 pt-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag size={17} className="text-[#ff3f6c]" />
                  {blog.tags.map((tag, i) => (
                    <span
                      key={`${tag}-${i}`}
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
                className="text-sm font-semibold text-slate-600 hover:text-[#ff3f6c]"
              >
                ← All Articles
              </Link>
              <ShareButton title={blog.title} text={blog.excerpt} />
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
