import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

type CalloutType = 'info' | 'warning' | 'success' | 'error'

const styles: Record<CalloutType, { icon: React.ElementType; classes: string }> = {
  info:    { icon: Info,          classes: 'border-blue-500/30   bg-blue-500/5   text-blue-400'   },
  warning: { icon: AlertTriangle, classes: 'border-amber-500/30  bg-amber-500/5  text-amber-400'  },
  success: { icon: CheckCircle,   classes: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' },
  error:   { icon: XCircle,       classes: 'border-red-500/30    bg-red-500/5    text-red-400'    },
}

interface Props {
  type?: CalloutType
  title?: string
  children: React.ReactNode
}

// Usage in MDX:
// <Callout type="warning" title="Heads up">
//   This will overwrite your existing config.
// </Callout>
export default function Callout({ type = 'info', title, children }: Props) {
  const { icon: Icon, classes } = styles[type]
  return (
    <div className={`my-6 flex gap-3 rounded-xl border p-4 ${classes}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm mb-1">{title}</p>}
        <div className="text-sm text-muted-foreground [&>p]:mb-0 [&>p]:mt-0">{children}</div>
      </div>
    </div>
  )
}
