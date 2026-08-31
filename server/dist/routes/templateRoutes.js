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
const express_1 = require("express");
const productTemplate_1 = require("../templates/productTemplate");
const ProductAttribute_1 = __importDefault(require("../models/ProductAttribute"));
const Brands_1 = __importDefault(require("../models/Brands"));
const Category_1 = __importDefault(require("../models/Category"));
const Color_1 = __importDefault(require("../models/Color"));
const Season_1 = __importDefault(require("../models/Season"));
const Gst_1 = __importDefault(require("../models/Gst"));
const router = (0, express_1.Router)();
router.get("/product", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ============================================================
        // GET SYSTEM DATA
        // ============================================================
        const [brands, categories, colors, seasons, gsts, attributes] = yield Promise.all([
            Brands_1.default.find({ isActive: true })
                .select("_id name")
                .sort({ name: 1 })
                .lean(),
            Category_1.default.find({ isActive: true })
                .select("_id name")
                .sort({ name: 1 })
                .lean(),
            Color_1.default.find({ isActive: true })
                .select("_id name")
                .sort({ name: 1 })
                .lean(),
            Season_1.default.find({ isActive: true })
                .select("_id name")
                .sort({ name: 1 })
                .lean(),
            Gst_1.default.find({ isActive: true })
                .select("_id percentage")
                .sort({ percentage: 1 })
                .lean(),
            ProductAttribute_1.default.find({
                isActive: true,
            })
                .select("_id type value parentId isActive sortOrder")
                .sort({
                type: 1,
                sortOrder: 1,
                value: 1,
            })
                .lean(),
        ]);
        // ============================================================
        // GENERATE WORKBOOK
        // ============================================================
        const workbook = yield (0, productTemplate_1.generateProductImportTemplate)({
            brands: brands.map((item) => ({
                _id: item._id.toString(),
                name: item.name,
            })),
            categories: categories.map((item) => ({
                _id: item._id.toString(),
                name: item.name,
            })),
            colors: colors.map((item) => ({
                _id: item._id.toString(),
                name: item.name,
            })),
            seasons: seasons.map((item) => ({
                _id: item._id.toString(),
                name: item.name,
            })),
            gsts: gsts.map((item) => ({
                _id: item._id.toString(),
                percentage: Number(item.percentage),
            })),
            attributes: attributes.map((item) => ({
                _id: item._id.toString(),
                type: item.type,
                value: item.value,
                parentId: item.parentId ? item.parentId.toString() : null,
                isActive: item.isActive,
                sortOrder: item.sortOrder,
            })),
        });
        // ============================================================
        // CONVERT WORKBOOK -> XLSX BUFFER
        // ============================================================
        const buffer = yield workbook.xlsx.writeBuffer();
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", 'attachment; filename="Saree-Fill-This.xlsx"');
        res.setHeader("Content-Length", buffer.byteLength.toString());
        return res.status(200).send(buffer);
    }
    catch (error) {
        console.error("Failed to generate product import template:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate product import template.",
        });
    }
}));
exports.default = router;
