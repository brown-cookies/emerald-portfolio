import Link from 'next/link'
import { BookOpen, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import type { PostWithSeries } from '@/lib/blog'
import type { Series } from '@/lib/db/schema'

interface Props {
  series: Series
  posts: PostWithSeries[]
  currentSlug: string
}

export default function SeriesNav({ series, posts, currentSlug }: Props) {
  const currentIdx = posts.findIndex(p => p.slug === currentSlug)
  const prev = currentIdx > 0              ? posts[currentIdx - 1] : null
  const next = currentIdx < posts.length - 1 ? posts[currentIdx + 1] : null

  return (
    <aside className="my-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-emerald-500/15">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-emerald-500/70 font-medium uppercase tracking-wide">Series</p>
          <p className="text-sm font-semibold text-foreground truncate">{series.title}</p>
        </div>
        <span className="ml-auto text-xs text-muted-foreground flex-shrink-0">
          {currentIdx + 1} / {posts.length}
        </span>
      </div>

      {/* Post list */}
      <ol className="px-5 py-3 space-y-1">
        {posts.map((post, i) => {
          const isCurrent = post.slug === currentSlug
          const isPast    = i < currentIdx

          return (
            <li key={post.id}>
              {isCurrent ? (
                // Current — not a link, just highlighted
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/25">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                  <span className="text-sm font-medium text-foreground truncate">{post.title}</span>
                  <span className="ml-auto text-xs text-emerald-500 flex-shrink-0">Reading</span>
                </div>
              ) : (
                <Link
                  href={`/blog/${post.slug}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group
                    ${isPast ? 'opacity-60 hover:opacity-100' : ''}
                    hover:bg-emerald-500/8`}
                >
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 text-[10px] font-bold transition-colors
                    ${isPast
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500'
                      : 'border-border text-muted-foreground group-hover:border-emerald-500/40 group-hover:text-emerald-400'
                    }`}>
                    {isPast ? <Check className="w-3 h-3" /> : i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">
                    {post.title}
                  </span>
                </Link>
              )}
            </li>
          )
        })}
      </ol>

      {/* Prev / Next navigation */}
      {(prev || next) && (
        <div className={`grid gap-px border-t border-emerald-500/15 ${prev && next ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {prev && (
            <Link
              href={`/blog/${prev.slug}`}
              className="flex items-center gap-2 px-5 py-3.5 hover:bg-emerald-500/8 transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 transition-colors flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Previous</p>
                <p className="text-xs font-medium text-foreground truncate group-hover:text-emerald-400 transition-colors">
                  {prev.title}
                </p>
              </div>
            </Link>
          )}
          {next && (
            <Link
              href={`/blog/${next.slug}`}
              className={`flex items-center gap-2 px-5 py-3.5 hover:bg-emerald-500/8 transition-colors group
                ${prev ? 'border-l border-emerald-500/15 justify-end text-right' : ''}`}
            >
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Next</p>
                <p className="text-xs font-medium text-foreground truncate group-hover:text-emerald-400 transition-colors">
                  {next.title}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 transition-colors flex-shrink-0" />
            </Link>
          )}
        </div>
      )}
    </aside>
  )
}
