"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Save,
  AlertCircle,
  Eye,
  X,
} from "lucide-react";
import {
  useGetBlogByIdAdminQuery,
  useUpdateBlogMutation,
} from "@/store/api/blogApi";

type FormValues = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  imageAlt: string;
  tags: string;
  readTime: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  isFeatured: boolean;
  isActive: boolean;
};

const emptyForm: FormValues = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  author: "MYSMME Editorial Team",
  imageAlt: "",
  tags: "",
  readTime: "5",
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  isFeatured: false,
  isActive: true,
};

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#ff3f6c] focus:ring-2 focus:ring-pink-100";

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === "object" && data !== null && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string") return message;
    }
  }
  return "Unable to save changes. Please try again.";
}

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    data: blog,
    isLoading,
    isError,
    refetch,
  } = useGetBlogByIdAdminQuery(id, { skip: !id });
  const [updateBlog, { isLoading: isSaving }] = useUpdateBlogMutation();
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [readyId, setReadyId] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!blog) return;
    setForm({
      title: blog.title ?? "",
      excerpt: blog.excerpt ?? "",
      content: blog.content ?? "",
      category: blog.category ?? "",
      author: blog.author ?? "MYSMME Editorial Team",
      imageAlt: blog.imageAlt ?? "",
      tags: (blog.tags ?? []).join(", "),
      readTime: String(blog.readTime ?? 5),
      seoTitle: blog.seoTitle ?? "",
      seoDescription: blog.seoDescription ?? "",
      canonicalUrl: blog.canonicalUrl ?? "",
      isFeatured: Boolean(blog.isFeatured),
      isActive: Boolean(blog.isActive),
    });
    setImageFile(null);
    setImagePreview(null);
    setReadyId(blog._id);
  }, [blog]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const setField = <K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please choose a JPG, PNG or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Featured image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }
    setError("");
    setImageFile(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!blog || readyId !== id) return;
    if (
      ![form.title, form.excerpt, form.content, form.category].every((value) =>
        value.trim(),
      )
    ) {
      setError("Title, excerpt, content and category are required.");
      return;
    }
    const minutes = Number(form.readTime);
    if (!Number.isInteger(minutes) || minutes < 1) {
      setError("Reading time must be a positive whole number.");
      return;
    }
    const data = new FormData();
    const textFields = [
      "title",
      "excerpt",
      "content",
      "category",
      "author",
      "imageAlt",
      "seoTitle",
      "seoDescription",
      "canonicalUrl",
    ] as const;
    for (const field of textFields) data.append(field, form[field]);
    data.append(
      "tags",
      JSON.stringify(
        form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    );
    data.append("readTime", String(minutes));
    data.append("isFeatured", String(form.isFeatured));
    data.append("isActive", String(form.isActive));
    if (imageFile) data.append("featuredImage", imageFile);
    try {
      await updateBlog({ id, data }).unwrap();
      router.push(`/platform/admin/blogs/${id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (isLoading || (blog && readyId !== id)) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-[#ff3f6c]" />
      </div>
    );
  }
  if (isError || !blog) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
          <h1 className="mt-4 text-xl font-bold">Unable to load blog</h1>
          <p className="mt-2 text-sm text-slate-500">
            Check the blog ID and your admin session.
          </p>
          <div className="mt-5 flex justify-center gap-3">
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

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              href={`/platform/admin/blogs/${id}`}
              className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#ff3f6c]"
            >
              <ArrowLeft size={17} /> Back to Blog Details
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Edit Blog</h1>
            <p className="mt-1 text-sm text-slate-500">
              Update your article, featured image and SEO information.
            </p>
          </div>
          <Link
            href={`/platform/admin/blogs/${id}`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            <Eye size={17} /> View Blog
          </Link>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]"
        >
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold text-slate-900">
                Article Details
              </h2>
              <div className="space-y-5">
                <Field label="Blog Title" required>
                  <input
                    className={fieldClass}
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    maxLength={200}
                    required
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Category" required>
                    <input
                      className={fieldClass}
                      value={form.category}
                      onChange={(e) => setField("category", e.target.value)}
                      placeholder="e.g. Saree Styling"
                      required
                    />
                  </Field>
                  <Field label="Author">
                    <input
                      className={fieldClass}
                      value={form.author}
                      onChange={(e) => setField("author", e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="Excerpt" required>
                  <textarea
                    className={fieldClass}
                    rows={3}
                    maxLength={500}
                    value={form.excerpt}
                    onChange={(e) => setField("excerpt", e.target.value)}
                    required
                  />
                  <p className="mt-1 text-right text-xs text-slate-400">
                    {form.excerpt.length}/500
                  </p>
                </Field>
                <Field label="Blog Content (HTML)" required>
                  <textarea
                    className={`${fieldClass} min-h-[420px] font-mono leading-7`}
                    value={form.content}
                    onChange={(e) => setField("content", e.target.value)}
                    placeholder="<h2>Introduction</h2><p>Your article...</p>"
                    required
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    HTML content is preserved. Sanitize HTML before rendering it
                    on the public website.
                  </p>
                </Field>
              </div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold text-slate-900">
                SEO Settings
              </h2>
              <div className="space-y-5">
                <Field label="SEO Title">
                  <input
                    className={fieldClass}
                    value={form.seoTitle}
                    maxLength={70}
                    onChange={(e) => setField("seoTitle", e.target.value)}
                  />
                  <p className="mt-1 text-right text-xs text-slate-400">
                    {form.seoTitle.length}/70
                  </p>
                </Field>
                <Field label="SEO Description">
                  <textarea
                    className={fieldClass}
                    rows={3}
                    maxLength={160}
                    value={form.seoDescription}
                    onChange={(e) => setField("seoDescription", e.target.value)}
                  />
                  <p className="mt-1 text-right text-xs text-slate-400">
                    {form.seoDescription.length}/160
                  </p>
                </Field>
                <Field label="Canonical URL">
                  <input
                    type="url"
                    className={fieldClass}
                    value={form.canonicalUrl}
                    onChange={(e) => setField("canonicalUrl", e.target.value)}
                    placeholder="https://mysmme.com/blogs/..."
                  />
                </Field>
              </div>
            </section>
          </div>
          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-slate-900">
                Featured Image
              </h2>
              <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50">
                {imagePreview || blog.featuredImage ? (
                  <img
                    src={imagePreview || blog.featuredImage}
                    alt="Featured image preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus className="h-12 w-12 text-slate-300" />
                )}
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onImageChange}
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ImagePlus size={17} />{" "}
                {blog.featuredImage ? "Replace Image" : "Upload Image"}
              </button>
              {imageFile && (
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    if (imageInputRef.current) imageInputRef.current.value = "";
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-red-600"
                >
                  <X size={13} /> Cancel replacement
                </button>
              )}
              <p className="mt-3 text-xs leading-5 text-slate-500">
                JPG, PNG or WebP, maximum 5 MB. Without a new image, the
                existing image stays unchanged.
              </p>
              <Field label="Image Alt Text">
                <input
                  className={fieldClass}
                  value={form.imageAlt}
                  onChange={(e) => setField("imageAlt", e.target.value)}
                />
              </Field>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold text-slate-900">
                Publishing & Tags
              </h2>
              <div className="space-y-5">
                <Field label="Tags (comma separated)">
                  <input
                    className={fieldClass}
                    value={form.tags}
                    onChange={(e) => setField("tags", e.target.value)}
                    placeholder="sarees, fashion, styling"
                  />
                </Field>
                <Field label="Reading Time (minutes)">
                  <input
                    className={fieldClass}
                    type="number"
                    min={1}
                    step={1}
                    value={form.readTime}
                    onChange={(e) => setField("readTime", e.target.value)}
                  />
                </Field>
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setField("isFeatured", e.target.checked)}
                    className="accent-[#ff3f6c]"
                  />{" "}
                  Featured Blog
                </label>
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setField("isActive", e.target.checked)}
                    className="accent-[#ff3f6c]"
                  />{" "}
                  Active Blog
                </label>
                <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                  Current status:{" "}
                  <strong className="capitalize">{blog.status}</strong>
                  <p className="mt-1 text-xs text-slate-500">
                    Saving edits does not change publication status.
                  </p>
                </div>
              </div>
            </section>
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff3f6c] px-5 py-3 text-sm font-semibold text-white hover:bg-[#e6325c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Saving Changes..." : "Save Changes"}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
