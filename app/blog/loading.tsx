// Streams instantly while blog/page.tsx fetches posts from DB
export default function BlogListLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header skeleton */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-8 w-16 rounded-lg bg-muted animate-pulse" />
            <div className="h-3 w-12 rounded bg-muted animate-pulse" />
          </div>
        </div>
        <div className="h-4 w-80 rounded bg-muted animate-pulse" />
      </div>

      {/* Search + filter toolbar skeleton */}
      <div className="flex gap-4 mb-8">
        <div className="h-10 w-72 rounded-xl bg-muted animate-pulse" />
        <div className="flex gap-2">
          {[60, 48, 72, 52].map((w, i) => (
            <div key={i} className="h-7 rounded-full bg-muted animate-pulse" style={{ width: w }} />
          ))}
        </div>
      </div>

      {/* PostCard shimmer grid — 2 columns, 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <div className="h-5 w-3/4 rounded-lg bg-muted animate-pulse" />
              <div className="h-5 w-1/2 rounded-lg bg-muted animate-pulse" />
            </div>
            {/* Description */}
            <div className="space-y-1.5">
              <div className="h-3.5 w-full rounded bg-muted animate-pulse" />
              <div className="h-3.5 w-5/6 rounded bg-muted animate-pulse" />
            </div>
            {/* Tags */}
            <div className="flex gap-1.5">
              {[48, 56, 44].map((w, j) => (
                <div key={j} className="h-5 rounded-full bg-muted animate-pulse" style={{ width: w }} />
              ))}
            </div>
            {/* Footer */}
            <div className="flex justify-between pt-1">
              <div className="h-3 w-20 rounded bg-muted animate-pulse" />
              <div className="h-3 w-16 rounded bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
