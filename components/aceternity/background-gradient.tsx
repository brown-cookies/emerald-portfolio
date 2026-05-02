'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function BackgroundGradient({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  animate?: boolean
}) {
  const variants = {
    initial: { backgroundPosition: '0% 50%' },
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    },
  }

  return (
    <div className={cn('relative group/card', containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? 'initial' : undefined}
        animate={animate ? 'animate' : undefined}
        transition={
          animate
            ? { duration: 5, repeat: Infinity, repeatType: 'reverse' }
            : undefined
        }
        style={{ backgroundSize: '400% 400%' }}
        className={cn(
          'absolute -inset-[1px] rounded-2xl z-[1] opacity-0 group-hover/card:opacity-100 transition duration-500 will-change-transform',
          'bg-[radial-gradient(circle_farthest-side_at_0_100%,#10b981,transparent),radial-gradient(circle_farthest-side_at_100%_0,#34d399,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#059669,transparent),radial-gradient(circle_farthest-side_at_0_0,#6ee7b7,#10b981)]'
        )}
      />
      <div className={cn('relative z-10 bg-card rounded-2xl', className)}>
        {children}
      </div>
    </div>
  )
}
