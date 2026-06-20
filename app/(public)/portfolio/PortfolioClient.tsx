"use client";

import { useState, useMemo } from "react";
import { Search, X, Filter, SlidersHorizontal } from "lucide-react";
import { ProjectCard } from "@/components/public/ProjectCard";
import { PROJECT_CATEGORIES } from "@/types";
import type { Project, ProjectCategory } from "@/types";
import { cn } from "@/lib/utils";

const PER_PAGE = 12;

type SortOption = "created_at_desc" | "created_at_asc" | "year_desc" | "year_asc";

const SORT_LABELS: Record<SortOption, string> = {
  created_at_desc: "Terbaru",
  created_at_asc:  "Terlama",
  year_desc:       "Tahun ↓",
  year_asc:        "Tahun ↑",
};

export function PortfolioClient({ initialProjects }: { initialProjects: Project[] }) {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState<ProjectCategory | "">("");
  const [sort,     setSort]     = useState<SortOption>("created_at_desc");
  const [page,     setPage]     = useState(1);

  const filtered = useMemo(() => {
    let list = [...initialProjects];

    if (search)   list = list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    if (category) list = list.filter((p) => p.category === category);

    switch (sort) {
      case "created_at_asc":  list.sort((a, b) => a.created_at.localeCompare(b.created_at)); break;
      case "year_desc":       list.sort((a, b) => (b.year ?? 0) - (a.year ?? 0)); break;
      case "year_asc":        list.sort((a, b) => (a.year ?? 0) - (b.year ?? 0)); break;
      default:                list.sort((a, b) => b.created_at.localeCompare(a.created_at)); break;
    }

    return list;
  }, [initialProjects, search, category, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const reset = () => { setSearch(""); setCategory(""); setSort("created_at_desc"); setPage(1); };
  const hasFilter = search || category || sort !== "created_at_desc";

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari proyek..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-10 py-2.5 border border-neutral-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-colors"
          />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }}
              aria-label="Hapus kata pencarian"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Category */}
        <div className="relative sm:w-48">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value as ProjectCategory | ""); setPage(1); }}
            className={cn(
              "w-full pl-8 pr-4 py-2.5 border border-neutral-200 rounded-xl bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-colors",
              !category && "text-neutral-400"
            )}
          >
            <option value="">Semua Kategori</option>
            {PROJECT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="relative sm:w-36">
          <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as SortOption); setPage(1); }}
            className="w-full pl-8 pr-4 py-2.5 border border-neutral-200 rounded-xl bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-colors"
          >
            {Object.entries(SORT_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count + reset */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-500">
          Menampilkan <span className="font-600 text-neutral-800">{filtered.length}</span> proyek
        </p>
        {hasFilter && (
          <button onClick={reset} className="text-sm text-brand-600 hover:text-brand-800 font-500">
            Reset filter
          </button>
        )}
      </div>

      {/* Grid */}
      {paginated.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-neutral-500 font-500">Tidak ada proyek yang sesuai.</p>
          <button onClick={reset} className="mt-3 text-sm text-brand-600 hover:text-brand-800 font-500">
            Hapus semua filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Sebelumnya
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={cn(
                "w-10 h-10 text-sm rounded-lg font-500 transition-colors",
                n === page ? "bg-brand-600 text-white" : "text-neutral-600 hover:bg-neutral-100"
              )}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Berikutnya →
          </button>
        </div>
      )}
    </div>
  );
}
