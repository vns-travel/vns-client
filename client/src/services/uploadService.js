import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Upload a single File to Firebase Storage.
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

  // Unique filename: path/timestamp-randomhex.ext
  const ext = file.name.split(".").pop();
  const filename = `${path}/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
  const storageRef = ref(storage, filename);
  const task = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => {
        if (onProgress) {
          onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        }
      },
      reject,
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}
