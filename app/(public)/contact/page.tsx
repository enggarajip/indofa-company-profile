import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import { COMPANY } from "@/lib/config/company";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description: `Hubungi ${COMPANY.name} untuk konsultasi proyek konstruksi. Kami siap membantu Anda mewujudkan proyek impian.`,
  openGraph: {
    title: `Hubungi Kami | ${COMPANY.name}`,
    description: `Konsultasi gratis proyek konstruksi bersama ${COMPANY.name}.`,
    url: `${COMPANY.url}/contact`,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: COMPANY.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Hubungi Kami | ${COMPANY.name}`,
    description: `Konsultasi gratis proyek konstruksi bersama ${COMPANY.name}.`,
  },
};

const CONTACT_ITEMS = [
  {
    icon:  MapPin,
    label: "Alamat Kantor",
    value: COMPANY.contact.address,
    href:  COMPANY.contact.mapsUrl,
    linkLabel: "Lihat di Maps",
  },
  {
    icon:  Mail,
    label: "Email",
    value: COMPANY.contact.email,
    href:  `mailto:${COMPANY.contact.email}`,
    linkLabel: "Kirim Email",
  },
  {
    icon:  Phone,
    label: "Telepon",
    value: COMPANY.contact.phone,
    href:  `tel:${COMPANY.contact.phone.replace(/\s/g, "")}`,
    linkLabel: "Hubungi",
  },
  {
    icon:  Clock,
    label: "Jam Operasional",
    value: "Senin – Jumat: 08.00 – 17.00 WIB\nSabtu: 08.00 – 13.00 WIB",
    href:  null,
    linkLabel: null,
  },
] as const;

export default function ContactPage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-brand-950 to-brand-800 py-24">
        <div className="container-content text-center">
          <p className="text-accent-400 font-600 text-sm uppercase tracking-widest mb-4">Kontak</p>
          <h1 className="text-4xl lg:text-5xl font-display font-700 text-white mb-5">
            Hubungi Kami
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Konsultasikan kebutuhan konstruksi Anda. Tim kami siap memberikan solusi terbaik dan estimasi gratis.
          </p>
        </div>
      </section>

      {/* ── MAIN ──────────────────────────────────────────────────────────────── */}
      <section className="section bg-neutral-50">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Left: contact info */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <h2 className="text-2xl font-display font-700 text-neutral-900 mb-2">
                  Informasi Kontak
                </h2>
                <p className="text-neutral-500 text-sm">
                  Kami senang mendengar dari Anda. Silakan hubungi melalui salah satu kanal berikut.
                </p>
              </div>

              {CONTACT_ITEMS.map(({ icon: Icon, label, value, href, linkLabel }) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl border border-neutral-200 p-5 flex gap-4 shadow-card"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-brand-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-400 font-500 uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-neutral-800 whitespace-pre-line leading-relaxed">
                      {value}
                    </p>
                    {href && linkLabel && (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-500 mt-1.5 transition-colors"
                      >
                        {linkLabel} <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${COMPANY.contact.whatsapp}?text=Halo%2C%20saya%20ingin%20konsultasi%20proyek%20konstruksi`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 hover:bg-green-600 text-white font-600 rounded-2xl transition-colors shadow-sm"
              >
                <span className="text-xl">💬</span>
                Chat via WhatsApp
              </a>
            </div>

            {/* Right: map + CTA form */}
            <div className="lg:col-span-3 space-y-6">

              {/* Google Maps embed */}
              <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-card">
                <iframe
                  src={COMPANY.contact.mapsEmbed}
                  width="100%"
                  height="380"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi PT Indofa Gemilang Konstruksi"
                />
              </div>

              {/* Quick contact card */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-7 shadow-card">
                <h3 className="text-lg font-display font-600 text-neutral-900 mb-2">
                  Butuh Respons Cepat?
                </h3>
                <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
                  Untuk penanganan lebih cepat, hubungi kami langsung via WhatsApp atau telepon.
                  Tim kami akan merespons dalam waktu maksimal 1 jam kerja.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={`https://wa.me/${COMPANY.contact.whatsapp}?text=Halo%2C%20saya%20ingin%20konsultasi%20proyek%20konstruksi`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-600 rounded-xl transition-colors"
                  >
                    💬 WhatsApp
                  </a>
                  <a
                    href={`tel:${COMPANY.contact.phone.replace(/\s/g, "")}`}
                    className="flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-600 rounded-xl transition-colors"
                  >
                    <Phone size={15} /> Telepon
                  </a>
                </div>

                <div className="mt-5 pt-5 border-t border-neutral-100">
                  <p className="text-xs text-neutral-400 text-center">
                    Atau kirim email ke{" "}
                    <a
                      href={`mailto:${COMPANY.contact.email}`}
                      className="text-brand-600 hover:text-brand-800 font-500"
                    >
                      {COMPANY.contact.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-content max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-700 text-neutral-900 mb-3">
              Pertanyaan Umum
            </h2>
            <p className="text-neutral-500 text-sm">
              Belum menemukan jawaban? Hubungi kami langsung.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Bagaimana cara mendapatkan penawaran harga?",
                a: "Hubungi kami via WhatsApp atau email dengan detail proyek Anda. Tim estimasi kami akan menyiapkan RAB (Rencana Anggaran Biaya) dalam 3–5 hari kerja, gratis tanpa komitmen.",
              },
              {
                q: "Berapa lama waktu yang dibutuhkan untuk memulai proyek?",
                a: "Setelah kontrak ditandatangani dan DP diterima, mobilisasi tim lapangan biasanya membutuhkan 7–14 hari kerja tergantung lokasi dan kompleksitas proyek.",
              },
              {
                q: "Apakah Anda mengerjakan proyek di luar Jawa?",
                a: "Ya, kami beroperasi di seluruh Indonesia termasuk Sumatera, Kalimantan, Sulawesi, dan wilayah Indonesia Timur. Kami memiliki tim lokal di beberapa kota besar.",
              },
              {
                q: "Apakah ada garansi setelah proyek selesai?",
                a: "Ya, kami memberikan garansi pekerjaan struktural selama 5 tahun dan garansi finishing selama 1 tahun. Detail garansi tertuang dalam kontrak pekerjaan.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50">
                <h3 className="font-display font-600 text-neutral-900 mb-2 text-sm sm:text-base">{q}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
