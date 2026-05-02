'use client'
import Link from 'next/link'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'
import { siteConfig } from '@/data/config'
import { Separator } from '@/components/ui/separator'

export default function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="font-display font-bold">
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Mielle</span>
              {' '}Almedejar
            </p>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">Web / Software / AI Engineer · Philippines</p>
          </div>

          <div className="flex items-center gap-3">
            {[
              { href: siteConfig.github, icon: Github, label: 'GitHub' },
              { href: siteConfig.linkedin, icon: Linkedin, label: 'LinkedIn' },
              { href: `mailto:${siteConfig.email}`, icon: Mail, label: 'Email' },
            ].map(({ href, icon: Icon, label }) => (
              <a key={label} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:border-emerald-500/50 hover:text-emerald-500 text-muted-foreground transition-all duration-200"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <p className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
            © {new Date().getFullYear()} · built with <Heart className="w-3 h-3 text-emerald-500 fill-emerald-500" /> in PH
          </p>
        </div>
      </div>
    </footer>
  )
}
