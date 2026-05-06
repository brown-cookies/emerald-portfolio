import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Sora, Fira_Code } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import { ScrollProgress } from '@/components/21st/scroll-progress'
import { Analytics } from '@vercel/analytics/react'
import CustomCursor from '@/components/shared/CustomCursor'
import './globals.css'
import { siteConfig } from '@/data/config'

// Self-hosted at build time — zero render-blocking network request
const spaceGrotesk = Space_Grotesk({
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display:  'swap',
})

const sora = Sora({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600'],
  variable: '--font-sora',
  display:  'swap',
})

const firaCode = Fira_Code({
  subsets:  ['latin'],
  weight:   ['300', '400', '500'],
  variable: '--font-fira-code',
  display:  'swap',
})

export const metadata: Metadata = {
  title: { default: `${siteConfig.name} — ${siteConfig.role}`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.tagline,
  keywords: ['Web Developer','Software Engineer','AI Engineer','React','Django','Laravel','Philippines',siteConfig.name],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  metadataBase: new URL('https://mielle.dev'),
  openGraph: { type: 'website', locale: 'en_US', url: 'https://mielle.dev', title: `${siteConfig.name} — ${siteConfig.role}`, description: siteConfig.tagline, siteName: siteConfig.name },
  twitter: { card: 'summary_large_image', title: `${siteConfig.name} — ${siteConfig.role}`, description: siteConfig.tagline },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)',  color: '#0a0d12' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${sora.variable} ${firaCode.variable}`}>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
          <CustomCursor />
          <ScrollProgress />
          {children}
          <Analytics />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '10px',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
