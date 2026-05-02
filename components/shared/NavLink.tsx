'use client'
// Tiny component that calls goTo — used inside sections that need to link to other sections
import { useNav, type SectionId } from '@/components/providers/NavProvider'

export default function NavLink({
  to,
  children,
  className,
}: {
  to: SectionId
  children: React.ReactNode
  className?: string
}) {
  const { goTo } = useNav()
  return (
    <button onClick={() => goTo(to)} className={className}>
      {children}
    </button>
  )
}
