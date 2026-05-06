'use client'
import { useEffect, useRef, useState } from 'react'
import { List } from 'lucide-react'
import type { TocHeading } from '@/lib/mdx'

interface Props {
  headings: TocHeading[]
}

export default function TOC({ headings }: Props) {
  const [activeId, setActiveId] = useState<string>('')
  const [open,     setOpen]     = useState(false)   // mobile drawer
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Intersection Observer — highlights the heading currently in the viewport
  useEffect(() => {
    if (headings.length === 0) return

    const ids = headings.map(h => h.id)

    observerRef.current = new IntersectionObserver(
      entries => {
        // Find the topmost intersecting heading
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 }
    )

    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveId(id)
    setOpen(false)
  }

  const NavList = () => (
    <ul className="space-y-1">
      {headings.map(h => (
        <li key={h.id} style={{ paddingLeft: h.depth === 3 ? '0.75rem' : 0 }}>
          <a
            href={`#${h.id}`}
            onClick={e => handleClick(e, h.id)}
            className={`block text-sm py-0.5 leading-snug transition-colors truncate
              ${h.depth === 3 ? 'text-[13px]' : ''}
              ${activeId === h.id
                ? 'text-emerald-400 font-medium'
                : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            {activeId === h.id && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 mb-0.5 flex-shrink-0" />
            )}
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      {/* ── Desktop sticky sidebar ── */}
      <aside className="hidden xl:block w-56 flex-shrink-0">
        <div className="sticky top-24 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <List className="w-3.5 h-3.5" />
            On this page
          </div>
          <nav>
            <NavList />
          </nav>
        </div>
      </aside>

      {/* ── Mobile floating button + drawer ── */}
      <div className="xl:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(v => !v)}
          className="w-10 h-10 rounded-full bg-card border border-border shadow-lg
            flex items-center justify-center text-muted-foreground
            hover:text-foreground hover:border-emerald-500/40 transition-all"
          aria-label="Table of contents"
        >
          <List className="w-4 h-4" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute bottom-12 right-0 z-50 w-64 rounded-2xl border border-border bg-card shadow-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                On this page
              </p>
              <nav>
                <NavList />
              </nav>
            </div>
          </>
        )}
      </div>
    </>
  )
}
