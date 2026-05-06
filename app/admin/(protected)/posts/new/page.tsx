import { getAllSeries } from '@/lib/blog'
import PostEditor from '@/components/admin/PostEditor'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New Post — Admin' }

export default async function NewPostPage() {
  const allSeries = await getAllSeries()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">New post</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Write in MDX. Preview before publishing.</p>
      </div>
      <PostEditor allSeries={allSeries} />
    </div>
  )
}
