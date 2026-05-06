import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { calcReadingTime } from '@/lib/mdx'

function guard() { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

// GET /api/admin/posts?slug=my-slug&excludeId=5
// Returns { available: boolean } — used by PostEditor for real-time slug check
export async function GET(req: NextRequest) {
  if (!(await getSession())) return guard()

  const slug      = req.nextUrl.searchParams.get('slug')?.trim()
  const excludeId = req.nextUrl.searchParams.get('excludeId')

  if (!slug) return NextResponse.json({ available: false })

  const { eq, and, ne } = await import('drizzle-orm')
  const existing = await db
    .select({ id: posts.id })
    .from(posts)
    .where(
      excludeId
        ? and(eq(posts.slug, slug), ne(posts.id, Number(excludeId)))
        : eq(posts.slug, slug)
    )
    .limit(1)

  return NextResponse.json({ available: existing.length === 0 })
}

export async function POST(req: NextRequest) {
  if (!(await getSession())) return guard()

  const body = await req.json()
  const { title, slug, description, content, tags, seriesId, seriesOrder, published } = body

  if (!title?.trim() || !slug?.trim())
    return NextResponse.json({ error: 'Title and slug are required.' }, { status: 422 })

  const cleanSlug = (slug as string)
    .toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

  // tags: accept comma string or array — store as native string[]
  const tagArray: string[] = Array.isArray(tags)
    ? tags
    : String(tags ?? '').split(',').map((t: string) => t.trim()).filter(Boolean)

  try {
    const [row] = await db.insert(posts).values({
      title:       title.trim(),
      slug:        cleanSlug,
      description: description?.trim() ?? '',
      content:     content ?? '',
      tags:        tagArray,
      seriesId:    seriesId ?? null,
      seriesOrder: seriesOrder ?? null,
      readingTime: calcReadingTime(content ?? ''),
      published:   Boolean(published),
    }).returning()

    return NextResponse.json({ ok: true, post: row }, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    if (msg.includes('unique') || msg.includes('duplicate'))
      return NextResponse.json({ error: 'Slug already exists.' }, { status: 409 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
