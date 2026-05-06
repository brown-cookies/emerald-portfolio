import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/blog'
import { siteConfig } from '@/data/config'

export const runtime = 'edge'
export const alt     = 'Blog post preview'
export const size    = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post     = await getPostBySlug(slug)

  // Fallback for unpublished / not-found slugs
  const title       = post?.title       ?? siteConfig.name
  const description = post?.description ?? siteConfig.tagline
  const tags        = post?.tags        ?? []
  const readingTime = post?.readingTime ?? ''

  // Space Grotesk loaded via next/og font option (edge-compatible)
  const spaceGroteskBold = await fetch(
    'https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gozuPTPgP0.woff2'
  ).then(r => r.arrayBuffer())

  const spaceGroteskRegular = await fetch(
    'https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gozuPTPgP0.woff2'
  ).then(r => r.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width:      '100%',
          height:     '100%',
          display:    'flex',
          flexDirection: 'column',
          background: '#0a0d12',
          padding:    '60px',
          position:   'relative',
          fontFamily: '"SpaceGrotesk"',
        }}
      >
        {/* Emerald glow top-left */}
        <div style={{
          position: 'absolute', top: -120, left: -80,
          width: 480, height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)',
        }} />

        {/* Subtle grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Top bar — author + site */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'auto' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(16,185,129,0.2)',
            border: '1px solid rgba(16,185,129,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#10b981', fontSize: 16, fontWeight: 700,
          }}>
            M
          </div>
          <span style={{ color: '#94a3b8', fontSize: 16 }}>{siteConfig.name}</span>
          <span style={{ color: '#334155', fontSize: 16, marginLeft: 4 }}>· Blog</span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {tags.slice(0, 4).map(tag => (
              <div key={tag} style={{
                padding: '4px 12px', borderRadius: 999,
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.25)',
                color: '#34d399', fontSize: 13,
              }}>
                {tag}
              </div>
            ))}
          </div>
        )}

        {/* Title */}
        <div style={{
          fontSize:   title.length > 50 ? 44 : 52,
          fontWeight: 700,
          color:      '#f1f5f9',
          lineHeight: 1.15,
          marginBottom: 20,
          maxWidth:   980,
          letterSpacing: '-0.02em',
        }}>
          {title}
        </div>

        {/* Description */}
        {description && (
          <div style={{
            fontSize: 22, color: '#64748b',
            lineHeight: 1.5, maxWidth: 860,
            marginBottom: 32,
          }}>
            {description.length > 120 ? description.slice(0, 120) + '…' : description}
          </div>
        )}

        {/* Bottom bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{ color: '#475569', fontSize: 15 }}>mielle.dev/blog</span>
          {readingTime && (
            <span style={{
              color: '#10b981', fontSize: 15,
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)',
              padding: '4px 14px', borderRadius: 999,
            }}>
              {readingTime}
            </span>
          )}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'SpaceGrotesk', data: spaceGroteskBold,    style: 'normal', weight: 700 },
        { name: 'SpaceGrotesk', data: spaceGroteskRegular, style: 'normal', weight: 400 },
      ],
    }
  )
}
