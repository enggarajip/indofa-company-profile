"use client";

import { useEffect, useState, useTransition, useCallback, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProjects } from "@/lib/actions/projects";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Toast, useToast } from "@/components/admin/Toast";
import { PROJECT_CATEGORIES } from "@/types";
import type { Project, ProjectCategory } from "@/types";
import {
  Plus, Search, Pencil, FolderOpen,
  MapPin, Calendar, Filter, X, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

export default function ProjectsPage() {
  const router = useRouter();
  const { toast, showToast, closeToast } = useToast();
  const searchId   = useId();
  const categoryId = useId();

  const [projects,   setProjects]   = useState<Project[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [category,   setCategory]   = useState<ProjectCategory | "">("");
  const [page,       setPage]       = useState(1);
  const [, startTransition] = useTransition();

  // ─── Fetch ─────────────────────────────────────────────────────────────────

  const fetchProjects = useCallback(() => {
    setLoading(true);
    startTransition(async () => {
      const result = await getProjects({ orderBy: "created_at_desc" });
      if (result.success) setProjects(result.data);
      else showToast(result.error, "error");
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  // ─── Filter & Search ───────────────────────────────────────────────────────

  const filtered = projects.filter((p) => {
    const matchSearch   = !search   || p.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !category || p.category === category;
    return matchSearch && matchCategory;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetPage = () => setPage(1);

  const handleEditClick = (id: string) => router.push(`/admin/projects/${id}/edit`);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="max-w-5xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-display font-700 text-neutral-900">Proyek</h1>
            <p className="text-neutral-500 text-sm mt-0.5" role="status" aria-live="polite">
              {loading ? "Memuat..." : `${filtered.length} dari ${projects.length} proyek`}
            </p>
          </div>
          <Link href="/admin/projects/new" className="btn-primary gap-2 text-sm py-2.5 px-4">
            <Plus size={16} aria-hidden="true" /> Tambah Proyek
          </Link>
        </div>

        {/* Filters */}
        <div className="admin-card p-4 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <label htmlFor={searchId} className="sr-only">Cari nama proyek</label>
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
            <input
              id={searchId}
              type="text"
              placeholder="Cari nama proyek..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              className="admin-input pl-9 text-sm"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); resetPage(); }}
                aria-label="Hapus kata pencarian"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2 rounded"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="relative sm:w-52">
            <label htmlFor={categoryId} className="sr-only">Filter kategori proyek</label>
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
            <select
              id={categoryId}
              value={category}
              onChange={(e) => { setCategory(e.target.value as ProjectCategory | ""); resetPage(); }}
              className={cn("admin-input pl-8 text-sm", !category && "text-neutral-400")}
            >
              <option value="">Semua Kategori</option>
              {PROJECT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {(search || category) && (
            <button
              onClick={() => { setSearch(""); setCategory(""); resetPage(); }}
              className="text-sm text-neutral-500 hover:text-neutral-800 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2"
            >
              Reset filter
            </button>
          )}
        </div>

        {/* Table */}
        <div className="admin-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20" role="status" aria-label="Memuat daftar proyek">
              <Loader2 size={24} className="animate-spin text-neutral-300" aria-hidden="true" />
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <FolderOpen size={40} className="text-neutral-200 mb-3" aria-hidden="true" />
              <p className="text-neutral-500 font-500">
                {search || category ? "Tidak ada proyek yang sesuai filter." : "Belum ada proyek."}
              </p>
              {!search && !category && (
                <Link href="/admin/projects/new" className="mt-3 text-sm text-brand-600 hover:text-brand-800 font-500">
                  Tambah proyek pertama →
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <caption className="sr-only">Daftar proyek konstruksi PT Indofa Gemilang</caption>
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50">
                      <th scope="col" className="text-left px-5 py-3 text-xs font-600 text-neutral-500 uppercase tracking-wide">Proyek</th>
                      <th scope="col" className="text-left px-4 py-3 text-xs font-600 text-neutral-500 uppercase tracking-wide">Kategori</th>
                      <th scope="col" className="text-left px-4 py-3 text-xs font-600 text-neutral-500 uppercase tracking-wide">Lokasi</th>
                      <th scope="col" className="text-left px-4 py-3 text-xs font-600 text-neutral-500 uppercase tracking-wide">Tahun</th>
                      <th scope="col" className="px-4 py-3 w-24"><span className="sr-only">Aksi</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((project) => (
                      <tr
                        key={project.id}
                        className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50 transition-colors"
                      >
                        {/* Title + thumbnail */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex-shrink-0 overflow-hidden">
                              {project.cover_image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-media/${project.cover_image}`}
                                  alt={`Foto cover proyek ${project.title}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                                  <FolderOpen size={14} className="text-neutral-300" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-500 text-neutral-800 truncate max-w-[220px]">{project.title}</p>
                              <p className="text-xs text-neutral-400 font-mono truncate max-w-[220px]">{project.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full font-500">
                            {project.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          {project.location ? (
                            <span className="text-neutral-500 flex items-center gap-1.5">
                              <MapPin size={12} className="text-neutral-300" aria-hidden="true" />
                              {project.location}
                            </span>
                          ) : (
                            <span className="text-neutral-300" aria-label="Lokasi tidak diisi">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          {project.year ? (
                            <span className="text-neutral-500 flex items-center gap-1.5">
                              <Calendar size={12} className="text-neutral-300" aria-hidden="true" />
                              {project.year}
                            </span>
                          ) : (
                            <span className="text-neutral-300" aria-label="Tahun tidak diisi">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEditClick(project.id)}
                              className="p-2 text-neutral-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2"
                              aria-label={`Edit proyek ${project.title}`}
                            >
                              <Pencil size={15} aria-hidden="true" />
                            </button>
                            <DeleteButton
                              projectId={project.id}
                              projectTitle={project.title}
                              onSuccess={() => {
                                showToast(`"${project.title}" berhasil dihapus.`, "success");
                                fetchProjects();
                              }}
                              onError={(msg) => showToast(msg, "error")}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <ul className="md:hidden divide-y divide-neutral-100" aria-label="Daftar proyek">
                {paginated.map((project) => (
                  <li key={project.id} className="p-4 flex items-start gap-3 list-none">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 flex-shrink-0 overflow-hidden mt-0.5">
                      {project.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-media/${project.cover_image}`}
                          alt={`Foto cover proyek ${project.title}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                          <FolderOpen size={16} className="text-neutral-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-500 text-neutral-800 text-sm leading-tight">{project.title}</p>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
                          {project.category}
                        </span>
                        {project.location && (
                          <span className="text-xs text-neutral-400">{project.location}</span>
                        )}
                        {project.year && (
                          <span className="text-xs text-neutral-400">{project.year}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEditClick(project.id)}
                        aria-label={`Edit proyek ${project.title}`}
                        className="p-2 text-neutral-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2"
                      >
                        <Pencil size={15} aria-hidden="true" />
                      </button>
                      <DeleteButton
                        projectId={project.id}
                        projectTitle={project.title}
                        onSuccess={() => {
                          showToast(`"${project.title}" berhasil dihapus.`, "success");
                          fetchProjects();
                        }}
                        onError={(msg) => showToast(msg, "error")}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav aria-label="Navigasi halaman" className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Halaman sebelumnya"
              className="px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2"
            >
              ← Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                aria-label={`Halaman ${n}`}
                aria-current={n === page ? "page" : undefined}
                className={cn(
                  "w-9 h-9 text-sm rounded-lg font-500 transition-colors focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2",
                  n === page
                    ? "bg-brand-600 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Halaman berikutnya"
              className="px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2"
            >
              Berikutnya →
            </button>
          </nav>
        )}

      </div>
    </>
  );
}
