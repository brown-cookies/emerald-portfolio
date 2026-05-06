// Streams instantly while blog/[slug]/page.tsx fetches post + series + comments
export default function BlogPostLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Back link */}
      <div className="h-4 w-20 rounded bg-muted animate-pulse mb-8" />

      {/* Post header skeleton */}
      <header className="mb-10">
        {/* Title */}
        <div className="space-y-3 mb-4">
          <div className="h-9 w-full rounded-lg bg-muted animate-pulse" />
          <div className="h-9 w-4/5 rounded-lg bg-muted animate-pulse" />
        </div>
        {/* Description */}
        <div className="space-y-2 mb-6">
          <div className="h-5 w-full rounded bg-muted animate-pulse" />
          <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
        </div>
        {/* Meta row */}
        <div className="flex gap-5 mb-6">
          <div className="h-4 w-28 rounded bg-muted animate-pulse" />
          <div className="h-4 w-20 rounded bg-muted animate-pulse" />
        </div>
        {/* Tags */}
        <div className="flex gap-2">
          {[52, 64, 48, 56].map((w, i) => (
            <div key={i} className="h-6 rounded-full bg-muted animate-pulse" style={{ width: w }} />
          ))}
        </div>
        {/* Divider */}
        <div className="mt-8 h-px bg-muted" />
      </header>

      {/* MDX content skeleton — varied line widths for natural feel */}
      <div className="space-y-3">
        {[100, 92, 97, 85, 100, 78, 94, 88, 100, 72, 96, 83, 60].map((pct, i) => (
          <div
            key={i}
            className={`h-4 rounded bg-muted animate-pulse ${i === 3 || i === 9 ? 'mt-8' : ''}`}
            style={{ width: `${pct}%` }}
          />
        ))}
        {/* Code block placeholder */}
        <div className="my-6 rounded-xl border border-border bg-card/60 p-5 space-y-2">
          {[70, 55, 80, 45, 65].map((pct, i) => (
            <div key={i} className="h-3.5 rounded bg-muted animate-pulse" style={{ width: `${pct}%` }} />
          ))}
        </div>
        {[100, 88, 95, 76, 91].map((pct, i) => (
          <div key={i} className="h-4 rounded bg-muted animate-pulse" style={{ width: `${pct}%` }} />
        ))}
      </div>
    </div>
  )
}
