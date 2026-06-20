import Link from "next/link";
import { Building2, Mail, Phone, MapPin, Instagram, Linkedin } from "lucide-react";
import { COMPANY } from "@/lib/config/company";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-white">
      <div className="container-content py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center flex-shrink-0">
                <Building2 size={20} className="text-white" />
              </div>
              <div>
                <p className="font-display font-700 text-base">{COMPANY.shortName}</p>
                <p className="text-white/50 text-xs">Konstruksi</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              {COMPANY.description}
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href={COMPANY.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href={COMPANY.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display font-600 text-sm text-white/90 mb-4 uppercase tracking-wide">
              Navigasi
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/",          label: "Beranda"   },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/about",     label: "Tentang Kami" },
                { href: "/contact",   label: "Kontak"    },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-600 text-sm text-white/90 mb-4 uppercase tracking-wide">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/60">
                <MapPin size={15} className="text-accent-400 flex-shrink-0 mt-0.5" />
                <span>{COMPANY.contact.address}</span>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.contact.email}`}
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Mail size={15} className="text-accent-400 flex-shrink-0" />
                  {COMPANY.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${COMPANY.contact.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Phone size={15} className="text-accent-400 flex-shrink-0" />
                  {COMPANY.contact.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-content py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/55">
          <p>© {year} {COMPANY.name}. Hak cipta dilindungi.</p>
          <p>Dibangun dengan Next.js &amp; Supabase</p>
        </div>
      </div>
    </footer>
  );
}
