import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ContactPayload {
  name:    string
  email:   string
  subject: string
  message: string
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(body: Partial<ContactPayload>): string | null {
  if (!body.name    || body.name.trim().length    < 2)  return 'Name must be at least 2 characters.'
  if (!body.email   || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return 'Please enter a valid email address.'
  if (!body.subject || body.subject.trim().length  < 3)  return 'Subject must be at least 3 characters.'
  if (!body.message || body.message.trim().length  < 20) return 'Message must be at least 20 characters.'
  if (body.name.length > 100)    return 'Name is too long.'
  if (body.subject.length > 200) return 'Subject is too long.'
  if (body.message.length > 5000) return 'Message is too long (max 5000 characters).'
  return null
}

// ─── Simple in-memory rate limit (per IP, resets on cold start) ───────────────
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3          // max submissions
const RATE_WINDOW = 60 * 60 * 1000  // per hour

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return false
  }

  if (entry.count >= RATE_LIMIT) return true

  entry.count++
  return false
}

// ─── Email HTML template ──────────────────────────────────────────────────────
function buildEmailHtml(name: string, email: string, subject: string, message: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New Contact — ${subject}</title>
</head>
<body style="margin:0;padding:0;background:#0a0d12;font-family:'DM Sans',sans-serif;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0d12;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0f1a14;border-radius:16px;border:1px solid rgba(16,185,129,0.2);overflow:hidden;max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#064e3b,#065f46);padding:32px 36px;">
            <p style="margin:0;font-size:11px;color:#6ee7b7;letter-spacing:0.15em;text-transform:uppercase;font-family:monospace;">New Portfolio Message</p>
            <h1 style="margin:8px 0 0;font-size:24px;font-weight:800;color:#ffffff;">${subject}</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px 36px;">
            <!-- Sender info -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="padding:4px 0;">
                  <p style="margin:0;font-size:11px;color:#6ee7b7;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;">From</p>
                  <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#f1f5f9;">${name}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0 4px;">
                  <p style="margin:0;font-size:11px;color:#6ee7b7;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;">Reply To</p>
                  <a href="mailto:${email}" style="margin:4px 0 0;display:block;font-size:15px;color:#34d399;text-decoration:none;">${email}</a>
                </td>
              </tr>
            </table>
            <!-- Divider -->
            <div style="height:1px;background:rgba(16,185,129,0.15);margin-bottom:28px;"></div>
            <!-- Message -->
            <p style="margin:0 0 8px;font-size:11px;color:#6ee7b7;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;">Message</p>
            <div style="background:#0a0d12;border:1px solid rgba(16,185,129,0.1);border-radius:10px;padding:20px;font-size:15px;line-height:1.7;color:#cbd5e1;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:0 36px 28px;">
            <div style="height:1px;background:rgba(16,185,129,0.1);margin-bottom:20px;"></div>
            <p style="margin:0;font-size:11px;color:#475569;font-family:monospace;">
              Sent via mielle.dev contact form · ${new Date().toUTCString()}
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── Auto-reply HTML ──────────────────────────────────────────────────────────
function buildAutoReplyHtml(name: string): string {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0d12;font-family:'DM Sans',sans-serif;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0d12;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0f1a14;border-radius:16px;border:1px solid rgba(16,185,129,0.2);overflow:hidden;max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#064e3b,#065f46);padding:32px 36px;">
            <p style="margin:0;font-size:11px;color:#6ee7b7;letter-spacing:0.15em;text-transform:uppercase;font-family:monospace;">Message Received</p>
            <h1 style="margin:8px 0 0;font-size:24px;font-weight:800;color:#ffffff;">Thanks, ${name}!</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 36px;">
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#cbd5e1;">
              I got your message and will get back to you within <strong style="color:#34d399;">24 hours</strong>.
            </p>
            <p style="margin:0;font-size:15px;line-height:1.7;color:#cbd5e1;">
              In the meantime, feel free to check out my work on
              <a href="https://github.com/mielle-almedejar" style="color:#34d399;">GitHub</a>
              or connect on <a href="https://linkedin.com/in/mielle-almedejar" style="color:#34d399;">LinkedIn</a>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 36px 28px;">
            <div style="height:1px;background:rgba(16,185,129,0.1);margin-bottom:20px;"></div>
            <p style="margin:0;font-size:13px;font-weight:600;color:#f1f5f9;">Mielle Almedejar</p>
            <p style="margin:4px 0 0;font-size:11px;color:#475569;font-family:monospace;">Web / Software / AI Engineer · Philippines</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── Route Handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait an hour before trying again.' },
        { status: 429 }
      )
    }

    // Parse body
    let body: Partial<ContactPayload>
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    // Validate
    const validationError = validate(body)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 422 })
    }

    const { name, email, subject, message } = body as ContactPayload

    // Check API key
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      // Dev mode: log and return success without sending
      console.log('[Contact API] No RESEND_API_KEY — message logged only:')
      console.log({ name, email, subject, message })
      return NextResponse.json({ success: true, dev: true })
    }

    const resend = new Resend(apiKey)
    const toEmail = process.env.CONTACT_TO_EMAIL ?? 'mielle.almedejar@gmail.com'
    const fromDomain = process.env.RESEND_FROM_DOMAIN ?? 'onboarding@resend.dev'

    // Send notification to you
    const { error: sendError } = await resend.emails.send({
      from:      `Portfolio Contact <${fromDomain}>`,
      to:        [toEmail],
      replyTo:  email,
      subject:   `[Portfolio] ${subject}`,
      html:      buildEmailHtml(name, email, subject, message),
    })

    if (sendError) {
      console.error('[Contact API] Resend error:', sendError)
      return NextResponse.json(
        { error: 'Failed to send message. Please try emailing directly.' },
        { status: 502 }
      )
    }

    // Send auto-reply to sender (best-effort — don't fail if this errors)
    try {
      await resend.emails.send({
        from:    `Mielle Almedejar <${fromDomain}>`,
        to:      [email],
        subject: `Got your message, ${name}!`,
        html:    buildAutoReplyHtml(name),
      })
    } catch (e) {
      console.warn('[Contact API] Auto-reply failed (non-fatal):', e)
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[Contact API] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

// Block other methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 })
}
