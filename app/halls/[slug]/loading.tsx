// Skeleton shown while the Hall Detail page resolves its 3–4 parallel
// Supabase queries. Next.js auto-wraps the async page in <Suspense>.

function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-100 ${className}`} />
}

function SkeletonItemCard() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm px-4 py-3">
      <Pulse className="h-4 w-48" />
      <div className="flex gap-1 mt-2">
        <Pulse className="h-3.5 w-7" />
        <Pulse className="h-3.5 w-7" />
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <>
      {/* Sub-header skeleton */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-100 shadow-sm px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Pulse className="w-5 h-5 rounded" />
            <div className="space-y-1.5">
              <Pulse className="h-4 w-24" />
              <Pulse className="h-3 w-32" />
            </div>
          </div>
          <Pulse className="h-7 w-20 rounded-full" />
        </div>
        {/* Tab strip skeleton */}
        <div className="flex gap-4 px-1 pt-3 pb-1">
          <Pulse className="h-4 w-20" />
          <Pulse className="h-4 w-16" />
          <Pulse className="h-4 w-16" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="px-4 py-5 space-y-6">
        <section className="space-y-2">
          <Pulse className="h-3 w-16" />
          <SkeletonItemCard />
          <SkeletonItemCard />
          <SkeletonItemCard />
        </section>
        <section className="space-y-2">
          <Pulse className="h-3 w-12" />
          <SkeletonItemCard />
          <SkeletonItemCard />
        </section>
        <section className="space-y-2">
          <Pulse className="h-3 w-24" />
          <SkeletonItemCard />
          <SkeletonItemCard />
          <SkeletonItemCard />
        </section>
      </div>
    </>
  )
}
