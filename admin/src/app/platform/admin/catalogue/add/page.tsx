"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  ImagePlus,
  Package,
  X,
  Loader2,
  Plus,
  Tag,
  DollarSign,
  Boxes,
  FileText,
  CheckCircle2,
  AlertCircle,
  Truck,
  Shirt,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useAddProductsMutation } from "@/store/api/productApi";
import { useGetBrandsQuery } from "@/store/api/brandApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { useGetColorsQuery } from "@/store/api/colorApi";
import { useGetSeasonsQuery } from "@/store/api/seasonApi";

// ============================================================
// FORM TYPE
// ============================================================

type ProductFormData = {
  title: string;
  description: string;

  brand: string;
  category: string;
  color: string;
  season: string;
  gender: "Womens" | "Unisex";
  collectionName: string;

  price: string;
  finalPrice: string;
  mrp: string;

  gstPercentage: string;
  hsnId: string;
  netWeight: string;
  netQuantity: string;
  countryOfOrigin: string;
  genericName: string;

  inventory: string;

  manufacturerName: string;
  manufacturerAddress: string;
  manufacturerPincode: string;

  packerName: string;
  packerAddress: string;
  packerPincode: string;

  importerName: string;
  importerAddress: string;
  importerPincode: string;

  blouse: string;
  blouseColor: string;
  blouseFabric: string;
  blousePattern: string;
  blouseLengthSize: string;

  border: string;
  borderWidth: string;

  colorRemarks: string;

  printOrPatternType: string;
  pattern: string;

  sareeFabric: string;
  sareeLengthSize: string;

  transparency: string;
  type: string;

  loomType: string;
  occasion: string;
  ornamentation: string;
  palluDetails: string;

  productId: string;
  styleId: string;
  skuId: string;
  groupId: string;

  tags: string;

  isActive: "true" | "false";
  publishStatus: "draft" | "pending" | "approved" | "rejected";

  rejectionReason: string;

  seller: string;
};

// ============================================================
// CATALOGUE OPTION TYPE
// ============================================================

type CatalogueOption = {
  _id: string;
  name: string;
};

// ============================================================
// IMAGE TYPE
// ============================================================

type ImagePreview = {
  id: string;
  file: File;
  preview: string;
};

// ============================================================
// CONSTANTS
// ============================================================

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

const MAX_IMAGES = 8;

// ============================================================
// NORMALIZE API RESPONSE
// ============================================================

const getCatalogueItems = (response: unknown): CatalogueOption[] => {
  if (Array.isArray(response)) {
    return response.filter(
      (item): item is CatalogueOption =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as { _id?: unknown })._id === "string" &&
        typeof (item as { name?: unknown }).name === "string",
    );
  }

  if (typeof response !== "object" || response === null) {
    return [];
  }

  const value = response as Record<string, unknown>;

  const possibleValues = [
    value.data,
    value.items,
    value.brands,
    value.categories,
    value.colors,
    value.seasons,
  ];

  for (const candidate of possibleValues) {
    if (Array.isArray(candidate)) {
      return getCatalogueItems(candidate);
    }

    if (candidate && typeof candidate === "object") {
      const nestedItems = getCatalogueItems(candidate);

      if (nestedItems.length > 0) {
        return nestedItems;
      }
    }
  }

  return [];
};

// ============================================================
// PAGE
// ============================================================

const Page = () => {
  const router = useRouter();

  const [addProducts, { isLoading: isAdding }] = useAddProductsMutation();

  const [images, setImages] = useState<ImagePreview[]>([]);

  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // ============================================================
  // CATALOGUE API
  // ============================================================

  const { data: brandsResponse, isLoading: brandsLoading } =
    useGetBrandsQuery();

  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const { data: colorsResponse, isLoading: colorsLoading } =
    useGetColorsQuery();

  const { data: seasonsResponse, isLoading: seasonsLoading } =
    useGetSeasonsQuery({});

  // ============================================================
  // NORMALIZED CATALOGUE DATA
  // ============================================================

  const brands = getCatalogueItems(brandsResponse);
  const categories = getCatalogueItems(categoriesResponse);
  const colors = getCatalogueItems(colorsResponse);
  const seasons = getCatalogueItems(seasonsResponse);

  // ============================================================
  // FORM
  // ============================================================

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      title: "",
      description: "",

      brand: "",
      category: "",
      color: "",
      season: "",
      gender: "Womens",
      collectionName: "",

      price: "",
      finalPrice: "",
      mrp: "",

      gstPercentage: "",
      hsnId: "",
      netWeight: "",
      netQuantity: "1",
      countryOfOrigin: "India",
      genericName: "Saree",

      inventory: "0",

      manufacturerName: "",
      manufacturerAddress: "",
      manufacturerPincode: "",

      packerName: "",
      packerAddress: "",
      packerPincode: "",

      importerName: "",
      importerAddress: "",
      importerPincode: "",

      blouse: "",
      blouseColor: "",
      blouseFabric: "",
      blousePattern: "",
      blouseLengthSize: "",

      border: "",
      borderWidth: "",

      colorRemarks: "",

      printOrPatternType: "",
      pattern: "",

      sareeFabric: "",
      sareeLengthSize: "",

      transparency: "",
      type: "",

      loomType: "",
      occasion: "",
      ornamentation: "",
      palluDetails: "",

      productId: "",
      styleId: "",
      skuId: "",
      groupId: "",

      tags: "",

      isActive: "true",
      publishStatus: "draft",

      rejectionReason: "",

      seller: "",
    },
  });

  // ============================================================
  // WATCH
  // ============================================================

  const price = watch("price");
  const finalPrice = watch("finalPrice");
  const mrp = watch("mrp");

  // ============================================================
  // IMAGE CLEANUP
  // ============================================================

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };

    // Cleanup only when component unmounts.
    // Individual images are revoked in removeImage().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================
  // IMAGE UPLOAD
  // ============================================================

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaveError("");

    const selectedFiles = Array.from(event.target.files ?? []);

    if (!selectedFiles.length) {
      return;
    }

    if (images.length + selectedFiles.length > MAX_IMAGES) {
      setSaveError(`You can upload a maximum of ${MAX_IMAGES} product images.`);

      event.target.value = "";
      return;
    }

    const validImages: ImagePreview[] = [];

    for (const file of selectedFiles) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setSaveError(`${file.name} is not a supported image format.`);
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setSaveError(`${file.name} is larger than 5MB.`);
        continue;
      }

      validImages.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      });
    }

    if (validImages.length) {
      setImages((previous) => [...previous, ...validImages]);
    }

    event.target.value = "";
  };

  // ============================================================
  // REMOVE IMAGE
  // ============================================================

  const removeImage = (id: string) => {
    setImages((previous) => {
      const imageToRemove = previous.find((image) => image.id === id);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return previous.filter((image) => image.id !== id);
    });
  };

  // ============================================================
  // MAKE PRIMARY IMAGE
  // ============================================================

  const makePrimaryImage = (id: string) => {
    setImages((previous) => {
      const selected = previous.find((image) => image.id === id);

      if (!selected) {
        return previous;
      }

      return [selected, ...previous.filter((image) => image.id !== id)];
    });
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const onSubmitProduct = async (data: ProductFormData) => {
    setSaveError("");
    setSuccessMessage("");

    try {
      // --------------------------------------------------------
      // IMAGE VALIDATION
      // --------------------------------------------------------

      if (!images.length) {
        setSaveError("Please upload at least one product image.");
        return;
      }

      // --------------------------------------------------------
      // PRICE
      // --------------------------------------------------------

      const numericPrice = Number(data.price);
      const numericFinalPrice = Number(data.finalPrice);
      const numericMrp = Number(data.mrp);

      if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
        setSaveError("Price must be greater than 0.");
        return;
      }

      if (!Number.isFinite(numericFinalPrice) || numericFinalPrice < 0) {
        setSaveError("Final price cannot be negative.");
        return;
      }

      if (numericFinalPrice > numericPrice) {
        setSaveError("Final price cannot be greater than price.");
        return;
      }

      if (!Number.isFinite(numericMrp) || numericMrp < numericPrice) {
        setSaveError("MRP must be greater than or equal to price.");
        return;
      }

      // --------------------------------------------------------
      // INVENTORY
      // --------------------------------------------------------

      const numericInventory = Number(data.inventory);

      if (!Number.isFinite(numericInventory) || numericInventory < 0) {
        setSaveError("Inventory cannot be negative.");
        return;
      }

      // --------------------------------------------------------
      // QUANTITY
      // --------------------------------------------------------

      const numericQuantity = Number(data.netQuantity);

      if (!Number.isFinite(numericQuantity) || numericQuantity < 1) {
        setSaveError("Net quantity must be at least 1.");
        return;
      }

      // --------------------------------------------------------
      // FORM DATA
      // --------------------------------------------------------

      const formData = new FormData();

      // ========================================================
      // BASIC
      // ========================================================

      formData.append("title", data.title.trim());

      formData.append("description", data.description.trim());

      // ========================================================
      // CATALOGUE
      // ========================================================

      formData.append("brand", data.brand.trim());

      formData.append("category", data.category.trim());

      formData.append("color", data.color.trim());

      formData.append("season", data.season.trim());

      formData.append("gender", data.gender);

      if (data.collectionName.trim()) {
        formData.append("collectionName", data.collectionName.trim());
      }

      // ========================================================
      // PRICING
      // ========================================================

      formData.append("price", String(numericPrice));

      formData.append("finalPrice", String(numericFinalPrice));

      formData.append("mrp", String(numericMrp));

      // ========================================================
      // TAX / PRODUCT
      // ========================================================

      if (data.gstPercentage.trim()) {
        const gst = Number(data.gstPercentage);

        if (!Number.isFinite(gst) || gst < 0 || gst > 100) {
          setSaveError("GST percentage must be between 0 and 100.");
          return;
        }

        formData.append("gstPercentage", String(gst));
      }

      if (data.hsnId.trim()) {
        formData.append("hsnId", data.hsnId.trim());
      }

      if (data.netWeight.trim()) {
        const weight = Number(data.netWeight);

        if (!Number.isFinite(weight) || weight < 0) {
          setSaveError("Net weight cannot be negative.");
          return;
        }

        formData.append("netWeight", String(weight));
      }

      formData.append("netQuantity", String(numericQuantity));

      formData.append("countryOfOrigin", data.countryOfOrigin.trim());

      if (data.genericName.trim()) {
        formData.append("genericName", data.genericName.trim());
      }

      // ========================================================
      // INVENTORY
      // ========================================================

      formData.append("inventory", String(numericInventory));

      // ========================================================
      // MANUFACTURER
      // ========================================================

      if (data.manufacturerName.trim()) {
        formData.append("manufacturerName", data.manufacturerName.trim());
      }

      if (data.manufacturerAddress.trim()) {
        formData.append("manufacturerAddress", data.manufacturerAddress.trim());
      }

      if (data.manufacturerPincode.trim()) {
        formData.append("manufacturerPincode", data.manufacturerPincode.trim());
      }

      // ========================================================
      // PACKER
      // ========================================================

      if (data.packerName.trim()) {
        formData.append("packerName", data.packerName.trim());
      }

      if (data.packerAddress.trim()) {
        formData.append("packerAddress", data.packerAddress.trim());
      }

      if (data.packerPincode.trim()) {
        formData.append("packerPincode", data.packerPincode.trim());
      }

      // ========================================================
      // IMPORTER
      // ========================================================

      if (data.importerName.trim()) {
        formData.append("importerName", data.importerName.trim());
      }

      if (data.importerAddress.trim()) {
        formData.append("importerAddress", data.importerAddress.trim());
      }

      if (data.importerPincode.trim()) {
        formData.append("importerPincode", data.importerPincode.trim());
      }

      // ========================================================
      // SAREE DETAILS
      // ========================================================

      const optionalStringFields = [
        "blouse",
        "blouseColor",
        "blouseFabric",
        "blousePattern",
        "border",
        "colorRemarks",
        "printOrPatternType",
        "pattern",
        "sareeFabric",
        "transparency",
        "type",
        "loomType",
        "occasion",
        "ornamentation",
        "palluDetails",
      ] as const;

      optionalStringFields.forEach((field) => {
        const value = data[field].trim();

        if (value) {
          formData.append(field, value);
        }
      });

      if (data.blouseLengthSize.trim()) {
        const value = Number(data.blouseLengthSize);

        if (!Number.isFinite(value) || value < 0) {
          setSaveError("Blouse length cannot be negative.");
          return;
        }

        formData.append("blouseLengthSize", String(value));
      }

      if (data.borderWidth.trim()) {
        const value = Number(data.borderWidth);

        if (!Number.isFinite(value) || value < 0) {
          setSaveError("Border width cannot be negative.");
          return;
        }

        formData.append("borderWidth", String(value));
      }

      if (data.sareeLengthSize.trim()) {
        const value = Number(data.sareeLengthSize);

        if (!Number.isFinite(value) || value < 0) {
          setSaveError("Saree length cannot be negative.");
          return;
        }

        formData.append("sareeLengthSize", String(value));
      }

      // ========================================================
      // PRODUCT IDENTIFICATION
      // ========================================================

      const identificationFields = [
        "productId",
        "styleId",
        "skuId",
        "groupId",
      ] as const;

      identificationFields.forEach((field) => {
        const value = data[field].trim();

        if (value) {
          formData.append(field, value);
        }
      });

      // ========================================================
      // TAGS
      // ========================================================

      if (data.tags.trim()) {
        const tags = data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);

        tags.forEach((tag) => {
          formData.append("tags", tag);
        });
      }

      // ========================================================
      // STATUS
      // ========================================================

      formData.append("isActive", String(data.isActive === "true"));

      formData.append("publishStatus", data.publishStatus);

      if (data.rejectionReason.trim()) {
        formData.append("rejectionReason", data.rejectionReason.trim());
      }

      // ========================================================
      // SELLER
      // ========================================================

      formData.append("seller", data.seller.trim());

      // ========================================================
      // IMAGES
      // ========================================================

      images.forEach((image) => {
        formData.append("images", image.file);
      });

      // ========================================================
      // API
      // ========================================================

      await addProducts(formData).unwrap();

      setSuccessMessage("Saree product created successfully.");

      setTimeout(() => {
        router.push("/platform/admin/catalogue");
      }, 700);
    } catch (error: unknown) {
      console.error("Failed to create product:", error);

      setSaveError(
        "Failed to create product. Please check your information and try again.",
      );
    }
  };

  // ============================================================
  // CANCEL
  // ============================================================

  const handleCancel = () => {
    if (isAdding) {
      return;
    }

    router.push("/platform/admin/catalogue");
  };

  // ============================================================
  // INPUT CLASSES
  // ============================================================

  const inputClass =
    "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-slate-50";

  const textareaClass =
    "w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-slate-50";

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">
          <button
            type="button"
            onClick={handleCancel}
            className="mb-5 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catalogue
          </button>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-600" />

                <span className="text-sm font-semibold uppercase tracking-wider text-red-600">
                  Saree Catalogue
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Add New Saree
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Create a saree product with pricing, inventory, manufacturer
                details and saree-specific attributes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/platform/admin/catalogue/import";
              }}
              className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <Plus className="h-4 w-4" />
              Import Template
            </button>
          </div>
        </div>
        {/* ======================================================
            SUCCESS
        ====================================================== */}

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />

            <p className="text-sm font-semibold text-emerald-700">
              {successMessage}
            </p>
          </div>
        )}

        {/* ======================================================
            ERROR
        ====================================================== */}

        {saveError && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />

            <p className="text-sm font-medium text-red-700">{saveError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmitProduct)}>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* ==================================================
                MAIN
            ================================================== */}

            <div className="space-y-6 xl:col-span-2">
              {/* ==================================================
                  BASIC INFORMATION
              ================================================== */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Package className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Basic Information
                      </h2>

                      <p className="text-sm text-slate-500">
                        Basic saree information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 px-6 py-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Product Title
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Women's Banarasi Silk Saree"
                      disabled={isAdding}
                      {...register("title", {
                        required: "Product title is required",
                        minLength: {
                          value: 2,
                          message: "Title must be at least 2 characters",
                        },
                        maxLength: {
                          value: 150,
                          message: "Title cannot exceed 150 characters",
                        },
                      })}
                      className={inputClass}
                    />

                    {errors.title && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Product Description
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <textarea
                      rows={6}
                      placeholder="Describe the saree, fabric, design, work, occasion and other details."
                      disabled={isAdding}
                      {...register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 10,
                          message: "Description must be at least 10 characters",
                        },
                        maxLength: {
                          value: 3000,
                          message: "Description cannot exceed 3000 characters",
                        },
                      })}
                      className={textareaClass}
                    />

                    {errors.description && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Gender
                      </label>

                      <select
                        disabled={isAdding}
                        {...register("gender")}
                        className={inputClass}
                      >
                        <option value="Womens">Womens</option>

                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Collection Name
                      </label>

                      <input
                        type="text"
                        placeholder="e.g. Festive Collection"
                        disabled={isAdding}
                        {...register("collectionName")}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* ==================================================
                  CATALOGUE
              ================================================== */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <Tag className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">Catalogue</h2>

                      <p className="text-sm text-slate-500">
                        Select catalogue references.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">
                  {/* BRAND */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Brand <span className="text-red-500">*</span>
                    </label>

                    <select
                      disabled={isAdding || brandsLoading}
                      {...register("brand", {
                        required: "Brand is required",
                      })}
                      className={inputClass}
                    >
                      <option value="">
                        {brandsLoading
                          ? "Loading brands..."
                          : brands.length === 0
                            ? "No brands found"
                            : "Select brand"}
                      </option>

                      {brands.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    {errors.brand && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.brand.message}
                      </p>
                    )}
                  </div>

                  {/* CATEGORY */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Category <span className="text-red-500">*</span>
                    </label>

                    <select
                      disabled={isAdding || categoriesLoading}
                      {...register("category", {
                        required: "Category is required",
                      })}
                      className={inputClass}
                    >
                      <option value="">
                        {categoriesLoading
                          ? "Loading categories..."
                          : categories.length === 0
                            ? "No categories found"
                            : "Select category"}
                      </option>

                      {categories.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    {errors.category && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* COLOR */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Color <span className="text-red-500">*</span>
                    </label>

                    <select
                      disabled={isAdding || colorsLoading}
                      {...register("color", {
                        required: "Color is required",
                      })}
                      className={inputClass}
                    >
                      <option value="">
                        {colorsLoading
                          ? "Loading colors..."
                          : colors.length === 0
                            ? "No colors found"
                            : "Select color"}
                      </option>

                      {colors.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    {errors.color && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.color.message}
                      </p>
                    )}
                  </div>

                  {/* SEASON */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Season <span className="text-red-500">*</span>
                    </label>

                    <select
                      disabled={isAdding || seasonsLoading}
                      {...register("season", {
                        required: "Season is required",
                      })}
                      className={inputClass}
                    >
                      <option value="">
                        {seasonsLoading
                          ? "Loading seasons..."
                          : seasons.length === 0
                            ? "No seasons found"
                            : "Select season"}
                      </option>

                      {seasons.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    {errors.season && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.season.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* ==================================================
                  PRICING
              ================================================== */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <DollarSign className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">Pricing</h2>

                      <p className="text-sm text-slate-500">
                        Set price, final price and MRP.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Price *
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      disabled={isAdding}
                      {...register("price", {
                        required: "Price is required",
                        min: {
                          value: 0,
                          message: "Price cannot be negative",
                        },
                      })}
                      className={inputClass}
                    />

                    {errors.price && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.price.message}
                      </p>
                    )}

                    <p className="mt-1.5 text-xs text-slate-400">
                      Regular selling price.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Final Price *
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      disabled={isAdding}
                      {...register("finalPrice", {
                        required: "Final price is required",
                        min: {
                          value: 0,
                          message: "Final price cannot be negative",
                        },
                      })}
                      className={inputClass}
                    />

                    {errors.finalPrice && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.finalPrice.message}
                      </p>
                    )}

                    <p className="mt-1.5 text-xs text-slate-400">
                      Must be ≤ price.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      MRP *
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      disabled={isAdding}
                      {...register("mrp", {
                        required: "MRP is required",
                        min: {
                          value: 0,
                          message: "MRP cannot be negative",
                        },
                      })}
                      className={inputClass}
                    />

                    {errors.mrp && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.mrp.message}
                      </p>
                    )}

                    <p className="mt-1.5 text-xs text-slate-400">
                      Must be ≥ price.
                    </p>
                  </div>
                </div>

                {price &&
                  finalPrice &&
                  Number(finalPrice) < Number(price) &&
                  Number(price) > 0 && (
                    <div className="px-6 pb-6">
                      <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        Discount:{" "}
                        {Math.round(
                          ((Number(price) - Number(finalPrice)) /
                            Number(price)) *
                            100,
                        )}
                        %
                      </div>
                    </div>
                  )}

                {price && mrp && Number(mrp) < Number(price) && (
                  <div className="px-6 pb-6">
                    <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      MRP must be greater than or equal to price.
                    </div>
                  </div>
                )}
              </section>

              {/* ==================================================
                  TAX / PRODUCT
              ================================================== */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Tax & Product Information
                      </h2>

                      <p className="text-sm text-slate-500">
                        Product tax and quantity details.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      GST %
                    </label>

                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="e.g. 5"
                      disabled={isAdding}
                      {...register("gstPercentage")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      HSN ID
                    </label>

                    <input
                      type="text"
                      placeholder="HSN code"
                      disabled={isAdding}
                      {...register("hsnId")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Net Quantity *
                    </label>

                    <input
                      type="number"
                      min="1"
                      placeholder="1"
                      disabled={isAdding}
                      {...register("netQuantity", {
                        required: "Net quantity is required",
                      })}
                      className={inputClass}
                    />

                    {errors.netQuantity && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.netQuantity.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Net Weight (g)
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Weight in grams"
                      disabled={isAdding}
                      {...register("netWeight")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Country of Origin
                    </label>

                    <input
                      type="text"
                      placeholder="India"
                      disabled={isAdding}
                      {...register("countryOfOrigin")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Generic Name
                    </label>

                    <input
                      type="text"
                      placeholder="Saree"
                      disabled={isAdding}
                      {...register("genericName")}
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>

              {/* ==================================================
                  SAREE DETAILS
              ================================================== */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                      <Shirt className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Saree Details
                      </h2>

                      <p className="text-sm text-slate-500">
                        Saree-specific product attributes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Saree Fabric
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Silk"
                      disabled={isAdding}
                      {...register("sareeFabric")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Saree Length (m)
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 5.5"
                      disabled={isAdding}
                      {...register("sareeLengthSize")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Blouse
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Unstitched"
                      disabled={isAdding}
                      {...register("blouse")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Blouse Color
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Red"
                      disabled={isAdding}
                      {...register("blouseColor")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Blouse Fabric
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Silk"
                      disabled={isAdding}
                      {...register("blouseFabric")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Blouse Pattern
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Printed"
                      disabled={isAdding}
                      {...register("blousePattern")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Blouse Length (m)
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 0.8"
                      disabled={isAdding}
                      {...register("blouseLengthSize")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Border
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Zari Border"
                      disabled={isAdding}
                      {...register("border")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Border Width
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Border width"
                      disabled={isAdding}
                      {...register("borderWidth")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Print / Pattern Type
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Floral"
                      disabled={isAdding}
                      {...register("printOrPatternType")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Pattern
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Printed"
                      disabled={isAdding}
                      {...register("pattern")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Transparency
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. No Transparency"
                      disabled={isAdding}
                      {...register("transparency")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Type
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Designer"
                      disabled={isAdding}
                      {...register("type")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Loom Type
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Handloom"
                      disabled={isAdding}
                      {...register("loomType")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Occasion
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Wedding"
                      disabled={isAdding}
                      {...register("occasion")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Ornamentation
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Zari"
                      disabled={isAdding}
                      {...register("ornamentation")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Pallu Details
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Designer Pallu"
                      disabled={isAdding}
                      {...register("palluDetails")}
                      className={inputClass}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Color Remarks
                    </label>

                    <input
                      type="text"
                      placeholder="Additional color information"
                      disabled={isAdding}
                      {...register("colorRemarks")}
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>

              {/* ==================================================
                  MANUFACTURER / PACKER / IMPORTER
              ================================================== */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <Truck className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Manufacturer, Packer & Importer
                      </h2>

                      <p className="text-sm text-slate-500">
                        Legal product information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 px-6 py-6">
                  {/* MANUFACTURER */}

                  <div>
                    <h3 className="mb-4 text-sm font-bold text-slate-900">
                      Manufacturer
                    </h3>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Manufacturer Name"
                        disabled={isAdding}
                        {...register("manufacturerName")}
                        className={inputClass}
                      />

                      <input
                        type="text"
                        placeholder="Manufacturer Pincode"
                        disabled={isAdding}
                        {...register("manufacturerPincode", {
                          pattern: {
                            value: /^[1-9][0-9]{5}$/,
                            message: "Invalid pincode",
                          },
                        })}
                        className={inputClass}
                      />

                      <textarea
                        rows={3}
                        placeholder="Manufacturer Address"
                        disabled={isAdding}
                        {...register("manufacturerAddress")}
                        className={`${textareaClass} md:col-span-2`}
                      />
                    </div>
                  </div>

                  {/* PACKER */}

                  <div>
                    <h3 className="mb-4 text-sm font-bold text-slate-900">
                      Packer
                    </h3>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Packer Name"
                        disabled={isAdding}
                        {...register("packerName")}
                        className={inputClass}
                      />

                      <input
                        type="text"
                        placeholder="Packer Pincode"
                        disabled={isAdding}
                        {...register("packerPincode", {
                          pattern: {
                            value: /^[1-9][0-9]{5}$/,
                            message: "Invalid pincode",
                          },
                        })}
                        className={inputClass}
                      />

                      <textarea
                        rows={3}
                        placeholder="Packer Address"
                        disabled={isAdding}
                        {...register("packerAddress")}
                        className={`${textareaClass} md:col-span-2`}
                      />
                    </div>
                  </div>

                  {/* IMPORTER */}

                  <div>
                    <h3 className="mb-4 text-sm font-bold text-slate-900">
                      Importer
                    </h3>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Importer Name"
                        disabled={isAdding}
                        {...register("importerName")}
                        className={inputClass}
                      />

                      <input
                        type="text"
                        placeholder="Importer Pincode"
                        disabled={isAdding}
                        {...register("importerPincode", {
                          pattern: {
                            value: /^[1-9][0-9]{5}$/,
                            message: "Invalid pincode",
                          },
                        })}
                        className={inputClass}
                      />

                      <textarea
                        rows={3}
                        placeholder="Importer Address"
                        disabled={isAdding}
                        {...register("importerAddress")}
                        className={`${textareaClass} md:col-span-2`}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* ==================================================
                  PRODUCT IDENTIFICATION
              ================================================== */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <h2 className="font-bold text-slate-900">
                    Product Identification
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    IDs used to identify and group sarees.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Product ID"
                    disabled={isAdding}
                    {...register("productId")}
                    className={inputClass}
                  />

                  <input
                    type="text"
                    placeholder="Style ID"
                    disabled={isAdding}
                    {...register("styleId")}
                    className={inputClass}
                  />

                  <input
                    type="text"
                    placeholder="SKU ID"
                    disabled={isAdding}
                    {...register("skuId")}
                    className={inputClass}
                  />

                  <input
                    type="text"
                    placeholder="Group ID"
                    disabled={isAdding}
                    {...register("groupId")}
                    className={inputClass}
                  />

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Tags
                    </label>

                    <input
                      type="text"
                      placeholder="silk, wedding, banarasi, festive"
                      disabled={isAdding}
                      {...register("tags")}
                      className={inputClass}
                    />

                    <p className="mt-1.5 text-xs text-slate-400">
                      Separate tags with commas.
                    </p>
                  </div>
                </div>
              </section>

              {/* ==================================================
                  IMAGES
              ================================================== */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                        <ImagePlus className="h-5 w-5" />
                      </div>

                      <div>
                        <h2 className="font-bold text-slate-900">
                          Product Images
                        </h2>

                        <p className="text-sm text-slate-500">
                          First image is the primary image.
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-medium text-slate-400">
                      {images.length}/{MAX_IMAGES}
                    </span>
                  </div>
                </div>

                <div className="px-6 py-6">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    disabled={isAdding || images.length >= MAX_IMAGES}
                    onChange={handleImagesChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    disabled={isAdding || images.length >= MAX_IMAGES}
                    onClick={() => imageInputRef.current?.click()}
                    className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 transition hover:border-red-400 hover:bg-red-50/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                      <ImagePlus className="h-6 w-6" />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-700">
                      Click to upload saree images
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      PNG, JPG, JPEG or WebP · Maximum 5MB each
                    </p>
                  </button>

                  {images.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {images.map((image, index) => (
                        <div
                          key={image.id}
                          className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                        >
                          <div className="aspect-square">
                            <img
                              src={image.preview}
                              alt={`Saree image ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          {index === 0 && (
                            <div className="absolute left-2 top-2 rounded-md bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                              Primary
                            </div>
                          )}

                          <button
                            type="button"
                            disabled={isAdding}
                            onClick={() => removeImage(image.id)}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-red-500 opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </button>

                          {index !== 0 && (
                            <button
                              type="button"
                              disabled={isAdding}
                              onClick={() => makePrimaryImage(image.id)}
                              className="absolute bottom-2 left-2 right-2 rounded-lg bg-white/90 px-2 py-1.5 text-[10px] font-semibold text-slate-700 opacity-0 shadow-sm transition group-hover:opacity-100"
                            >
                              Make Primary
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {!images.length && (
                    <p className="mt-4 text-center text-xs text-slate-400">
                      At least one image is required.
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <div className="space-y-6">
              {/* ==================================================
                  INVENTORY
              ================================================== */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <Boxes className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">Inventory</h2>

                      <p className="text-xs text-slate-500">Current stock.</p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Inventory Quantity *
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    disabled={isAdding}
                    {...register("inventory", {
                      required: "Inventory is required",
                    })}
                    className={inputClass}
                  />

                  {errors.inventory && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.inventory.message}
                    </p>
                  )}
                </div>
              </section>

              {/* ==================================================
                  STATUS
              ================================================== */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Product Status
                      </h2>

                      <p className="text-xs text-slate-500">
                        Control product visibility.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 px-5 py-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Active
                    </label>

                    <select
                      disabled={isAdding}
                      {...register("isActive")}
                      className={inputClass}
                    >
                      <option value="true">Active</option>

                      <option value="false">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Publish Status
                    </label>

                    <select
                      disabled={isAdding}
                      {...register("publishStatus")}
                      className={inputClass}
                    >
                      <option value="draft">Draft</option>

                      <option value="pending">Pending</option>

                      <option value="approved">Approved</option>

                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Seller *
                    </label>

                    <input
                      type="text"
                      placeholder="Seller ID"
                      disabled={isAdding}
                      {...register("seller", {
                        required: "Seller is required",
                      })}
                      className={inputClass}
                    />

                    {errors.seller && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.seller.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Rejection Reason
                    </label>

                    <textarea
                      rows={3}
                      placeholder="Only required if rejected"
                      disabled={isAdding}
                      {...register("rejectionReason")}
                      className={textareaClass}
                    />
                  </div>
                </div>
              </section>

              {/* ==================================================
                  SUMMARY
              ================================================== */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-5">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-slate-600" />

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Product Summary
                      </h2>

                      <p className="text-xs text-slate-500">
                        Review before creating.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  <div className="flex items-center justify-between px-5 py-4">
                    <span className="text-sm text-slate-500">Images</span>

                    <span className="text-sm font-semibold text-slate-900">
                      {images.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-5 py-4">
                    <span className="text-sm text-slate-500">Price</span>

                    <span className="text-sm font-semibold text-slate-900">
                      {price
                        ? `₹${Number(price).toLocaleString("en-IN")}`
                        : "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-5 py-4">
                    <span className="text-sm text-slate-500">Final Price</span>

                    <span className="text-sm font-semibold text-emerald-600">
                      {finalPrice
                        ? `₹${Number(finalPrice).toLocaleString("en-IN")}`
                        : "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-5 py-4">
                    <span className="text-sm text-slate-500">MRP</span>

                    <span className="text-sm font-semibold text-slate-900">
                      {mrp ? `₹${Number(mrp).toLocaleString("en-IN")}` : "—"}
                    </span>
                  </div>
                </div>
              </section>

              {/* ==================================================
                  HELP
              ================================================== */}

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />

                  <div>
                    <p className="text-xs font-semibold text-blue-800">
                      Saree listing tip
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-700">
                      Use a clear front image as the first image. The first
                      uploaded image becomes the primary image.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================
              ACTIONS
          ====================================================== */}

          <div className="sticky bottom-0 z-20 mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={isAdding}
              onClick={handleCancel}
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>

            <button
              type="submit"
              disabled={isAdding}
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAdding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Saree...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Saree
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Page;
