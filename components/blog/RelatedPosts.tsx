import Link from 'next/link'
import { ArrowRight, Clock, Tag } from 'lucide-react'
import { parseTags } from '@/lib/blog'
import type { PostWithSeries } from '@/lib/blog'

interface Props {
  posts: PostWithSeries[]
  currentTags: string[]
}

export default function RelatedPosts({ posts, currentTags }: Props) {
  if (posts.length === 0) return null

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="font-display font-bold text-lg text-foreground mb-6">Related posts</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => {
          const tags        = parseTags(post.tags)
          const sharedTags  = tags.filter(t => currentTags.includes(t))
          const date        = new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day:   'numeric',
            year:  'numeric',
          })

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-xl border border-border bg-card/60 p-5 gap-3
                transition-all hover:border-emerald-500/40 hover:bg-card hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-500/5"
            >
              {/* Shared tag badges — shows which tags matched */}
              {sharedTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {sharedTags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium
                        border border-emerald-500/20 bg-emerald-500/8 text-emerald-400"
                    >
                      <Tag className="w-2 h-2" />{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h3 className="text-sm font-semibold text-foreground leading-snug
                group-hover:text-emerald-400 transition-colors line-clamp-2">
                {post.title}
              </h3>

              {/* Description */}
              {post.description && (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                  {post.description}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/60">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />{post.readingTime}
                </span>
                <span className="text-xs text-muted-foreground">{date}</span>
              </div>

              {/* Read arrow */}
              <span className="flex items-center gap-1 text-xs text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity -mt-1">
                Read post <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
