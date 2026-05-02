'use client'
import React, { useRef } from 'react'
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

export function MovingBorder({
  children,
  duration = 2000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode
  as?: React.ElementType
  containerClassName?: string
  borderClassName?: string
  duration?: number
  className?: string
  rx?: string
  ry?: string
  [key: string]: unknown
}) {
  const pathRef = useRef<SVGRectElement | null>(null)
  const progress = useMotionValue<number>(0)

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength()
    if (length) {
      const pxPerMillisecond = length / duration
      progress.set((time * pxPerMillisecond) % length)
    }
  })

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val)?.x ?? 0)
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val)?.y ?? 0)

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`

  return (
    <div
      className="relative inline-flex h-12 overflow-hidden rounded-xl p-[1px]"
      {...otherProps}
    >
      <div className="absolute inset-0">
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            fill="none"
            width="100%"
            height="100%"
            rx={rx || '12'}
            ry={ry || '12'}
            ref={pathRef}
          />
        </svg>
        <motion.div
          style={{ position: 'absolute', top: 0, left: 0, transform }}
          className="h-10 w-10 opacity-90"
        >
          <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 opacity-80 blur-[8px]" />
        </motion.div>
      </div>
      <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-card text-foreground text-sm antialiased">
        {children}
      </div>
    </div>
  )
}

export function MovingBorderButton({
  children,
  className,
  containerClassName,
  duration,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  containerClassName?: string
  duration?: number
}) {
  return (
    <button
      className={cn('relative cursor-pointer', containerClassName)}
      {...props}
    >
      <MovingBorder duration={duration}>
        <span className={cn('px-6 py-3 font-medium text-sm', className)}>
          {children}
        </span>
      </MovingBorder>
    </button>
  )
}
