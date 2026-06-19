export default function ProjectDetailLoading() {
  return (
    <>
      {/* Breadcrumb skeleton */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="container-content py-3">
          <div className="h-3 w-64 bg-neutral-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Hero image skeleton */}
      <div className="aspect-[21/9] max-h-[520px] bg-neutral-200 animate-pulse" />

      <div className="container-content py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main content skeleton */}
          <div className="lg:col-span-2 space-y-8 animate-pulse">
            <div className="space-y-3">
              <div className="h-7 bg-neutral-200 rounded w-3/4" />
              <div className="h-4 bg-neutral-100 rounded w-full" />
              <div className="h-4 bg-neutral-100 rounded w-5/6" />
              <div className="h-4 bg-neutral-100 rounded w-4/6" />
            </div>

            {/* Gallery skeleton */}
            <div>
              <div className="h-5 w-32 bg-neutral-200 rounded mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-neutral-200" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-4 animate-pulse">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
              <div className="h-5 w-40 bg-neutral-200 rounded" />
              <div className="space-y-4">
                {[80, 60, 70, 50].map((w, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-3 bg-neutral-100 rounded" style={{ width: `${w}%` }} />
                    <div className="h-4 bg-neutral-200 rounded w-full" />
                  </div>
                ))}
              </div>
              <div className="h-10 bg-neutral-100 rounded-lg" />
              <div className="h-10 bg-brand-100 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
