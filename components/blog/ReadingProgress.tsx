'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * ReadingProgress
 *
 * A thin 2px accent bar fixed below the blog header that fills as the reader
 * scrolls through the article. Scoped to the article element (not the whole
 * page), so header / footer scroll doesn't count toward "read".
 *
 * Driven by a plain scroll listener → `scaleX` transform → GPU-composited,
 * no layout thrash.
 */
export default function ReadingProgress() {
  const articleRef  = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Walk up from the marker div to find the nearest <article> ancestor,
    // or fall back to the document as a whole.
    const marker = articleRef.current
    const article = marker
      ? (marker.closest('article') ?? marker.parentElement ?? document.documentElement)
      : document.documentElement

    const onScroll = () => {
      const { top, height } = article.getBoundingClientRect()
      const viewportH = window.innerHeight
      // How far the bottom of the article has scrolled past the top of the viewport
      const scrolled   = viewportH - top
      const total      = height + viewportH
      const clamped    = Math.min(1, Math.max(0, scrolled / total))
      setProgress(clamped)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // seed on mount
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Invisible marker so we can walk up to the article ancestor */}
      <div ref={articleRef} aria-hidden className="hidden" />

      {/* Fixed progress bar — sits just below the sticky blog nav (z-40) */}
      <div
        aria-hidden
        className="fixed top-14 left-0 right-0 h-[2px] z-30 origin-left
          bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300
          shadow-[0_0_6px_rgba(16,185,129,0.5)]
          transition-transform duration-75 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </>
  )
}
