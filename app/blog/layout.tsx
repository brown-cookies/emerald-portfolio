import Link from 'next/link'
import { ArrowLeft, PenLine } from 'lucide-react'
import { siteConfig } from '@/data/config'
import ThemeToggle from '@/components/shared/ThemeToggle'
import CustomCursor from '@/components/shared/CustomCursor'
import ParticlesBackground from '@/components/shared/ParticlesBackground'
import { BgProvider } from '@/components/providers/BgProvider'
import BlogTransition from '@/components/blog/BlogTransition'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <BgProvider>
      <CustomCursor />
      <ParticlesBackground />

      {/* Sticky blog nav */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          {/* Left — back to portfolio */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            {siteConfig.firstName}
          </Link>

          {/* Center — blog wordmark */}
          <Link href="/blog" className="flex items-center gap-2 font-display font-bold text-foreground">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <PenLine className="w-3 h-3 text-emerald-500" />
            </div>
            Blog
          </Link>

          {/* Right */}
          <ThemeToggle />
        </div>
      </header>

      <main className="min-h-screen">
        <BlogTransition>{children}</BlogTransition>
      </main>

      <footer className="border-t border-border/60 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name} · All rights reserved
        </div>
      </footer>
    </BgProvider>
  )
}
