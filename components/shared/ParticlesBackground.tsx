'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBg } from '@/components/providers/BgProvider'

interface Particle { x: number; y: number; vx: number; vy: number; alpha: number; size: number; base: number }

function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const mouse = { x: -9999, y: -9999 }
    let particles: Particle[] = []

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 13000), 80)
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        alpha: Math.random() * 0.35 + 0.05,
        size: Math.random() * 1.5 + 0.4,
        base: Math.random() * 0.32 + 0.05,
      }))
    }

    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const t = Date.now()
      particles.forEach((p, i) => {
        const dx = p.x - mouse.x, dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const f = (120 - dist) / 120 * 0.4
          p.vx += dx / dist * f; p.vy += dy / dist * f
        }
        p.vx *= 0.97; p.vy *= 0.97
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width;  if (p.x > canvas.width)  p.x = 0
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0
        p.alpha = p.base + Math.sin(t * 0.0008 + i) * 0.08

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(16,185,129,${p.alpha})`
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j], ddx = p.x - q.x, ddy = p.y - q.y
          const d = Math.sqrt(ddx * ddx + ddy * ddy)
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(16,185,129,${(1 - d / 100) * 0.1})`
            ctx.lineWidth = 0.5; ctx.stroke()
          }
        }
      })
      raf = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch, { passive: true })
    resize(); draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" aria-hidden />
}

// Global layer — renders outside section panels so it persists across transitions
export default function ParticlesBackground() {
  const { bgEnabled } = useBg()
  // Respect system accessibility preference
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  // Don't render at all if reduced motion is preferred
  if (prefersReduced) return null

  return (
    <AnimatePresence>
      {bgEnabled && (
        <motion.div
          key="particles"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-0 pointer-events-none"
        >
          <ParticlesCanvas />
          {/* Subtle grid overlay */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(16,185,129,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.025) 1px,transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
