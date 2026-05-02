'use client'
import { createContext, useContext, useState, useCallback } from 'react'

export const SECTIONS = ['hero', 'about', 'projects', 'skills', 'experience', 'testimonials', 'contact'] as const
export type SectionId = typeof SECTIONS[number]

interface NavContextValue {
  current: SectionId
  previous: SectionId | null
  direction: 1 | -1        // 1 = forward, -1 = backward
  goTo: (id: SectionId) => void
}

const NavContext = createContext<NavContextValue | null>(null)

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent]   = useState<SectionId>('hero')
  const [previous, setPrevious] = useState<SectionId | null>(null)
  const [direction, setDirection] = useState<1 | -1>(1)

  const goTo = useCallback((id: SectionId) => {
    if (id === current) return
    const fromIdx = SECTIONS.indexOf(current)
    const toIdx   = SECTIONS.indexOf(id)
    setDirection(toIdx > fromIdx ? 1 : -1)
    setPrevious(current)
    setCurrent(id)
  }, [current])

  return (
    <NavContext.Provider value={{ current, previous, direction, goTo }}>
      {children}
    </NavContext.Provider>
  )
}

export function useNav() {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error('useNav must be used inside NavProvider')
  return ctx
}
