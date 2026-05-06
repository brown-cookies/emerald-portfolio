import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getAllComments } from '@/lib/blog'

export async function GET() {
  if (!(await getSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = await getAllComments()
  return NextResponse.json(data)
}
