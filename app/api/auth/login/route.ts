import { NextRequest, NextResponse } from 'next/server'
import { checkPassword, createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { password } = body as { password?: string }

  if (!password || !checkPassword(password)) {
    // Same error regardless of whether password exists or is wrong
    // — don't leak which one failed
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  await createSession()
  return NextResponse.json({ ok: true })
}
