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
exports.deleteBrand = exports.updateBrand = exports.deleteFileFromCloudinary = exports.getBrandById = exports.getAllBrands = exports.createBrand = void 0;
const Brands_1 = __importDefault(require("../models/Brands"));
const responseHandler_1 = require("../utils/responseHandler");
const sharp_1 = __importDefault(require("sharp"));
const cloudnaryConfig_1 = require("../config/cloudnaryConfig");
const removeFile_1 = require("../config/removeFile");
const cloudinary_1 = require("cloudinary");
const createBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filePath;
    let compressedPath;
    try {
        const { name, description } = req.body;
        if (!(name === null || name === void 0 ? void 0 : name.trim())) {
            return (0, responseHandler_1.response)(res, 400, "Brand name is required");
        }
        const existing = yield Brands_1.default.findOne({
            name: name.trim(),
        });
        if (existing) {
            return (0, responseHandler_1.response)(res, 409, "Brand with this name already exists");
        }
        if (!req.file) {
            return (0, responseHandler_1.response)(res, 400, "Brand logo is required");
        }
        console.log("req.file:", req.file);
        filePath = req.file.path;
        // Compress logo
        compressedPath = `${filePath}-compressed.webp`;
        yield (0, sharp_1.default)(filePath)
            .webp({ quality: 60 })
            .toFile(compressedPath);
        // Upload compressed logo to Cloudinary
        const upload = yield (0, cloudnaryConfig_1.uploadFileToCloudinary)(Object.assign(Object.assign({}, req.file), { path: compressedPath }));
        // Remove temporary local files
        (0, removeFile_1.removeLocalFile)(filePath);
        (0, removeFile_1.removeLocalFile)(compressedPath);
        // Create brand
        const brand = yield Brands_1.default.create({
            name: name.trim(),
            description: (description === null || description === void 0 ? void 0 : description.trim()) || "",
            logo: upload.secure_url,
            logoPublicId: upload.public_id,
            isActive: true,
        });
        return (0, responseHandler_1.response)(res, 201, "Brand created successfully", brand);
    }
    catch (error) {
        console.error("Create brand error:", error);
        if (filePath) {
            (0, removeFile_1.removeLocalFile)(filePath);
        }
        if (compressedPath) {
            (0, removeFile_1.removeLocalFile)(compressedPath);
        }
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.createBrand = createBrand;
const getAllBrands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brands = yield Brands_1.default.find().sort({ createdAt: -1 });
        return (0, responseHandler_1.response)(res, 200, "Brands fetched successfully", brands);
    }
    catch (err) {
        console.error(err);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.getAllBrands = getAllBrands;
// Get brand by ID
const getBrandById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brand = yield Brands_1.default.findById(req.params.id);
        if (!brand) {
            return (0, responseHandler_1.response)(res, 404, "Brand not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Brand fetched successfully", brand);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.getBrandById = getBrandById;
const deleteFileFromCloudinary = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Deleting Cloudinary public ID:", publicId);
    const result = yield cloudinary_1.v2.uploader.destroy(publicId, {
        resource_type: "image",
        type: "upload",
        invalidate: true,
    });
    console.log("Cloudinary destroy result:", result);
    return result;
});
exports.deleteFileFromCloudinary = deleteFileFromCloudinary;
// Update brand
const updateBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filePath;
    let compressedPath;
    try {
        const { name, description, isActive } = req.body;
        const brand = yield Brands_1.default.findById(req.params.id);
        if (!brand) {
            return (0, responseHandler_1.response)(res, 404, "Brand not found");
        }
        // Keep old logo public ID
        const oldLogoPublicId = brand.logoPublicId;
        // Update name
        if (name === null || name === void 0 ? void 0 : name.trim()) {
            brand.name = name.trim();
        }
        // Update description
        if (description !== undefined) {
            brand.description = description.trim();
        }
        // Update status
        if (isActive !== undefined) {
            brand.isActive =
                isActive === true ||
                    isActive === "true";
        }
        // Handle logo upload
        if (req.file) {
            console.log("req.file:", req.file);
            filePath = req.file.path;
            // Compress logo
            compressedPath = `${filePath}-compressed.webp`;
            yield (0, sharp_1.default)(filePath)
                .webp({ quality: 60 })
                .toFile(compressedPath);
            // Upload NEW logo to Cloudinary
            const upload = yield (0, cloudnaryConfig_1.uploadFileToCloudinary)(Object.assign(Object.assign({}, req.file), { path: compressedPath }));
            // Save NEW logo information
            brand.logo = upload.secure_url;
            brand.logoPublicId = upload.public_id;
        }
        // Save MongoDB first
        const updatedBrand = yield brand.save();
        // Delete OLD logo only after DB update succeeds
        if (req.file &&
            oldLogoPublicId &&
            oldLogoPublicId !== brand.logoPublicId) {
            try {
                yield (0, exports.deleteFileFromCloudinary)(oldLogoPublicId);
            }
            catch (cloudinaryError) {
                console.error("Failed to delete old Cloudinary logo:", cloudinaryError);
            }
        }
        // Remove temporary files
        if (filePath) {
            (0, removeFile_1.removeLocalFile)(filePath);
            filePath = undefined;
        }
        if (compressedPath) {
            (0, removeFile_1.removeLocalFile)(compressedPath);
            compressedPath = undefined;
        }
        return (0, responseHandler_1.response)(res, 200, "Brand updated successfully", updatedBrand);
    }
    catch (error) {
        console.error("Update brand error:", error);
        if (filePath) {
            (0, removeFile_1.removeLocalFile)(filePath);
        }
        if (compressedPath) {
            (0, removeFile_1.removeLocalFile)(compressedPath);
        }
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.updateBrand = updateBrand;
// export const updateBrand = async (req: Request, res: Response) => {
//   try {
//     const { name, description, logo } = req.body;
//     const brand = await Brand.findById(req.params.id);
//     if (!brand) {
//       return response(res, 404, "Brand not found");
//     }
//     if (name) brand.name = name;
//     if (description) brand.description = description;
//     if (logo) brand.logo = logo;
//     const updatedBrand = await brand.save();
//     return response(res, 200, "Brand updated successfully", updatedBrand);
//   } catch (error) {
//     console.error(error);
//     return response(res, 500, "Internal Server Error");
//   }
// };
// Delete brand
const deleteBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brand = yield Brands_1.default.findById(req.params.id);
        if (!brand) {
            return (0, responseHandler_1.response)(res, 404, "Brand not found");
        }
        // Keep the Cloudinary public ID before deleting MongoDB document
        const logoPublicId = brand.logoPublicId;
        // Delete brand from MongoDB
        yield Brands_1.default.findByIdAndDelete(req.params.id);
        // Delete logo from Cloudinary
        if (logoPublicId) {
            try {
                yield (0, exports.deleteFileFromCloudinary)(logoPublicId);
            }
            catch (cloudinaryError) {
                console.error("Failed to delete brand logo from Cloudinary:", cloudinaryError);
            }
        }
        return (0, responseHandler_1.response)(res, 200, "Brand deleted successfully");
    }
    catch (error) {
        console.error("Delete brand error:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.deleteBrand = deleteBrand;
