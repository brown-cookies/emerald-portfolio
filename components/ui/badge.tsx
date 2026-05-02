import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20',
        secondary:
          'border-border bg-muted text-muted-foreground hover:bg-muted/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground',
        outline: 'border-border text-foreground',
        emerald:
          'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
        amber:
          'border-amber-500/30 bg-amber-500/10 text-amber-400',
        blue:
          'border-blue-500/30 bg-blue-500/10 text-blue-400',
        purple:
          'border-purple-500/30 bg-purple-500/10 text-purple-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
