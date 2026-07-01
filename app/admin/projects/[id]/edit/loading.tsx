// Skeleton loading state untuk /admin/projects/[id]/edit.
// Ditampilkan oleh Next.js App Router secara otomatis saat page.tsx
// sedang menunggu data (async Server Component + fetch getProjectById).

export default function EditProjectLoading() {
  return (
    <div className="max-w-3xl mx-auto">

      {/* Header — back button + judul */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-9 h-9 rounded-lg bg-neutral-100 flex-shrink-0 animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 w-28 bg-neutral-100 rounded animate-pulse" />
          <div className="h-4 w-52 bg-neutral-100 rounded animate-pulse" />
        </div>
      </div>

      <div className="space-y-5">

        {/* Section: Informasi Utama */}
        <div className="admin-card p-6 space-y-5">
          <div className="h-4 w-36 bg-neutral-100 rounded animate-pulse" />
          {/* Nama Proyek — full width */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-neutral-100 rounded animate-pulse" />
            <div className="h-10 w-full bg-neutral-100 rounded-md animate-pulse" />
          </div>
          {/* Slug — full width */}
          <div className="space-y-2">
            <div className="h-4 w-16 bg-neutral-100 rounded animate-pulse" />
            <div className="h-10 w-full bg-neutral-100 rounded-md animate-pulse" />
          </div>
          {/* Kategori + Service Type — 2 kolom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
                <div className="h-10 w-full bg-neutral-100 rounded-md animate-pulse" />
              </div>
            ))}
          </div>
          {/* Deskripsi — full width, textarea */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
            <div className="h-24 w-full bg-neutral-100 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Section: Lokasi */}
        <div className="admin-card p-6 space-y-5">
          <div className="h-4 w-16 bg-neutral-100 rounded animate-pulse" />
          {/* Kota + Google Maps — 2 kolom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-neutral-100 rounded animate-pulse" />
                <div className="h-10 w-full bg-neutral-100 rounded-md animate-pulse" />
              </div>
            ))}
          </div>
          {/* Alamat lengkap — full width, textarea */}
          <div className="space-y-2">
            <div className="h-4 w-28 bg-neutral-100 rounded animate-pulse" />
            <div className="h-20 w-full bg-neutral-100 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Section: Detail Proyek */}
        <div className="admin-card p-6 space-y-5">
          <div className="h-4 w-28 bg-neutral-100 rounded animate-pulse" />
          {/* Tahun + Durasi — 2 kolom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-16 bg-neutral-100 rounded animate-pulse" />
                <div className="h-10 w-full bg-neutral-100 rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Section: Foto */}
        <div className="admin-card p-6 space-y-5">
          <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
          {/* Cover image uploader area */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
            <div className="h-44 w-full bg-neutral-100 rounded-xl animate-pulse" />
          </div>
          {/* Gallery uploader area */}
          <div className="space-y-2 border-t border-neutral-100 pt-5">
            <div className="h-4 w-24 bg-neutral-100 rounded animate-pulse" />
            <div className="h-28 w-full bg-neutral-100 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pb-8">
          <div className="h-10 w-28 bg-neutral-100 rounded-lg animate-pulse" />
          <div className="h-10 w-36 bg-neutral-100 rounded-lg animate-pulse" />
        </div>

      </div>
    </div>
  );
}