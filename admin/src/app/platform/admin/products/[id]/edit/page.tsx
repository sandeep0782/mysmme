"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ImageIcon,
  Loader2,
  Package,
  Save,
  XCircle,
} from "lucide-react";

import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/store/api/productApi";

type ReferenceValue = {
  _id?: string;
  name?: string;
  slug?: string;
};

type ProductForm = {
  title: string;
  slug: string;
  description: string;

  brand: string;
  category: string;
  color: string;
  season: string;

  collectionName: string;
  gender: string;

  price: string;
  finalPrice: string;
  mrp: string;

  inventory: string;

  productId: string;
  styleId: string;
  skuId: string;
  groupId: string;

  gstPercentage: string;
  hsnId: string;
  netWeight: string;
  netQuantity: string;

  countryOfOrigin: string;
  genericName: string;

  sareeFabric: string;
  sareeLengthSize: string;
  occasion: string;

  blouse: string;
  blouseColor: string;
  blouseFabric: string;
  blousePattern: string;
  blouseLengthSize: string;

  border: string;
  borderWidth: string;

  printOrPatternType: string;
  pattern: string;

  transparency: string;
  type: string;
  loomType: string;
  ornamentation: string;
  palluDetails: string;

  colorRemarks: string;

  manufacturerName: string;
  manufacturerAddress: string;
  manufacturerPincode: string;

  packerName: string;
  packerAddress: string;
  packerPincode: string;

  importerName: string;
  importerAddress: string;
  importerPincode: string;

  tags: string;

  publishStatus: string;
  rejectionReason: string;

  isActive: boolean;
};

const initialForm: ProductForm = {
  title: "",
  slug: "",
  description: "",

  brand: "",
  category: "",
  color: "",
  season: "",

  collectionName: "",
  gender: "",

  price: "",
  finalPrice: "",
  mrp: "",

  inventory: "",

  productId: "",
  styleId: "",
  skuId: "",
  groupId: "",

  gstPercentage: "",
  hsnId: "",
  netWeight: "",
  netQuantity: "",

  countryOfOrigin: "",
  genericName: "",

  sareeFabric: "",
  sareeLengthSize: "",
  occasion: "",

  blouse: "",
  blouseColor: "",
  blouseFabric: "",
  blousePattern: "",
  blouseLengthSize: "",

  border: "",
  borderWidth: "",

  printOrPatternType: "",
  pattern: "",

  transparency: "",
  type: "",
  loomType: "",
  ornamentation: "",
  palluDetails: "",

  colorRemarks: "",

  manufacturerName: "",
  manufacturerAddress: "",
  manufacturerPincode: "",

  packerName: "",
  packerAddress: "",
  packerPincode: "",

  importerName: "",
  importerAddress: "",
  importerPincode: "",

  tags: "",

  publishStatus: "draft",
  rejectionReason: "",

  isActive: true,
};

const getId = (value: unknown): string => {
  if (!value) return "";

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    const item = value as ReferenceValue;
    return String(item._id ?? "");
  }

  return "";
};

const getString = (value: unknown): string => {
  if (value === null || value === undefined) return "";

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return String(value);
};

const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100";

const textareaClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = String(params?.id ?? "");

  const {
    data: productResponse,
    isLoading,
    isError,
  } = useGetProductByIdQuery(id, {
    skip: !id,
  });

  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation();

  const [form, setForm] = useState<ProductForm>(initialForm);

  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const previewUrlsRef = useRef<string[]>([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const product = productResponse?.data ?? productResponse;

  // ============================================================
  // LOAD PRODUCT
  // ============================================================

  useEffect(() => {
    if (!product?._id) return;

    setExistingImages(
      Array.isArray(product.images)
        ? product.images.filter(
            (image: unknown): image is string =>
              typeof image === "string" && Boolean(image),
          )
        : [],
    );

    setForm({
      title: getString(product.title),
      slug: getString(product.slug),
      description: getString(product.description),

      brand: getId(product.brand),
      category: getId(product.category),
      color: getId(product.color),
      season: getId(product.season),

      collectionName: getString(product.collectionName),
      gender: getString(product.gender),

      price: getString(product.price),
      finalPrice: getString(product.finalPrice),
      mrp: getString(product.mrp),

      inventory: getString(product.inventory),

      productId: getString(product.productId),
      styleId: getString(product.styleId),
      skuId: getString(product.skuId),
      groupId: getString(product.groupId),

      gstPercentage: getString(product.gstPercentage),
      hsnId: getString(product.hsnId),
      netWeight: getString(product.netWeight),
      netQuantity: getString(product.netQuantity),

      countryOfOrigin: getString(product.countryOfOrigin),
      genericName: getString(product.genericName),

      sareeFabric: getString(product.sareeFabric),
      sareeLengthSize: getString(product.sareeLengthSize),
      occasion: getString(product.occasion),

      blouse: getString(product.blouse),
      blouseColor: getString(product.blouseColor),
      blouseFabric: getString(product.blouseFabric),
      blousePattern: getString(product.blousePattern),
      blouseLengthSize: getString(product.blouseLengthSize),

      border: getString(product.border),
      borderWidth: getString(product.borderWidth),

      printOrPatternType: getString(product.printOrPatternType),
      pattern: getString(product.pattern),

      transparency: getString(product.transparency),
      type: getString(product.type),
      loomType: getString(product.loomType),
      ornamentation: getString(product.ornamentation),
      palluDetails: getString(product.palluDetails),

      colorRemarks: getString(product.colorRemarks),

      manufacturerName: getString(product.manufacturerName),
      manufacturerAddress: getString(product.manufacturerAddress),
      manufacturerPincode: getString(product.manufacturerPincode),

      packerName: getString(product.packerName),
      packerAddress: getString(product.packerAddress),
      packerPincode: getString(product.packerPincode),

      importerName: getString(product.importerName),
      importerAddress: getString(product.importerAddress),
      importerPincode: getString(product.importerPincode),

      tags: getString(product.tags),

      publishStatus: getString(product.publishStatus) || "draft",

      rejectionReason: getString(product.rejectionReason),

      isActive: Boolean(product.isActive),
    });
  }, [product]);

  // ============================================================
  // CLEANUP LOCAL IMAGE PREVIEWS
  // ============================================================

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      previewUrlsRef.current = [];
    };
  }, []);

  // ============================================================
  // FORM VALUE
  // ============================================================

  const setValue = (field: keyof ProductForm, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // ============================================================
  // SELECT NEW IMAGES
  // ============================================================

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) return;

    setError("");

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    if (!validFiles.length) {
      setError("Please select valid image files.");
      event.target.value = "";
      return;
    }

    const previews = validFiles.map((file) => URL.createObjectURL(file));

    previewUrlsRef.current.push(...previews);

    setNewImageFiles((current) => [...current, ...validFiles]);

    setNewImagePreviews((current) => [...current, ...previews]);

    event.target.value = "";
  };

  // ============================================================
  // REMOVE EXISTING IMAGE
  // ============================================================

  const removeExistingImage = (index: number) => {
    const totalImages = existingImages.length + newImageFiles.length;

    if (totalImages <= 1) {
      setError("A product must have at least one image.");
      return;
    }

    setError("");

    setExistingImages((current) => current.filter((_, i) => i !== index));
  };

  // ============================================================
  // REMOVE NEW IMAGE
  // ============================================================

  const removeNewImage = (index: number) => {
    const totalImages = existingImages.length + newImageFiles.length;

    if (totalImages <= 1) {
      setError("A product must have at least one image.");
      return;
    }

    const preview = newImagePreviews[index];

    if (preview) {
      URL.revokeObjectURL(preview);

      previewUrlsRef.current = previewUrlsRef.current.filter(
        (url) => url !== preview,
      );
    }

    setError("");

    setNewImageFiles((current) => current.filter((_, i) => i !== index));

    setNewImagePreviews((current) => current.filter((_, i) => i !== index));
  };

  // ============================================================
  // SAVE PRODUCT
  // ============================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!form.title.trim()) {
      setError("Product title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Product description is required.");
      return;
    }

    if (!form.brand) {
      setError("Brand is required.");
      return;
    }

    if (!form.category) {
      setError("Category is required.");
      return;
    }

    if (!form.color) {
      setError("Color is required.");
      return;
    }

    if (!form.season) {
      setError("Season is required.");
      return;
    }

    const price = Number(form.price);
    const finalPrice = Number(form.finalPrice);
    const mrp = Number(form.mrp);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (!Number.isFinite(finalPrice) || finalPrice < 0) {
      setError("Final price must be 0 or greater.");
      return;
    }

    if (!Number.isFinite(mrp) || mrp < 0) {
      setError("MRP must be 0 or greater.");
      return;
    }

    if (finalPrice > price) {
      setError("Final price cannot be greater than price.");
      return;
    }

    const totalImages = existingImages.length + newImageFiles.length;

    if (totalImages === 0) {
      setError("At least one product image is required.");
      return;
    }

    try {
      // ========================================================
      // BUILD MULTIPART FORM DATA
      // ========================================================

      const formData = new FormData();

      const fields: Record<string, unknown> = {
        ...form,

        price,
        finalPrice,
        mrp,

        inventory: Number(form.inventory || 0),

        gstPercentage:
          form.gstPercentage === "" ? "" : Number(form.gstPercentage),

        netWeight: form.netWeight === "" ? "" : Number(form.netWeight),

        netQuantity: form.netQuantity === "" ? "" : Number(form.netQuantity),

        sareeLengthSize:
          form.sareeLengthSize === "" ? "" : Number(form.sareeLengthSize),

        blouseLengthSize:
          form.blouseLengthSize === "" ? "" : Number(form.blouseLengthSize),

        borderWidth: form.borderWidth === "" ? "" : Number(form.borderWidth),
      };

      // --------------------------------------------------------
      // APPEND NORMAL FIELDS
      // --------------------------------------------------------

      Object.entries(fields).forEach(([key, value]) => {
        if (key === "tags") {
          return;
        }

        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // --------------------------------------------------------
      // TAGS
      // --------------------------------------------------------

      const parsedTags = form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      formData.append("tags", JSON.stringify(parsedTags));

      // --------------------------------------------------------
      // EXISTING IMAGES TO KEEP
      // --------------------------------------------------------

      formData.append("keepImages", JSON.stringify(existingImages));

      // --------------------------------------------------------
      // NEW IMAGE FILES
      // --------------------------------------------------------

      newImageFiles.forEach((file) => {
        formData.append("images", file);
      });

      // ========================================================
      // UPDATE - ONLY ONE API CALL
      // ========================================================

      await updateProduct({
        id,
        data: formData,
      }).unwrap();

      setSuccess("Product updated successfully.");

      window.setTimeout(() => {
        router.push("/platform/admin/products");
      }, 900);
    } catch (err: unknown) {
      const apiError = err as {
        status?: number | string;
        data?: unknown;
        error?: string;
      };

      console.error("========== UPDATE PRODUCT ERROR ==========");
      console.error("Status:", apiError?.status);
      console.error("Data:", JSON.stringify(apiError?.data, null, 2));
      console.error("Error:", apiError?.error);
      console.error("Raw:", err);
      console.error("==========================================");

      let message = "Failed to update product. Please try again.";

      if (apiError?.data && typeof apiError.data === "object") {
        const data = apiError.data as {
          message?: string;
          error?: string;
        };

        message = data.message || data.error || message;
      }

      if (apiError?.error) {
        message = apiError.error;
      }

      setError(message);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-red-600" />

          <p className="mt-3 text-sm text-slate-500">Loading product...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <XCircle className="mx-auto h-10 w-10 text-red-500" />

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Product could not be loaded
          </h1>

          <Link
            href="/platform/admin/products"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <form onSubmit={handleSubmit}>
        {/* HEADER */}

        <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-4">
              <Link
                href="/platform/admin/products"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
                  Catalog Management
                </p>

                <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
                  Edit Product
                </h1>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1500px]">
            {/* ERROR MESSAGE */}

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {/* SUCCESS MESSAGE */}

            {success && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <p className="text-sm font-medium text-emerald-700">
                  {success}
                </p>
              </div>
            )}

            <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
              {/* LEFT */}

              <div className="space-y-6">
                {/* BASIC */}

                <Section
                  title="Basic Information"
                  description="Main information customers see on the product page."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Product Title" required>
                      <input
                        value={form.title}
                        onChange={(e) => setValue("title", e.target.value)}
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Slug">
                      <input
                        value={form.slug}
                        onChange={(e) => setValue("slug", e.target.value)}
                        className={inputClass}
                      />
                    </Field>

                    <div className="md:col-span-2">
                      <Field label="Description" required>
                        <textarea
                          rows={7}
                          value={form.description}
                          onChange={(e) =>
                            setValue("description", e.target.value)
                          }
                          className={textareaClass}
                        />
                      </Field>
                    </div>
                  </div>
                </Section>

                {/* CLASSIFICATION */}

                <Section
                  title="Product Classification"
                  description="Brand, category, colour and collection references."
                >
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <Field label="Brand ID" required>
                      <input
                        value={form.brand}
                        onChange={(e) => setValue("brand", e.target.value)}
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Category ID" required>
                      <input
                        value={form.category}
                        onChange={(e) => setValue("category", e.target.value)}
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Color ID" required>
                      <input
                        value={form.color}
                        onChange={(e) => setValue("color", e.target.value)}
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Season ID" required>
                      <input
                        value={form.season}
                        onChange={(e) => setValue("season", e.target.value)}
                        className={inputClass}
                      />
                    </Field>

                    <TextField
                      label="Collection"
                      value={form.collectionName}
                      onChange={(value) => setValue("collectionName", value)}
                    />

                    <TextField
                      label="Gender"
                      value={form.gender}
                      onChange={(value) => setValue("gender", value)}
                    />

                    <TextField
                      label="Saree Fabric"
                      value={form.sareeFabric}
                      onChange={(value) => setValue("sareeFabric", value)}
                    />

                    <TextField
                      label="Occasion"
                      value={form.occasion}
                      onChange={(value) => setValue("occasion", value)}
                    />
                  </div>
                </Section>

                {/* PRICING */}

                <Section
                  title="Pricing & Inventory"
                  description="Manage selling price, MRP and available inventory."
                >
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <NumberField
                      label="Price"
                      value={form.price}
                      onChange={(value) => setValue("price", value)}
                    />

                    <NumberField
                      label="Final Price"
                      value={form.finalPrice}
                      onChange={(value) => setValue("finalPrice", value)}
                    />

                    <NumberField
                      label="MRP"
                      value={form.mrp}
                      onChange={(value) => setValue("mrp", value)}
                    />

                    <NumberField
                      label="Inventory"
                      value={form.inventory}
                      onChange={(value) => setValue("inventory", value)}
                    />
                  </div>
                </Section>

                {/* IDS */}

                <Section
                  title="Product Identifiers"
                  description="Internal product, style, SKU and group identifiers."
                >
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <TextField
                      label="Product ID"
                      value={form.productId}
                      onChange={(value) => setValue("productId", value)}
                    />

                    <TextField
                      label="Style ID"
                      value={form.styleId}
                      onChange={(value) => setValue("styleId", value)}
                    />

                    <TextField
                      label="SKU ID"
                      value={form.skuId}
                      onChange={(value) => setValue("skuId", value)}
                    />

                    <TextField
                      label="Group ID"
                      value={form.groupId}
                      onChange={(value) => setValue("groupId", value)}
                    />
                  </div>
                </Section>

                {/* SAREE */}

                <Section
                  title="Saree Details"
                  description="Detailed saree and blouse attributes."
                >
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    <TextField
                      label="Saree Fabric"
                      value={form.sareeFabric}
                      onChange={(value) => setValue("sareeFabric", value)}
                    />

                    <NumberField
                      label="Saree Length"
                      value={form.sareeLengthSize}
                      onChange={(value) => setValue("sareeLengthSize", value)}
                    />

                    <TextField
                      label="Occasion"
                      value={form.occasion}
                      onChange={(value) => setValue("occasion", value)}
                    />

                    <TextField
                      label="Blouse"
                      value={form.blouse}
                      onChange={(value) => setValue("blouse", value)}
                    />

                    <TextField
                      label="Blouse Color"
                      value={form.blouseColor}
                      onChange={(value) => setValue("blouseColor", value)}
                    />

                    <TextField
                      label="Blouse Fabric"
                      value={form.blouseFabric}
                      onChange={(value) => setValue("blouseFabric", value)}
                    />

                    <TextField
                      label="Blouse Pattern"
                      value={form.blousePattern}
                      onChange={(value) => setValue("blousePattern", value)}
                    />

                    <NumberField
                      label="Blouse Length"
                      value={form.blouseLengthSize}
                      onChange={(value) => setValue("blouseLengthSize", value)}
                    />

                    <TextField
                      label="Border"
                      value={form.border}
                      onChange={(value) => setValue("border", value)}
                    />

                    <NumberField
                      label="Border Width"
                      value={form.borderWidth}
                      onChange={(value) => setValue("borderWidth", value)}
                    />

                    <TextField
                      label="Pattern Type"
                      value={form.printOrPatternType}
                      onChange={(value) =>
                        setValue("printOrPatternType", value)
                      }
                    />

                    <TextField
                      label="Pattern"
                      value={form.pattern}
                      onChange={(value) => setValue("pattern", value)}
                    />

                    <TextField
                      label="Transparency"
                      value={form.transparency}
                      onChange={(value) => setValue("transparency", value)}
                    />

                    <TextField
                      label="Type"
                      value={form.type}
                      onChange={(value) => setValue("type", value)}
                    />

                    <TextField
                      label="Loom Type"
                      value={form.loomType}
                      onChange={(value) => setValue("loomType", value)}
                    />

                    <TextField
                      label="Ornamentation"
                      value={form.ornamentation}
                      onChange={(value) => setValue("ornamentation", value)}
                    />
                  </div>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <Field label="Pallu Details">
                      <textarea
                        rows={4}
                        value={form.palluDetails}
                        onChange={(e) =>
                          setValue("palluDetails", e.target.value)
                        }
                        className={textareaClass}
                      />
                    </Field>

                    <Field label="Color Remarks">
                      <textarea
                        rows={4}
                        value={form.colorRemarks}
                        onChange={(e) =>
                          setValue("colorRemarks", e.target.value)
                        }
                        className={textareaClass}
                      />
                    </Field>
                  </div>
                </Section>

                {/* TAX */}

                <Section
                  title="Tax & Package"
                  description="GST, HSN and package information."
                >
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <NumberField
                      label="GST %"
                      value={form.gstPercentage}
                      onChange={(value) => setValue("gstPercentage", value)}
                    />

                    <TextField
                      label="HSN"
                      value={form.hsnId}
                      onChange={(value) => setValue("hsnId", value)}
                    />

                    <NumberField
                      label="Net Weight"
                      value={form.netWeight}
                      onChange={(value) => setValue("netWeight", value)}
                    />

                    <NumberField
                      label="Net Quantity"
                      value={form.netQuantity}
                      onChange={(value) => setValue("netQuantity", value)}
                    />

                    <TextField
                      label="Country of Origin"
                      value={form.countryOfOrigin}
                      onChange={(value) => setValue("countryOfOrigin", value)}
                    />

                    <TextField
                      label="Generic Name"
                      value={form.genericName}
                      onChange={(value) => setValue("genericName", value)}
                    />
                  </div>
                </Section>

                {/* MANUFACTURER */}

                <Section
                  title="Manufacturer & Packaging"
                  description="Legal manufacturer, packer and importer information."
                >
                  <PartyFields
                    title="Manufacturer"
                    name={form.manufacturerName}
                    address={form.manufacturerAddress}
                    pincode={form.manufacturerPincode}
                    onName={(value) => setValue("manufacturerName", value)}
                    onAddress={(value) =>
                      setValue("manufacturerAddress", value)
                    }
                    onPincode={(value) =>
                      setValue("manufacturerPincode", value)
                    }
                  />

                  <PartyFields
                    title="Packer"
                    name={form.packerName}
                    address={form.packerAddress}
                    pincode={form.packerPincode}
                    onName={(value) => setValue("packerName", value)}
                    onAddress={(value) => setValue("packerAddress", value)}
                    onPincode={(value) => setValue("packerPincode", value)}
                  />

                  <PartyFields
                    title="Importer"
                    name={form.importerName}
                    address={form.importerAddress}
                    pincode={form.importerPincode}
                    onName={(value) => setValue("importerName", value)}
                    onAddress={(value) => setValue("importerAddress", value)}
                    onPincode={(value) => setValue("importerPincode", value)}
                  />
                </Section>
              </div>

              {/* RIGHT SIDEBAR */}

              <aside className="space-y-6">
                {/* IMAGES */}

                <Section
                  title="Product Images"
                  description="Preview, remove or upload product images."
                >
                  <div className="space-y-5">
                    {/* EXISTING */}

                    {existingImages.length > 0 && (
                      <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Current Images
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                          {existingImages.map((image, index) => (
                            <div
                              key={`${image}-${index}`}
                              className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                            >
                              <img
                                src={image}
                                alt={`Product ${index + 1}`}
                                className="h-full w-full object-contain object-top"
                              />

                              <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
                                {index + 1}
                              </span>

                              {index === 0 && (
                                <span className="absolute bottom-2 left-2 rounded-md bg-red-600 px-2 py-1 text-[9px] font-bold uppercase text-white">
                                  Primary
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() => removeExistingImage(index)}
                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow-md transition hover:bg-red-600 hover:text-white"
                                title="Remove image"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* NEW PREVIEWS */}

                    {newImagePreviews.length > 0 && (
                      <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-600">
                          New Images
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                          {newImagePreviews.map((preview, index) => (
                            <div
                              key={preview}
                              className="group relative aspect-[3/4] overflow-hidden rounded-xl border-2 border-emerald-200 bg-slate-50"
                            >
                              <img
                                src={preview}
                                alt={`New image ${index + 1}`}
                                className="h-full w-full object-contain object-top"
                              />

                              <span className="absolute left-2 top-2 rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white">
                                NEW
                              </span>

                              <button
                                type="button"
                                onClick={() => removeNewImage(index)}
                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow-md transition hover:bg-red-600 hover:text-white"
                                title="Remove new image"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* UPLOAD */}

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-red-400 hover:bg-red-50/30">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                        <ImageIcon className="h-5 w-5 text-red-600" />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-800">
                        Upload Images
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Select one or multiple product images
                      </p>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>

                    <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                      Total after save:{" "}
                      <strong className="text-slate-800">
                        {existingImages.length + newImageFiles.length}
                      </strong>{" "}
                      images
                    </div>
                  </div>
                </Section>

                {/* PUBLISHING */}

                <Section
                  title="Publishing"
                  description="Control product visibility."
                >
                  <Field label="Publish Status">
                    <select
                      value={form.publishStatus}
                      onChange={(e) =>
                        setValue("publishStatus", e.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="draft">Draft</option>

                      <option value="pending">Pending Review</option>

                      <option value="approved">Approved</option>

                      <option value="rejected">Rejected</option>
                    </select>
                  </Field>

                  {form.publishStatus === "rejected" && (
                    <div className="mt-5">
                      <Field label="Rejection Reason">
                        <textarea
                          rows={4}
                          value={form.rejectionReason}
                          onChange={(e) =>
                            setValue("rejectionReason", e.target.value)
                          }
                          className={textareaClass}
                        />
                      </Field>
                    </div>
                  )}

                  <label className="mt-5 flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Active Product
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Allow this product to appear in the catalog.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setValue("isActive", e.target.checked)}
                      className="h-5 w-5 accent-red-600"
                    />
                  </label>
                </Section>

                {/* TAGS */}

                <Section
                  title="Tags"
                  description="Separate multiple tags with commas."
                >
                  <textarea
                    rows={4}
                    value={form.tags}
                    onChange={(e) => setValue("tags", e.target.value)}
                    placeholder="silk, wedding, festive"
                    className={textareaClass}
                  />
                </Section>

                {/* DATABASE ID */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-slate-400" />

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Product Database ID
                      </p>

                      <p className="mt-1 break-all text-xs text-slate-400">
                        {id}
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </form>
    </div>
  );
}

// ============================================================
// SECTION
// ============================================================

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      {children}
    </section>
  );
}

// ============================================================
// FIELD
// ============================================================

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
    <label className="block">
      <span className={labelClass}>
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      {children}
    </label>
  );
}

// ============================================================
// TEXT FIELD
// ============================================================

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </Field>
  );
}

// ============================================================
// NUMBER FIELD
// ============================================================

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        min="0"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </Field>
  );
}

// ============================================================
// MANUFACTURER / PACKER / IMPORTER
// ============================================================

function PartyFields({
  title,
  name,
  address,
  pincode,
  onName,
  onAddress,
  onPincode,
}: {
  title: string;
  name: string;
  address: string;
  pincode: string;
  onName: (value: string) => void;
  onAddress: (value: string) => void;
  onPincode: (value: string) => void;
}) {
  return (
    <div className="mb-7 last:mb-0">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
        {title}
      </h3>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <TextField label="Name" value={name} onChange={onName} />
        </div>

        <div className="lg:col-span-2">
          <TextField label="Address" value={address} onChange={onAddress} />
        </div>

        <TextField label="Pincode" value={pincode} onChange={onPincode} />
      </div>
    </div>
  );
}
