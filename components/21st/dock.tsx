'use client'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

// Individual dock item with magnification
function DockItem({
  children,
  label,
  mouseX,
  className,
  onClick,
}: {
  children: React.ReactNode
  label: string
  mouseX: ReturnType<typeof useMotionValue<number>>
  className?: string
  onClick?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect()
    return bounds ? val - (bounds.left + bounds.width / 2) : 0
  })

  const widthRaw = useTransform(distance, [-100, 0, 100], [40, 60, 40])
  const width = useSpring(widthRaw, { stiffness: 300, damping: 30 })

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={cn(
        'relative flex aspect-square cursor-pointer items-center justify-center rounded-xl bg-muted/60 hover:bg-muted border border-border/50 hover:border-emerald-500/30 transition-colors',
        className
      )}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 2, x: '-50%' }}
            className="absolute -top-9 left-1/2 whitespace-nowrap rounded-lg bg-card border border-border px-2.5 py-1 text-xs font-medium text-foreground shadow-lg z-50"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </motion.div>
  )
}

export function Dock({
  items,
  className,
}: {
  items: {
    label: string
    icon: React.ReactNode
    onClick?: () => void
    href?: string
  }[]
  className?: string
}) {
  const mouseX = useMotionValue(Infinity)

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'flex h-14 items-end gap-2 rounded-2xl border border-border bg-background/80 px-3 pb-2 shadow-xl shadow-black/10 backdrop-blur-md',
        className
      )}
    >
      {items.map((item, idx) =>
        item.href ? (
          <a key={idx} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
            <DockItem mouseX={mouseX} label={item.label} onClick={item.onClick}>
              {item.icon}
            </DockItem>
          </a>
        ) : (
          <DockItem key={idx} mouseX={mouseX} label={item.label} onClick={item.onClick}>
            {item.icon}
          </DockItem>
        )
      )}
    </motion.div>
  )
}
