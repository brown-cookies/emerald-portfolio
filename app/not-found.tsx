import Link from 'next/link'
import { BgProvider }  from '@/components/providers/BgProvider'
import { NavProvider } from '@/components/providers/NavProvider'
import ParticlesBackground from '@/components/shared/ParticlesBackground'
import CustomCursor from '@/components/shared/CustomCursor'

export default function NotFound() {
  return (
    <BgProvider>
      <NavProvider>
        <ParticlesBackground />
        <CustomCursor />
        <main className="min-h-screen flex items-center justify-center px-4 bg-background">
          <div className="text-center max-w-md">
            {/* Glitchy 404 */}
            <div className="relative mb-6 select-none">
              <p className="font-display font-extrabold text-[120px] sm:text-[160px] leading-none bg-gradient-to-br from-emerald-400 to-emerald-600 bg-clip-text text-transparent opacity-20">
                404
              </p>
              <p className="absolute inset-0 flex items-center justify-center font-display font-extrabold text-[120px] sm:text-[160px] leading-none bg-gradient-to-br from-emerald-400 to-emerald-600 bg-clip-text text-transparent blur-[2px]">
                404
              </p>
            </div>

            <span className="font-mono text-emerald-500 text-xs tracking-widest uppercase mb-4 block">
              page not found
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl mb-3">
              Lost in the void
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              The page you&apos;re looking for doesn&apos;t exist or was moved.
              Let&apos;s get you back to the portfolio.
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              ← Back to portfolio
            </Link>

            <p className="font-mono text-[10px] text-muted-foreground mt-8">
              mielle.dev · {new Date().getFullYear()}
            </p>
          </div>
        </main>
      </NavProvider>
    </BgProvider>
  )
}
