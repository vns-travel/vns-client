const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Upload a single File to storage.
 * @param {File} file
 * @param {string} path  — storage path prefix, e.g. "services/tour"
 * @param {(progress: number) => void} onProgress  — 0–100
 * @returns {Promise<string>} download URL
 */
export function uploadImage(file, path, onProgress) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return Promise.reject(new Error(`Định dạng không hỗ trợ: ${file.type}. Chỉ chấp nhận JPG, PNG, WebP, GIF.`));
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return Promise.reject(new Error(`Ảnh vượt quá ${MAX_FILE_SIZE_MB}MB.`));
  }

  // TODO: implement upload via backend or alternative storage provider
  return Promise.reject(new Error("Upload chưa được cấu hình."));
}
