'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, GraduationCap, Briefcase, Users, BookOpen } from 'lucide-react'
import { BackgroundGradient } from '@/components/aceternity/background-gradient'
import { GlowingCard } from '@/components/21st/glowing-card'
import { testimonials, type Testimonial } from '@/data/config'

// ─── Relationship icon + color map ───────────────────────────────────────────
const REL_META = {
  classmate:  { icon: Users,        label: 'Classmate',   color: 'text-blue-400',   bg: 'bg-blue-400/10'   },
  professor:  { icon: GraduationCap,label: 'Professor',   color: 'text-purple-400', bg: 'bg-purple-400/10' },
  colleague:  { icon: Briefcase,    label: 'Colleague',   color: 'text-amber-400',  bg: 'bg-amber-400/10'  },
  client:     { icon: BookOpen,     label: 'Client',      color: 'text-emerald-400',bg: 'bg-emerald-400/10'},
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ t }: { t: Testimonial }) {
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-base text-white flex-shrink-0 shadow-lg"
      style={{ background: `linear-gradient(135deg, ${t.avatarColor}, ${t.avatarColor}99)` }}
    >
      {t.avatar}
    </div>
  )
}

// ─── Single testimonial card ──────────────────────────────────────────────────
function TestimonialCard({ t, active }: { t: Testimonial; active: boolean }) {
  const rel    = REL_META[t.relationship]
  const RelIcon = rel.icon

  return (
    <BackgroundGradient animate={false} containerClassName="h-full" className="h-full">
      <div className="p-6 sm:p-7 flex flex-col gap-5 h-full">
        {/* Quote icon */}
        <div className="flex items-start justify-between">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <Quote className="w-4 h-4 text-emerald-500" />
          </div>
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono ${rel.color} ${rel.bg} border border-current/20`}>
            <RelIcon className="w-3 h-3" />
            {rel.label}
          </span>
        </div>

        {/* Quote text */}
        <blockquote className="flex-1 text-sm sm:text-base text-muted-foreground leading-relaxed italic">
          &ldquo;{t.quote}&rdquo;
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <Avatar t={t} />
          <div className="min-w-0">
            <p className="font-display font-bold text-sm truncate">{t.name}</p>
            <p className="text-xs text-muted-foreground font-mono truncate">{t.role} · {t.organization}</p>
          </div>
        </div>
      </div>
    </BackgroundGradient>
  )
}

// ─── Marquee row for desktop ──────────────────────────────────────────────────
function MarqueeRow({ items, reverse = false }: { items: Testimonial[]; reverse?: boolean }) {
  const shouldReduce = useReducedMotion()
  // Duplicate array so it loops seamlessly
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden w-full">
      <motion.div
        className="flex gap-5"
        animate={shouldReduce ? {} : { x: reverse ? ['0%', '50%'] : ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        style={{ width: 'max-content' }}
      >
        {doubled.map((t, i) => (
          <div key={`${t.id}-${i}`} className="w-80 flex-shrink-0">
            <TestimonialCard t={t} active={false} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Mobile carousel ──────────────────────────────────────────────────────────
function Carousel() {
  const [active, setActive]       = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const total = testimonials.length

  const go = (dir: 1 | -1) => {
    setDirection(dir)
    setActive(i => (i + dir + total) % total)
  }

  const slideVariants = {
    enter: (d: 1 | -1) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 280, damping: 28 } },
    exit:   (d: 1 | -1) => ({ x: d > 0 ? '-40%' : '40%', opacity: 0, scale: 0.94, transition: { duration: 0.2 } }),
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Card */}
      <div className="relative overflow-hidden" style={{ minHeight: 340 }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={active}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <TestimonialCard t={testimonials[active]} active={true} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-1">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > active ? 1 : -1); setActive(i) }}
              className="transition-all duration-200"
              aria-label={`Go to testimonial ${i + 1}`}
            >
              <motion.div
                animate={{ width: i === active ? 20 : 6, opacity: i === active ? 1 : 0.35 }}
                transition={{ type: 'spring' as const, stiffness: 400, damping: 28 }}
                className={`h-1.5 rounded-full ${i === active ? 'bg-emerald-500' : 'bg-muted-foreground'}`}
              />
            </button>
          ))}
        </div>

        {/* Arrows */}
        <div className="flex items-center gap-2">
          <button onClick={() => go(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:border-emerald-500/40 hover:text-emerald-500 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => go(1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:border-emerald-500/40 hover:text-emerald-500 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main section ──────────────────────────────────────────────────────────────
const container = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] } },
}

export default function Testimonials() {
  // Split into two rows for the marquee
  const row1 = testimonials.filter((_, i) => i % 2 === 0)
  const row2 = testimonials.filter((_, i) => i % 2 !== 0)

  return (
    <section className="min-h-[100dvh] flex flex-col bg-card/20 pt-20">
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        <motion.div variants={container} initial="hidden" animate="visible" className="flex-1 flex flex-col">

          {/* Header */}
          <motion.div variants={fadeUp} className="mb-8">
            <span className="font-mono text-emerald-500 text-xs tracking-widest uppercase mb-1.5 block">
              06. testimonials
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">What people say</h2>
            <p className="text-muted-foreground text-sm max-w-lg">
              Feedback from classmates, professors, and collaborators I&apos;ve worked with.
            </p>
          </motion.div>

          {/* Mobile: carousel. Desktop: marquee rows */}
          <motion.div variants={fadeUp} className="flex-1 flex flex-col justify-center">
            {/* Mobile carousel */}
            <div className="lg:hidden">
              <Carousel />
            </div>

            {/* Desktop marquee — two rows scrolling in opposite directions */}
            <div className="hidden lg:flex flex-col gap-5 overflow-hidden">
              <MarqueeRow items={row1.length >= 2 ? row1 : testimonials} reverse={false} />
              <MarqueeRow items={row2.length >= 2 ? row2 : [...testimonials].reverse()} reverse={true} />
            </div>
          </motion.div>

          {/* Note about authenticity */}
          <motion.div variants={fadeUp} className="mt-8 pt-6 border-t border-border">
            <p className="text-[11px] text-muted-foreground font-mono text-center">
              These are real people — names used with permission. Replace with your actual references in{' '}
              <span className="text-emerald-500">data/config.ts</span>
            </p>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
