import { Building2 } from "lucide-react";
import { PARTNERS } from "@/lib/config/company";

export function PartnersSection() {
  return (
    <section className="py-14 bg-neutral-50 border-y border-neutral-100">
      <div className="container-content">
        <p className="text-center text-sm text-neutral-400 font-500 uppercase tracking-widest mb-8">
          Dipercaya oleh Berbagai Klien &amp; Mitra
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center justify-center gap-2 bg-white border border-neutral-200 rounded-xl py-6 px-3 hover:border-brand-200 hover:shadow-card transition-all duration-300"
              title={p.name}
            >
              <Building2 size={22} className="text-neutral-300" aria-hidden="true" />
              <span className="text-xs text-neutral-400 text-center leading-tight line-clamp-2">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
