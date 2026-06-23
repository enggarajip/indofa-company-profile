import { Award, CheckCircle2, Smile, HardHat } from "lucide-react";
import { WHY_US } from "@/lib/config/company";

// Ikon yang relevan untuk tiap statistik, dipetakan berdasarkan urutan WHY_US
// di company.ts: Tahun Pengalaman, Proyek Selesai, Klien Puas, Tenaga Ahli.
const STAT_ICONS = [Award, CheckCircle2, Smile, HardHat];

export function StatsSection() {
  return (
    <section className="bg-neutral-50 py-14 border-y border-neutral-100">
      <div className="container-content">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US.map(({ label, value }, i) => {
            const Icon = STAT_ICONS[i] ?? Award;
            return (
              <div
                key={label}
                className="text-center group transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-100 transition-colors">
                  <Icon size={22} className="text-brand-600" aria-hidden="true" />
                </div>
                <p className="text-3xl sm:text-4xl font-display font-800 text-brand-600 mb-1">
                  {value}
                </p>
                <p className="text-sm text-neutral-500">{label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
