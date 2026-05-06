'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

/**
 * BlogTransition
 *
 * Wraps blog route children in AnimatePresence so Next.js route changes
 * trigger a smooth fade. The key on the motion.div is the current pathname,
 * which causes AnimatePresence to unmount the old page and mount the new one
 * while animating between them.
 *
 * Must be a client component — used as a passthrough in the server layout.
 */
export default function BlogTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
