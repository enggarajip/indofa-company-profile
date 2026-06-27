// ===========================================================================
// app/robots.ts
// Base URL diambil dari COMPANY.url — tidak ada domain yang di-hardcode.
// ===========================================================================

import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/config/company";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:     "/",
        disallow:  ["/admin", "/admin/", "/login"],
      },
    ],
    sitemap: `${COMPANY.url}/sitemap.xml`,
  };
}
