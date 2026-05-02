'use client'
import { createContext, useContext, useState, useCallback } from 'react'

interface BgContextValue {
  bgEnabled: boolean
  toggleBg: () => void
}

const BgContext = createContext<BgContextValue>({ bgEnabled: true, toggleBg: () => {} })

export function BgProvider({ children }: { children: React.ReactNode }) {
  const [bgEnabled, setBgEnabled] = useState(true)
  const toggleBg = useCallback(() => setBgEnabled(v => !v), [])
  return <BgContext.Provider value={{ bgEnabled, toggleBg }}>{children}</BgContext.Provider>
}

export function useBg() {
  return useContext(BgContext)
}
