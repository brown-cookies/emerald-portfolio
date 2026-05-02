'use client'
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type SectionId = 'hero' | 'about' | 'projects' | 'skills' | 'experience' | 'contact'

export const SECTIONS: SectionId[] = ['hero', 'about', 'projects', 'skills', 'experience', 'contact']

interface SectionContextValue {
  active: SectionId
  direction: 1 | -1
  navigate: (id: SectionId) => void
}

const SectionContext = createContext<SectionContextValue | null>(null)

export function SectionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<SectionId>('hero')
  const [direction, setDirection] = useState<1 | -1>(1)

  const navigate = useCallback((id: SectionId) => {
    setActive(prev => {
      const prevIdx = SECTIONS.indexOf(prev)
      const nextIdx = SECTIONS.indexOf(id)
      setDirection(nextIdx >= prevIdx ? 1 : -1)
      return id
    })
  }, [])

  return (
    <SectionContext.Provider value={{ active, direction, navigate }}>
      {children}
    </SectionContext.Provider>
  )
}

export function useSectionNav() {
  const ctx = useContext(SectionContext)
  if (!ctx) throw new Error('useSectionNav must be used inside SectionProvider')
  return ctx
}
