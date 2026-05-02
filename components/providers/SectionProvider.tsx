'use client'
import { createContext, useContext, useState, useCallback } from 'react'

export const SECTIONS = ['hero', 'about', 'projects', 'skills', 'experience', 'contact'] as const
export type SectionId = typeof SECTIONS[number]

interface SectionCtx {
  active: SectionId
  direction: 1 | -1
  goTo: (id: SectionId) => void
  goNext: () => void
  goPrev: () => void
}

const Ctx = createContext<SectionCtx | null>(null)

export function SectionProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<SectionId>('hero')
  const [direction, setDirection] = useState<1 | -1>(1)

  const goTo = useCallback((id: SectionId) => {
    const from = SECTIONS.indexOf(active)
    const to   = SECTIONS.indexOf(id)
    if (from === to) return
    setDirection(to > from ? 1 : -1)
    setActive(id)
  }, [active])

  const goNext = useCallback(() => {
    const idx = SECTIONS.indexOf(active)
    if (idx < SECTIONS.length - 1) goTo(SECTIONS[idx + 1])
  }, [active, goTo])

  const goPrev = useCallback(() => {
    const idx = SECTIONS.indexOf(active)
    if (idx > 0) goTo(SECTIONS[idx - 1])
  }, [active, goTo])

  return (
    <Ctx.Provider value={{ active, direction, goTo, goNext, goPrev }}>
      {children}
    </Ctx.Provider>
  )
}

export function useSection() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSection must be used inside SectionProvider')
  return ctx
}
