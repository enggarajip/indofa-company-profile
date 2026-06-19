import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { getStorageUrl } from "@/lib/utils";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  const coverUrl = project.cover_image ? getStorageUrl(project.cover_image) : null;

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-brand-200 shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
            <div className="text-neutral-300 text-center">
              <div className="text-4xl mb-1">🏗️</div>
              <p className="text-xs">Foto belum tersedia</p>
            </div>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm text-brand-700 text-xs font-600 rounded-full shadow-sm">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-600 text-neutral-900 text-base leading-snug group-hover:text-brand-700 transition-colors line-clamp-2 mb-3">
          {project.title}
        </h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
          {project.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-neutral-300" />
              {project.location}
            </span>
          )}
          {project.year && (
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-neutral-300" />
              {project.year}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-center gap-1 text-brand-600 text-sm font-500">
          Lihat Detail
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
