import { Request, Response } from "express";
import Product from "../models/Product";
import { response } from "../utils/responseHandler";
import { uploadFileToCloudinary } from "../config/cloudnaryConfig";

// ============================================================
// CREATE PRODUCT
// ============================================================

export const createProduct = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.id;

    const {
      title,
      description,

      slug,

      brand,
      category,
      color,
      season,
      gender,
      collectionName,

      price,
      finalPrice,
      mrp,

      gstPercentage,
      hsnId,
      netWeight,
      netQuantity,
      countryOfOrigin,
      genericName,

      inventory,

      manufacturerName,
      manufacturerAddress,
      manufacturerPincode,

      packerName,
      packerAddress,
      packerPincode,

      importerName,
      importerAddress,
      importerPincode,

      blouse,
      blouseColor,
      blouseFabric,
      blousePattern,
      blouseLengthSize,

      border,
      borderWidth,

      colorRemarks,

      printOrPatternType,
      pattern,

      sareeFabric,
      sareeLengthSize,

      transparency,
      type,

      loomType,
      occasion,
      ornamentation,
      palluDetails,

      productId,
      styleId,
      skuId,
      groupId,

      tags,

      isActive,
      publishStatus,
      rejectionReason,
    } = req.body;

    // ============================================================
    // FILES
    // ============================================================

    const images = req.files as Express.Multer.File[];

    if (!images || images.length === 0) {
      return response(res, 400, "At least one product image is required");
    }

    // ============================================================
    // REQUIRED FIELDS
    // ============================================================

    if (!title?.trim()) {
      return response(res, 400, "Product title is required");
    }

    if (!description?.trim()) {
      return response(res, 400, "Product description is required");
    }

    if (!brand) {
      return response(res, 400, "Brand is required");
    }

    if (!category) {
      return response(res, 400, "Category is required");
    }

    if (!color) {
      return response(res, 400, "Color is required");
    }

    if (!season) {
      return response(res, 400, "Season is required");
    }

    // ============================================================
    // PARSE NUMBERS
    // ============================================================

    const numericPrice = Number(price);
    const numericFinalPrice = Number(finalPrice);
    const numericMrp = Number(mrp);

    const numericInventory = Number(inventory ?? 0);
    const numericNetQuantity = Number(netQuantity ?? 1);

    const numericGstPercentage =
      gstPercentage !== undefined && gstPercentage !== ""
        ? Number(gstPercentage)
        : undefined;

    const numericNetWeight =
      netWeight !== undefined && netWeight !== ""
        ? Number(netWeight)
        : undefined;

    const numericBlouseLengthSize =
      blouseLengthSize !== undefined && blouseLengthSize !== ""
        ? Number(blouseLengthSize)
        : undefined;

    const numericBorderWidth =
      borderWidth !== undefined && borderWidth !== ""
        ? Number(borderWidth)
        : undefined;

    const numericSareeLengthSize =
      sareeLengthSize !== undefined && sareeLengthSize !== ""
        ? Number(sareeLengthSize)
        : undefined;

    // ============================================================
    // PRICE VALIDATION
    // ============================================================

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return response(res, 400, "Price must be greater than 0");
    }

    if (!Number.isFinite(numericFinalPrice) || numericFinalPrice < 0) {
      return response(res, 400, "Final price must be 0 or greater");
    }

    if (!Number.isFinite(numericMrp) || numericMrp < 0) {
      return response(res, 400, "MRP must be 0 or greater");
    }

    if (numericFinalPrice > numericPrice) {
      return response(res, 400, "Final price cannot be greater than price");
    }

    if (numericPrice > numericMrp) {
      return response(res, 400, "MRP must be greater than or equal to price");
    }

    // ============================================================
    // INVENTORY VALIDATION
    // ============================================================

    if (!Number.isFinite(numericInventory) || numericInventory < 0) {
      return response(res, 400, "Inventory cannot be negative");
    }

    if (!Number.isFinite(numericNetQuantity) || numericNetQuantity < 1) {
      return response(res, 400, "Net quantity must be at least 1");
    }

    // ============================================================
    // UPLOAD IMAGES
    // ============================================================

    const uploadPromises = images.map((file) =>
      uploadFileToCloudinary(file as any),
    );

    const uploadedImages = await Promise.all(uploadPromises);

    const imageUrls = uploadedImages.map((image) => image.secure_url);

    if (!imageUrls.length) {
      return response(res, 400, "Failed to upload product images");
    }

    // ============================================================
    // PARSE TAGS
    // ============================================================

    let parsedTags: string[] = [];

    if (tags) {
      if (Array.isArray(tags)) {
        parsedTags = tags.map((tag) => String(tag).trim()).filter(Boolean);
      } else if (typeof tags === "string") {
        try {
          const jsonTags = JSON.parse(tags);

          if (Array.isArray(jsonTags)) {
            parsedTags = jsonTags
              .map((tag) => String(tag).trim())
              .filter(Boolean);
          } else {
            parsedTags = tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean);
          }
        } catch {
          parsedTags = tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
        }
      }
    }

    // ============================================================
    // CREATE PRODUCT
    // ============================================================

    const product = new Product({
      title: title.trim(),

      // Slug is automatically generated by Product schema
      ...(slug?.trim() ? { slug: slug.trim() } : {}),

      description: description.trim(),

      brand,
      category,
      color,
      season,

      gender: gender || "Womens",
      collectionName: collectionName?.trim(),

      // Pricing
      price: numericPrice,
      finalPrice: numericFinalPrice,
      mrp: numericMrp,

      // Tax / Product Information
      gstPercentage: numericGstPercentage,
      hsnId: hsnId?.trim(),
      netWeight: numericNetWeight,
      netQuantity: numericNetQuantity,
      countryOfOrigin: countryOfOrigin?.trim() || "India",
      genericName: genericName?.trim(),

      // Inventory
      inventory: numericInventory,

      // Manufacturer
      manufacturerName: manufacturerName?.trim(),
      manufacturerAddress: manufacturerAddress?.trim(),
      manufacturerPincode: manufacturerPincode?.trim(),

      // Packer
      packerName: packerName?.trim(),
      packerAddress: packerAddress?.trim(),
      packerPincode: packerPincode?.trim(),

      // Importer
      importerName: importerName?.trim(),
      importerAddress: importerAddress?.trim(),
      importerPincode: importerPincode?.trim(),

      // Saree Details
      blouse: blouse?.trim(),
      blouseColor: blouseColor?.trim(),
      blouseFabric: blouseFabric?.trim(),
      blousePattern: blousePattern?.trim(),
      blouseLengthSize: numericBlouseLengthSize,

      border: border?.trim(),
      borderWidth: numericBorderWidth,

      colorRemarks: colorRemarks?.trim(),

      printOrPatternType: printOrPatternType?.trim(),
      pattern: pattern?.trim(),

      sareeFabric: sareeFabric?.trim(),
      sareeLengthSize: numericSareeLengthSize,

      transparency: transparency?.trim(),
      type: type?.trim(),

      loomType: loomType?.trim(),
      occasion: occasion?.trim(),
      ornamentation: ornamentation?.trim(),
      palluDetails: palluDetails?.trim(),

      // Product Identification
      productId: productId?.trim(),
      styleId: styleId?.trim(),
      skuId: skuId?.trim(),
      groupId: groupId?.trim(),

      // Media
      images: imageUrls,
      videos: [],

      // Search
      tags: parsedTags,

      // Status
      isActive:
        isActive === undefined
          ? true
          : isActive === true || isActive === "true",

      publishStatus: publishStatus || "draft",

      rejectionReason: rejectionReason?.trim(),

      // Reviews
      rating: 0,
      numReviews: 0,

      // Seller
      seller: loggedInUser,
    });

    await product.save();

    return response(res, 201, "Product created successfully", product);
  } catch (error: unknown) {
    console.error("====================================");
    console.error("CREATE PRODUCT ERROR");
    console.error(error);
    console.error("====================================");

    const message =
      error instanceof Error ? error.message : "Error creating product";

    return response(res, 500, message);
  }
};

// ============================================================
// GET ALL PRODUCTS
// ============================================================

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("brand", "name slug")
      .populate("color", "name slug")
      .populate("category", "name slug")
      .populate("season", "name slug");

    return response(res, 200, "Products fetched successfully", products);
  } catch (error: unknown) {
    console.error("Error fetching products:", error);

    return response(res, 500, "Error fetching products");
  }
};

// ============================================================
// UPDATE PRODUCT
// ============================================================

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // ============================================================
    // FIND PRODUCT
    // ============================================================

    const product = await Product.findById(id);

    if (!product) {
      return response(res, 404, "Product not found");
    }

    // ============================================================
    // PRODUCT IMAGES
    // ============================================================

    const newImages = (req.files as Express.Multer.File[]) || [];

    let keptImages: string[] = [];

    // If keepImages was sent by frontend,
    // only keep URLs already belonging to this product.
    if (req.body.keepImages !== undefined) {
      try {
        const parsedKeepImages =
          typeof req.body.keepImages === "string"
            ? JSON.parse(req.body.keepImages)
            : req.body.keepImages;

        if (!Array.isArray(parsedKeepImages)) {
          return response(res, 400, "Invalid existing image data");
        }

        const currentImages: string[] = Array.isArray(product.images)
          ? product.images.map((image: unknown) => String(image))
          : [];

        keptImages = parsedKeepImages
          .map((image: unknown) => String(image))
          .filter((image: string) => currentImages.includes(image));
      } catch {
        return response(res, 400, "Invalid existing image data");
      }
    } else {
      // keepImages not supplied:
      // preserve all current images.
      keptImages = Array.isArray(product.images)
        ? product.images.map((image: unknown) => String(image))
        : [];
    }

    // ============================================================
    // UPLOAD NEW IMAGES
    // ============================================================

    let newImageUrls: string[] = [];

    if (newImages.length > 0) {
      try {
        const uploadedImages = await Promise.all(
          newImages.map((file) => uploadFileToCloudinary(file as any)),
        );

        newImageUrls = uploadedImages
          .map((image) => image.secure_url)
          .filter(
            (url): url is string =>
              typeof url === "string" && url.trim().length > 0,
          );
      } catch (uploadError) {
        console.error("Error uploading product images:", uploadError);

        return response(res, 500, "Failed to upload product images");
      }
    }

    const finalImages = [...keptImages, ...newImageUrls];

    if (finalImages.length === 0) {
      return response(res, 400, "At least one product image is required");
    }

    // ============================================================
    // REQUEST BODY
    // ============================================================

    const {
      title,
      description,
      slug,

      brand,
      category,
      color,
      season,
      gender,
      collectionName,

      price,
      finalPrice,
      mrp,

      gstPercentage,
      hsnId,
      netWeight,
      netQuantity,
      countryOfOrigin,
      genericName,

      inventory,

      manufacturerName,
      manufacturerAddress,
      manufacturerPincode,

      packerName,
      packerAddress,
      packerPincode,

      importerName,
      importerAddress,
      importerPincode,

      blouse,
      blouseColor,
      blouseFabric,
      blousePattern,
      blouseLengthSize,

      border,
      borderWidth,

      colorRemarks,

      printOrPatternType,
      pattern,

      sareeFabric,
      sareeLengthSize,

      transparency,
      type,

      loomType,
      occasion,
      ornamentation,
      palluDetails,

      productId,
      styleId,
      skuId,
      groupId,

      tags,

      isActive,
      publishStatus,
      rejectionReason,
    } = req.body;

    // ============================================================
    // REQUIRED FIELD VALIDATION
    // ============================================================

    if (title !== undefined && !String(title).trim()) {
      return response(res, 400, "Product title is required");
    }

    if (description !== undefined && !String(description).trim()) {
      return response(res, 400, "Product description is required");
    }

    if (brand !== undefined && !String(brand).trim()) {
      return response(res, 400, "Brand is required");
    }

    if (category !== undefined && !String(category).trim()) {
      return response(res, 400, "Category is required");
    }

    if (color !== undefined && !String(color).trim()) {
      return response(res, 400, "Color is required");
    }

    if (season !== undefined && !String(season).trim()) {
      return response(res, 400, "Season is required");
    }

    // ============================================================
    // PRICE VALIDATION
    //
    // Required relationship:
    //
    // finalPrice <= price <= mrp
    //
    // Example:
    // finalPrice = 839
    // price      = 1899
    // mrp        = 2999
    // ============================================================

    const nextPrice =
      price !== undefined ? Number(price) : Number(product.price);

    const nextFinalPrice =
      finalPrice !== undefined
        ? Number(finalPrice)
        : Number(product.finalPrice);

    const nextMrp = mrp !== undefined ? Number(mrp) : Number(product.mrp);

    if (!Number.isFinite(nextPrice) || nextPrice < 0) {
      return response(res, 400, "Price must be 0 or greater");
    }

    if (!Number.isFinite(nextFinalPrice) || nextFinalPrice < 0) {
      return response(res, 400, "Final price must be 0 or greater");
    }

    if (!Number.isFinite(nextMrp) || nextMrp < 0) {
      return response(res, 400, "MRP must be 0 or greater");
    }

    if (nextFinalPrice > nextPrice) {
      return response(res, 400, "Final price cannot be greater than price");
    }

    if (nextMrp < nextPrice) {
      return response(res, 400, "MRP must be greater than or equal to price");
    }

    // ============================================================
    // INVENTORY
    // ============================================================

    let numericInventory: number | undefined;

    if (inventory !== undefined) {
      numericInventory = Number(inventory);

      if (!Number.isFinite(numericInventory) || numericInventory < 0) {
        return response(res, 400, "Inventory must be 0 or greater");
      }
    }

    // ============================================================
    // STYLE ID
    //
    // Product schema:
    // type: Number
    // required: true
    // min: 1
    // ============================================================

    let numericStyleId: number | undefined;

    if (styleId !== undefined) {
      if (styleId === null || String(styleId).trim() === "") {
        return response(res, 400, "Style ID is required");
      }

      numericStyleId = Number(styleId);

      if (!Number.isFinite(numericStyleId) || numericStyleId < 1) {
        return response(
          res,
          400,
          "Style ID must be a number greater than or equal to 1",
        );
      }
    }

    // ============================================================
    // NET QUANTITY
    //
    // Product schema:
    // type: Number
    // min: 1
    // default: 1
    // ============================================================

    let numericNetQuantity: number | undefined;

    if (
      netQuantity !== undefined &&
      netQuantity !== null &&
      String(netQuantity).trim() !== ""
    ) {
      numericNetQuantity = Number(netQuantity);

      if (!Number.isFinite(numericNetQuantity) || numericNetQuantity < 1) {
        return response(res, 400, "Net quantity must be at least 1");
      }
    }

    // ============================================================
    // TAGS
    // ============================================================

    let parsedTags: string[] | undefined;

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        parsedTags = tags.map((tag) => String(tag).trim()).filter(Boolean);
      } else if (typeof tags === "string") {
        const trimmedTags = tags.trim();

        if (!trimmedTags) {
          parsedTags = [];
        } else {
          try {
            const jsonTags = JSON.parse(trimmedTags);

            if (Array.isArray(jsonTags)) {
              parsedTags = jsonTags
                .map((tag) => String(tag).trim())
                .filter(Boolean);
            } else {
              parsedTags = trimmedTags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean);
            }
          } catch {
            parsedTags = trimmedTags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean);
          }
        }
      }
    }

    // ============================================================
    // HELPER: SET VALUE WHEN PROVIDED
    // ============================================================

    const setIfDefined = (key: string, value: unknown) => {
      if (value !== undefined) {
        product.set(key, value);
      }
    };

    // ============================================================
    // HELPER: OPTIONAL NUMBER
    //
    // Only use this for schema fields that are actually Numbers.
    // ============================================================

    const setOptionalNumber = (key: string, value: unknown, minimum = 0) => {
      if (value === undefined || value === null) {
        return;
      }

      const stringValue = String(value).trim();

      if (stringValue === "") {
        product.set(key, undefined);
        return;
      }

      const numericValue = Number(stringValue);

      if (!Number.isFinite(numericValue)) {
        throw new Error(`Invalid numeric value for ${key}`);
      }

      if (numericValue < minimum) {
        throw new Error(`${key} cannot be less than ${minimum}`);
      }

      product.set(key, numericValue);
    };

    // ============================================================
    // IMAGES
    // ============================================================

    product.set("images", finalImages);

    // ============================================================
    // BASIC INFORMATION
    // ============================================================

    if (title !== undefined) {
      product.set("title", String(title).trim());
    }

    if (description !== undefined) {
      product.set("description", String(description).trim());
    }

    if (slug !== undefined) {
      product.set("slug", String(slug).trim());
    }

    // ============================================================
    // CLASSIFICATION
    // ============================================================

    setIfDefined("brand", brand);
    setIfDefined("category", category);
    setIfDefined("color", color);
    setIfDefined("season", season);

    setIfDefined("gender", gender);

    setIfDefined("collectionName", collectionName);

    // ============================================================
    // PRICING
    // ============================================================

    if (price !== undefined) {
      product.set("price", nextPrice);
    }

    if (finalPrice !== undefined) {
      product.set("finalPrice", nextFinalPrice);
    }

    if (mrp !== undefined) {
      product.set("mrp", nextMrp);
    }

    // ============================================================
    // TAX / PRODUCT INFORMATION
    // ============================================================

    setOptionalNumber("gstPercentage", gstPercentage, 0);

    setIfDefined("hsnId", hsnId);

    setOptionalNumber("netWeight", netWeight, 0);

    if (numericNetQuantity !== undefined) {
      product.set("netQuantity", numericNetQuantity);
    }

    setIfDefined("countryOfOrigin", countryOfOrigin);

    setIfDefined("genericName", genericName);

    // ============================================================
    // INVENTORY
    // ============================================================

    if (numericInventory !== undefined) {
      product.set("inventory", numericInventory);
    }

    // ============================================================
    // MANUFACTURER
    // ============================================================

    setIfDefined("manufacturerName", manufacturerName);

    setIfDefined("manufacturerAddress", manufacturerAddress);

    setIfDefined("manufacturerPincode", manufacturerPincode);

    // ============================================================
    // PACKER
    // ============================================================

    setIfDefined("packerName", packerName);

    setIfDefined("packerAddress", packerAddress);

    setIfDefined("packerPincode", packerPincode);

    // ============================================================
    // IMPORTER
    // ============================================================

    setIfDefined("importerName", importerName);

    setIfDefined("importerAddress", importerAddress);

    setIfDefined("importerPincode", importerPincode);

    // ============================================================
    // BLOUSE
    // ============================================================

    setIfDefined("blouse", blouse);

    setIfDefined("blouseColor", blouseColor);

    setIfDefined("blouseFabric", blouseFabric);

    setIfDefined("blousePattern", blousePattern);

    setOptionalNumber("blouseLengthSize", blouseLengthSize, 0);

    // ============================================================
    // BORDER
    //
    // IMPORTANT:
    // borderWidth is STRING in Product schema.
    // Do NOT convert it to Number.
    // ============================================================

    setIfDefined("border", border);

    setIfDefined("borderWidth", borderWidth);

    // ============================================================
    // PATTERN / COLOR
    // ============================================================

    setIfDefined("colorRemarks", colorRemarks);

    setIfDefined("printOrPatternType", printOrPatternType);

    setIfDefined("pattern", pattern);

    // ============================================================
    // SAREE
    // ============================================================

    setIfDefined("sareeFabric", sareeFabric);

    setOptionalNumber("sareeLengthSize", sareeLengthSize, 0);

    setIfDefined("transparency", transparency);

    setIfDefined("type", type);

    setIfDefined("loomType", loomType);

    setIfDefined("occasion", occasion);

    setIfDefined("ornamentation", ornamentation);

    setIfDefined("palluDetails", palluDetails);

    // ============================================================
    // PRODUCT IDENTIFICATION
    // ============================================================

    setIfDefined("productId", productId);

    if (numericStyleId !== undefined) {
      product.set("styleId", numericStyleId);
    }

    setIfDefined("skuId", skuId);

    setIfDefined("groupId", groupId);

    // ============================================================
    // TAGS
    // ============================================================

    if (parsedTags !== undefined) {
      product.set("tags", parsedTags);
    }

    // ============================================================
    // ACTIVE STATUS
    //
    // FormData sends boolean as "true" / "false".
    // ============================================================

    if (isActive !== undefined) {
      const parsedIsActive =
        isActive === true || String(isActive).toLowerCase() === "true";

      product.set("isActive", parsedIsActive);
    }

    // ============================================================
    // PUBLISH STATUS
    // ============================================================

    if (publishStatus !== undefined) {
      const validStatuses = ["draft", "pending", "approved", "rejected"];

      if (!validStatuses.includes(String(publishStatus))) {
        return response(res, 400, "Invalid publish status");
      }

      product.set("publishStatus", publishStatus);
    }

    setIfDefined("rejectionReason", rejectionReason);

    // ============================================================
    // SAVE PRODUCT
    //
    // IMPORTANT:
    //
    // Do NOT use findByIdAndUpdate here.
    //
    // finalPrice and mrp schema validators use this.price.
    // product.save() makes "this" the actual document.
    // ============================================================

    await product.save();

    // ============================================================
    // POPULATE
    // ============================================================

    await product.populate([
      {
        path: "brand",
        select: "name slug",
      },
      {
        path: "color",
        select: "name slug",
      },
      {
        path: "category",
        select: "name slug",
      },
      {
        path: "season",
        select: "name slug",
      },
    ]);

    // ============================================================
    // SUCCESS
    // ============================================================

    return response(res, 200, "Product updated successfully", product);
  } catch (error: unknown) {
    console.error("Error updating product:", error);

    // ============================================================
    // MONGOOSE VALIDATION ERROR
    // ============================================================

    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      const validationError = error as {
        errors?: Record<
          string,
          {
            message?: string;
          }
        >;
      };

      const messages = Object.values(validationError.errors || {})
        .map((item) => item.message)
        .filter(
          (message): message is string =>
            typeof message === "string" && message.length > 0,
        );

      return response(
        res,
        400,
        messages.length > 0 ? messages.join(", ") : "Product validation failed",
      );
    }

    // ============================================================
    // INVALID OBJECT ID
    // ============================================================

    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "CastError"
    ) {
      return response(res, 400, "Invalid product or reference ID");
    }

    // ============================================================
    // DUPLICATE KEY
    // ============================================================

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return response(
        res,
        409,
        "A product with this unique value already exists",
      );
    }

    // ============================================================
    // OTHER ERROR
    // ============================================================

    return response(
      res,
      500,
      error instanceof Error ? error.message : "Error updating product",
    );
  }
};

// ============================================================
// GET PRODUCT BY ID
// ============================================================

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand", "name slug")
      .populate("color", "name slug")
      .populate("category", "name slug")
      .populate("season", "name slug");

    if (!product) {
      return response(res, 404, "Product not found");
    }

    return response(res, 200, "Product fetched successfully", product);
  } catch (error: unknown) {
    console.error("Error fetching product:", error);

    return response(res, 500, "Error fetching product");
  }
};

// ============================================================
// GET PRODUCT BY SLUG
// ============================================================

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug })
      .populate("category", "name slug")
      .populate("brand", "name slug")
      .populate("season", "name slug")
      .populate("color", "name slug")
      .populate("seller", "name");

    if (!product) {
      return response(res, 404, "Product not found");
    }

    return response(res, 200, "Product fetched successfully", product);
  } catch (error: unknown) {
    console.error("Error fetching product by slug:", error);

    return response(res, 500, "Internal server error");
  }
};

// ============================================================
// DELETE PRODUCT
// ============================================================

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (!product) {
      return response(res, 404, "Product not found");
    }

    return response(res, 200, "Product deleted successfully");
  } catch (error: unknown) {
    console.error("Error deleting product:", error);

    return response(res, 500, "Error deleting product");
  }
};

// ============================================================
// GET PRODUCTS BY SELLER
// ============================================================

export const getProductsBySeller = async (req: Request, res: Response) => {
  try {
    const sellerId = req.params.sellerId;

    if (!sellerId) {
      return response(res, 400, "Seller ID is required");
    }

    const products = await Product.find({
      seller: sellerId,
    })
      .sort({ createdAt: -1 })
      .populate("brand", "name slug")
      .populate("color", "name slug")
      .populate("category", "name slug")
      .populate("season", "name slug");

    if (products.length === 0) {
      return response(res, 200, "No products found for this seller", []);
    }

    return response(res, 200, "Products fetched successfully", products);
  } catch (error: unknown) {
    console.error("Error fetching seller products:", error);

    return response(res, 500, "Error fetching products");
  }
};
