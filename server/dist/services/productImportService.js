"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.processProductImport = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const XLSX = __importStar(require("xlsx"));
const Product_1 = __importDefault(require("../models/Product"));
const ProductImport_1 = __importDefault(require("../models/ProductImport"));
const Brands_1 = __importDefault(require("../models/Brands"));
const Category_1 = __importDefault(require("../models/Category"));
const Color_1 = __importDefault(require("../models/Color"));
const Season_1 = __importDefault(require("../models/Season"));
const cloudnaryConfig_1 = require("../config/cloudnaryConfig");
// ============================================================
// HELPERS
// ============================================================
const getString = (value) => {
    if (value === null || value === undefined) {
        return "";
    }
    return String(value).trim();
};
const getNumber = (value) => {
    if (value === null || value === undefined || value === "") {
        return undefined;
    }
    const number = Number(value);
    return Number.isFinite(number) ? number : undefined;
};
// ============================================================
// GET IMAGES FROM EXCEL
// ============================================================
const isValidImageUrl = (value) => {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    }
    catch (_a) {
        return false;
    }
};
const getImages = (row) => {
    return [
        getString(row.image1),
        getString(row.image2),
        getString(row.image3),
        getString(row.image4),
        getString(row.image5),
    ]
        .filter(Boolean)
        .filter(isValidImageUrl);
};
// ============================================================
// TAGS
// ============================================================
const getTags = (value) => {
    const valueString = getString(value);
    if (!valueString) {
        return [];
    }
    return valueString
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
};
// ============================================================
// ESCAPE REGEX
// ============================================================
const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
// ============================================================
// FIND BRAND
// ============================================================
const findBrand = (value) => __awaiter(void 0, void 0, void 0, function* () {
    if (!value) {
        throw new Error("Brand is required");
    }
    const brand = yield Brands_1.default.findOne({
        name: {
            $regex: `^${escapeRegex(value)}$`,
            $options: "i",
        },
    });
    if (!brand) {
        throw new Error(`Brand not found: ${value}`);
    }
    return brand;
});
// ============================================================
// FIND CATEGORY
// ============================================================
const findCategory = (value) => __awaiter(void 0, void 0, void 0, function* () {
    if (!value) {
        throw new Error("Category is required");
    }
    const category = yield Category_1.default.findOne({
        name: {
            $regex: `^${escapeRegex(value)}$`,
            $options: "i",
        },
    });
    if (!category) {
        throw new Error(`Category not found: ${value}`);
    }
    return category;
});
// ============================================================
// FIND COLOR
// ============================================================
const findColor = (value) => __awaiter(void 0, void 0, void 0, function* () {
    if (!value) {
        throw new Error("Color is required");
    }
    const color = yield Color_1.default.findOne({
        name: {
            $regex: `^${escapeRegex(value)}$`,
            $options: "i",
        },
    });
    if (!color) {
        throw new Error(`Color not found: ${value}`);
    }
    return color;
});
// ============================================================
// FIND SEASON
// ============================================================
const findSeason = (value) => __awaiter(void 0, void 0, void 0, function* () {
    if (!value) {
        throw new Error("Season is required");
    }
    const season = yield Season_1.default.findOne({
        name: {
            $regex: `^${escapeRegex(value)}$`,
            $options: "i",
        },
    });
    if (!season) {
        throw new Error(`Season not found: ${value}`);
    }
    return season;
});
// ============================================================
// UPLOAD PRODUCT IMAGES
// ============================================================
const uploadProductImages = (imageUrls, imageCache) => __awaiter(void 0, void 0, void 0, function* () {
    if (imageUrls.length === 0) {
        throw new Error("At least one image is required");
    }
    const cloudinaryImages = [];
    // ----------------------------------------------------------
    // Upload sequentially
    //
    // This is safer for Meesho/Cloudinary and avoids sending
    // hundreds of requests simultaneously.
    // ----------------------------------------------------------
    for (const imageUrl of imageUrls) {
        // --------------------------------------------------------
        // Already uploaded during this import?
        // --------------------------------------------------------
        const cachedUrl = imageCache.get(imageUrl);
        if (cachedUrl) {
            console.log(`Using cached Cloudinary image: ${cachedUrl}`);
            cloudinaryImages.push(cachedUrl);
            continue;
        }
        try {
            console.log(`Uploading product image to Cloudinary: ${imageUrl}`);
            const cloudinaryUrl = yield (0, cloudnaryConfig_1.uploadImageUrlToCloudinary)(imageUrl, "products/import");
            // ------------------------------------------------------
            // Cache it
            // ------------------------------------------------------
            imageCache.set(imageUrl, cloudinaryUrl);
            cloudinaryImages.push(cloudinaryUrl);
            console.log(`Cloudinary image saved: ${cloudinaryUrl}`);
        }
        catch (error) {
            throw new Error(`Failed to upload image "${imageUrl}": ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    return cloudinaryImages;
});
// ============================================================
// IMPORT SINGLE PRODUCT ROW
// ============================================================
const importProductRow = (row, imageCache, sellerId) => __awaiter(void 0, void 0, void 0, function* () {
    // ==========================================================
    // BASIC VALUES
    // ==========================================================
    var _a;
    var _b, _c, _d, _e, _f;
    const productId = getString(row.productId);
    const skuId = getString(row.skuId);
    const groupId = getString(row.groupId);
    const title = getString(row.title);
    const description = getString(row.description);
    if (!title) {
        throw new Error("Title is required");
    }
    if (!description) {
        throw new Error("Description is required");
    }
    // ==========================================================
    // RELATED MODELS
    // ==========================================================
    const brand = yield findBrand(getString(row.brand));
    const category = yield findCategory(getString(row.category));
    const color = yield findColor(getString(row.color));
    const season = yield findSeason(getString(row.season));
    // ==========================================================
    // EXCEL IMAGE URLs
    // ==========================================================
    const imageUrls = getImages(row);
    if (imageUrls.length === 0) {
        throw new Error(`At least one image is required for "${title}"`);
    }
    console.log(`Product "${title}" has ${imageUrls.length} images`);
    // ==========================================================
    // DOWNLOAD + UPLOAD TO CLOUDINARY
    // ==========================================================
    const images = yield uploadProductImages(imageUrls, imageCache);
    // ==========================================================
    // PRODUCT DATA
    // ==========================================================
    const productData = {
        productId: productId || undefined,
        skuId: skuId || undefined,
        groupId: groupId || undefined,
        title,
        description,
        brand: brand._id,
        category: category._id,
        color: color._id,
        season: season._id,
        gender: getString(row.gender) === "Unisex" ? "Unisex" : "Womens",
        collectionName: getString(row.collectionName) || undefined,
        // ========================================================
        // PRICING
        // ========================================================
        price: (_b = getNumber(row.price)) !== null && _b !== void 0 ? _b : 0,
        finalPrice: (_c = getNumber(row.finalPrice)) !== null && _c !== void 0 ? _c : 0,
        mrp: (_d = getNumber(row.mrp)) !== null && _d !== void 0 ? _d : 0,
        // ========================================================
        // TAX / PRODUCT INFORMATION
        // ========================================================
        gstPercentage: getNumber(row.gstPercentage),
        hsnId: getString(row.hsnId) || undefined,
        netWeight: getNumber(row.netWeight),
        netQuantity: (_e = getNumber(row.netQuantity)) !== null && _e !== void 0 ? _e : 1,
        countryOfOrigin: getString(row.countryOfOrigin) || "India",
        genericName: getString(row.genericName) || undefined,
        // ========================================================
        // INVENTORY
        // ========================================================
        inventory: (_f = getNumber(row.inventory)) !== null && _f !== void 0 ? _f : 0,
        // ========================================================
        // MANUFACTURER
        // ========================================================
        manufacturerName: getString(row.manufacturerName) || undefined,
        manufacturerAddress: getString(row.manufacturerAddress) || undefined,
        manufacturerPincode: getString(row.manufacturerPincode) || undefined,
        // ========================================================
        // PACKER
        // ========================================================
        packerName: getString(row.packerName) || undefined,
        packerAddress: getString(row.packerAddress) || undefined,
        packerPincode: getString(row.packerPincode) || undefined,
        // ========================================================
        // IMPORTER
        // ========================================================
        importerName: getString(row.importerName) || undefined,
        importerAddress: getString(row.importerAddress) || undefined,
        importerPincode: getString(row.importerPincode) || undefined,
        // ========================================================
        // SAREE DETAILS
        // ========================================================
        blouse: getString(row.blouse) || undefined,
        blouseColor: getString(row.blouseColor) || undefined,
        blouseFabric: getString(row.blouseFabric) || undefined,
        blousePattern: getString(row.blousePattern) || undefined,
        blouseLengthSize: getNumber(row.blouseLengthSize),
        border: getString(row.border) || undefined,
        borderWidth: getNumber(row.borderWidth),
        colorRemarks: getString(row.colorRemarks) || undefined,
        printOrPatternType: getString(row.printOrPatternType) || undefined,
        pattern: getString(row.pattern) || undefined,
        sareeFabric: getString(row.sareeFabric) || undefined,
        sareeLengthSize: getNumber(row.sareeLengthSize),
        transparency: getString(row.transparency) || undefined,
        type: getString(row.type) || undefined,
        loomType: getString(row.loomType) || undefined,
        occasion: getString(row.occasion) || undefined,
        ornamentation: getString(row.ornamentation) || undefined,
        palluDetails: getString(row.palluDetails) || undefined,
        // ========================================================
        // MEDIA
        // ========================================================
        // IMPORTANT:
        // These are now Cloudinary URLs.
        // The original Meesho URLs are NOT stored.
        images,
        videos: [],
        // ========================================================
        // TAGS
        // ========================================================
        tags: getTags(row.tags),
        // ========================================================
        // STATUS
        // ========================================================
        isActive: true,
        publishStatus: "draft",
        rejectionReason: getString(row.rejectionReason) || undefined,
        // ========================================================
        // REVIEWS
        // ========================================================
        rating: 0,
        numReviews: 0,
        // ========================================================
        // SELLER
        // ========================================================
        seller: sellerId,
    };
    // ==========================================================
    // CREATE PRODUCT
    // ==========================================================
    try {
        yield Product_1.default.create(productData);
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
            const duplicateField = Object.keys(error.keyPattern || {})[0];
            const duplicateValue = (_a = error.keyValue) === null || _a === void 0 ? void 0 : _a[duplicateField];
            throw new Error(`Duplicate product: ${duplicateField} "${duplicateValue}" already exists.`);
        }
        throw error;
    }
});
// ============================================================
// PROCESS PRODUCT IMPORT
// ============================================================
const processProductImport = (productImportId) => __awaiter(void 0, void 0, void 0, function* () {
    const productImport = yield ProductImport_1.default.findById(productImportId);
    if (!productImport) {
        throw new Error("Product import has no uploadedBy user");
    }
    const sellerId = productImport.uploadedBy;
    // ==========================================================
    // SET PROCESSING
    // ==========================================================
    yield ProductImport_1.default.findByIdAndUpdate(productImportId, {
        completedAt: undefined,
        processedRows: 0,
        successRows: 0,
        failedRows: 0,
        importErrors: [],
    });
    try {
        // ========================================================
        // READ EXCEL
        // ========================================================
        const fileBuffer = yield promises_1.default.readFile(productImport.fileUrl);
        const workbook = XLSX.read(fileBuffer, {
            type: "buffer",
        });
        const sheetName = "Saree-Fill-This";
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
            throw new Error(`Worksheet "${sheetName}" not found in Excel file`);
        }
        const rows = XLSX.utils.sheet_to_json(worksheet, {
            defval: "",
        });
        // ========================================================
        // LOG EXCEL
        // ========================================================
        console.log("====================================");
        console.log(`READING SHEET: ${sheetName}`);
        console.log(`TOTAL ROWS: ${rows.length}`);
        console.log("COLUMNS:");
        console.log(Object.keys(rows[0] || {}));
        console.log("FIRST ROW:");
        console.log(rows[0]);
        console.log("====================================");
        // ========================================================
        // TOTAL ROWS
        // ========================================================
        yield ProductImport_1.default.findByIdAndUpdate(productImportId, {
            totalRows: rows.length,
        });
        let successRows = 0;
        let failedRows = 0;
        // ========================================================
        // ERROR STORAGE
        // ========================================================
        const importErrors = [];
        // ========================================================
        // IMAGE CACHE
        //
        // If the same image URL appears in multiple products,
        // we upload it only once.
        // ========================================================
        const imageCache = new Map();
        // ========================================================
        // PROCESS ROWS
        // ========================================================
        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            const rowNumber = index + 2;
            try {
                console.log(`====================================`);
                console.log(`Processing product row ${rowNumber}`);
                console.log(`Product: ${getString(row.title)}`);
                console.log(`SKU: ${getString(row.skuId)}`);
                // ----------------------------------------------------
                // IMPORT PRODUCT
                // ----------------------------------------------------
                yield importProductRow(row, imageCache, sellerId);
                successRows++;
                console.log(`Successfully imported row ${rowNumber}`);
            }
            catch (error) {
                failedRows++;
                // ----------------------------------------------------
                // ERROR MESSAGE
                // ----------------------------------------------------
                const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
                const sku = getString(row.skuId);
                const productName = getString(row.title);
                // ----------------------------------------------------
                // SAVE ERROR
                // ----------------------------------------------------
                importErrors.push({
                    rowNumber,
                    sku,
                    productName,
                    error: errorMessage,
                });
                console.error(`Failed to import row ${rowNumber}: ${errorMessage}`);
            }
            // ======================================================
            // UPDATE PROGRESS
            // ======================================================
            yield ProductImport_1.default.findByIdAndUpdate(productImportId, {
                processedRows: successRows + failedRows,
                successRows,
                failedRows,
                importErrors,
            });
            console.log(`Progress: ${successRows + failedRows}/${rows.length}`);
        }
        // ========================================================
        // FINAL STATUS
        // ========================================================
        let status;
        if (failedRows === 0) {
            status = "completed";
        }
        else if (successRows > 0) {
            status = "completed_with_errors";
        }
        else {
            status = "failed";
        }
        // ========================================================
        // FINAL DATABASE UPDATE
        // ========================================================
        yield ProductImport_1.default.findByIdAndUpdate(productImportId, {
            status,
            completedAt: new Date(),
            processedRows: successRows + failedRows,
            successRows,
            failedRows,
            importErrors,
        });
        // ========================================================
        // LOG
        // ========================================================
        console.log("====================================");
        console.log("PRODUCT IMPORT FINISHED");
        console.log("TOTAL:", rows.length);
        console.log("SUCCESS:", successRows);
        console.log("FAILED:", failedRows);
        console.log("STATUS:", status);
        console.log("CLOUDINARY IMAGES:", imageCache.size);
        console.log("IMPORT ERRORS:", importErrors);
        console.log("====================================");
    }
    catch (error) {
        console.error("Product import failed:", error);
        throw error;
    }
});
exports.processProductImport = processProductImport;
