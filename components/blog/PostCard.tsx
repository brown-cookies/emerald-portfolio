'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, Tag, BookOpen } from 'lucide-react'
import { parseTags } from '@/lib/blog'
import type { PostWithSeries } from '@/lib/blog'

interface Props {
  post: PostWithSeries
}

export default function PostCard({ post }: Props) {
  const tags = parseTags(post.tags)
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'month' in new Date() ? 'numeric' : 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 h-full
        transition-all duration-300
        hover:border-emerald-500/40 hover:bg-card hover:shadow-lg hover:shadow-emerald-500/5
        hover:-translate-y-0.5">

        {/* Series badge */}
        {post.series && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-500 mb-3">
            <BookOpen className="w-3 h-3" />
            <span className="font-medium">{post.series.title}</span>
            {post.seriesOrder && (
              <span className="text-muted-foreground">· Part {post.seriesOrder}</span>
            )}
          </div>
        )}

        {/* Title */}
        <motion.h2
          layoutId={`post-title-${post.slug}`}
          className="font-display font-bold text-lg text-foreground mb-2
            group-hover:text-emerald-500 transition-colors leading-snug"
        >
          {post.title}
        </motion.h2>

        {/* Description */}
        {post.description && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {post.description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 4).map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
                  border border-emerald-500/20 bg-emerald-500/8 text-emerald-400"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="px-2 py-0.5 rounded-full text-xs border border-border text-muted-foreground">
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer: date + reading time */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <time dateTime={post.createdAt}>{date}</time>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readingTime}
          </span>
        </div>

        {/* Hover accent line */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity" />
      </article>
    </Link>
  )
}
