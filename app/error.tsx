"use client";

// app/error.tsx
//
// Global Error Boundary Next.js (App Router).
// Otomatis menangkap error runtime yang terjadi di Server Component atau
// Client Component mana pun di bawah root layout, lalu menampilkan halaman
// ini sebagai pengganti white screen of death.
//
// Catatan: file ini WAJIB berupa Client Component ("use client") sesuai
// kontrak Next.js untuk error boundary.

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Catat error ke logger — di production otomatis aman (tanpa stack trace
    // mentah), dan ini adalah titik yang sama yang akan terhubung ke Sentry
    // nanti jika sudah diaktifkan (lihat komentar MONITORING PREPARATION
    // di lib/logger.ts).
    logger.error("Unhandled error tertangkap di Error Boundary", error, {
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4 text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-6" aria-hidden="true">
        <AlertTriangle size={28} className="text-red-600" />
      </div>

      <h1 className="text-2xl font-display font-700 text-neutral-900 mb-3">
        Terjadi Kesalahan
      </h1>
      <p className="text-neutral-500 max-w-md mb-2 leading-relaxed">
        Mohon maaf, terjadi gangguan teknis saat memuat halaman ini.
        Tim kami akan segera memeriksanya.
      </p>

      {/* Digest error: aman ditampilkan ke pengguna (bukan stack trace),
          berguna sebagai referensi jika pengguna melaporkan masalah ke admin. */}
      {error.digest && (
        <p className="text-xs text-neutral-400 mb-8 font-mono">
          Kode referensi: {error.digest}
        </p>
      )}
      {!error.digest && <div className="mb-8" />}

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 btn-primary py-2.5 px-6 text-sm"
        >
          <RotateCcw size={16} aria-hidden="true" /> Coba Lagi
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 btn-secondary py-2.5 px-6 text-sm"
        >
          <Home size={16} aria-hidden="true" /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
