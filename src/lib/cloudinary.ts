import { v2 as cloudinary } from "cloudinary";

let isConfigured = false;

function ensureCloudinaryConfig() {
  if (isConfigured) {
    return;
  }

  const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
  } = process.env;

  if (
    !CLOUDINARY_CLOUD_NAME ||
    !CLOUDINARY_API_KEY ||
    !CLOUDINARY_API_SECRET
  ) {
    const envKeys = Object.keys(process.env).filter((key) =>
      key.includes("CLOUDINARY")
    );
    throw new Error(
      `Missing Cloudinary configuration. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env.local file.\n` +
        `Found Cloudinary-related env vars: ${envKeys.length > 0 ? envKeys.join(", ") : "none"}\n` +
        `Make sure you have a .env.local file in the root directory with all required Cloudinary variables.`
    );
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  isConfigured = true;
}

export async function uploadImageFromBuffer(
  buffer: Buffer,
  fileName: string,
  mimeType?: string
) {
  ensureCloudinaryConfig();
  
  const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || "portfolio";
  const base64 = buffer.toString("base64");
  const dataUri = `data:${mimeType || "application/octet-stream"};base64,${base64}`;
  return cloudinary.uploader.upload(dataUri, {
    folder: CLOUDINARY_FOLDER,
    public_id: fileName.replace(/\.[^/.]+$/, ""),
    overwrite: true,
    resource_type: "image",
  });
}

