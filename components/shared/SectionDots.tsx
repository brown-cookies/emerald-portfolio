'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNav, SECTIONS, type SectionId } from '@/components/providers/NavProvider'

const LABELS: Record<SectionId, string> = {
  hero: 'Home', about: 'About', projects: 'Projects',
  skills: 'Skills', experience: 'Experience', testimonials: 'Testimonials', contact: 'Contact',
}

export default function SectionDots() {
  const { current, goTo } = useNav()
  const idx = SECTIONS.indexOf(current)

  // Keyboard: arrow up/down + Page Up/Down
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if ((e.key === 'ArrowDown' || e.key === 'PageDown') && idx < SECTIONS.length - 1)
        goTo(SECTIONS[idx + 1] as SectionId)
      if ((e.key === 'ArrowUp'   || e.key === 'PageUp')   && idx > 0)
        goTo(SECTIONS[idx - 1] as SectionId)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [idx, goTo])

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3.5">
      {SECTIONS.map((id) => {
        const isActive = current === id
        return (
          <button
            key={id}
            onClick={() => goTo(id as SectionId)}
            aria-label={`Go to ${LABELS[id as SectionId]}`}
            className="group relative flex items-center justify-end gap-2"
          >
            {/* Tooltip */}
            <motion.span
              className="absolute right-7 font-mono text-[10px] text-emerald-500 whitespace-nowrap bg-background/90 px-2 py-0.5 rounded-md border border-emerald-500/20 backdrop-blur-sm pointer-events-none"
              initial={{ opacity: 0, x: 4 }}
              whileHover={{ opacity: 1, x: 0 }}
              // We can't use group-hover with framer so we rely on CSS below
            />
            <span className="absolute right-7 font-mono text-[10px] text-emerald-500 whitespace-nowrap bg-background/90 px-2 py-0.5 rounded-md border border-emerald-500/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-1 transition-all duration-200">
              {LABELS[id as SectionId]}
            </span>

            {/* Pill dot */}
            <motion.div
              animate={{
                width:   isActive ? 22 : 6,
                height:  6,
                opacity: isActive ? 1 : 0.3,
              }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              className={`rounded-full transition-colors duration-200 ${
                isActive
                  ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]'
                  : 'bg-muted-foreground group-hover:bg-emerald-400'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
