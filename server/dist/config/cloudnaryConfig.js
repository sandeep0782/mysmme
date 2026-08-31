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
exports.categoryImageUploadMiddleware = exports.logoUploadMiddleware = exports.uploadFileToCloudinary = exports.multerMiddleware = exports.uploadImageUrlToCloudinary = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
// ============================================================
// CLOUDINARY CONFIG
// ============================================================
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// ============================================================
// UPLOAD LOCAL FILE TO CLOUDINARY
// ============================================================
const uploadFileToCloudinary = (file) => {
    const options = {
        resource_type: "image",
    };
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(file.path, options, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
};
exports.uploadFileToCloudinary = uploadFileToCloudinary;
// ============================================================
// DOWNLOAD IMAGE URL + UPLOAD TO CLOUDINARY
// ============================================================
const uploadImageUrlToCloudinary = (imageUrl_1, ...args_1) => __awaiter(void 0, [imageUrl_1, ...args_1], void 0, function* (imageUrl, folder = "products") {
    if (!imageUrl) {
        throw new Error("Image URL is required");
    }
    // ----------------------------------------------------------
    // Validate URL
    // ----------------------------------------------------------
    let parsedUrl;
    try {
        parsedUrl = new URL(imageUrl);
    }
    catch (_a) {
        throw new Error(`Invalid image URL: ${imageUrl}`);
    }
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error(`Invalid image protocol: ${parsedUrl.protocol}`);
    }
    console.log(`Downloading image: ${imageUrl}`);
    // ----------------------------------------------------------
    // DOWNLOAD IMAGE
    // ----------------------------------------------------------
    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort();
    }, 30000);
    let response;
    try {
        response = yield fetch(imageUrl, {
            method: "GET",
            signal: controller.signal,
            headers: {
                // Some CDNs behave better with a normal browser UA.
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
                Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            },
        });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === "AbortError") {
            throw new Error(`Image download timed out after 30 seconds: ${imageUrl}`);
        }
        throw new Error(`Failed to download image: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
    finally {
        clearTimeout(timeout);
    }
    // ----------------------------------------------------------
    // CHECK RESPONSE
    // ----------------------------------------------------------
    if (!response.ok) {
        throw new Error(`Image download failed: HTTP ${response.status} ${response.statusText}`);
    }
    // ----------------------------------------------------------
    // CHECK CONTENT TYPE
    // ----------------------------------------------------------
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
        throw new Error(`URL did not return an image. Content-Type: ${contentType}`);
    }
    // ----------------------------------------------------------
    // DOWNLOAD INTO BUFFER
    // ----------------------------------------------------------
    const arrayBuffer = yield response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (!buffer.length) {
        throw new Error(`Downloaded image is empty: ${imageUrl}`);
    }
    // Prevent accidentally downloading huge files.
    const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
    if (buffer.length > MAX_IMAGE_SIZE) {
        throw new Error(`Image is too large (${Math.round(buffer.length / 1024 / 1024)} MB): ${imageUrl}`);
    }
    console.log(`Downloaded image: ${Math.round(buffer.length / 1024)} KB`);
    // ----------------------------------------------------------
    // CREATE STABLE PUBLIC ID
    // ----------------------------------------------------------
    const hash = crypto_1.default.createHash("sha1").update(imageUrl).digest("hex");
    const publicId = `product-${hash}`;
    // ----------------------------------------------------------
    // UPLOAD BUFFER TO CLOUDINARY
    // ----------------------------------------------------------
    const uploadOptions = {
        resource_type: "image",
        folder,
        public_id: publicId,
        overwrite: false,
    };
    const result = yield new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream(uploadOptions, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
        uploadStream.end(buffer);
    });
    console.log(`Cloudinary upload successful: ${result.secure_url}`);
    return result.secure_url;
});
exports.uploadImageUrlToCloudinary = uploadImageUrlToCloudinary;
// ============================================================
// MULTIPLE PRODUCT IMAGES
// ============================================================
const multerMiddleware = (0, multer_1.default)({
    dest: "uploads/",
}).array("images", 4);
exports.multerMiddleware = multerMiddleware;
// ============================================================
// BRAND LOGO
// ============================================================
const logoUploadMiddleware = (0, multer_1.default)({
    dest: "uploads/",
}).single("logo");
exports.logoUploadMiddleware = logoUploadMiddleware;
// ============================================================
// CATEGORY IMAGE
// ============================================================
const categoryImageUploadMiddleware = (0, multer_1.default)({
    dest: "uploads/",
}).single("image");
exports.categoryImageUploadMiddleware = categoryImageUploadMiddleware;
