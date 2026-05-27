// Skeleton shown while the async TodayPage (home) is loading.
// Next.js automatically wraps page.tsx in <Suspense> and renders this first.

function SkeletonLine({ width = 'w-full', height = 'h-4' }: { width?: string; height?: string }) {
  return (
    <div className={`${width} ${height} bg-gray-100 rounded-lg animate-pulse`} />
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm px-4 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-2.5 h-2.5 rounded-full bg-gray-100 animate-pulse shrink-0" />
        <div className="flex-1 space-y-1.5">
          <SkeletonLine width="w-32" height="h-4" />
          <SkeletonLine width="w-48" height="h-3" />
        </div>
      </div>
      <SkeletonLine width="w-16" height="h-6" />
    </div>
  )
}

export default function Loading() {
  return (
    <div className="px-4 py-5 space-y-5">
      {/* Date + meal header */}
      <div className="space-y-2">
        <SkeletonLine width="w-40" height="h-3" />
        <SkeletonLine width="w-24" height="h-7" />
      </div>

      {/* Open now strip */}
      <div className="rounded-xl h-12 bg-gray-100 animate-pulse" />

      {/* Dining Commons */}
      <section className="space-y-2.5">
        <SkeletonLine width="w-32" height="h-3" />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </section>

      {/* Campus Restaurants */}
      <section className="space-y-2.5">
        <SkeletonLine width="w-36" height="h-3" />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </section>
    </div>
  )
}
