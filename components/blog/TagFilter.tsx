'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { X } from 'lucide-react'

interface Props {
  tags: string[]
}

// Client component — selecting a tag appends ?tag=x to the URL.
// The server page.tsx reads searchParams and passes only matching posts.
// This keeps filtering in the URL so it's shareable and works without JS.
export default function TagFilter({ tags }: Props) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const active       = searchParams.get('tag')

  function toggle(tag: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (active === tag) {
      params.delete('tag')
    } else {
      params.set('tag', tag)
    }
    // Preserve any active search query
    router.push(`${pathname}?${params.toString()}`)
  }

  function clear() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('tag')
    router.push(`${pathname}?${params.toString()}`)
  }

  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground font-medium">Filter:</span>

      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => toggle(tag)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
            active === tag
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
              : 'border-border text-muted-foreground hover:border-emerald-500/30 hover:text-emerald-400 bg-transparent'
          }`}
        >
          {tag}
        </button>
      ))}

      {active && (
        <button
          onClick={clear}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-muted-foreground hover:text-foreground border border-border hover:border-foreground/30 transition-all"
        >
          <X className="w-3 h-3" /> Clear
        </button>
      )}
    </div>
  )
}
