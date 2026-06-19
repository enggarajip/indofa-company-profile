"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth";
import { Building2, FolderOpen, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin",          label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Proyek",    icon: FolderOpen,       exact: false },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Navigasi admin">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "sidebar-item focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2",
              active && "active"
            )}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarHeader() {
  return (
    <div className="px-5 py-5 border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-accent-500 flex items-center justify-center flex-shrink-0" aria-hidden="true">
          <Building2 size={18} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-display font-600 text-sm leading-tight truncate">
            Indofa Gemilang
          </p>
          <p className="text-white/50 text-xs">Admin Panel</p>
        </div>
      </div>
    </div>
  );
}

function LogoutButton() {
  return (
    <div className="px-3 py-4 border-t border-white/10">
      <form action={logoutAction}>
        <button
          type="submit"
          aria-label="Keluar dari admin panel"
          className="sidebar-item w-full text-red-300 hover:text-white hover:bg-red-700/50 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
        >
          <LogOut size={18} aria-hidden="true" />
          <span>Keluar</span>
        </button>
      </form>
    </div>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  // Tutup drawer mobile dengan tombol Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      {/* Desktop */}
      <aside className="admin-sidebar hidden md:flex flex-col" aria-label="Sidebar admin">
        <SidebarHeader />
        <NavLinks />
        <LogoutButton />
      </aside>

      {/* Mobile topbar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-14 bg-brand-900 flex items-center justify-between px-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center" aria-hidden="true">
            <Building2 size={14} className="text-white" />
          </div>
          <span className="text-white font-display font-600 text-sm">Indofa Admin</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Buka menu navigasi"
          aria-expanded={open}
          className="text-white/70 hover:text-white p-1.5 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi admin"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-64 bg-brand-900 flex flex-col h-full shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup menu navigasi"
              className="absolute top-3 right-3 text-white/60 hover:text-white p-1 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <SidebarHeader />
            <NavLinks onNavigate={() => setOpen(false)} />
            <LogoutButton />
          </aside>
        </div>
      )}
    </>
  );
}
