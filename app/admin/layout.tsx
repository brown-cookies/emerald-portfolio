import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AdminShell from '@/components/admin/AdminShell'

// Every /admin/* page is rendered inside this layout.
// getSession() checks the JWT cookie — if invalid, middleware already
// redirected, but this is a second guard for direct server renders.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await getSession()
  if (!authed) redirect('/admin/login')

  return <AdminShell>{children}</AdminShell>
}
