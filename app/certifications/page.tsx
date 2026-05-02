import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BgProvider } from '@/components/providers/BgProvider'
import { NavProvider } from '@/components/providers/NavProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/shared/CustomCursor'
import ParticlesBackground from '@/components/shared/ParticlesBackground'
import CertificationsGrid from '@/components/sections/CertificationsGrid'
import { AnimatedCounter } from '@/components/21st/animated-counter'
import { GlowingCard } from '@/components/21st/glowing-card'
import { certifications, siteConfig } from '@/data/config'

export const metadata: Metadata = {
  title: 'Certifications',
  description: `Professional certifications earned by ${siteConfig.name}`,
}

export default function CertificationsPage() {
  const stats = [
    { label: 'Total',    value: certifications.length },
    { label: 'Security', value: certifications.filter(c => c.category === 'security' || c.category === 'networking').length },
    { label: 'AI / Dev', value: certifications.filter(c => c.category === 'ai' || c.category === 'web').length },
    { label: 'Cloud',    value: certifications.filter(c => c.category === 'cloud').length },
  ]

  return (
    <BgProvider>
      <NavProvider>
        <ParticlesBackground />
        <CustomCursor />
        <Navbar />
        <main className="relative min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-emerald-500 transition-colors mb-10 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              back to portfolio
            </Link>
            <div className="mb-14">
              <span className="font-mono text-emerald-500 text-sm tracking-widest uppercase mb-3 block">credentials</span>
              <h1 className="font-display text-5xl sm:text-6xl font-extrabold mb-4">Certifications</h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                Professional certificates across web development, AI, networking, and cybersecurity.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
              {stats.map(({ label, value }) => (
                <GlowingCard key={label}>
                  <div className="p-5 text-center">
                    <div className="font-display text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                      <AnimatedCounter to={value} duration={1.5} />
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-1">{label}</div>
                  </div>
                </GlowingCard>
              ))}
            </div>
            <CertificationsGrid certifications={certifications} />
          </div>
        </main>
        <Footer />
      </NavProvider>
    </BgProvider>
  )
}
