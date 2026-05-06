'use client'
import { useState, FormEvent } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface Props {
  postId: number
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function CommentForm({ postId }: Props) {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [content, setContent] = useState('')
  const [status,  setStatus]  = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/comments', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ postId, name, email, content }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message ?? 'Comment submitted! It will appear after review.')
        setName(''); setEmail(''); setContent('')
      } else {
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please check your connection.')
    }
  }

  const inputClass = `w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground
    placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/60
    focus:ring-2 focus:ring-emerald-500/20 transition-all`

  return (
    <div className="mt-8">
      <h3 className="text-base font-semibold text-foreground mb-4">Leave a comment</h3>

      {status === 'success' ? (
        <div className="flex items-start gap-3 p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/8">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Thanks for your comment!</p>
            <p className="text-xs text-muted-foreground mt-0.5">{message}</p>
          </div>
          <button
            onClick={() => setStatus('idle')}
            className="ml-auto text-xs text-emerald-500 hover:text-emerald-400 transition-colors flex-shrink-0"
          >
            Write another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name + Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              required
              minLength={2}
              maxLength={100}
              className={inputClass}
            />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email (not shown publicly)"
              required
              className={inputClass}
            />
          </div>

          {/* Comment body */}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your comment…"
            required
            minLength={10}
            maxLength={2000}
            rows={4}
            className={`${inputClass} resize-none`}
          />

          {/* Character count + submit */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {content.length > 0 && `${content.length} / 2000`}
            </p>

            <div className="flex items-center gap-3">
              {status === 'error' && (
                <div className="flex items-center gap-1.5 text-xs text-red-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {message}
                </div>
              )}
              <button
                type="submit"
                disabled={status === 'loading' || !name || !email || !content}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500
                  disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-all"
              >
                {status === 'loading' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                ) : (
                  <><Send className="w-4 h-4" /> Submit</>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/60">
            Your email is used for identity only and will never be published.
            Comments are reviewed before appearing.
          </p>
        </form>
      )}
    </div>
  )
}
