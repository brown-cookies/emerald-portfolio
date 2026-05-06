import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getAllPosts, getAllTags, searchPosts, parseTags } from '@/lib/blog'
import { siteConfig } from '@/data/config'
import PostCard from '@/components/blog/PostCard'
import TagFilter from '@/components/blog/TagFilter'
import SearchBar from '@/components/blog/SearchBar'
import { PenLine, Rss } from 'lucide-react'

export const metadata: Metadata = {
  title: `Blog · ${siteConfig.name}`,
  description: `Articles on web development, AI engineering, and software by ${siteConfig.name}.`,
}

// searchParams — comes from the URL (?q=query&tag=tag)
// Next.js 15: searchParams is a Promise
interface Props {
  searchParams: Promise<{ q?: string; tag?: string }>
}

export default async function BlogPage({ searchParams }: Props) {
  const { q, tag } = await searchParams

  // Parallel fetch: posts + all tags for filter
  const [allPosts, allTags] = await Promise.all([
    q ? searchPosts(q) : getAllPosts(),
    getAllTags(),
  ])

  // Tag filter applied after search (in-memory, fast at portfolio scale)
  const posts = tag
    ? allPosts.filter(p => parseTags(p.tags).includes(tag))
    : allPosts

  const isEmpty = posts.length === 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
            <PenLine className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Blog</h1>
            <p className="text-sm text-muted-foreground">
              {allPosts.length} {allPosts.length === 1 ? 'post' : 'posts'}
            </p>
          </div>
          {/* RSS link */}
          <a
            href="/blog/rss.xml"
            className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-500 transition-colors"
            title="RSS Feed"
          >
            <Rss className="w-4 h-4" />
            RSS
          </a>
        </div>
        <p className="text-muted-foreground max-w-xl leading-relaxed">
          Thoughts on web development, AI engineering, robotics, and building things from scratch.
        </p>
      </div>

      {/* Search + Filter toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Suspense boundary required — SearchBar uses useSearchParams() */}
        <Suspense>
          <SearchBar />
        </Suspense>
        <Suspense>
          <TagFilter tags={allTags} />
        </Suspense>
      </div>

      {/* Active filters indicator */}
      {(q || tag) && (
        <p className="text-sm text-muted-foreground mb-6">
          Showing <span className="text-foreground font-medium">{posts.length}</span> result{posts.length !== 1 ? 's' : ''}
          {q && <> for &ldquo;<span className="text-emerald-400">{q}</span>&rdquo;</>}
          {tag && <> tagged <span className="text-emerald-400">{tag}</span></>}
        </p>
      )}

      {/* Posts grid */}
      {isEmpty ? (
        <div className="text-center py-24">
          <PenLine className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">No posts found</p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            {q || tag ? 'Try a different search or filter.' : 'Check back soon!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
