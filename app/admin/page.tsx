import { getAllPostsAdmin } from '@/lib/blog'
import { getAllComments } from '@/lib/blog'
import { FileText, MessageSquare, Eye, BookOpen } from 'lucide-react'

export const metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboard() {
  const [allPosts, allComments] = await Promise.all([
    getAllPostsAdmin(),
    getAllComments(),
  ])

  const published = allPosts.filter(p => p.published).length
  const drafts    = allPosts.length - published
  const pending   = allComments.filter(c => !c.approved).length

  const stats = [
    { label: 'Published posts', value: published, icon: Eye,          color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Drafts',          value: drafts,    icon: FileText,      color: 'text-amber-500',   bg: 'bg-amber-500/10   border-amber-500/20'   },
    { label: 'Total posts',     value: allPosts.length, icon: BookOpen, color: 'text-blue-500',   bg: 'bg-blue-500/10    border-blue-500/20'    },
    { label: 'Pending comments',value: pending,   icon: MessageSquare, color: 'text-rose-500',    bg: 'bg-rose-500/10    border-rose-500/20'    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back. Here&apos;s what&apos;s going on.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`rounded-xl border p-5 ${s.bg}`}>
            <s.icon className={`w-5 h-5 mb-3 ${s.color}`} />
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent posts */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recent posts</h2>
        {allPosts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No posts yet. <a href="/admin/posts/new" className="text-emerald-500 hover:underline">Create your first post →</a></p>
        ) : (
          <div className="space-y-2">
            {allPosts.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${p.published ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-500 bg-amber-500/10 border-amber-500/20'}`}>
                  {p.published ? 'Live' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
