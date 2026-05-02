'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { useNav, SECTIONS, type SectionId } from '@/components/providers/NavProvider'

const LABELS: Record<SectionId, string> = {
  hero: 'Home', about: 'About', projects: 'Projects',
  skills: 'Skills', experience: 'Experience', testimonials: 'Testimonials', contact: 'Contact',
}

export default function SectionCounter() {
  const { current, goTo } = useNav()
  const idx   = SECTIONS.indexOf(current)
  const total = SECTIONS.length
  const canUp   = idx > 0
  const canDown = idx < total - 1

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-4">
      {/* Counter */}
      <div className="flex items-center gap-2 font-mono text-xs select-none">
        {/* Current index — slides on change */}
        <div className="relative w-5 h-5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={idx}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0,  opacity: 1 }}
              exit={{   y: -12, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center font-bold text-emerald-500"
            >
              {String(idx + 1).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="text-border">/</span>
        <span className="text-muted-foreground">{String(total).padStart(2, '0')}</span>

        {/* Section name */}
        <div className="relative ml-1 w-20 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={current}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{   opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute whitespace-nowrap text-muted-foreground"
            >
              {LABELS[current]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Prev / next arrows */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => canUp && goTo(SECTIONS[idx - 1] as SectionId)}
          disabled={!canUp}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:border-emerald-500/40 hover:text-emerald-500 text-muted-foreground transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none"
          aria-label="Previous section"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => canDown && goTo(SECTIONS[idx + 1] as SectionId)}
          disabled={!canDown}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:border-emerald-500/40 hover:text-emerald-500 text-muted-foreground transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none"
          aria-label="Next section"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
