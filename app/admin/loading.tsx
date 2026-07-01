// Skeleton loading state untuk /admin (Dashboard).
// Ditampilkan oleh Next.js App Router secara otomatis saat page.tsx
// sedang menunggu data (force-dynamic + fetch getProjects).

export default function AdminDashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="space-y-2">
        <div className="h-7 w-32 bg-neutral-100 rounded-lg animate-pulse" />
        <div className="h-4 w-64 bg-neutral-100 rounded animate-pulse" />
      </div>

      {/* Stat cards — 3 kolom */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="admin-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 flex-shrink-0 animate-pulse" />
            <div className="space-y-2">
              <div className="h-7 w-10 bg-neutral-100 rounded animate-pulse" />
              <div className="h-4 w-24 bg-neutral-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick action cards — 2 kolom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="admin-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex-shrink-0 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-36 bg-neutral-100 rounded animate-pulse" />
              <div className="h-3 w-48 bg-neutral-100 rounded animate-pulse" />
            </div>
            <div className="w-4 h-4 bg-neutral-100 rounded animate-pulse flex-shrink-0" />
          </div>
        ))}
      </div>

      {/* Recent projects card */}
      <div className="admin-card">
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div className="h-4 w-28 bg-neutral-100 rounded animate-pulse" />
          <div className="h-4 w-16 bg-neutral-100 rounded animate-pulse" />
        </div>

        {/* Row skeleton — 5 baris sesuai jumlah recent di page.tsx */}
        <div className="px-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-0"
            >
              {/* Thumbnail */}
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex-shrink-0 animate-pulse" />
              {/* Info */}
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-neutral-100 rounded animate-pulse" />
                <div className="h-3 w-32 bg-neutral-100 rounded animate-pulse" />
              </div>
              {/* Edit link */}
              <div className="h-4 w-8 bg-neutral-100 rounded animate-pulse flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}