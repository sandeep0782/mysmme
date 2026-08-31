"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsBySeller = exports.deleteProduct = exports.getProductBySlug = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const responseHandler_1 = require("../utils/responseHandler");
const cloudnaryConfig_1 = require("../config/cloudnaryConfig");
// ============================================================
// CREATE PRODUCT
// ============================================================
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUser = req.id;
        const { title, description, slug, brand, category, color, season, gender, collectionName, price, finalPrice, mrp, gstPercentage, hsnId, netWeight, netQuantity, countryOfOrigin, genericName, inventory, manufacturerName, manufacturerAddress, manufacturerPincode, packerName, packerAddress, packerPincode, importerName, importerAddress, importerPincode, blouse, blouseColor, blouseFabric, blousePattern, blouseLengthSize, border, borderWidth, colorRemarks, printOrPatternType, pattern, sareeFabric, sareeLengthSize, transparency, type, loomType, occasion, ornamentation, palluDetails, productId, styleId, skuId, groupId, tags, isActive, publishStatus, rejectionReason, } = req.body;
        // ============================================================
        // FILES
        // ============================================================
        const images = req.files;
        if (!images || images.length === 0) {
            return (0, responseHandler_1.response)(res, 400, "At least one product image is required");
        }
        // ============================================================
        // REQUIRED FIELDS
        // ============================================================
        if (!(title === null || title === void 0 ? void 0 : title.trim())) {
            return (0, responseHandler_1.response)(res, 400, "Product title is required");
        }
        if (!(description === null || description === void 0 ? void 0 : description.trim())) {
            return (0, responseHandler_1.response)(res, 400, "Product description is required");
        }
        if (!brand) {
            return (0, responseHandler_1.response)(res, 400, "Brand is required");
        }
        if (!category) {
            return (0, responseHandler_1.response)(res, 400, "Category is required");
        }
        if (!color) {
            return (0, responseHandler_1.response)(res, 400, "Color is required");
        }
        if (!season) {
            return (0, responseHandler_1.response)(res, 400, "Season is required");
        }
        // ============================================================
        // PARSE NUMBERS
        // ============================================================
        const numericPrice = Number(price);
        const numericFinalPrice = Number(finalPrice);
        const numericMrp = Number(mrp);
        const numericInventory = Number(inventory !== null && inventory !== void 0 ? inventory : 0);
        const numericNetQuantity = Number(netQuantity !== null && netQuantity !== void 0 ? netQuantity : 1);
        const numericGstPercentage = gstPercentage !== undefined && gstPercentage !== ""
            ? Number(gstPercentage)
            : undefined;
        const numericNetWeight = netWeight !== undefined && netWeight !== ""
            ? Number(netWeight)
            : undefined;
        const numericBlouseLengthSize = blouseLengthSize !== undefined && blouseLengthSize !== ""
            ? Number(blouseLengthSize)
            : undefined;
        const numericBorderWidth = borderWidth !== undefined && borderWidth !== ""
            ? Number(borderWidth)
            : undefined;
        const numericSareeLengthSize = sareeLengthSize !== undefined && sareeLengthSize !== ""
            ? Number(sareeLengthSize)
            : undefined;
        // ============================================================
        // PRICE VALIDATION
        // ============================================================
        if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
            return (0, responseHandler_1.response)(res, 400, "Price must be greater than 0");
        }
        if (!Number.isFinite(numericFinalPrice) || numericFinalPrice < 0) {
            return (0, responseHandler_1.response)(res, 400, "Final price must be 0 or greater");
        }
        if (!Number.isFinite(numericMrp) || numericMrp < 0) {
            return (0, responseHandler_1.response)(res, 400, "MRP must be 0 or greater");
        }
        if (numericFinalPrice > numericPrice) {
            return (0, responseHandler_1.response)(res, 400, "Final price cannot be greater than price");
        }
        if (numericPrice > numericMrp) {
            return (0, responseHandler_1.response)(res, 400, "MRP must be greater than or equal to price");
        }
        // ============================================================
        // INVENTORY VALIDATION
        // ============================================================
        if (!Number.isFinite(numericInventory) || numericInventory < 0) {
            return (0, responseHandler_1.response)(res, 400, "Inventory cannot be negative");
        }
        if (!Number.isFinite(numericNetQuantity) || numericNetQuantity < 1) {
            return (0, responseHandler_1.response)(res, 400, "Net quantity must be at least 1");
        }
        // ============================================================
        // UPLOAD IMAGES
        // ============================================================
        const uploadPromises = images.map((file) => (0, cloudnaryConfig_1.uploadFileToCloudinary)(file));
        const uploadedImages = yield Promise.all(uploadPromises);
        const imageUrls = uploadedImages.map((image) => image.secure_url);
        if (!imageUrls.length) {
            return (0, responseHandler_1.response)(res, 400, "Failed to upload product images");
        }
        // ============================================================
        // PARSE TAGS
        // ============================================================
        let parsedTags = [];
        if (tags) {
            if (Array.isArray(tags)) {
                parsedTags = tags.map((tag) => String(tag).trim()).filter(Boolean);
            }
            else if (typeof tags === "string") {
                try {
                    const jsonTags = JSON.parse(tags);
                    if (Array.isArray(jsonTags)) {
                        parsedTags = jsonTags
                            .map((tag) => String(tag).trim())
                            .filter(Boolean);
                    }
                    else {
                        parsedTags = tags
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean);
                    }
                }
                catch (_a) {
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
        const product = new Product_1.default(Object.assign(Object.assign({ title: title.trim() }, ((slug === null || slug === void 0 ? void 0 : slug.trim()) ? { slug: slug.trim() } : {})), { description: description.trim(), brand,
            category,
            color,
            season, gender: gender || "Womens", collectionName: collectionName === null || collectionName === void 0 ? void 0 : collectionName.trim(), 
            // Pricing
            price: numericPrice, finalPrice: numericFinalPrice, mrp: numericMrp, 
            // Tax / Product Information
            gstPercentage: numericGstPercentage, hsnId: hsnId === null || hsnId === void 0 ? void 0 : hsnId.trim(), netWeight: numericNetWeight, netQuantity: numericNetQuantity, countryOfOrigin: (countryOfOrigin === null || countryOfOrigin === void 0 ? void 0 : countryOfOrigin.trim()) || "India", genericName: genericName === null || genericName === void 0 ? void 0 : genericName.trim(), 
            // Inventory
            inventory: numericInventory, 
            // Manufacturer
            manufacturerName: manufacturerName === null || manufacturerName === void 0 ? void 0 : manufacturerName.trim(), manufacturerAddress: manufacturerAddress === null || manufacturerAddress === void 0 ? void 0 : manufacturerAddress.trim(), manufacturerPincode: manufacturerPincode === null || manufacturerPincode === void 0 ? void 0 : manufacturerPincode.trim(), 
            // Packer
            packerName: packerName === null || packerName === void 0 ? void 0 : packerName.trim(), packerAddress: packerAddress === null || packerAddress === void 0 ? void 0 : packerAddress.trim(), packerPincode: packerPincode === null || packerPincode === void 0 ? void 0 : packerPincode.trim(), 
            // Importer
            importerName: importerName === null || importerName === void 0 ? void 0 : importerName.trim(), importerAddress: importerAddress === null || importerAddress === void 0 ? void 0 : importerAddress.trim(), importerPincode: importerPincode === null || importerPincode === void 0 ? void 0 : importerPincode.trim(), 
            // Saree Details
            blouse: blouse === null || blouse === void 0 ? void 0 : blouse.trim(), blouseColor: blouseColor === null || blouseColor === void 0 ? void 0 : blouseColor.trim(), blouseFabric: blouseFabric === null || blouseFabric === void 0 ? void 0 : blouseFabric.trim(), blousePattern: blousePattern === null || blousePattern === void 0 ? void 0 : blousePattern.trim(), blouseLengthSize: numericBlouseLengthSize, border: border === null || border === void 0 ? void 0 : border.trim(), borderWidth: numericBorderWidth, colorRemarks: colorRemarks === null || colorRemarks === void 0 ? void 0 : colorRemarks.trim(), printOrPatternType: printOrPatternType === null || printOrPatternType === void 0 ? void 0 : printOrPatternType.trim(), pattern: pattern === null || pattern === void 0 ? void 0 : pattern.trim(), sareeFabric: sareeFabric === null || sareeFabric === void 0 ? void 0 : sareeFabric.trim(), sareeLengthSize: numericSareeLengthSize, transparency: transparency === null || transparency === void 0 ? void 0 : transparency.trim(), type: type === null || type === void 0 ? void 0 : type.trim(), loomType: loomType === null || loomType === void 0 ? void 0 : loomType.trim(), occasion: occasion === null || occasion === void 0 ? void 0 : occasion.trim(), ornamentation: ornamentation === null || ornamentation === void 0 ? void 0 : ornamentation.trim(), palluDetails: palluDetails === null || palluDetails === void 0 ? void 0 : palluDetails.trim(), 
            // Product Identification
            productId: productId === null || productId === void 0 ? void 0 : productId.trim(), styleId: styleId === null || styleId === void 0 ? void 0 : styleId.trim(), skuId: skuId === null || skuId === void 0 ? void 0 : skuId.trim(), groupId: groupId === null || groupId === void 0 ? void 0 : groupId.trim(), 
            // Media
            images: imageUrls, videos: [], 
            // Search
            tags: parsedTags, 
            // Status
            isActive: isActive === undefined
                ? true
                : isActive === true || isActive === "true", publishStatus: publishStatus || "draft", rejectionReason: rejectionReason === null || rejectionReason === void 0 ? void 0 : rejectionReason.trim(), 
            // Reviews
            rating: 0, numReviews: 0, 
            // Seller
            seller: loggedInUser }));
        yield product.save();
        return (0, responseHandler_1.response)(res, 201, "Product created successfully", product);
    }
    catch (error) {
        console.error("====================================");
        console.error("CREATE PRODUCT ERROR");
        console.error(error);
        console.error("====================================");
        const message = error instanceof Error ? error.message : "Error creating product";
        return (0, responseHandler_1.response)(res, 500, message);
    }
});
exports.createProduct = createProduct;
// ============================================================
// GET ALL PRODUCTS
// ============================================================
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find()
            .sort({ createdAt: -1 })
            .populate("brand", "name slug")
            .populate("color", "name slug")
            .populate("category", "name slug")
            .populate("season", "name slug");
        return (0, responseHandler_1.response)(res, 200, "Products fetched successfully", products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        return (0, responseHandler_1.response)(res, 500, "Error fetching products");
    }
});
exports.getAllProducts = getAllProducts;
// ============================================================
// GET PRODUCT BY ID
// ============================================================
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_1.default.findById(req.params.id)
            .populate("brand", "name slug")
            .populate("color", "name slug")
            .populate("category", "name slug")
            .populate("season", "name slug");
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, "Product not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Product fetched successfully", product);
    }
    catch (error) {
        console.error("Error fetching product:", error);
        return (0, responseHandler_1.response)(res, 500, "Error fetching product");
    }
});
exports.getProductById = getProductById;
// ============================================================
// GET PRODUCT BY SLUG
// ============================================================
const getProductBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const product = yield Product_1.default.findOne({ slug })
            .populate("category", "name slug")
            .populate("brand", "name slug")
            .populate("season", "name slug")
            .populate("color", "name slug");
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, "Product not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Product fetched successfully", product);
    }
    catch (error) {
        console.error("Error fetching product by slug:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
});
exports.getProductBySlug = getProductBySlug;
// ============================================================
// DELETE PRODUCT
// ============================================================
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_1.default.findByIdAndDelete(req.params.productId);
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, "Product not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Product deleted successfully");
    }
    catch (error) {
        console.error("Error deleting product:", error);
        return (0, responseHandler_1.response)(res, 500, "Error deleting product");
    }
});
exports.deleteProduct = deleteProduct;
// ============================================================
// GET PRODUCTS BY SELLER
// ============================================================
const getProductsBySeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellerId = req.params.sellerId;
        if (!sellerId) {
            return (0, responseHandler_1.response)(res, 400, "Seller ID is required");
        }
        const products = yield Product_1.default.find({
            seller: sellerId,
        })
            .sort({ createdAt: -1 })
            .populate("brand", "name slug")
            .populate("color", "name slug")
            .populate("category", "name slug")
            .populate("season", "name slug");
        if (products.length === 0) {
            return (0, responseHandler_1.response)(res, 200, "No products found for this seller", []);
        }
        return (0, responseHandler_1.response)(res, 200, "Products fetched successfully", products);
    }
    catch (error) {
        console.error("Error fetching seller products:", error);
        return (0, responseHandler_1.response)(res, 500, "Error fetching products");
    }
});
exports.getProductsBySeller = getProductsBySeller;
