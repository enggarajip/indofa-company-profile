"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "@/lib/config/company";

// ─── Konfigurasi ──────────────────────────────────────────────────────────────
const AUTO_ADVANCE_MS = 5000;   // ganti slide tiap 5 detik
const RESUME_DELAY_MS = 8000;   // setelah interaksi manual, tunggu 8 detik sebelum auto-geser lagi

// Berapa kartu yang tampil sekaligus, mengikuti breakpoint Tailwind yang sudah ada
// (sm: 2 kolom, lg: 3 kolom) — dipakai untuk hitung jumlah "halaman" carousel.
function useCardsPerView() {
  const [cardsPerView, setCardsPerView] = useState(1);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCardsPerView(3);      // lg
      else if (w >= 640) setCardsPerView(2);  // sm
      else setCardsPerView(1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return cardsPerView;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`Rating ${rating} dari 5 bintang`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          className={i < rating ? "fill-accent-400 text-accent-400" : "fill-neutral-200 text-neutral-200"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-brand-200 hover:shadow-card-hover transition-all duration-300 flex flex-col h-full">
      <Quote size={28} className="text-brand-100 mb-3" aria-hidden="true" />
      <StarRating rating={t.rating} />
      <p className="text-sm text-neutral-600 leading-relaxed mt-4 mb-5 flex-1">
        &ldquo;{t.comment}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
        {/*
          ASSET DIBUTUHKAN (opsional): foto profil klien, format persegi,
          minimal 80x80px. Saat ini avatar memakai inisial nama sebagai
          placeholder. Cara ganti: tambahkan field `avatarUrl` ke
          TESTIMONIALS di lib/config/company.ts, lalu render
          Image src={t.avatarUrl} fill className="object-cover rounded-full"
          di tempat span inisial di bawah ini.
        */}
        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
          <span className="text-brand-700 font-display font-700 text-sm" aria-hidden="true">
            {t.name.charAt(0)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-600 text-neutral-900 truncate">{t.name}</p>
          <p className="text-xs text-neutral-500 truncate">{t.role}, {t.company}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialSection() {
  const cardsPerView = useCardsPerView();
  const pageCount = Math.max(1, Math.ceil(TESTIMONIALS.length / cardsPerView));

  const [page, setPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Kalau breakpoint berubah (resize) dan page jadi out-of-range, kembalikan ke awal.
  useEffect(() => {
    if (page > pageCount - 1) setPage(0);
  }, [pageCount, page]);

  // ─── Auto-advance ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || pageCount <= 1) return;
    const timer = setInterval(() => {
      setPage((p) => (p + 1) % pageCount);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [isPaused, pageCount]);

  // Hentikan auto-advance sementara setelah interaksi manual, lalu lanjut lagi.
  const pauseTemporarily = useCallback(() => {
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setIsPaused(false), RESUME_DELAY_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const goTo = (target: number) => {
    setPage(((target % pageCount) + pageCount) % pageCount);
    pauseTemporarily();
  };
  const goPrev = () => goTo(page - 1);
  const goNext = () => goTo(page + 1);

  // ─── Swipe (mobile) ─────────────────────────────────────────────────────────
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) < 40) return; // threshold biar ga ke-trigger sentuhan kecil
    if (delta < 0) goNext();
    else goPrev();
  };

  const showNav = TESTIMONIALS.length > cardsPerView;

  return (
    <section className="section bg-white">
      <div className="container-content">
        <div className="text-center mb-14">
          <p className="text-accent-500 font-600 text-sm uppercase tracking-widest mb-3">Testimoni</p>
          <h2 className="text-3xl lg:text-4xl font-display font-700 text-neutral-900 mb-4">
            Apa Kata Klien Kami
          </h2>
          <p className="text-neutral-500 max-w-xl mx-auto">
            Kepercayaan klien adalah pencapaian terbesar kami dalam setiap proyek yang dikerjakan.
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Track */}
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              ref={trackRef}
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {Array.from({ length: pageCount }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full flex-shrink-0 px-1"
                >
                  {TESTIMONIALS.slice(
                    pageIndex * cardsPerView,
                    pageIndex * cardsPerView + cardsPerView
                  ).map((t) => (
                    <TestimonialCard key={t.name} t={t} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Tombol navigasi — hanya tampil kalau lebih dari 1 halaman */}
          {showNav && (
            <>
              <button
                onClick={goPrev}
                aria-label="Testimoni sebelumnya"
                className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-10 h-10 rounded-full bg-white border border-neutral-200 shadow-card items-center justify-center text-neutral-600 hover:text-brand-600 hover:border-brand-200 transition-colors focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <button
                onClick={goNext}
                aria-label="Testimoni berikutnya"
                className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-10 h-10 rounded-full bg-white border border-neutral-200 shadow-card items-center justify-center text-neutral-600 hover:text-brand-600 hover:border-brand-200 transition-colors focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {/* Dots indikator */}
        {showNav && (
          <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Navigasi testimoni">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === page}
                aria-label={`Ke halaman testimoni ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2 ${
                  i === page ? "w-8 bg-brand-600" : "w-2 bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
