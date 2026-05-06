'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Github, Linkedin, ArrowUpRight, Download, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { BackgroundGradient } from '@/components/aceternity/background-gradient'
import { MagneticButton } from '@/components/21st/magnetic-button'
import { Button } from '@/components/ui/button'
import ContactForm from '@/components/sections/ContactForm'
import { siteConfig } from '@/data/config'

const container = {
  hidden:   {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] } },
}

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email)
      setCopied(true)
      toast.success('Email copied!', { icon: '📋', duration: 2500 })
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.error('Could not copy — try manually.')
    }
  }

  return (
    <section className="min-h-[100dvh] flex flex-col bg-card/20 pt-20">
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        <motion.div variants={container} initial="hidden" animate="visible">

          {/* Header */}
          <motion.div variants={fadeUp} className="mb-8">
            <span className="font-mono text-emerald-500 text-xs tracking-widest uppercase mb-1.5 block">
              07. contact
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Let&apos;s work together</h2>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 items-start">

            {/* ── LEFT: info + quick links ── */}
            <motion.div variants={fadeUp} className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                I&apos;m open to freelance, full-time, and collaborative projects.
                Fill out the form — or reach me directly below.
              </p>

              {/* Availability badge */}
              <div className="flex items-center gap-3 py-3.5 px-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-sm font-medium text-emerald-500">Available for new projects</span>
              </div>

              {/* Email copy row */}
              <div>
                <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2 block">
                  Direct email
                </label>
                <div className="flex items-center justify-between gap-2 p-3.5 rounded-xl bg-muted/40 border border-border">
                  <span className="font-mono text-sm break-all text-foreground">{siteConfig.email}</span>
                  <motion.button
                    onClick={copyEmail}
                    whileTap={{ scale: 0.85 }}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:border-emerald-500/50 hover:bg-emerald-500/8 transition-all"
                    aria-label="Copy email address"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={copied ? 'check' : 'copy'}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{ duration: 0.12 }}
                      >
                        {copied
                          ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                          : <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        }
                      </motion.div>
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>

              {/* Social links */}
              <div className="space-y-2.5">
                {[
                  { href: siteConfig.github,   icon: Github,   label: 'GitHub',   sub: 'See my source code'       },
                  { href: siteConfig.linkedin,  icon: Linkedin, label: 'LinkedIn', sub: 'Connect professionally'   },
                  { href: `mailto:${siteConfig.email}`, icon: Mail, label: 'Email', sub: 'Open mail client'       },
                ].map(({ href, icon: Icon, label, sub }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3.5 p-3 rounded-xl border border-border hover:border-emerald-500/30 hover:bg-emerald-500/4 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{sub}</p>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground group-hover:text-emerald-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                  </a>
                ))}
              </div>

              {/* Resume download */}
              <MagneticButton href={siteConfig.resumeUrl} download>
                <Button variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" /> Download Resume
                </Button>
              </MagneticButton>
            </motion.div>

            {/* ── RIGHT: contact form ── */}
            <motion.div variants={fadeUp}>
              <BackgroundGradient animate={false}>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
                    <h3 className="font-display font-bold text-base">Send a message</h3>
                  </div>
                  <ContactForm />
                </div>
              </BackgroundGradient>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}
