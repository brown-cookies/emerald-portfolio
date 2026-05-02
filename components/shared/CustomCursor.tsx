'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true) }
    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setHovering(!!(t.closest('a') || t.closest('button') || t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'))
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mouseover', onOver)
    document.body.addEventListener('mouseleave', () => setVisible(false))
    document.body.addEventListener('mouseenter', () => setVisible(true))

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <>
      {/* Ring — lags behind with spring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        animate={{ x: pos.x - 20, y: pos.y - 20, opacity: visible ? 1 : 0, scale: hovering ? 1.8 : clicking ? 0.7 : 1 }}
        transition={{ x: { type: 'spring', stiffness: 120, damping: 18, mass: 0.4 }, y: { type: 'spring', stiffness: 120, damping: 18, mass: 0.4 }, scale: { duration: 0.15 }, opacity: { duration: 0.2 } }}
      >
        <div className={`w-10 h-10 rounded-full border ${hovering ? 'border-emerald-400 bg-emerald-400/10' : 'border-emerald-400/60'} transition-colors duration-200`} />
      </motion.div>

      {/* Dot — follows instantly */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{ x: pos.x - 3, y: pos.y - 3, opacity: visible ? 1 : 0, scale: clicking ? 1.8 : 1 }}
        transition={{ x: { duration: 0 }, y: { duration: 0 }, scale: { duration: 0.1 }, opacity: { duration: 0.2 } }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      </motion.div>
    </>
  )
}
