import { COMPANY } from "@/lib/config/company";
import type { Project } from "@/types";

// ─── Organization / LocalBusiness JSON-LD ─────────────────────────────────────
// Dipakai di root layout agar muncul di setiap halaman publik.

export function organizationJsonLd() {
  return {
    "@context":            "https://schema.org",
    "@type":               ["Organization", "LocalBusiness", "ConstructionCompany"],
    "@id":                 `${COMPANY.url}/#organization`,
    name:                  COMPANY.name,
    alternateName:         COMPANY.shortName,
    url:                   COMPANY.url,
    logo: {
      "@type":             "ImageObject",
      url:                 `${COMPANY.url}/logo.png`,
      width:               "200",
      height:              "200",
    },
    image:                 `${COMPANY.url}/og-image.jpg`,
    description:           COMPANY.description,
    foundingDate:          String(COMPANY.founded),
    numberOfEmployees: {
      "@type":             "QuantitativeValue",
      value:               500,
    },
    address: {
      "@type":             "PostalAddress",
      streetAddress:       "Jl. Gatot Subroto No. 45",
      addressLocality:     "Jakarta Selatan",
      addressRegion:       "DKI Jakarta",
      postalCode:          "12950",
      addressCountry:      "ID",
    },
    geo: {
      "@type":             "GeoCoordinates",
      latitude:            -6.23,
      longitude:           106.82,
    },
    contactPoint: [
      {
        "@type":           "ContactPoint",
        telephone:         COMPANY.contact.phone,
        contactType:       "customer service",
        availableLanguage: "Indonesian",
        areaServed:        "ID",
      },
    ],
    sameAs: [
      COMPANY.social.instagram,
      COMPANY.social.linkedin,
    ],
  };
}

// ─── Project / CreativeWork JSON-LD ───────────────────────────────────────────
// Dipakai di halaman detail project.

export function projectJsonLd(project: Project) {
  return {
    "@context":   "https://schema.org",
    "@type":      "CreativeWork",
    "@id":        `${COMPANY.url}/portfolio/${project.slug}`,
    name:         project.title,
    description:  project.description ?? undefined,
    url:          `${COMPANY.url}/portfolio/${project.slug}`,
    creator: {
      "@id":      `${COMPANY.url}/#organization`,
    },
    ...(project.year && {
      datePublished: `${project.year}-01-01`,
    }),
    ...(project.location && {
      locationCreated: {
        "@type": "Place",
        name:    project.location,
        address: project.address ?? project.location,
      },
    }),
    keywords: [project.category, "konstruksi", "Indonesia"].join(", "),
  };
}

// ─── BreadcrumbList JSON-LD ───────────────────────────────────────────────────
// Dipakai di halaman detail project untuk breadcrumb di hasil pencarian.

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context":      "https://schema.org",
    "@type":         "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type":    "ListItem",
      position:   index + 1,
      name:       item.name,
      item:       item.url,
    })),
  };
}
