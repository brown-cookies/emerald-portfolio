'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { cn } from '@/lib/utils'

export function FloatingNav({
  navItems,
  className,
}: {
  navItems: {
    name: string
    link: string
    icon?: React.ReactNode
  }[]
  className?: string
}) {
  const { scrollYProgress } = useScroll()
  const [visible, setVisible] = useState(false)

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    if (typeof current === 'number') {
      const direction = current - (scrollYProgress.getPrevious() ?? 0)
      if (scrollYProgress.get() < 0.05) {
        setVisible(false)
      } else {
        setVisible(direction < 0)
      }
    }
  })

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'fixed top-4 inset-x-0 mx-auto z-[5000] flex max-w-fit items-center justify-center space-x-2 rounded-2xl border border-border bg-background/80 px-4 py-2.5 shadow-lg shadow-black/10 backdrop-blur-md',
            className
          )}
        >
          {navItems.map((item, idx) => (
            <a
              key={`nav-${idx}`}
              href={item.link}
              className={cn(
                'relative flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-muted'
              )}
            >
              {item.icon && (
                <span className="text-emerald-500 w-4 h-4">{item.icon}</span>
              )}
              <span className="font-medium">{item.name}</span>
            </a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
