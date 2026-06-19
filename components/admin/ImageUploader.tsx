"use client";

import { useRef, useState, useCallback, useId } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { uploadProjectImage } from "@/lib/actions/projects";
import { getStorageUrl, cn } from "@/lib/utils";

// ─── Single Image Uploader (untuk cover) ─────────────────────────────────────

type SingleUploaderProps = {
  projectId:   string;
  currentPath: string;              // path Storage yang sudah tersimpan
  onChange:    (path: string) => void;
  onError:     (msg: string) => void;
  label?:      string;
};

export function SingleImageUploader({
  projectId,
  currentPath,
  onChange,
  onError,
  label = "Foto Cover",
}: SingleUploaderProps) {
  const [uploading, setUploading]   = useState(false);
  const [preview,   setPreview]     = useState<string | null>(
    currentPath ? getStorageUrl(currentPath) : null
  );
  const inputRef  = useRef<HTMLInputElement>(null);
  const dropzoneId = useId();

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        onError("File harus berupa gambar (JPG, PNG, atau WebP).");
        return;
      }
      setUploading(true);
      // Local preview segera tampil
      setPreview(URL.createObjectURL(file));

      const result = await uploadProjectImage(file, projectId);
      setUploading(false);

      if (!result.success) {
        onError(result.error);
        setPreview(currentPath ? getStorageUrl(currentPath) : null);
        return;
      }
      onChange(result.data.path);
    },
    [projectId, currentPath, onChange, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const openFileDialog = () => {
    if (!uploading) inputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Aktifkan dropzone dengan keyboard (Enter atau Space), sama seperti klik mouse
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFileDialog();
    }
  };

  return (
    <div>
      <span id={`${dropzoneId}-label`} className="admin-label">{label}</span>
      <div
        role="button"
        tabIndex={uploading ? -1 : 0}
        aria-labelledby={`${dropzoneId}-label`}
        aria-describedby={`${dropzoneId}-hint`}
        aria-disabled={uploading}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={openFileDialog}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-colors",
          "focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2",
          uploading
            ? "border-brand-300 bg-brand-50"
            : "border-neutral-200 hover:border-brand-400 hover:bg-brand-50/50"
        )}
        style={{ minHeight: "180px" }}
      >
        {preview ? (
          <div className="relative w-full h-48">
            <Image src={preview} alt={`Pratinjau ${label.toLowerCase()}`} fill className="object-cover" unoptimized />
            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-brand-600" aria-hidden="true" />
                <span className="sr-only">Mengupload foto...</span>
              </div>
            )}
            {!uploading && (
              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                <p className="text-white text-sm font-500">Klik untuk ganti foto</p>
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                onChange("");
              }}
              aria-label={`Hapus ${label.toLowerCase()}`}
              className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 text-neutral-500 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-10 px-4">
            {uploading ? (
              <Loader2 size={28} className="animate-spin text-brand-500" aria-hidden="true" />
            ) : (
              <Upload size={28} className="text-neutral-300" aria-hidden="true" />
            )}
            <p className="text-sm text-neutral-500 text-center">
              {uploading ? "Mengupload..." : "Seret foto ke sini atau klik untuk pilih"}
            </p>
            <p id={`${dropzoneId}-hint`} className="text-xs text-neutral-400">
              JPG, PNG, WebP · Maks 10 MB
            </p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ─── Multi Image Uploader (untuk galeri) ─────────────────────────────────────

type MultiUploaderProps = {
  projectId:     string;
  currentPaths:  string[];
  onChange:      (paths: string[]) => void;
  onError:       (msg: string) => void;
};

export function MultiImageUploader({
  projectId,
  currentPaths,
  onChange,
  onError,
}: MultiUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [paths,     setPaths]     = useState<string[]>(currentPaths);
  const inputRef  = useRef<HTMLInputElement>(null);
  const dropzoneId = useId();

  const handleFiles = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (fileArray.length === 0) {
        onError("Pilih file gambar (JPG, PNG, atau WebP).");
        return;
      }

      setUploading(true);
      const newPaths: string[] = [];

      for (const file of fileArray) {
        const result = await uploadProjectImage(file, projectId);
        if (result.success) {
          newPaths.push(result.data.path);
        } else {
          onError(`Gagal upload "${file.name}": ${result.error}`);
        }
      }

      setUploading(false);
      // Functional update: tidak bergantung pada closure `paths` yang bisa stale
      // jika user memicu upload baru sebelum upload sebelumnya selesai.
      setPaths((prevPaths) => {
        const updated = [...prevPaths, ...newPaths];
        onChange(updated);
        return updated;
      });
    },
    [projectId, onChange, onError]
  );

  const removeImage = (index: number) => {
    setPaths((prevPaths) => {
      const updated = prevPaths.filter((_, i) => i !== index);
      onChange(updated);
      return updated;
    });
  };

  const openFileDialog = () => {
    if (!uploading) inputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFileDialog();
    }
  };

  return (
    <div>
      <span id={`${dropzoneId}-label`} className="admin-label">Galeri Foto</span>

      {/* Grid preview */}
      {paths.length > 0 && (
        <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3" aria-label="Daftar foto galeri yang sudah diupload">
          {paths.map((p, i) => (
            <li key={p + i} className="relative aspect-square rounded-lg overflow-hidden group list-none">
              <Image
                src={getStorageUrl(p)}
                alt={`Foto galeri proyek ke-${i + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label={`Hapus foto galeri ke-${i + 1}`}
                className="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity shadow hover:bg-red-50 text-neutral-500 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2"
              >
                <X size={12} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={uploading ? -1 : 0}
        aria-labelledby={`${dropzoneId}-label`}
        aria-describedby={`${dropzoneId}-hint`}
        aria-disabled={uploading}
        onDrop={(e) => {
          e.preventDefault();
          if (!uploading) handleFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => e.preventDefault()}
        onClick={openFileDialog}
        onKeyDown={handleKeyDown}
        className={cn(
          "border-2 border-dashed rounded-xl cursor-pointer transition-colors py-6 px-4 text-center",
          "focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2",
          uploading
            ? "border-brand-300 bg-brand-50"
            : "border-neutral-200 hover:border-brand-400 hover:bg-brand-50/50"
        )}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={22} className="animate-spin text-brand-500" aria-hidden="true" />
            <p className="text-sm text-neutral-500">Mengupload foto...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ImageIcon size={22} className="text-neutral-300" aria-hidden="true" />
            <p className="text-sm text-neutral-500">
              Seret beberapa foto atau klik untuk pilih
            </p>
            <p id={`${dropzoneId}-hint`} className="text-xs text-neutral-400">
              JPG, PNG, WebP · Maks 10 MB per foto
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
