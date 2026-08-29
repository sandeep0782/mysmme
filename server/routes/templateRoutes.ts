import { Router } from "express";
import { generateProductImportTemplate } from "../templates/productTemplate";
import ProductAttribute from "../models/ProductAttribute";
import Brand from "../models/Brands";
import Category from "../models/Category";
import Color from "../models/Color";
import Season from "../models/Season";
import GST from "../models/Gst";

const router = Router();

router.get("/product", async (_req, res) => {
  try {
    // ============================================================
    // GET SYSTEM DATA
    // ============================================================
    const [brands, categories, colors, seasons, gsts, attributes] =
      await Promise.all([
        Brand.find({ isActive: true })
          .select("_id name")
          .sort({ name: 1 })
          .lean(),

        Category.find({ isActive: true })
          .select("_id name")
          .sort({ name: 1 })
          .lean(),

        Color.find({ isActive: true })
          .select("_id name")
          .sort({ name: 1 })
          .lean(),

        Season.find({ isActive: true })
          .select("_id name")
          .sort({ name: 1 })
          .lean(),

        GST.find({ isActive: true })
          .select("_id percentage")
          .sort({ percentage: 1 })
          .lean(),

        ProductAttribute.find({
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

    const workbook = await generateProductImportTemplate({
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

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Saree-Fill-This.xlsx"',
    );

    res.setHeader("Content-Length", buffer.byteLength.toString());

    return res.status(200).send(buffer);
  } catch (error) {
    console.error("Failed to generate product import template:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate product import template.",
    });
  }
});

export default router;
