'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, Calendar, Tag, BookOpen, ArrowLeft } from 'lucide-react'
import { parseTags } from '@/lib/blog'
import type { PostWithSeries } from '@/lib/blog'

interface Props {
  post: PostWithSeries
}

export default function PostHeader({ post }: Props) {
  const tags = parseTags(post.tags)
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  })

  return (
    <header className="mb-10">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        All posts
      </Link>

      {/* Series badge */}
      {post.series && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <BookOpen className="w-3 h-3" />
            {post.series.title}
            {post.seriesOrder && <span className="text-emerald-400/70">· Part {post.seriesOrder}</span>}
          </div>
        </div>
      )}

      {/* Title */}
      <motion.h1
        layoutId={`post-title-${post.slug}`}
        className="font-display font-bold text-3xl sm:text-4xl text-foreground leading-tight mb-4"
      >
        {post.title}
      </motion.h1>

      {/* Description */}
      {post.description && (
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          {post.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-6">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <time dateTime={post.createdAt}>{date}</time>
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          {post.readingTime}
        </span>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-muted-foreground/60" />
          {tags.map(tag => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="px-2.5 py-0.5 rounded-full text-xs border border-emerald-500/20 bg-emerald-500/8 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="mt-8 h-px bg-gradient-to-r from-emerald-500/30 via-border to-transparent" />
    </header>
  )
}
