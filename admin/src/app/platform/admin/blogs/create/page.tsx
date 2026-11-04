"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  ImagePlus,
  Loader2,
  Save,
  Send,
  Trash2,
  Eye,
  Code2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  useCreateBlogMutation,
  usePublishBlogMutation,
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

const initialValues: FormValues = {
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

const categories = [
  "Saree Styling",
  "Fashion Trends",
  "Fabric Guide",
  "Wedding Fashion",
  "Ethnic Wear",
  "Shopping Guide",
  "Care & Maintenance",
  "Brand Stories",
];

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === "object" && data !== null && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string") return message;
    }
  }
  return "Something went wrong. Please try again.";
}

export default function CreateBlogPage() {
  const router = useRouter();
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [publishBlog, { isLoading: isPublishing }] = usePublishBlogMutation();
  const [form, setForm] = useState<FormValues>(initialValues);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [pendingPublishId, setPendingPublishId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const isBusy = isCreating || isPublishing;

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const setField = <K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Featured image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }
    setImage(file);
  };

  const submit = async (publish: boolean) => {
    if (isBusy) return;
    setError("");
    setNotice("");

    // If publishing failed after creation, retry only the publish step.
    if (pendingPublishId) {
      if (!publish) {
        setNotice(
          "This blog is already saved as a draft. Publish it or return to Blogs.",
        );
        return;
      }
      try {
        await publishBlog(pendingPublishId).unwrap();
        router.push("/platform/admin/blogs");
      } catch (err) {
        setError(`Draft saved, but publishing failed: ${getErrorMessage(err)}`);
      }
      return;
    }

    if (
      !form.title.trim() ||
      !form.category.trim() ||
      !form.excerpt.trim() ||
      !form.content.trim()
    ) {
      setError("Title, category, excerpt and content are required.");
      return;
    }
    if (!/<[a-z][\s\S]*>/i.test(form.content) && !form.content.trim()) {
      setError("Please add blog content.");
      return;
    }
    const readTime = Number(form.readTime);
    if (!Number.isInteger(readTime) || readTime < 1) {
      setError("Reading time must be a positive whole number.");
      return;
    }
    if (form.canonicalUrl.trim()) {
      try {
        const url = new URL(form.canonicalUrl.trim());
        if (!["https:", "http:"].includes(url.protocol))
          throw new Error("Invalid protocol");
      } catch {
        setError("Canonical URL must be a valid http or https URL.");
        return;
      }
    }

    const payload = new FormData();
    const stringFields = [
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
    for (const field of stringFields) payload.append(field, form[field].trim());
    payload.append("readTime", String(readTime));
    payload.append(
      "tags",
      JSON.stringify(
        form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    );
    payload.append("isFeatured", String(form.isFeatured));
    payload.append("isActive", String(form.isActive));
    if (image) payload.append("featuredImage", image);

    try {
      const created = await createBlog(payload).unwrap();
      if (publish) {
        setPendingPublishId(created._id);
        try {
          await publishBlog(created._id).unwrap();
        } catch (publishError) {
          setError(
            `Blog saved as draft, but publishing failed: ${getErrorMessage(publishError)}. Click Publish again to retry without creating a duplicate.`,
          );
          return;
        }
      }
      router.push("/platform/admin/blogs");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit(false);
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#ff3f6c] focus:ring-2 focus:ring-pink-100";
  const labelClass = "block text-sm font-semibold text-slate-700";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/platform/admin/blogs"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#ff3f6c]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blogs
        </Link>
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#ff3f6c]">
              Content Management
            </p>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
              <BookOpen className="h-7 w-7 text-[#ff3f6c]" /> Create New Blog
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Write, optimize and publish a new article for MYSMME.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Eye className="h-4 w-4" />{" "}
              {showPreview ? "Hide Preview" : "Preview"}
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={() => void submit(false)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}{" "}
              Save Draft
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={() => void submit(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#ff3f6c] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e6325c] disabled:opacity-50"
            >
              {isBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}{" "}
              {pendingPublishId ? "Retry Publish" : "Publish Blog"}
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}
        {notice && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {notice}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
        >
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="mb-5 text-lg font-bold text-slate-900">
                Article Details
              </h2>
              <label className={labelClass}>
                Blog Title <span className="text-red-500">*</span>
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  maxLength={200}
                  placeholder="e.g. How to Style a Banarasi Saree"
                  required
                />
              </label>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className={labelClass}>
                  Category <span className="text-red-500">*</span>
                  <input
                    list="blog-categories"
                    className={inputClass}
                    value={form.category}
                    onChange={(e) => setField("category", e.target.value)}
                    placeholder="Select or enter a category"
                    required
                  />
                  <datalist id="blog-categories">
                    {categories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </label>
                <label className={labelClass}>
                  Author
                  <input
                    className={inputClass}
                    value={form.author}
                    onChange={(e) => setField("author", e.target.value)}
                    placeholder="Author name"
                  />
                </label>
              </div>
              <label className={`${labelClass} mt-5`}>
                Short Excerpt <span className="text-red-500">*</span>
                <textarea
                  className={inputClass}
                  rows={3}
                  maxLength={500}
                  value={form.excerpt}
                  onChange={(e) => setField("excerpt", e.target.value)}
                  placeholder="A short summary shown on blog cards and search results..."
                  required
                />
                <span className="mt-1 block text-right text-xs font-normal text-slate-400">
                  {form.excerpt.length}/500
                </span>
              </label>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-900">
                  Blog Content <span className="text-red-500">*</span>
                </h2>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Code2 className="h-4 w-4" /> HTML editor
                </span>
              </div>
              <p className="mb-3 text-xs leading-5 text-slate-500">
                Enter HTML such as &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;,
                &lt;ul&gt; and &lt;li&gt;. The preview is for trusted
                admin-authored HTML only; sanitize HTML before displaying it on
                the public website.
              </p>
              <textarea
                className={`${inputClass} mt-0 min-h-[400px] font-mono leading-7`}
                value={form.content}
                onChange={(e) => setField("content", e.target.value)}
                placeholder={
                  "<h2>Introduction</h2>\n<p>Write your article here...</p>"
                }
                required
              />
              <p className="mt-2 text-xs text-slate-400">
                For now this is an HTML editor. A rich-text toolbar can be added
                later.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="mb-5 text-lg font-bold text-slate-900">
                SEO Settings
              </h2>
              <label className={labelClass}>
                SEO Title
                <input
                  className={inputClass}
                  maxLength={70}
                  value={form.seoTitle}
                  onChange={(e) => setField("seoTitle", e.target.value)}
                  placeholder="Search engine title"
                />
                <span className="mt-1 block text-right text-xs font-normal text-slate-400">
                  {form.seoTitle.length}/70
                </span>
              </label>
              <label className={`${labelClass} mt-5`}>
                SEO Description
                <textarea
                  className={inputClass}
                  maxLength={160}
                  rows={3}
                  value={form.seoDescription}
                  onChange={(e) => setField("seoDescription", e.target.value)}
                  placeholder="Search engine description"
                />
                <span className="mt-1 block text-right text-xs font-normal text-slate-400">
                  {form.seoDescription.length}/160
                </span>
              </label>
              <label className={`${labelClass} mt-5`}>
                Canonical URL (optional)
                <input
                  type="url"
                  className={inputClass}
                  value={form.canonicalUrl}
                  onChange={(e) => setField("canonicalUrl", e.target.value)}
                  placeholder="https://mysmme.com/blogs/example"
                />
              </label>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-slate-900">
                Featured Image
              </h2>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onImageChange}
              />
              {previewUrl ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <img
                    src={previewUrl}
                    alt="Featured image preview"
                    className="aspect-video w-full object-cover"
                  />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => {
                      setImage(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className="absolute right-2 top-2 rounded-lg bg-white p-2 text-red-600 shadow"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500 hover:border-[#ff3f6c] hover:bg-pink-50"
                >
                  <ImagePlus className="h-8 w-8" />
                  <span className="text-sm font-semibold">
                    Choose Featured Image
                  </span>
                  <span className="text-xs">JPG, PNG, WebP · Max 5 MB</span>
                </button>
              )}
              {image && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-3 text-xs font-semibold text-[#ff3f6c]"
                >
                  Change image
                </button>
              )}
              <label className={`${labelClass} mt-4`}>
                Image Alt Text
                <input
                  className={inputClass}
                  value={form.imageAlt}
                  onChange={(e) => setField("imageAlt", e.target.value)}
                  placeholder="Describe the image"
                />
              </label>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-slate-900">
                Publishing Options
              </h2>
              <label className={labelClass}>
                Reading Time (minutes)
                <input
                  type="number"
                  min="1"
                  step="1"
                  className={inputClass}
                  value={form.readTime}
                  onChange={(e) => setField("readTime", e.target.value)}
                />
              </label>
              <label className={`${labelClass} mt-4`}>
                Tags (comma separated)
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.tags}
                  onChange={(e) => setField("tags", e.target.value)}
                  placeholder="sarees, styling, silk, fashion"
                />
              </label>
              <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-slate-700">
                Featured Article{" "}
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setField("isFeatured", e.target.checked)}
                  className="h-4 w-4 accent-[#ff3f6c]"
                />
              </label>
              <label className="mt-4 flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-slate-700">
                Active{" "}
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setField("isActive", e.target.checked)}
                  className="h-4 w-4 accent-[#ff3f6c]"
                />
              </label>
              <p className="mt-4 text-xs leading-5 text-slate-500">
                Save Draft stores an unpublished article. Publish Blog creates
                it first, then publishes it.
              </p>
            </section>
          </aside>
        </form>

        {showPreview && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              Article Preview
            </h2>
            {previewUrl && (
              <img
                src={previewUrl}
                alt={form.imageAlt || "Featured preview"}
                className="mb-6 aspect-video max-h-[360px] w-full rounded-xl object-cover"
              />
            )}
            <p className="text-sm font-semibold text-[#ff3f6c]">
              {form.category || "Category"}
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {form.title || "Untitled article"}
            </h3>
            <p className="mt-3 text-slate-500">{form.excerpt}</p>
            <p className="mt-3 text-xs text-slate-400">
              {form.author} · {form.readTime} min read
            </p>
            <div className="mt-6 whitespace-pre-wrap rounded-xl bg-slate-50 p-5 font-mono text-sm leading-7 text-slate-700">
              {form.content ||
                "Your HTML content will appear here as source text."}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              HTML is shown as source text here for safety.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
