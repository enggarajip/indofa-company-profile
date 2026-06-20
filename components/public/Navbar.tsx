"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Building2 } from "lucide-react";
import { COMPANY } from "@/lib/config/company";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/",          label: "Beranda"   },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about",     label: "Tentang"   },
  { href: "/contact",   label: "Kontak"    },
] as const;

export function Navbar() {
  const pathname  = usePathname();
  const [open,    setOpen]    = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled || !isHome
          ? "bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container-content">
        <div className="flex items-center justify-between h-[var(--navbar-height)]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0">
              <Building2 size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className={cn(
                "font-display font-700 text-sm leading-tight transition-colors",
                scrolled || !isHome ? "text-neutral-900" : "text-white"
              )}>
                {COMPANY.shortName}
              </p>
              <p className={cn(
                "text-xs transition-colors",
                scrolled || !isHome ? "text-neutral-500" : "text-white/70"
              )}>
                Konstruksi
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-500 transition-colors",
                    active
                      ? "text-brand-600 bg-brand-50"
                      : scrolled || !isHome
                        ? "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="ml-2 btn-primary py-2 px-5 text-sm"
            >
              Hubungi Kami
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              scrolled || !isHome
                ? "text-neutral-600 hover:bg-neutral-100"
                : "text-white hover:bg-white/10"
            )}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-neutral-200 shadow-lg">
          <nav className="container-content py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-500 transition-colors",
                    active
                      ? "text-brand-600 bg-brand-50"
                      : "text-neutral-600 hover:bg-neutral-50"
                  )}
                >
                  {label}
                </Link>
              );
            })}
            <Link href="/contact" className="btn-primary justify-center mt-2 text-sm">
              Hubungi Kami
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
