import { cn } from '@/lib/utils'

export function BentoGrid({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto',
        className
      )}
    >
      {children}
    </div>
  )
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'row-span-1 rounded-2xl group/bento hover:shadow-xl hover:shadow-emerald-500/5 transition duration-300 shadow-none p-4 bg-card border border-border flex flex-col space-y-3',
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-1 transition duration-200">
        {icon}
        <div className="font-display font-bold text-foreground mt-2 text-sm">
          {title}
        </div>
        <div className="font-body font-normal text-muted-foreground text-xs leading-relaxed mt-1">
          {description}
        </div>
      </div>
    </div>
  )
}
