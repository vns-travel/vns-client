import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { uploadImage } from "../services/uploadService";

const MAX_IMAGES = 10;

/**
 * ImageUpload — lets a partner pick up to MAX_IMAGES images, uploads each to
 * storage immediately, and reports the final URL array via onChange.
 *
 * Props:
 *   storagePath  {string}   — storage folder, e.g. "services/tour"
 *   urls         {string[]} — current list of already-uploaded URLs (controlled)
 *   onChange     {(urls: string[]) => void}
 *   label        {string}   — optional section label
 */
export default function ImageUpload({ storagePath, urls = [], onChange, label = "Hình ảnh" }) {
  const inputRef = useRef(null);
  // Per-file upload state: { file, previewUrl, progress, error, done }
  const [uploading, setUploading] = useState([]);

  const handleFiles = async (files) => {
    const remaining = MAX_IMAGES - urls.length - uploading.filter((u) => !u.done && !u.error).length;
    const picked = Array.from(files).slice(0, remaining);
    if (!picked.length) return;

    // Seed upload entries with local preview URLs so the user sees thumbnails immediately
    const entries = picked.map((file) => ({
      id: Math.random().toString(16).slice(2),
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      error: null,
      done: false,
    }));

    setUploading((prev) => [...prev, ...entries]);

    for (const entry of entries) {
      try {
        const url = await uploadImage(entry.file, storagePath, (pct) => {
          setUploading((prev) =>
            prev.map((u) => (u.id === entry.id ? { ...u, progress: pct } : u))
          );
        });

        // Mark done and bubble the new URL up
        setUploading((prev) =>
          prev.map((u) => (u.id === entry.id ? { ...u, done: true, progress: 100 } : u))
        );
        onChange([...urls, url]);

        // Clean up the object URL to free browser memory
        URL.revokeObjectURL(entry.previewUrl);

        // Remove completed entry from local state after a short delay so the user
        // sees the 100% state briefly before it moves to the confirmed grid.
        setTimeout(() => {
          setUploading((prev) => prev.filter((u) => u.id !== entry.id));
        }, 600);
      } catch (err) {
        setUploading((prev) =>
          prev.map((u) =>
            u.id === entry.id ? { ...u, error: err.message || "Tải lên thất bại", done: false } : u
          )
        );
      }
    }
  };

  const removeUploaded = (idx) => {
    onChange(urls.filter((_, i) => i !== idx));
  };

  const dismissError = (id) => {
    setUploading((prev) => prev.filter((u) => u.id !== id));
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const canAddMore = urls.length + uploading.filter((u) => !u.error).length < MAX_IMAGES;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {/* Drop zone */}
      {canAddMore && (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <p className="text-sm text-gray-500">
            Kéo thả hoặc <span className="text-primary font-medium">chọn ảnh</span>
          </p>
          <p className="text-xs text-gray-400">JPG, PNG, WebP · Tối đa 5MB / ảnh · {MAX_IMAGES - urls.length} ảnh còn lại</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Confirmed uploaded images */}
      {urls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-3">
          {urls.map((url, idx) => (
            <div key={url} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
              <img src={url} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] bg-black/50 text-white py-0.5">
                  Ảnh bìa
                </span>
              )}
              <button
                type="button"
                onClick={() => removeUploaded(idx)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* In-progress uploads */}
      {uploading.length > 0 && (
        <div className="space-y-2 mt-3">
          {uploading.map((u) => (
            <div key={u.id} className="flex items-center gap-3 border border-gray-200 rounded-lg p-2">
              {u.error ? (
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              ) : u.done ? (
                <ImageIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 truncate">{u.file.name}</p>
                {!u.error && (
                  <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-200"
                      style={{ width: `${u.progress}%` }}
                    />
                  </div>
                )}
                {u.error && <p className="text-xs text-red-500 mt-0.5">{u.error}</p>}
              </div>
              {u.error && (
                <button type="button" onClick={() => dismissError(u.id)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
