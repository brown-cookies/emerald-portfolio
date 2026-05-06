import { notFound } from 'next/navigation'
import { getPostBySlugAdmin, getAllSeries } from '@/lib/blog'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import PostEditor from '@/components/admin/PostEditor'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Edit Post — Admin' }

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const [row] = await db.select().from(posts).where(eq(posts.id, Number(id))).limit(1)
  if (!row) notFound()

  const post = await getPostBySlugAdmin(row.slug)
  if (!post) notFound()

  const allSeries = await getAllSeries()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Edit post</h1>
        <p className="text-sm text-muted-foreground font-mono mt-0.5">{post.slug}</p>
      </div>
      <PostEditor post={post} allSeries={allSeries} />
    </div>
  )
}
