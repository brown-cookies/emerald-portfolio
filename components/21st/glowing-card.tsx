'use client'
import { useRef, MouseEvent } from 'react'
import { cn } from '@/lib/utils'

export function GlowingCard({
  children,
  className,
  glowColor = 'rgba(16,185,129,0.15)',
}: {
  children: React.ReactNode
  className?: string
  glowColor?: string
}) {
  const divRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    divRef.current.style.setProperty('--mouse-x', `${x}px`)
    divRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn(
        'relative rounded-2xl border border-border bg-card overflow-hidden',
        'before:absolute before:inset-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:rounded-2xl',
        'before:bg-[radial-gradient(600px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),var(--glow-color,rgba(16,185,129,0.08)),transparent_40%)]',
        className
      )}
      style={{ '--glow-color': glowColor } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
