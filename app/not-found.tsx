import Link from "next/link";
import { ArrowLeft, Search, HardHat } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4 text-center py-20">

      {/* Ilustrasi sederhana: ikon konstruksi + nomor 404 */}
      <div className="relative mb-8">
        <div className="text-[7rem] sm:text-[9rem] font-display font-800 text-brand-100 leading-none select-none" aria-hidden="true">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg" aria-hidden="true">
            <HardHat size={28} className="text-white" />
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-display font-700 text-neutral-900 mb-3">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-neutral-500 max-w-md mb-8 leading-relaxed">
        Sepertinya halaman yang Anda cari sedang &ldquo;dalam tahap pembangunan&rdquo;,
        sudah dipindahkan, atau memang tidak pernah ada. Mari kembali ke jalur yang benar.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 btn-primary py-2.5 px-6 text-sm"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Kembali ke Beranda
        </Link>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 btn-secondary py-2.5 px-6 text-sm"
        >
          <Search size={16} aria-hidden="true" /> Lihat Portfolio
        </Link>
      </div>
    </div>
  );
}
