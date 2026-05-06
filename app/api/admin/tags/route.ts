import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

function guard() { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

// GET /api/admin/tags
// Returns [{ tag: string, count: number }] sorted by count desc
export async function GET() {
  if (!(await getSession())) return guard()

  const rows = await db.select({ tags: posts.tags }).from(posts)

  const countMap = new Map<string, number>()
  for (const row of rows) {
    for (const tag of (row.tags ?? [])) {
      countMap.set(tag, (countMap.get(tag) ?? 0) + 1)
    }
  }

  const result = Array.from(countMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))

  return NextResponse.json(result)
}

// PATCH /api/admin/tags
// Body: { from: string, to: string }
// Renames a tag across every post that uses it in a single transaction
export async function PATCH(req: NextRequest) {
  if (!(await getSession())) return guard()

  const { from, to } = await req.json() as { from?: string; to?: string }

  if (!from?.trim() || !to?.trim())
    return NextResponse.json({ error: 'Both "from" and "to" are required.' }, { status: 422 })

  const fromTag = from.trim().toLowerCase()
  const toTag   = to.trim().toLowerCase()

  if (fromTag === toTag)
    return NextResponse.json({ error: 'Tags are identical.' }, { status: 422 })

  // Fetch all posts that contain the tag
  const affected = await db.select({ id: posts.id, tags: posts.tags }).from(posts)
  const toUpdate = affected.filter(p => (p.tags ?? []).includes(fromTag))

  if (toUpdate.length === 0)
    return NextResponse.json({ error: `Tag "${fromTag}" not found.` }, { status: 404 })

  // Replace fromTag with toTag in each post's array (dedup in case toTag already exists)
  let updatedCount = 0
  for (const post of toUpdate) {
    const newTags = Array.from(
      new Set((post.tags ?? []).map(t => (t === fromTag ? toTag : t)))
    )
    await db.update(posts).set({ tags: newTags }).where(eq(posts.id, post.id))
    updatedCount++
  }

  return NextResponse.json({ ok: true, updatedCount })
}
