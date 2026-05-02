'use client'
import { useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

type SpotlightProps = {
  className?: string
  fill?: string
}

export function Spotlight({ className, fill }: SpotlightProps) {
  return (
    <svg
      className={cn(
        'animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] opacity-0 lg:w-[84%]',
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill || '#10b981'}
          fillOpacity="0.15"
        />
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_8" />
        </filter>
      </defs>
    </svg>
  )
}

// Mouse-tracking spotlight for cards
export function CardSpotlight({
  children,
  className,
  radius = 400,
}: {
  children: React.ReactNode
  className?: string
  radius?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [{ x, y }, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn('relative overflow-hidden rounded-2xl', className)}
    >
      {isHovering && (
        <div
          className="pointer-events-none absolute -inset-px z-0 transition-opacity duration-300 rounded-2xl"
          style={{
            background: `radial-gradient(${radius}px circle at ${x}px ${y}px, rgba(16,185,129,0.08), transparent 80%)`,
          }}
        />
      )}
      {children}
    </div>
  )
}
