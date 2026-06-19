"use client";

import { useState, useTransition, useEffect, useRef, useId } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProjectWithMedia } from "@/lib/actions/projects";
import { cn } from "@/lib/utils";

export function DeleteButton({
  projectId,
  projectTitle,
  onSuccess,
  onError,
}: {
  projectId:    string;
  projectTitle: string;
  onSuccess?:   () => void;
  onError?:     (msg: string) => void;
}) {
  const [confirm, setConfirm]      = useState(false);
  const [pending, startTransition] = useTransition();
  const dialogTitleId = useId();
  const cancelBtnRef   = useRef<HTMLButtonElement>(null);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProjectWithMedia(projectId);
      setConfirm(false);
      if (result.success) onSuccess?.();
      else onError?.(result.error);
    });
  };

  // Auto-focus tombol "Batal" saat dialog terbuka (default aman, mencegah hapus tidak sengaja)
  useEffect(() => {
    if (confirm) cancelBtnRef.current?.focus();
  }, [confirm]);

  // Tutup dialog dengan tombol Escape
  useEffect(() => {
    if (!confirm) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) setConfirm(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [confirm, pending]);

  return (
    <>
      <button
        onClick={() => setConfirm(true)}
        aria-label={`Hapus proyek ${projectTitle}`}
        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2"
      >
        <Trash2 size={15} aria-hidden="true" />
      </button>

      {confirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !pending && setConfirm(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
              <Trash2 size={22} className="text-red-600" />
            </div>
            <h3 id={dialogTitleId} className="text-base font-display font-600 text-neutral-900 mb-2">
              Hapus Proyek?
            </h3>
            <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
              <span className="font-500 text-neutral-700">&ldquo;{projectTitle}&rdquo;</span>
              {" "}akan dihapus permanen beserta semua fotonya. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                ref={cancelBtnRef}
                onClick={() => setConfirm(false)}
                disabled={pending}
                className="flex-1 py-2.5 text-sm font-500 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={pending}
                aria-busy={pending}
                className={cn(
                  "flex-1 py-2.5 text-sm font-500 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors",
                  "flex items-center justify-center gap-2 disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-red-700 focus-visible:outline-offset-2"
                )}
              >
                {pending
                  ? <><Loader2 size={14} className="animate-spin" aria-hidden="true" /> Menghapus...</>
                  : "Ya, Hapus"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
