import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { COMPANY, VISION, MISSION, VALUES, WHY_US } from "@/lib/config/company";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: `Kenali lebih dalam ${COMPANY.name} — perusahaan konstruksi terpercaya sejak ${COMPANY.founded} dengan pengalaman lebih dari ${COMPANY.experience} tahun.`,
  alternates: {
    canonical: `${COMPANY.url}/about`,
  },
  openGraph: {
    title: `Tentang Kami | ${COMPANY.name}`,
    description: `Profil, visi, misi, dan nilai-nilai ${COMPANY.name}.`,
    url: `${COMPANY.url}/about`,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: COMPANY.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Tentang Kami | ${COMPANY.name}`,
    description: `Profil, visi, misi, dan nilai-nilai ${COMPANY.name}.`,
  },
};

const VALUE_EMOJI: Record<string, string> = {
  shield: "🛡️", star: "⭐", "hard-hat": "⛑️", lightbulb: "💡",
};

const MILESTONES = [
  {
    year:  COMPANY.founded,
    event: "Resmi berdiri sebagai PT. Indofa Gemilang Konstruksi melalui Akte Pendirian Perusahaan, setelah sebelumnya beroperasi sebagai CV. Indofa di bidang sipil dan konstruksi.",
  },
  {
    year:  COMPANY.founded + 1,
    event: "Memperoleh Surat Keputusan (SK) Menteri Hukum dan HAM RI sebagai legalitas resmi badan usaha.",
  },
  {
    year:  2025,
    event: "Melakukan Akte Perubahan Perusahaan dan memperoleh SK Menkumham RI terbaru, menandai perkembangan struktur perusahaan.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-brand-950 to-brand-800 py-24">
        <div className="container-content text-center">
          <p className="text-accent-400 font-600 text-sm uppercase tracking-widest mb-4">Tentang Kami</p>
          <h1 className="text-4xl lg:text-5xl font-display font-700 text-white mb-5 max-w-3xl mx-auto leading-tight">
            Membangun Kepercayaan Sejak {COMPANY.founded}
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
            {COMPANY.description}
          </p>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-neutral-200">
        <div className="container-content py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_US.map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-4xl font-display font-800 text-brand-600 mb-1">{value}</p>
                <p className="text-sm text-neutral-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROFILE ───────────────────────────────────────────────────────────── */}
      <section className="section bg-neutral-50">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-accent-500 font-600 text-sm uppercase tracking-widest mb-3">Profil Perusahaan</p>
              <h2 className="text-3xl font-display font-700 text-neutral-900 mb-6">
                Siapa Kami
              </h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>
                  <strong className="text-neutral-800 font-600">{COMPANY.name}</strong> berawal
                  dari usaha di bidang sipil dan konstruksi, mengerjakan proyek pembangunan rumah
                  tinggal dan gudang. Seiring waktu, lingkup usaha berkembang ke bidang interior
                  fit out dan disain perencanaan.
                </p>
                <p>
                  Dengan perkembangan bidang usaha yang cepat, dibentuklah CV. Indofa, yang kemudian
                  berkembang dan berubah menjadi <strong className="text-neutral-800 font-600">PT.
                  Indofa Gemilang Konstruksi</strong> — perusahaan General Contractor, Trading and
                  Consultant yang bergerak di bidang Konstruksi Umum, Gambar dan Perencanaan, serta
                  Pengawasan.
                </p>
                <p>
                  Dengan cakupan bidang usaha tersebut, pengguna jasa layanan kami dapat menerima
                  pelayanan prima yang terintegrasi antara pelaksanaan, perencanaan, dan pengawasan
                  dalam satu atap.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-neutral-200 p-4">
                  <p className="text-2xl font-display font-700 text-brand-600">PT</p>
                  <p className="text-xs text-neutral-500 mt-1">General Contractor, Trading &amp; Consultant</p>
                </div>
                <div className="bg-white rounded-xl border border-neutral-200 p-4">
                  <p className="text-2xl font-display font-700 text-brand-600">{COMPANY.founded}</p>
                  <p className="text-xs text-neutral-500 mt-1">Tahun Pendirian Resmi</p>
                </div>
              </div>
            </div>

            {/* Visual */}
            {/*
              ASSET DIBUTUHKAN (3 foto):
              1. Box besar atas  : foto tim/kantor — rasio 4:3, landscape.
              2. Box kecil kiri  : foto contoh proyek gedung — rasio 1:1 (square).
              3. Box kecil kanan : foto contoh proyek infrastruktur — rasio 1:1 (square).
              Cara ganti: replace masing-masing wrapper gradient di bawah dengan
              komponen Image (fill, object-cover), lalu hapus emoji placeholder-nya.
            */}
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center overflow-hidden">
                <div className="text-center text-white/20">
                  <div className="text-8xl mb-3">🏗️</div>
                  <p className="text-sm">Ganti dengan foto tim / kantor</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                  <div className="text-center text-white/30 text-5xl">🏢</div>
                </div>
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                  <div className="text-center text-white/30 text-5xl">🌉</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VISI & MISI ───────────────────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Visi */}
            <div className="bg-brand-950 rounded-3xl p-8 lg:p-10">
              <div className="w-12 h-12 rounded-xl bg-accent-500 flex items-center justify-center mb-6 text-2xl">
                🎯
              </div>
              <h2 className="text-2xl font-display font-700 text-white mb-4">Visi</h2>
              <p className="text-white/70 leading-relaxed text-lg">{VISION}</p>
            </div>

            {/* Misi */}
            <div className="bg-neutral-50 rounded-3xl p-8 lg:p-10 border border-neutral-200">
              <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-6 text-2xl">
                🚀
              </div>
              <h2 className="text-2xl font-display font-700 text-neutral-900 mb-5">Misi</h2>
              <ul className="space-y-3">
                {MISSION.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-neutral-600">
                    <CheckCircle size={16} className="text-brand-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── NILAI ─────────────────────────────────────────────────────────────── */}
      <section className="section bg-neutral-50">
        <div className="container-content">
          <div className="text-center mb-14">
            <p className="text-accent-500 font-600 text-sm uppercase tracking-widest mb-3">Nilai Perusahaan</p>
            <h2 className="text-3xl font-display font-700 text-neutral-900">
              Yang Kami Pegang Teguh
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl border border-neutral-200 p-6 hover:border-brand-200 hover:shadow-card-hover transition-all"
              >
                <div className="text-4xl mb-4">{VALUE_EMOJI[v.icon] ?? "✨"}</div>
                <h3 className="font-display font-600 text-neutral-900 mb-2">{v.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ──────────────────────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-content">
          <div className="text-center mb-14">
            <p className="text-accent-500 font-600 text-sm uppercase tracking-widest mb-3">Perjalanan Kami</p>
            <h2 className="text-3xl font-display font-700 text-neutral-900">
              Milestone Perusahaan
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[calc(4rem-1px)] top-0 bottom-0 w-px bg-neutral-200 hidden sm:block" />

              <div className="space-y-8">
                {MILESTONES.map(({ year, event }, i) => (
                  <div key={i} className="flex gap-6 sm:gap-8 items-start group">
                    {/* Year badge */}
                    <div className="flex-shrink-0 w-16 sm:w-32 flex sm:justify-end">
                      <div className="relative">
                        <span className="inline-block bg-brand-600 text-white text-xs font-700 px-3 py-1.5 rounded-full sm:rounded-lg">
                          {year}
                        </span>
                        {/* Dot on the line */}
                        <div className="hidden sm:block absolute -right-[calc(0.5rem+1px)] top-1/2 -translate-y-1/2 w-3 h-3 bg-brand-600 rounded-full border-2 border-white shadow-sm" />
                      </div>
                    </div>
                    {/* Event */}
                    <div className="flex-1 pb-2">
                      <p className="text-neutral-700 leading-relaxed text-sm sm:text-base">{event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section className="section bg-brand-600">
        <div className="container-content text-center">
          <h2 className="text-3xl font-display font-700 text-white mb-4">
            Mari Berkolaborasi
          </h2>
          <p className="text-white/80 max-w-lg mx-auto mb-8">
            Percayakan proyek konstruksi Anda kepada tim profesional kami yang berpengalaman.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/portfolio" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-brand-700 font-600 rounded-lg hover:bg-neutral-50 transition-colors">
              Lihat Portfolio <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-800 text-white font-600 rounded-lg hover:bg-brand-950 transition-colors">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
