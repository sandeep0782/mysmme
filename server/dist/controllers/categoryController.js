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
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategories = exports.createCategory = exports.deleteFileFromCloudinary = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const responseHandler_1 = require("../utils/responseHandler");
const sharp_1 = __importDefault(require("sharp"));
const cloudnaryConfig_1 = require("../config/cloudnaryConfig");
const removeFile_1 = require("../config/removeFile");
const cloudinary_1 = require("cloudinary");
// ============================================================
// DELETE FILE FROM CLOUDINARY
// ============================================================
const deleteFileFromCloudinary = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cloudinary_1.v2.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true,
    });
});
exports.deleteFileFromCloudinary = deleteFileFromCloudinary;
// ============================================================
// CREATE CATEGORY
// ============================================================
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filePath;
    let compressedPath;
    try {
        const { name, description } = req.body;
        // Validate name
        if (!(name === null || name === void 0 ? void 0 : name.trim())) {
            return (0, responseHandler_1.response)(res, 400, "Category name is required");
        }
        // Check duplicate name
        const existingCategory = yield Category_1.default.findOne({
            name: name.trim(),
        });
        if (existingCategory) {
            return (0, responseHandler_1.response)(res, 409, "Category with this name already exists");
        }
        // Image required when creating category
        if (!req.file) {
            return (0, responseHandler_1.response)(res, 400, "Category image is required");
        }
        filePath = req.file.path;
        // ========================================================
        // COMPRESS IMAGE
        // ========================================================
        compressedPath = `${filePath}-compressed.webp`;
        yield (0, sharp_1.default)(filePath)
            .webp({ quality: 60 })
            .toFile(compressedPath);
        // ========================================================
        // UPLOAD TO CLOUDINARY
        // ========================================================
        const upload = yield (0, cloudnaryConfig_1.uploadFileToCloudinary)(Object.assign(Object.assign({}, req.file), { path: compressedPath }));
        // ========================================================
        // REMOVE LOCAL FILES
        // ========================================================
        (0, removeFile_1.removeLocalFile)(filePath);
        (0, removeFile_1.removeLocalFile)(compressedPath);
        filePath = undefined;
        compressedPath = undefined;
        // ========================================================
        // CREATE CATEGORY
        // ========================================================
        const category = yield Category_1.default.create({
            name: name.trim(),
            description: (description === null || description === void 0 ? void 0 : description.trim()) || "",
            image: upload.secure_url,
            imagePublicId: upload.public_id,
            isActive: true,
        });
        return (0, responseHandler_1.response)(res, 201, "Category created successfully", category);
    }
    catch (error) {
        console.error("Create category error:", error);
        if (filePath) {
            (0, removeFile_1.removeLocalFile)(filePath);
        }
        if (compressedPath) {
            (0, removeFile_1.removeLocalFile)(compressedPath);
        }
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.createCategory = createCategory;
// ============================================================
// GET ALL CATEGORIES
// ============================================================
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category_1.default.find().sort({
            createdAt: -1,
        });
        return (0, responseHandler_1.response)(res, 200, "Categories fetched successfully", categories);
    }
    catch (error) {
        console.error("Get categories error:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.getAllCategories = getAllCategories;
// ============================================================
// GET CATEGORY BY ID
// ============================================================
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield Category_1.default.findById(req.params.id);
        if (!category) {
            return (0, responseHandler_1.response)(res, 404, "Category not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Category fetched successfully", category);
    }
    catch (error) {
        console.error("Get category error:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.getCategoryById = getCategoryById;
// ============================================================
// UPDATE CATEGORY
// ============================================================
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filePath;
    let compressedPath;
    try {
        const { name, description, isActive, } = req.body;
        const category = yield Category_1.default.findById(req.params.id);
        if (!category) {
            return (0, responseHandler_1.response)(res, 404, "Category not found");
        }
        // Keep old image public ID
        const oldImagePublicId = category.imagePublicId;
        // ========================================================
        // UPDATE NAME
        // ========================================================
        if (name === null || name === void 0 ? void 0 : name.trim()) {
            category.name = name.trim();
        }
        // ========================================================
        // UPDATE DESCRIPTION
        // ========================================================
        if (description !== undefined) {
            category.description =
                description.trim();
        }
        // ========================================================
        // UPDATE STATUS
        // ========================================================
        if (isActive !== undefined) {
            category.isActive =
                isActive === true ||
                    isActive === "true";
        }
        // ========================================================
        // HANDLE IMAGE UPLOAD
        // ========================================================
        if (req.file) {
            console.log("req.file:", req.file);
            filePath = req.file.path;
            // Compress image
            compressedPath =
                `${filePath}-compressed.webp`;
            yield (0, sharp_1.default)(filePath)
                .webp({ quality: 60 })
                .toFile(compressedPath);
            // Upload NEW image
            const upload = yield (0, cloudnaryConfig_1.uploadFileToCloudinary)(Object.assign(Object.assign({}, req.file), { path: compressedPath }));
            // Save NEW image information
            category.image =
                upload.secure_url;
            category.imagePublicId =
                upload.public_id;
        }
        // ========================================================
        // SAVE DATABASE FIRST
        // ========================================================
        const updatedCategory = yield category.save();
        // ========================================================
        // DELETE OLD CLOUDINARY IMAGE
        // ONLY AFTER DB UPDATE SUCCEEDS
        // ========================================================
        if (req.file &&
            oldImagePublicId &&
            oldImagePublicId !==
                category.imagePublicId) {
            try {
                console.log("Deleting Cloudinary public ID:", oldImagePublicId);
                const result = yield (0, exports.deleteFileFromCloudinary)(oldImagePublicId);
                console.log("Cloudinary destroy result:", result);
            }
            catch (cloudinaryError) {
                console.error("Failed to delete old Cloudinary category image:", cloudinaryError);
            }
        }
        // ========================================================
        // REMOVE LOCAL FILES
        // ========================================================
        if (filePath) {
            (0, removeFile_1.removeLocalFile)(filePath);
            filePath = undefined;
        }
        if (compressedPath) {
            (0, removeFile_1.removeLocalFile)(compressedPath);
            compressedPath = undefined;
        }
        return (0, responseHandler_1.response)(res, 200, "Category updated successfully", updatedCategory);
    }
    catch (error) {
        console.error("Update category error:", error);
        if (filePath) {
            (0, removeFile_1.removeLocalFile)(filePath);
        }
        if (compressedPath) {
            (0, removeFile_1.removeLocalFile)(compressedPath);
        }
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.updateCategory = updateCategory;
// ============================================================
// DELETE CATEGORY
// ============================================================
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield Category_1.default.findById(req.params.id);
        if (!category) {
            return (0, responseHandler_1.response)(res, 404, "Category not found");
        }
        // Keep public ID before deleting DB document
        const imagePublicId = category.imagePublicId;
        // Delete database record
        yield Category_1.default.findByIdAndDelete(req.params.id);
        // Delete Cloudinary image
        if (imagePublicId) {
            try {
                console.log("Deleting category image:", imagePublicId);
                const result = yield (0, exports.deleteFileFromCloudinary)(imagePublicId);
                console.log("Cloudinary destroy result:", result);
            }
            catch (cloudinaryError) {
                console.error("Failed to delete category image:", cloudinaryError);
            }
        }
        return (0, responseHandler_1.response)(res, 200, "Category deleted successfully");
    }
    catch (error) {
        console.error("Delete category error:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.deleteCategory = deleteCategory;
