import { uploadImage as cloudinaryUpload } from "../utils/uploadImage";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Upload a single File to Cloudinary.
 * Validates type and size before uploading.
 * @param {File} file
 * @param {string} path  — unused (Cloudinary uses upload_preset for folder routing)
 * @param {(progress: number) => void} onProgress  — 0 on start, 100 on complete
 * @returns {Promise<string>} permanent Cloudinary URL
 */
export function uploadImage(file, path, onProgress) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return Promise.reject(new Error(`Định dạng không hỗ trợ: ${file.type}. Chỉ chấp nhận JPG, PNG, WebP, GIF.`));
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return Promise.reject(new Error(`Ảnh vượt quá ${MAX_FILE_SIZE_MB}MB.`));
  }

  onProgress?.(0);
  return cloudinaryUpload(file).then((url) => {
    onProgress?.(100);
    return url;
  });
}
