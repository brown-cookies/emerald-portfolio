'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  onClick,
  href,
  target,
  rel,
  download,
}: {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
  href?: string
  target?: string
  rel?: string
  download?: boolean | string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (e.clientX - (left + width / 2)) * strength
    const y = (e.clientY - (top + height / 2)) * strength
    setPosition({ x, y })
  }

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 })

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.5 }}
      className={cn('inline-flex', className)}
    >
      {children}
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} target={target} rel={rel} download={download}>
        {inner}
      </a>
    )
  }

  return <div onClick={onClick}>{inner}</div>
}
