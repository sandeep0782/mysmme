import multer from "multer";
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";
import dotenv from "dotenv";
import { RequestHandler } from "express";
import crypto from "crypto";
import sharp from "sharp";
import { checkImageForNudity } from "../utils/nsfwDetector";

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
): Promise<{
  url: string;
  hash: string;
}> => {
  if (!imageUrl) {
    throw new Error("Image URL is required");
  }

  // ----------------------------------------------------------
  // VALIDATE URL
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
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
    });
  } catch (error) {
    if ((error as Error)?.name === "AbortError") {
      throw new Error(
        `Image download timed out after 30 seconds: ${imageUrl}`,
      );
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

  // ----------------------------------------------------------
  // MAX FILE SIZE CHECK
  // ----------------------------------------------------------

  const MAX_IMAGE_SIZE = 15 * 1024 * 1024;

  if (buffer.length > MAX_IMAGE_SIZE) {
    throw new Error(
      `Image is too large (${Math.round(
        buffer.length / 1024 / 1024,
      )} MB). Maximum allowed size is 15 MB.`,
    );
  }

  // ----------------------------------------------------------
  // READ IMAGE METADATA
  // ----------------------------------------------------------

  let metadata: sharp.Metadata;

  try {
    metadata = await sharp(buffer, {
      failOn: "none",
    }).metadata();
  } catch {
    throw new Error(`Unable to read image: ${imageUrl}`);
  }

  const width = metadata.width;
  const height = metadata.height;

  if (!width || !height) {
    throw new Error("Unable to determine image dimensions");
  }

  // ----------------------------------------------------------
  // EXACT IMAGE SIZE VALIDATION
  // ----------------------------------------------------------

  const REQUIRED_WIDTH = 1080;
  const REQUIRED_HEIGHT = 1440;

  console.log("IMAGE SIZE CHECK", {
    required: `${REQUIRED_WIDTH}x${REQUIRED_HEIGHT}`,
    received: `${width}x${height}`,
    imageUrl,
  });

  if (width !== REQUIRED_WIDTH || height !== REQUIRED_HEIGHT) {
    throw new Error(
      `Image size is not matching. Required size is ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT}px, received ${width}x${height}px.`,
    );
  }

  // ==========================================================
  // IMPORTANT:
  // DO NOT RESIZE, CROP, ROTATE OR RE-ENCODE THE IMAGE.
  // Upload the original buffer exactly as downloaded.
  // ==========================================================

  const uploadBuffer = buffer;

  // ==========================================================
  // NUDITY / NSFW CHECK
  // ==========================================================

  const nudityCheck = await checkImageForNudity(uploadBuffer);

  if (!nudityCheck.safe) {
    throw new Error(
      "Image rejected: potentially explicit content detected",
    );
  }

  // ----------------------------------------------------------
  // IMAGE HASH
  // ----------------------------------------------------------

  const imageHash = crypto
    .createHash("sha256")
    .update(uploadBuffer)
    .digest("hex");

  // ----------------------------------------------------------
  // CREATE STABLE PUBLIC ID
  // ----------------------------------------------------------

  const sourceHash = crypto
    .createHash("sha1")
    .update(imageUrl)
    .digest("hex");

  const publicId = `product-${sourceHash}`;

  // ----------------------------------------------------------
  // UPLOAD ORIGINAL BUFFER TO CLOUDINARY
  // ----------------------------------------------------------

  const uploadOptions: UploadApiOptions = {
    resource_type: "image",
    folder,
    public_id: publicId,
    overwrite: true,
    invalidate: true,
  };

  const result = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result) {
            return reject(
              new Error("Cloudinary upload returned no result"),
            );
          }

          resolve(result);
        },
      );

      uploadStream.end(uploadBuffer);
    },
  );

  console.log("CLOUDINARY UPLOAD", {
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    url: result.secure_url,
  });

  // ----------------------------------------------------------
  // VERIFY CLOUDINARY DID NOT CHANGE DIMENSIONS
  // ----------------------------------------------------------

  if (
    result.width !== REQUIRED_WIDTH ||
    result.height !== REQUIRED_HEIGHT
  ) {
    throw new Error(
      `Uploaded image dimensions are incorrect. Expected ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT}px but Cloudinary returned ${result.width}x${result.height}px.`,
    );
  }

  return {
    url: result.secure_url,
    hash: imageHash,
  };
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