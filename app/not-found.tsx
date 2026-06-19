import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center mb-6">
        <Building2 size={30} className="text-white" />
      </div>

      <h1 className="text-8xl font-display font-800 text-brand-600 leading-none mb-4">404</h1>
      <h2 className="text-2xl font-display font-700 text-neutral-900 mb-3">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-neutral-500 max-w-md mb-8 leading-relaxed">
        Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.
        Silakan kembali ke beranda.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 btn-primary py-2.5 px-6 text-sm"
        >
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 btn-secondary py-2.5 px-6 text-sm"
        >
          Lihat Portfolio
        </Link>
      </div>
    </div>
  );
}
