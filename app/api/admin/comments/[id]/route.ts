import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { comments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

function guard() { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return guard()
  const { id } = await params

  const [current] = await db.select({ approved: comments.approved })
    .from(comments).where(eq(comments.id, Number(id))).limit(1)

  if (!current) return NextResponse.json({ error: 'Comment not found.' }, { status: 404 })

  const [row] = await db.update(comments)
    .set({ approved: !current.approved })
    .where(eq(comments.id, Number(id)))
    .returning()

  return NextResponse.json({ ok: true, comment: row })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return guard()
  const { id } = await params
  await db.delete(comments).where(eq(comments.id, Number(id)))
  return NextResponse.json({ ok: true })
}
