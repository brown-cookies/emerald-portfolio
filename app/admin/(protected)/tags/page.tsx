'use client'
import { useEffect, useState, useTransition } from 'react'
import { Tag, Loader2, Pencil, Check, X, AlertCircle } from 'lucide-react'

interface TagRow { tag: string; count: number }

export default function AdminTagsPage() {
  const [tags,      setTags]      = useState<TagRow[]>([])
  const [loading,   setLoading]   = useState(true)
  const [isPending, start]        = useTransition()

  // Rename state — only one rename open at a time
  const [editing,   setEditing]   = useState<string | null>(null)
  const [renameVal, setRenameVal] = useState('')
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/tags')
    if (res.ok) setTags(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openEdit(tag: string) {
    setEditing(tag)
    setRenameVal(tag)
    setError('')
    setSuccess('')
  }

  function cancelEdit() {
    setEditing(null)
    setRenameVal('')
    setError('')
  }

  function handleRename(from: string) {
    setError('')
    setSuccess('')
    start(async () => {
      const res  = await fetch('/api/admin/tags', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ from, to: renameVal }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(`Renamed "${from}" → "${renameVal}" across ${data.updatedCount} post${data.updatedCount !== 1 ? 's' : ''}.`)
        setEditing(null)
        await load()  // refresh list
      } else {
        setError(data.error ?? 'Rename failed.')
      }
    })
  }

  const inputCls = `px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground
    placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tags</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Rename tags to fix duplicates like <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">react</span> vs <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">React</span> vs <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">reactjs</span>.
          Renaming updates every post that uses the tag atomically.
        </p>
      </div>

      {/* Feedback */}
      {success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8 text-sm text-emerald-400">
          <Check className="w-4 h-4 flex-shrink-0" /> {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/8 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : tags.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-border">
          <Tag className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No tags yet. Add them when creating posts.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tag</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Posts</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tags.map(({ tag, count }) => (
                <tr key={tag} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    {editing === tag ? (
                      <input
                        value={renameVal}
                        onChange={e => setRenameVal(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleRename(tag)
                          if (e.key === 'Escape') cancelEdit()
                        }}
                        autoFocus
                        className={inputCls}
                      />
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                        border border-emerald-500/20 bg-emerald-500/8 text-emerald-400">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {count} {count === 1 ? 'post' : 'posts'}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {editing === tag ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleRename(tag)}
                          disabled={isPending || !renameVal.trim() || renameVal === tag}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500
                            disabled:opacity-50 text-white text-xs font-medium transition-all"
                        >
                          {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                          Rename
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground border border-border hover:border-foreground/30 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => openEdit(tag)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border
                          text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
                      >
                        <Pencil className="w-3 h-3" /> Rename
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
