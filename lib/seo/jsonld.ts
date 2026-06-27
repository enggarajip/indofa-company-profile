// ===========================================================================
// lib/seo/jsonld.ts
// Generator JSON-LD structured data (schema.org).
// Semua data diambil dari lib/config/company.ts — tidak ada domain/data
// yang di-hardcode di file ini.
// ===========================================================================

import { COMPANY } from "@/lib/config/company";
import type { Project } from "@/types";

// ─── Organization (schema.org/Organization) ───────────────────────────────────
// Dipasang di Home Page agar mesin pencari (Google, Bing) memahami identitas
// resmi perusahaan: nama, website, logo, kontak, dan media sosial.
export function organizationJsonLd() {
  const sameAs = Object.values(COMPANY.social).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type":    "Organization",
    "@id":      `${COMPANY.url}/#organization`,
    name:       COMPANY.name,
    alternateName: COMPANY.shortName,
    url:        COMPANY.url,
    logo:       `${COMPANY.url}/logo.png`,
    image:      `${COMPANY.url}/og-image.jpg`,
    description: COMPANY.description,
    foundingDate: String(COMPANY.founded),
    email:      COMPANY.contact.email,
    telephone:  COMPANY.contact.phone,
    address: {
      "@type":         "PostalAddress",
      streetAddress:   COMPANY.contact.address,
      addressCountry:  "ID",
    },
    contactPoint: {
      "@type":           "ContactPoint",
      telephone:         COMPANY.contact.phone,
      email:             COMPANY.contact.email,
      contactType:       "customer service",
      areaServed:        "ID",
      availableLanguage: ["Indonesian"],
    },
    // Hanya disertakan jika ada akun sosial media yang terisi (filter di atas)
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

// ─── Project / CreativeWork (schema.org/CreativeWork) ─────────────────────────
// Dipasang di halaman detail proyek (/portfolio/[slug]) agar mesin pencari
// memahami proyek tersebut sebagai karya/hasil kerja perusahaan.
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
    keywords: [project.category, project.service_type, "konstruksi", "Indonesia"]
      .filter(Boolean)
      .join(", "),
  };
}

// ─── BreadcrumbList (schema.org/BreadcrumbList) ────────────────────────────────
// Dipasang di halaman detail proyek agar Google bisa menampilkan breadcrumb
// (Beranda > Portfolio > Nama Proyek) langsung di hasil pencarian.
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context":      "https://schema.org",
    "@type":         "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type":  "ListItem",
      position: index + 1,
      name:     item.name,
      item:     item.url,
    })),
  };
}
