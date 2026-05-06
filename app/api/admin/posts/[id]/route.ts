import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { calcReadingTime } from '@/lib/mdx'

function guard() { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return guard()
  const { id } = await params
  const body = await req.json()
  const { title, slug, description, content, tags, seriesId, seriesOrder, published } = body

  const tagArray: string[] = Array.isArray(tags)
    ? tags
    : String(tags ?? '').split(',').map((t: string) => t.trim()).filter(Boolean)

  const cleanSlug = slug
    ? String(slug).toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    : undefined

  try {
    const [row] = await db.update(posts)
      .set({
        ...(title       !== undefined && { title:       title.trim()       }),
        ...(cleanSlug   !== undefined && { slug:        cleanSlug          }),
        ...(description !== undefined && { description: description.trim() }),
        ...(content     !== undefined && { content,     readingTime: calcReadingTime(content) }),
        ...(tags        !== undefined && { tags:        tagArray           }),
        ...(seriesId    !== undefined && { seriesId:    seriesId ?? null   }),
        ...(seriesOrder !== undefined && { seriesOrder: seriesOrder ?? null }),
        ...(published   !== undefined && { published:   Boolean(published) }),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(posts.id, Number(id)))
      .returning()

    if (!row) return NextResponse.json({ error: 'Post not found.' }, { status: 404 })
    return NextResponse.json({ ok: true, post: row })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    if (msg.includes('unique') || msg.includes('duplicate'))
      return NextResponse.json({ error: 'Slug already exists.' }, { status: 409 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return guard()
  const { id } = await params
  await db.delete(posts).where(eq(posts.id, Number(id)))
  return NextResponse.json({ ok: true })
}
