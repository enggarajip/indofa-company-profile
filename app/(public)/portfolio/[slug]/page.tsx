import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, Calendar, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import { getProjectBySlug, getProjects } from "@/lib/actions/projects";
import { getStorageUrl } from "@/lib/utils";
import { COMPANY } from "@/lib/config/company";
import { projectJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result   = await getProjectBySlug(slug);

  if (!result.success) {
    return {
      title:       "Proyek Tidak Ditemukan",
      description: "Halaman yang Anda cari tidak ditemukan.",
      robots:      { index: false },
    };
  }

  const p           = result.data;
  const description = p.description
    ?? `Proyek ${p.category} oleh ${COMPANY.name} di ${p.location ?? "Indonesia"}.${p.year ? ` Selesai tahun ${p.year}.` : ""}`;
  const imgUrl      = p.cover_image ? getStorageUrl(p.cover_image) : `${COMPANY.url}/og-image.jpg`;
  const pageUrl     = `${COMPANY.url}/portfolio/${p.slug}`;

  return {
    title:       p.title,
    description,
    keywords:    [p.category, p.location ?? "", "konstruksi", COMPANY.name].filter(Boolean),
    openGraph: {
      type:        "article",
      url:         pageUrl,
      title:       `${p.title} | ${COMPANY.name}`,
      description,
      images:      [{ url: imgUrl, width: 1200, height: 630, alt: p.title }],
      siteName:    COMPANY.name,
    },
    twitter: {
      card:        "summary_large_image",
      title:       `${p.title} | ${COMPANY.name}`,
      description,
      images:      [imgUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const result   = await getProjectBySlug(slug);

  if (!result.success) notFound();

  const project    = result.data;
  const coverUrl   = project.cover_image ? getStorageUrl(project.cover_image) : null;
  const galleryUrls = (project.gallery_images ?? []).map(getStorageUrl);

  // Related: ambil 3 proyek dari kategori yang sama
  const relatedResult = await getProjects({
    category:  project.category,
    limit:     4,
    orderBy:   "created_at_desc",
  });
  const related = (relatedResult.success ? relatedResult.data : [])
    .filter((p) => p.id !== project.id)
    .slice(0, 3);

  return (
    <>
      {/* JSON-LD: Project + Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd(project)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Beranda",   url: COMPANY.url },
            { name: "Portfolio", url: `${COMPANY.url}/portfolio` },
            { name: project.title, url: `${COMPANY.url}/portfolio/${project.slug}` },
          ])),
        }}
      />

      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="container-content py-3">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Link href="/" className="hover:text-neutral-800 transition-colors">Beranda</Link>
            <span>/</span>
            <Link href="/portfolio" className="hover:text-neutral-800 transition-colors">Portfolio</Link>
            <span>/</span>
            <span className="text-neutral-800 truncate max-w-[200px]">{project.title}</span>
          </div>
        </div>
      </div>

      {/* Hero cover */}
      {coverUrl && (
        <div className="relative aspect-[21/9] max-h-[520px] bg-neutral-200 overflow-hidden">
          <Image
            src={coverUrl}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 inset-x-0 container-content pb-8">
            <span className="inline-block bg-accent-500 text-white text-xs font-600 px-3 py-1 rounded-full mb-3">
              {project.category}
            </span>
            <h1 className="text-3xl lg:text-4xl font-display font-700 text-white max-w-3xl leading-tight">
              {project.title}
            </h1>
          </div>
        </div>
      )}

      <div className="container-content py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Title (if no cover) */}
            {!coverUrl && (
              <div>
                <span className="inline-block bg-brand-100 text-brand-700 text-xs font-600 px-3 py-1 rounded-full mb-3">
                  {project.category}
                </span>
                <h1 className="text-3xl font-display font-700 text-neutral-900">{project.title}</h1>
              </div>
            )}

            {/* Description */}
            {project.description && (
              <div>
                <h2 className="text-lg font-display font-600 text-neutral-900 mb-4">Deskripsi Proyek</h2>
                <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{project.description}</p>
              </div>
            )}

            {/* Gallery */}
            {galleryUrls.length > 0 && (
              <div>
                <h2 className="text-lg font-display font-600 text-neutral-900 mb-4">
                  Galeri Foto ({galleryUrls.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {galleryUrls.map((url, i) => (
                    <div
                      key={url}
                      className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 group cursor-pointer"
                    >
                      <Image
                        src={url}
                        alt={`${project.title} — foto ${i + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back + related */}
            <div className="pt-4">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
              >
                <ArrowLeft size={15} /> Kembali ke Portfolio
              </Link>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="border-t border-neutral-200 pt-10">
                <h2 className="text-lg font-display font-600 text-neutral-900 mb-6">
                  Proyek Serupa
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map((p) => {
                    const imgUrl = p.cover_image ? getStorageUrl(p.cover_image) : null;
                    return (
                      <Link
                        key={p.id}
                        href={`/portfolio/${p.slug}`}
                        className="group block rounded-xl overflow-hidden border border-neutral-200 hover:border-brand-200 hover:shadow-card transition-all"
                      >
                        <div className="relative aspect-[4/3] bg-neutral-100">
                          {imgUrl
                            ? <Image src={imgUrl} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="33vw" />
                            : <div className="absolute inset-0 flex items-center justify-center text-2xl text-neutral-200">🏗️</div>
                          }
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-500 text-neutral-800 line-clamp-2 group-hover:text-brand-700 transition-colors">
                            {p.title}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar info */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5 shadow-card sticky top-[calc(var(--navbar-height)+1.5rem)]">
              <h2 className="font-display font-600 text-neutral-900 text-base">Informasi Proyek</h2>

              <div className="space-y-4 divide-y divide-neutral-100">
                {project.location && (
                  <div className="pt-4 first:pt-0">
                    <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                      <MapPin size={11} /> Lokasi
                    </p>
                    <p className="text-sm font-500 text-neutral-800">{project.location}</p>
                    {project.address && (
                      <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{project.address}</p>
                    )}
                  </div>
                )}

                {project.year && (
                  <div className="pt-4">
                    <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                      <Calendar size={11} /> Tahun Selesai
                    </p>
                    <p className="text-sm font-500 text-neutral-800">{project.year}</p>
                  </div>
                )}

                {project.duration && (
                  <div className="pt-4">
                    <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                      <Clock size={11} /> Durasi
                    </p>
                    <p className="text-sm font-500 text-neutral-800">{project.duration}</p>
                  </div>
                )}

                <div className="pt-4">
                  <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1.5">Kategori</p>
                  <span className="inline-block bg-brand-50 text-brand-700 text-xs font-600 px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Google Maps */}
              {project.google_maps_url && (
                <a
                  href={project.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-500 text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors"
                >
                  <ExternalLink size={14} /> Lihat di Google Maps
                </a>
              )}

              {/* CTA */}
              <div className="pt-2 border-t border-neutral-100">
                <p className="text-xs text-neutral-400 mb-3 text-center">
                  Tertarik dengan proyek serupa?
                </p>
                <Link href="/contact" className="btn-primary w-full justify-center text-sm py-2.5">
                  Konsultasi Gratis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
