import type { Comment } from '@/lib/db/schema'
import { MessageSquare, User } from 'lucide-react'

interface Props {
  comments: Comment[]
}

export default function CommentList({ comments }: Props) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-10 rounded-xl border border-dashed border-border">
        <MessageSquare className="w-7 h-7 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => {
        const date = new Date(comment.createdAt).toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
        })
        // Color the avatar based on name — deterministic
        const hue = Array.from(comment.name).reduce((acc: number, ch: string) => acc + ch.charCodeAt(0), 0) % 360
        const initials = comment.name.trim().split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

        return (
          <div key={comment.id} className="flex gap-4 p-5 rounded-xl border border-border bg-card/60">
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: `hsl(${hue}, 55%, 45%)` }}
            >
              {initials || <User className="w-4 h-4" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-sm font-semibold text-foreground">{comment.name}</span>
                <time className="text-xs text-muted-foreground">{date}</time>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
