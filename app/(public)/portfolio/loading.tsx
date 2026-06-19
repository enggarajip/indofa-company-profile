// Otomatis ditampilkan Next.js saat portfolio/page.tsx sedang fetch data

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-neutral-200 animate-pulse">
      <div className="aspect-[4/3] bg-neutral-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-neutral-100 rounded w-1/2" />
        <div className="h-3 bg-neutral-100 rounded w-1/4 mt-4" />
      </div>
    </div>
  );
}

export default function PortfolioLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="bg-gradient-to-br from-brand-950 to-brand-800 py-20">
        <div className="container-content text-center animate-pulse">
          <div className="h-3 w-20 bg-white/20 rounded-full mx-auto mb-4" />
          <div className="h-10 w-64 bg-white/20 rounded-xl mx-auto mb-4" />
          <div className="h-4 w-80 bg-white/10 rounded mx-auto" />
        </div>
      </section>

      {/* Filter skeleton */}
      <section className="section bg-neutral-50">
        <div className="container-content">
          <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-pulse">
            <div className="flex-1 h-11 bg-neutral-200 rounded-xl" />
            <div className="sm:w-48 h-11 bg-neutral-200 rounded-xl" />
            <div className="sm:w-36 h-11 bg-neutral-200 rounded-xl" />
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
