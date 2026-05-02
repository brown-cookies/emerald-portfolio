'use client'
import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Github, ExternalLink, Star, Clock, Archive, Settings2, Package, Code2, ChevronDown, ChevronUp } from 'lucide-react'
import { CardSpotlight } from '@/components/aceternity/spotlight'
import { BackgroundGradient } from '@/components/aceternity/background-gradient'
import { Badge } from '@/components/ui/badge'
import { projects, type Project } from '@/data/config'

// ─── Shared constants ──────────────────────────────────────────────────────────
const STATUS = {
  live:          { label: 'Live',     icon: ExternalLink, cls: 'emerald'   as const },
  'in-progress': { label: 'Building', icon: Clock,        cls: 'amber'     as const },
  archived:      { label: 'Archived', icon: Archive,      cls: 'secondary' as const },
}
const ALL_TAGS = ['All', ...Array.from(new Set(projects.flatMap(p => p.tags))).slice(0, 9)]

const container = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] } },
}

// ─── Floating tech icon (used in featured card header) ────────────────────────
function FloatingIcon({ label, delay, style }: { label: string; delay: number; style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute text-white/50 text-xs font-mono font-bold px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/15 pointer-events-none"
      style={style}
      animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
      transition={{ duration: 4 + delay * 0.8, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {label}
    </motion.div>
  )
}

// ─── 3-D tilt card wrapper ─────────────────────────────────────────────────────
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]),  { stiffness: 200, damping: 30 })
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width  - 0.5)
    y.set((e.clientY - rect.top)  / rect.height - 0.5)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Featured project expanded card ───────────────────────────────────────────
function FeaturedProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const s  = STATUS[project.status]
  const SI = s.icon

  // Positions for floating tech labels — cycles through 8 slots
  const floatPositions: React.CSSProperties[] = [
    { top: '12%',  right: '6%'  },
    { top: '28%',  right: '2%'  },
    { top: '45%',  right: '7%'  },
    { bottom: '30%', right: '4%' },
    { bottom: '18%', right: '10%'},
    { top: '18%',  right: '18%' },
    { top: '55%',  right: '14%' },
    { bottom: '10%', right: '18%'},
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] }}
    >
      <TiltCard className="group w-full">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-card shadow-xl hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500">

          {/* ── Gradient header ─────────────────────────────────────────── */}
          <div className={`relative bg-gradient-to-br ${project.gradient ?? 'from-emerald-600 to-teal-600'} p-6 sm:p-8 overflow-hidden`}>

            {/* Dot-grid pattern overlay */}
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            {/* Floating tech label badges */}
            <div className="absolute inset-0 hidden md:block pointer-events-none">
              {(project.techIcons ?? []).slice(0, 8).map((t, i) => (
                <FloatingIcon key={t.label} label={t.label} delay={i * 0.4} style={floatPositions[i % floatPositions.length]} />
              ))}
            </div>

            {/* Header content */}
            <div className="relative z-10 pr-0 md:pr-32">
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="px-3 py-1.5 rounded-full border border-white/30 bg-white/15 text-xs font-semibold text-white backdrop-blur-sm">
                  {project.category}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-500/20 text-xs font-semibold text-yellow-100 backdrop-blur-sm">
                  <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" /> Featured
                </span>
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                  project.status === 'live'
                    ? 'border border-green-400/30 bg-green-500/20 text-green-100'
                    : 'border border-amber-400/30 bg-amber-500/20 text-amber-100'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${project.status === 'live' ? 'bg-green-400' : 'bg-amber-400'}`} />
                  {s.label}
                </span>
                {project.timeline && (
                  <span className="px-3 py-1.5 rounded-full border border-white/20 bg-black/20 text-xs text-white backdrop-blur-sm">
                    {project.timeline}
                  </span>
                )}
                {project.clientType && (
                  <span className="hidden sm:inline-block px-3 py-1.5 rounded-full border border-white/20 bg-black/20 text-xs text-white backdrop-blur-sm">
                    {project.clientType}
                  </span>
                )}
              </div>

              {/* Title & description */}
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white mb-1.5 leading-tight">
                {project.title}
              </h3>
              {project.subtitle && (
                <p className="font-display font-medium text-base sm:text-lg text-white/85 mb-3">{project.subtitle}</p>
              )}
              <p className="text-sm sm:text-base text-white/75 leading-relaxed max-w-2xl">{project.description}</p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/30 bg-white/15 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all duration-200 active:scale-95"
                  >
                    <Github className="w-4 h-4" /> Source Code
                  </a>
                )}
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-sm font-medium text-gray-900 hover:bg-white/90 transition-all duration-200 active:scale-95 shadow-lg"
                  >
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ── Expandable details ───────────────────────────────────────── */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:p-8 grid lg:grid-cols-2 gap-8">
                  {/* Features */}
                  {project.features && (
                    <div>
                      <h4 className="flex items-center gap-2.5 font-display font-bold text-base mb-4">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Settings2 className="w-3.5 h-3.5 text-white" />
                        </div>
                        Key Features
                      </h4>
                      <ul className="space-y-2.5">
                        {project.features.map((f, i) => (
                          <motion.li key={i}
                            initial={{ opacity: 0, x: -14 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
                          >
                            <span className="mt-1 w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            </span>
                            {f}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Deliverables */}
                  {project.deliverables && (
                    <div>
                      <h4 className="flex items-center gap-2.5 font-display font-bold text-base mb-4">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                          <Package className="w-3.5 h-3.5 text-white" />
                        </div>
                        Deliverables
                      </h4>
                      <ul className="space-y-2.5">
                        {project.deliverables.map((d, i) => (
                          <motion.li key={i}
                            initial={{ opacity: 0, x: -14 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
                          >
                            <span className="mt-1 w-4 h-4 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            </span>
                            {d}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Tech stack */}
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-border pt-6">
                  <h4 className="flex items-center gap-2.5 font-display font-bold text-base mb-4">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                      <Code2 className="w-3.5 h-3.5 text-white" />
                    </div>
                    Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((t, i) => (
                      <motion.span key={t}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        whileHover={{ scale: 1.06, y: -2 }}
                        className="px-3 py-1.5 rounded-xl border border-border bg-muted text-xs font-mono text-foreground hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all duration-200 cursor-default"
                      >
                        {t}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(v => !v)}
            className="w-full flex items-center justify-center gap-2 py-3 text-xs font-mono text-muted-foreground hover:text-emerald-500 border-t border-border hover:bg-emerald-500/3 transition-all duration-200 group/btn"
          >
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.div>
            <span>{expanded ? 'Show less' : 'View features & stack'}</span>
          </button>
        </div>
      </TiltCard>
    </motion.div>
  )
}

// ─── Regular project card (existing, enhanced with tilt) ──────────────────────
function ProjectCard({ project }: { project: Project }) {
  const s  = STATUS[project.status]
  const SI = s.icon
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]),  { stiffness: 250, damping: 30 })
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 250, damping: 30 })
  const glowX = useTransform(x, [-0.5, 0.5], [0, 100])
  const glowY = useTransform(y, [-0.5, 0.5], [0, 100])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width  - 0.5)
    y.set((e.clientY - r.top)  / r.height - 0.5)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 800 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
      className="group h-full"
    >
      <CardSpotlight className="relative h-full border border-border bg-card rounded-2xl p-5 flex flex-col gap-3 overflow-hidden">
        {/* Mouse-tracking glow */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([gx, gy]) => `radial-gradient(180px circle at ${(gx as number)}% ${(gy as number)}%, rgba(16,185,129,0.07), transparent 80%)`
            ),
          }}
        />

        <div className="relative z-10 flex flex-col gap-3 h-full">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              {project.featured && <Star className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 flex-shrink-0" />}
              <h3 className="font-display font-bold text-sm leading-tight truncate group-hover:text-emerald-500 transition-colors duration-200">
                {project.title}
              </h3>
            </div>
            <Badge variant={s.cls} className="flex-shrink-0 flex items-center gap-1 text-[9px] px-2 py-0.5">
              <SI className="w-2.5 h-2.5" />{s.label}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 4).map(t => (
              <Badge key={t} variant="emerald" className="text-[9px] px-1.5 py-0">{t}</Badge>
            ))}
            {project.tags.length > 4 && (
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0">+{project.tags.length - 4}</Badge>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-border">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                onClick={e => e.stopPropagation()}>
                <Github className="w-3 h-3" /> Source
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-emerald-500 hover:text-emerald-400 transition-colors"
                onClick={e => e.stopPropagation()}>
                <ExternalLink className="w-3 h-3" /> Demo
              </a>
            )}
          </div>
        </div>
      </CardSpotlight>
    </motion.div>
  )
}

// ─── Main section ──────────────────────────────────────────────────────────────
export default function Projects() {
  const [tag, setTag] = useState('All')

  const featuredProjects = useMemo(() => projects.filter(p => p.featured), [])
  const filtered = useMemo(() =>
    tag === 'All'
      ? projects.filter(p => !p.featured)          // non-featured by default
      : projects.filter(p => p.tags.includes(tag)), // all when filtering
    [tag]
  )

  return (
    <section className="min-h-[100dvh] flex flex-col pt-20">
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col overflow-y-auto">
        <motion.div variants={container} initial="hidden" animate="visible">

          {/* Header */}
          <motion.div variants={fadeUp} className="mb-6">
            <span className="font-mono text-emerald-500 text-xs tracking-widest uppercase mb-1.5 block">02. projects</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Things I&apos;ve built</h2>
          </motion.div>

          {/* ── Featured projects ──────────────────────────────────────── */}
          {tag === 'All' && featuredProjects.length > 0 && (
            <motion.div variants={fadeUp} className="mb-8">
              <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                Featured — click to expand features & stack
              </p>
              <div className="space-y-5">
                {featuredProjects.map((p, i) => (
                  <FeaturedProjectCard key={p.id} project={p} index={i} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Filter bar ────────────────────────────────────────────── */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-1.5 mb-2">
            {ALL_TAGS.map(t => (
              <button key={t} onClick={() => setTag(t)}
                className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all duration-200 ${
                  tag === t
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                    : 'border border-border text-muted-foreground hover:border-emerald-500/40 hover:text-foreground'
                }`}
              >{t}</button>
            ))}
          </motion.div>

          <motion.p variants={fadeUp} className="text-[11px] text-muted-foreground font-mono mb-5">
            {tag === 'All'
              ? `${projects.filter(p => !p.featured).length} more projects`
              : `${filtered.length} project${filtered.length !== 1 ? 's' : ''} · "${tag}"`
            }
          </motion.p>

        </motion.div>

        {/* ── Regular project grid ──────────────────────────────────── */}
        <div className="flex-1 pb-4">
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filtered.map(p => (
                  <motion.div key={p.id} layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.22 }}
                    className="h-full"
                  >
                    <ProjectCard project={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
