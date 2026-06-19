import Link from "next/link";
import { getProjects } from "@/lib/actions/projects";
import { FolderOpen, Plus, ArrowRight, MapPin, Calendar } from "lucide-react";
import type { Project } from "@/types";

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="admin-card p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-display font-700 text-neutral-900">{value}</p>
        <p className="text-sm text-neutral-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Recent Project Row ───────────────────────────────────────────────────────

function RecentRow({ project }: { project: Project }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-0">
      {/* Cover thumbnail */}
      <div className="w-10 h-10 rounded-lg bg-neutral-100 flex-shrink-0 overflow-hidden">
        {project.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-media/${project.cover_image}`}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FolderOpen size={16} className="text-neutral-300" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-500 text-neutral-800 truncate">{project.title}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
            {project.category}
          </span>
          {project.location && (
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <MapPin size={10} /> {project.location}
            </span>
          )}
          {project.year && (
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <Calendar size={10} /> {project.year}
            </span>
          )}
        </div>
      </div>

      {/* Edit link */}
      <Link
        href={`/admin/projects/${project.id}/edit`}
        className="text-xs text-brand-600 hover:text-brand-800 font-500 flex-shrink-0"
      >
        Edit
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminDashboard() {
  const result = await getProjects({ orderBy: "created_at_desc" });
  const projects = result.success ? result.data : [];

  const total   = projects.length;
  const recent  = projects.slice(0, 5);

  // Hitung per kategori
  const byCategory = projects.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-700 text-neutral-900">Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Selamat datang di panel admin PT Indofa Gemilang Konstruksi.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Proyek"
          value={total}
          icon={FolderOpen}
          color="bg-brand-600"
        />
        <div className="admin-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-accent-500">
            <FolderOpen size={22} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-display font-700 text-neutral-900">
              {topCategory?.[1] ?? 0}
            </p>
            <p className="text-sm text-neutral-500 mt-0.5">
              {topCategory?.[0] ?? "—"}
            </p>
          </div>
        </div>
        <div className="admin-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-green-500">
            <Calendar size={22} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-display font-700 text-neutral-900">
              {projects.filter((p) => p.year === new Date().getFullYear()).length}
            </p>
            <p className="text-sm text-neutral-500 mt-0.5">Proyek Tahun Ini</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/projects/new"
          className="admin-card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow group"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
            <Plus size={20} className="text-brand-600" />
          </div>
          <div>
            <p className="font-display font-600 text-neutral-800 text-sm">Tambah Proyek Baru</p>
            <p className="text-xs text-neutral-400 mt-0.5">Tambahkan proyek ke portfolio</p>
          </div>
          <ArrowRight size={16} className="text-neutral-300 ml-auto group-hover:text-brand-400 transition-colors" />
        </Link>

        <Link
          href="/admin/projects"
          className="admin-card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow group"
        >
          <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center group-hover:bg-neutral-100 transition-colors">
            <FolderOpen size={20} className="text-neutral-500" />
          </div>
          <div>
            <p className="font-display font-600 text-neutral-800 text-sm">Kelola Semua Proyek</p>
            <p className="text-xs text-neutral-400 mt-0.5">Edit, hapus, atau filter proyek</p>
          </div>
          <ArrowRight size={16} className="text-neutral-300 ml-auto group-hover:text-neutral-400 transition-colors" />
        </Link>
      </div>

      {/* Recent projects */}
      <div className="admin-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="font-display font-600 text-neutral-800 text-sm">Proyek Terbaru</h2>
          <Link href="/admin/projects" className="text-xs text-brand-600 hover:text-brand-800 font-500">
            Lihat semua
          </Link>
        </div>

        <div className="px-6">
          {recent.length === 0 ? (
            <div className="py-12 text-center">
              <FolderOpen size={32} className="text-neutral-200 mx-auto mb-3" />
              <p className="text-sm text-neutral-400">Belum ada proyek.</p>
              <Link href="/admin/projects/new" className="text-sm text-brand-600 hover:text-brand-800 font-500 mt-1 inline-block">
                Tambah proyek pertama
              </Link>
            </div>
          ) : (
            recent.map((p) => <RecentRow key={p.id} project={p} />)
          )}
        </div>
      </div>

    </div>
  );
}
