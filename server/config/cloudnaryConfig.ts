import multer from "multer";
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";
import dotenv from "dotenv";
import { RequestHandler } from "express";
import crypto from "crypto";

dotenv.config();

// ============================================================
// CLOUDINARY CONFIG
// ============================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// ============================================================
// TYPES
// ============================================================

interface CustomFile extends Express.Multer.File {
  path: string;
}

// ============================================================
// UPLOAD LOCAL FILE TO CLOUDINARY
// ============================================================

const uploadFileToCloudinary = (
  file: CustomFile,
): Promise<UploadApiResponse> => {
  const options: UploadApiOptions = {
    resource_type: "image",
  };

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, options, (error, result) => {
      if (error) {
        return reject(error);
      }

      resolve(result as UploadApiResponse);
    });
  });
};

// ============================================================
// DOWNLOAD IMAGE URL + UPLOAD TO CLOUDINARY
// ============================================================

export const uploadImageUrlToCloudinary = async (
  imageUrl: string,
  folder = "products",
): Promise<string> => {
  if (!imageUrl) {
    throw new Error("Image URL is required");
  }

  // ----------------------------------------------------------
  // Validate URL
  // ----------------------------------------------------------

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(imageUrl);
  } catch {
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
  }, 30_000);

  let response: Response;

  try {
    response = await fetch(imageUrl, {
      method: "GET",
      signal: controller.signal,
      headers: {
        // Some CDNs behave better with a normal browser UA.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
    });
  } catch (error) {
    if ((error as Error)?.name === "AbortError") {
      throw new Error(`Image download timed out after 30 seconds: ${imageUrl}`);
    }

    throw new Error(
      `Failed to download image: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  } finally {
    clearTimeout(timeout);
  }

  // ----------------------------------------------------------
  // CHECK RESPONSE
  // ----------------------------------------------------------

  if (!response.ok) {
    throw new Error(
      `Image download failed: HTTP ${response.status} ${response.statusText}`,
    );
  }

  // ----------------------------------------------------------
  // CHECK CONTENT TYPE
  // ----------------------------------------------------------

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.startsWith("image/")) {
    throw new Error(
      `URL did not return an image. Content-Type: ${contentType}`,
    );
  }

  // ----------------------------------------------------------
  // DOWNLOAD INTO BUFFER
  // ----------------------------------------------------------

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!buffer.length) {
    throw new Error(`Downloaded image is empty: ${imageUrl}`);
  }

  // Prevent accidentally downloading huge files.
  const MAX_IMAGE_SIZE = 15 * 1024 * 1024;

  if (buffer.length > MAX_IMAGE_SIZE) {
    throw new Error(
      `Image is too large (${Math.round(
        buffer.length / 1024 / 1024,
      )} MB): ${imageUrl}`,
    );
  }

  console.log(`Downloaded image: ${Math.round(buffer.length / 1024)} KB`);

  // ----------------------------------------------------------
  // CREATE STABLE PUBLIC ID
  // ----------------------------------------------------------

  const hash = crypto.createHash("sha1").update(imageUrl).digest("hex");

  const publicId = `product-${hash}`;

  // ----------------------------------------------------------
  // UPLOAD BUFFER TO CLOUDINARY
  // ----------------------------------------------------------

  const uploadOptions: UploadApiOptions = {
    resource_type: "image",
    folder,
    public_id: publicId,
    overwrite: false,
  };

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result as UploadApiResponse);
      },
    );

    uploadStream.end(buffer);
  });

  console.log(`Cloudinary upload successful: ${result.secure_url}`);

  return result.secure_url;
};

// ============================================================
// MULTIPLE PRODUCT IMAGES
// ============================================================

const multerMiddleware: RequestHandler = multer({
  dest: "uploads/",
}).array("images", 4);

// ============================================================
// BRAND LOGO
// ============================================================

const logoUploadMiddleware: RequestHandler = multer({
  dest: "uploads/",
}).single("logo");

// ============================================================
// CATEGORY IMAGE
// ============================================================

const categoryImageUploadMiddleware: RequestHandler = multer({
  dest: "uploads/",
}).single("image");

// ============================================================
// EXPORT
// ============================================================

export {
  multerMiddleware,
  uploadFileToCloudinary,
  logoUploadMiddleware,
  categoryImageUploadMiddleware,
};
