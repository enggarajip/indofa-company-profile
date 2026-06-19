import Link from "next/link";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";
import { getProjects } from "@/lib/actions/projects";
import { ProjectCard } from "@/components/public/ProjectCard";
import { COMPANY, SERVICES, VALUES, WHY_US } from "@/lib/config/company";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: COMPANY.name,
  description: COMPANY.description,
  openGraph: {
    title: COMPANY.name,
    description: COMPANY.description,
    url: COMPANY.url,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: COMPANY.name }],
  },
};

// Icon map sederhana — tidak perlu dependency tambahan
const SERVICE_EMOJI: Record<string, string> = {
  building: "🏢", bridge: "🌉", home: "🏘️",
  factory: "🏭", landmark: "🏛️", wrench: "🔧",
};
const VALUE_EMOJI: Record<string, string> = {
  shield: "🛡️", star: "⭐", "hard-hat": "⛑️", lightbulb: "💡",
};

export default async function HomePage() {
  const result   = await getProjects({ orderBy: "created_at_desc", limit: 6 });
  const projects = result.success ? result.data : [];

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-950">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f59e0b 0%, transparent 40%)" }}
        />

        <div className="relative container-content py-24 z-10">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-white/80 text-sm font-500">
                {COMPANY.experience}+ Tahun Pengalaman Konstruksi
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-800 text-white leading-[1.1] mb-6">
              {COMPANY.tagline}
            </h1>

            <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-2xl">
              {COMPANY.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/portfolio" className="btn-primary text-base px-7 py-3.5 gap-2">
                Lihat Portfolio <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-600 text-white border-2 border-white/30 hover:border-white/60 rounded-lg transition-colors"
              >
                <Phone size={18} /> Hubungi Kami
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 20C1200 70 960 0 720 30C480 60 240 10 0 40L0 80Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="bg-neutral-50 py-14">
        <div className="container-content">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-4xl font-display font-800 text-brand-600 mb-1">{value}</p>
                <p className="text-sm text-neutral-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT INTRO ───────────────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent-500 font-600 text-sm uppercase tracking-widest mb-3">
                Tentang Kami
              </p>
              <h2 className="text-3xl lg:text-4xl font-display font-700 text-neutral-900 leading-tight mb-6">
                Kontraktor Terpercaya Sejak {COMPANY.founded}
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-6">
                {COMPANY.description}
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Berpengalaman di lebih dari 200 proyek nasional",
                  "Tim tenaga ahli bersertifikat internasional",
                  "Standar keselamatan kerja tertinggi (zero accident)",
                  "Tepat waktu dan sesuai anggaran",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-neutral-600">
                    <CheckCircle size={18} className="text-brand-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/about" className="btn-secondary">
                Selengkapnya <ArrowRight size={16} />
              </Link>
            </div>
            {/* Company Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-card-hover">
                <img
                  src="/company.jpeg"
                  alt="PT Indofa Gemilang Konstruksi"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-card-hover p-5 border border-neutral-100">
                <p className="text-3xl font-display font-800 text-brand-600">
                  {COMPANY.experience}+
                </p>
                <p className="text-sm text-neutral-500 mt-0.5">
                  Tahun Pengalaman
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <section className="section bg-neutral-50">
        <div className="container-content">
          <div className="text-center mb-14">
            <p className="text-accent-500 font-600 text-sm uppercase tracking-widest mb-3">Layanan</p>
            <h2 className="text-3xl lg:text-4xl font-display font-700 text-neutral-900 mb-4">
              Lingkup Pekerjaan
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Kami mengerjakan berbagai jenis proyek konstruksi dari skala kecil hingga proyek nasional berskala besar.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-brand-200 hover:shadow-card-hover transition-all group"
              >
                <div className="text-3xl mb-4">{SERVICE_EMOJI[s.icon] ?? "🏗️"}</div>
                <h3 className="font-display font-600 text-neutral-900 mb-2 group-hover:text-brand-700 transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ─────────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-content">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-accent-500 font-600 text-sm uppercase tracking-widest mb-3">Portfolio</p>
              <h2 className="text-3xl lg:text-4xl font-display font-700 text-neutral-900">
                Proyek Unggulan
              </h2>
            </div>
            <Link href="/portfolio" className="btn-secondary text-sm py-2.5 px-5">
              Semua Proyek <ArrowRight size={15} />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-20 text-neutral-400">
              <p className="text-4xl mb-4">🏗️</p>
              <p>Proyek akan segera ditampilkan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────────────────────── */}
      <section className="section bg-brand-950">
        <div className="container-content">
          <div className="text-center mb-14">
            <p className="text-accent-400 font-600 text-sm uppercase tracking-widest mb-3">Nilai Kami</p>
            <h2 className="text-3xl lg:text-4xl font-display font-700 text-white mb-4">
              Mengapa Memilih Kami
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="text-3xl mb-4">{VALUE_EMOJI[v.icon] ?? "✨"}</div>
                <h3 className="font-display font-600 text-white mb-2">{v.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="section bg-brand-600">
        <div className="container-content text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-700 text-white mb-4">
            Siap Memulai Proyek Anda?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Konsultasikan kebutuhan konstruksi Anda bersama tim ahli kami. Estimasi gratis, tanpa komitmen.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-700 font-600 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <Phone size={18} /> Hubungi Sekarang
            </Link>
            <a
              href={`https://wa.me/${COMPANY.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 text-white font-600 rounded-lg hover:bg-green-600 transition-colors"
            >
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
