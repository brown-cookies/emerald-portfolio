'use client'
import { motion, useInView, type Variants } from 'framer-motion'
import { useRef } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  once?: boolean
}

export default function ScrollReveal({ children, className, delay = 0, direction = 'up', once = true }: ScrollRevealProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-8% 0px' })

  const offsets = { up: { y: 28, x: 0 }, down: { y: -28, x: 0 }, left: { y: 0, x: 28 }, right: { y: 0, x: -28 }, none: { y: 0, x: 0 } }

  const variants: Variants = {
    hidden: { opacity: 0, ...offsets[direction] },
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] } },
  }

  return (
    <motion.div ref={ref} className={className} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={variants}>
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className, staggerDelay = 0.1 }: { children: React.ReactNode; className?: string; staggerDelay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ visible: { transition: { staggerChildren: staggerDelay } } }}
    >
      {children}
    </motion.div>
  )
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
}
