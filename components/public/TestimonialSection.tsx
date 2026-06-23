import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/config/company";

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

export function TestimonialSection() {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-brand-200 hover:shadow-card-hover transition-all duration-300 flex flex-col"
            >
              <Quote size={28} className="text-brand-100 mb-3" aria-hidden="true" />
              <StarRating rating={t.rating} />
              <p className="text-sm text-neutral-600 leading-relaxed mt-4 mb-5 flex-1">
                &ldquo;{t.comment}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
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
          ))}
        </div>
      </div>
    </section>
  );
}
