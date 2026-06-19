import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Images ──────────────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:  "*.supabase.co",
        pathname:  "/storage/v1/object/public/**",
      },
    ],
    formats:         ["image/avif", "image/webp"],
    deviceSizes:     [640, 768, 1024, 1280, 1536],
    imageSizes:      [64, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  compress: true,

  async headers() {
    const imgCacheHeader = [
      { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
    ];

    return [
      // ── Semua halaman ───────────────────────────────────────────────────────
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",        value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",     value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-XSS-Protection",       value: "1; mode=block" },
        ],
      },

      // ── Admin: no cache, no index ───────────────────────────────────────────
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "X-Robots-Tag",  value: "noindex, nofollow" },
        ],
      },
      {
        source: "/login",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "X-Robots-Tag",  value: "noindex, nofollow" },
        ],
      },

      // ── Static assets: immutable cache ─────────────────────────────────────
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },

      // ── Public images: 7 day cache (satu rule per ekstensi) ─────────────────
      { source: "/:path*.jpg",  headers: imgCacheHeader },
      { source: "/:path*.jpeg", headers: imgCacheHeader },
      { source: "/:path*.png",  headers: imgCacheHeader },
      { source: "/:path*.webp", headers: imgCacheHeader },
      { source: "/:path*.avif", headers: imgCacheHeader },
      { source: "/:path*.svg",  headers: imgCacheHeader },
      { source: "/:path*.ico",  headers: imgCacheHeader },
    ];
  },
};

export default nextConfig;
