'use client'
import React, { useId } from 'react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SparkleType {
  id: string
  createdAt: number
  color: string
  size: number
  style: React.CSSProperties
}

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min

const useRandomInterval = (
  callback: () => void,
  minDelay: number | null,
  maxDelay: number | null
) => {
  const timeoutId = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const savedCallback = React.useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (!minDelay || !maxDelay) return

    let isEnabled = true
    const handleTick = () => {
      const nextTickAt = random(minDelay, maxDelay)
      timeoutId.current = setTimeout(() => {
        if (isEnabled) {
          savedCallback.current()
          handleTick()
        }
      }, nextTickAt)
    }
    handleTick()
    return () => {
      isEnabled = false
      if (timeoutId.current) clearTimeout(timeoutId.current)
    }
  }, [minDelay, maxDelay])
}

const generateSparkle = (color: string): SparkleType => ({
  id: String(random(10000, 99999)),
  createdAt: Date.now(),
  color,
  size: random(10, 20),
  style: {
    top: `${random(0, 100)}%`,
    left: `${random(0, 100)}%`,
    zIndex: 2,
  },
})

export function SparklesCore({
  children,
  className,
  color = '#10b981',
}: {
  children?: React.ReactNode
  className?: string
  color?: string
}) {
  const [sparkles, setSparkles] = useState<SparkleType[]>([])
  const prefersReducedMotion = false

  useRandomInterval(
    () => {
      const sparkle = generateSparkle(color)
      const now = Date.now()
      const nextSparkles = sparkles
        .filter((s) => now - s.createdAt < 750)
        .concat(sparkle)
      setSparkles(nextSparkles)
    },
    prefersReducedMotion ? null : 200,
    prefersReducedMotion ? null : 500
  )

  return (
    <span className={cn('relative inline-block', className)}>
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.svg
            key={sparkle.id}
            style={sparkle.style as React.CSSProperties}
            className="absolute pointer-events-none"
            width={sparkle.size}
            height={sparkle.size}
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ scale: 0, rotate: 75 }}
            animate={{ scale: 1, rotate: 45 }}
            exit={{ scale: 0, rotate: 75 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <path
              d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
              fill={sparkle.color}
            />
          </motion.svg>
        ))}
      </AnimatePresence>
      <span className="relative z-10">{children}</span>
    </span>
  )
}
