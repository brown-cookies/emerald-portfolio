import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import { ScrollProgress } from '@/components/21st/scroll-progress'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { siteConfig } from '@/data/config'

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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
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
