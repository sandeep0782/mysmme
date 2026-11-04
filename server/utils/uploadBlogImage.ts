import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";

import { uploadFileToCloudinary } from "../config/cloudnaryConfig";
import { removeLocalFile } from "../config/removeFile";

export const uploadBlogImage = async (
  file: Express.Multer.File
) => {
  const originalPath = file.path;
  const compressedPath = `${originalPath}-compressed.webp`;

  try {
    // Validate actual image contents, not only MIME type.
    const metadata = await sharp(originalPath).metadata();

    if (!["jpeg", "png", "webp"].includes(metadata.format || "")) {
      throw new Error("Unsupported blog image format");
    }

    // Convert and compress featured image.
    await sharp(originalPath)
      .rotate()
      .resize({
        width: 1600,
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toFile(compressedPath);

    // Upload to Cloudinary.
    const upload = await uploadFileToCloudinary({
      ...file,
      path: compressedPath,
    });

    return {
      featuredImage: upload.secure_url,
      featuredImagePublicId: upload.public_id,
    };
  } finally {
    removeLocalFile(originalPath);
    removeLocalFile(compressedPath);
  }
};

export const deleteBlogImage = async (publicId?: string) => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
};