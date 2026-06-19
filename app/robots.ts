import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/config/company";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:     ["/", "/portfolio", "/about", "/contact"],
        disallow:  ["/admin", "/admin/", "/login"],
      },
    ],
    sitemap: `${COMPANY.url}/sitemap.xml`,
  };
}
