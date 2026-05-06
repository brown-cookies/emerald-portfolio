import { eq, and, ilike, or, desc, asc } from 'drizzle-orm'
import type { Post, Series, Comment } from '@/lib/db/schema'

// ─── Types ───────────────────────────────────────────────────────────────────

export type PostWithSeries = Post & { series: Series | null }

// tags is a real string[] from Postgres.
// This helper exists for call-site compatibility — components call parseTags(post.tags)
export function parseTags(tags: string[] | string): string[] {
  if (Array.isArray(tags)) return tags
  try { return JSON.parse(tags) } catch { return [] }
}

// ─── Mock fallback ────────────────────────────────────────────────────────────
// When DATABASE_URL is not set (no Neon account yet), all functions return
// the static mock data so `npm run dev` works immediately.

function isMockMode() {
  return !process.env.DATABASE_URL
}

// Lazy import — only loads the mock module when needed
async function getMock() {
  const m = await import('@/lib/db/mock')
  return m
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<PostWithSeries[]> {
  if (isMockMode()) return (await getMock()).mockPosts.filter(p => p.published)

  const { db } = await import('@/lib/db')
  const { posts, series } = await import('@/lib/db/schema')
  const rows = await db
    .select()
    .from(posts)
    .leftJoin(series, eq(posts.seriesId, series.id))
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt))
  return rows.map(r => ({ ...r.posts, series: r.series ?? null }))
}

export async function getAllPostsAdmin(): Promise<PostWithSeries[]> {
  if (isMockMode()) return (await getMock()).mockPosts

  const { db } = await import('@/lib/db')
  const { posts, series } = await import('@/lib/db/schema')
  const rows = await db
    .select()
    .from(posts)
    .leftJoin(series, eq(posts.seriesId, series.id))
    .orderBy(desc(posts.createdAt))
  return rows.map(r => ({ ...r.posts, series: r.series ?? null }))
}

export async function getPostBySlug(slug: string): Promise<PostWithSeries | null> {
  if (isMockMode()) {
    const { mockPosts } = await getMock()
    return mockPosts.find(p => p.slug === slug && p.published) ?? null
  }

  const { db } = await import('@/lib/db')
  const { posts, series } = await import('@/lib/db/schema')
  const rows = await db
    .select()
    .from(posts)
    .leftJoin(series, eq(posts.seriesId, series.id))
    .where(and(eq(posts.slug, slug), eq(posts.published, true)))
    .limit(1)
  if (!rows[0]) return null
  return { ...rows[0].posts, series: rows[0].series ?? null }
}

export async function getPostBySlugAdmin(slug: string): Promise<PostWithSeries | null> {
  if (isMockMode()) {
    const { mockPosts } = await getMock()
    return mockPosts.find(p => p.slug === slug) ?? null
  }

  const { db } = await import('@/lib/db')
  const { posts, series } = await import('@/lib/db/schema')
  const rows = await db
    .select()
    .from(posts)
    .leftJoin(series, eq(posts.seriesId, series.id))
    .where(eq(posts.slug, slug))
    .limit(1)
  if (!rows[0]) return null
  return { ...rows[0].posts, series: rows[0].series ?? null }
}

export async function searchPosts(query: string): Promise<PostWithSeries[]> {
  if (isMockMode()) {
    const { mockPosts } = await getMock()
    const q = query.toLowerCase()
    return mockPosts.filter(p =>
      p.published && (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    )
  }

  const { db } = await import('@/lib/db')
  const { posts, series } = await import('@/lib/db/schema')
  const term = `%${query}%`
  const rows = await db
    .select()
    .from(posts)
    .leftJoin(series, eq(posts.seriesId, series.id))
    .where(and(eq(posts.published, true), or(ilike(posts.title, term), ilike(posts.description, term))))
    .orderBy(desc(posts.createdAt))
  return rows.map(r => ({ ...r.posts, series: r.series ?? null }))
}

export async function getAllTags(): Promise<string[]> {
  if (isMockMode()) {
    const { mockPosts } = await getMock()
    const tagSet = new Set<string>()
    mockPosts.filter(p => p.published).forEach(p => p.tags.forEach(t => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }

  const { db } = await import('@/lib/db')
  const { posts } = await import('@/lib/db/schema')
  const rows = await db.select({ tags: posts.tags }).from(posts).where(eq(posts.published, true))
  const tagSet = new Set<string>()
  for (const row of rows) for (const tag of (row.tags ?? [])) tagSet.add(tag)
  return Array.from(tagSet).sort()
}

export async function getRelatedPosts(post: Post): Promise<PostWithSeries[]> {
  const myTags = post.tags ?? []
  if (myTags.length === 0) return []
  const all = await getAllPosts()
  return all
    .filter(p => p.id !== post.id)
    .map(p => ({ post: p, score: (p.tags ?? []).filter(t => myTags.includes(t)).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ post }) => post)
}

// ─── Series ──────────────────────────────────────────────────────────────────

export async function getAllSeries(): Promise<Series[]> {
  if (isMockMode()) return (await getMock()).mockSeries

  const { db } = await import('@/lib/db')
  const { series } = await import('@/lib/db/schema')
  return db.select().from(series).orderBy(asc(series.title))
}

export async function getSeriesPosts(seriesId: number): Promise<PostWithSeries[]> {
  if (isMockMode()) {
    const { mockPosts } = await getMock()
    return mockPosts
      .filter(p => p.seriesId === seriesId && p.published)
      .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0))
  }

  const { db } = await import('@/lib/db')
  const { posts, series } = await import('@/lib/db/schema')
  const rows = await db
    .select()
    .from(posts)
    .leftJoin(series, eq(posts.seriesId, series.id))
    .where(and(eq(posts.seriesId, seriesId), eq(posts.published, true)))
    .orderBy(asc(posts.seriesOrder))
  return rows.map(r => ({ ...r.posts, series: r.series ?? null }))
}

// ─── Comments ────────────────────────────────────────────────────────────────

export async function getApprovedComments(postId: number): Promise<Comment[]> {
  if (isMockMode()) {
    const { mockComments } = await getMock()
    return mockComments.filter(c => c.postId === postId && c.approved)
  }

  const { db } = await import('@/lib/db')
  const { comments } = await import('@/lib/db/schema')
  return db
    .select()
    .from(comments)
    .where(and(eq(comments.postId, postId), eq(comments.approved, true)))
    .orderBy(asc(comments.createdAt))
}

export async function getPendingComments(): Promise<(Comment & { postSlug: string; postTitle: string })[]> {
  if (isMockMode()) return []

  const { db } = await import('@/lib/db')
  const { posts, comments } = await import('@/lib/db/schema')
  const rows = await db
    .select({ comment: comments, postSlug: posts.slug, postTitle: posts.title })
    .from(comments)
    .leftJoin(posts, eq(comments.postId, posts.id))
    .where(eq(comments.approved, false))
    .orderBy(desc(comments.createdAt))
  return rows.map(r => ({ ...r.comment, postSlug: r.postSlug ?? '', postTitle: r.postTitle ?? '' }))
}

export async function getAllComments(): Promise<(Comment & { postSlug: string; postTitle: string })[]> {
  if (isMockMode()) {
    const { mockComments, mockPosts } = await getMock()
    return mockComments.map(c => {
      const post = mockPosts.find(p => p.id === c.postId)
      return { ...c, postSlug: post?.slug ?? '', postTitle: post?.title ?? '' }
    })
  }

  const { db } = await import('@/lib/db')
  const { posts, comments } = await import('@/lib/db/schema')
  const rows = await db
    .select({ comment: comments, postSlug: posts.slug, postTitle: posts.title })
    .from(comments)
    .leftJoin(posts, eq(comments.postId, posts.id))
    .orderBy(desc(comments.createdAt))
  return rows.map(r => ({ ...r.comment, postSlug: r.postSlug ?? '', postTitle: r.postTitle ?? '' }))
}
