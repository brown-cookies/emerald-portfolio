'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDebounce } from '@/lib/hooks/useDebounce'

// Search submits via URL param ?q=query — server re-renders with filtered posts.
// Debounced 300ms so we don't hit the server on every keystroke.
export default function SearchBar() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const initial      = searchParams.get('q') ?? ''

  const [value, setValue] = useState(initial)
  const debounced          = useDebounce(value, 300)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debounced) {
      params.set('q', debounced)
    } else {
      params.delete('q')
    }
    router.push(`${pathname}?${params.toString()}`)
  }, [debounced]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search posts…"
        className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground
          placeholder:text-muted-foreground
          focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20
          transition-all"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
