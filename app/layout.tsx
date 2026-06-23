import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { organizationJsonLd } from "@/lib/seo/jsonld";
import { COMPANY } from "@/lib/config/company";

// Validasi env saat startup — akan crash dengan pesan jelas jika ada yang kurang
import "@/lib/env";

import "./globals.css";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets:  ["latin"],
  weight:   ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display:  "swap",
});

const inter = Inter({
  subsets:  ["latin"],
  weight:   ["400", "500", "600"],
  variable: "--font-body",
  display:  "swap",
});

// ─── Global Metadata ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.url),

  title: {
    default:  COMPANY.name,
    template: `%s | ${COMPANY.name}`,
  },
  description: COMPANY.description,
  keywords: [
    "konstruksi", "kontraktor", "gedung komersial", "infrastruktur",
    "jembatan", "jalan", "perumahan", "Indonesia", "Jakarta",
    COMPANY.name, COMPANY.shortName,
  ],
  authors:   [{ name: COMPANY.name, url: COMPANY.url }],
  creator:   COMPANY.name,
  publisher: COMPANY.name,

  // ── Open Graph ───────────────────────────────────────────────────────────
  openGraph: {
    type:        "website",
    locale:      "id_ID",
    url:         COMPANY.url,
    siteName:    COMPANY.name,
    title:       COMPANY.name,
    description: COMPANY.description,
    images: [{
      url:    "/og-image.jpg",
      width:  1200,
      height: 630,
      alt:    COMPANY.name,
    }],
  },

  // ── Twitter / X Card ─────────────────────────────────────────────────────
  twitter: {
    card:        "summary_large_image",
    title:       COMPANY.name,
    description: COMPANY.description,
    images:      ["/og-image.jpg"],
  },

  // ── Robots ───────────────────────────────────────────────────────────────
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },

  // ── Icons & Manifest ─────────────────────────────────────────────────────
  icons: {
    icon:    [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple:   [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

// ─── Viewport ─────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor:   "#1e3a8a",
  width:        "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Organization JSON-LD — tampil di semua halaman */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
      </head>
      <body className="antialiased">
        {children}

        {/*
          Vercel Web Analytics & Speed Insights — komponen resmi Vercel.
          Hanya aktif mengirim data saat di-deploy ke Vercel (production/preview);
          tidak melakukan apa-apa saat development lokal, jadi aman dan tidak
          memerlukan konfigurasi tambahan apa pun di sisi kode.
        */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
