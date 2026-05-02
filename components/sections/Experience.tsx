'use client'
import { motion } from 'framer-motion'
import { Briefcase, GraduationCap } from 'lucide-react'
import { BackgroundGradient } from '@/components/aceternity/background-gradient'
import { Badge } from '@/components/ui/badge'
import { experiences, type Experience } from '@/data/config'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] } },
}
const dotPop = {
  hidden:  { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 320, damping: 22, delay: 0.15 } },
}

function TimelineCard({ exp, index }: { exp: Experience; index: number }) {
  const isLeft = index % 2 === 0
  const Icon   = exp.type === 'work' ? Briefcase : GraduationCap

  return (
    <motion.div variants={fadeUp} className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-center">
      {/* Card */}
      <div className={isLeft ? 'md:col-start-1' : 'md:col-start-3 md:row-start-1'}>
        <BackgroundGradient animate={false} containerClassName="h-full" className="h-full">
          <div className="p-5">
            <span className="font-mono text-xs text-emerald-500 mb-1 block">{exp.period}</span>
            <h3 className="font-display font-bold text-sm leading-snug mb-0.5">{exp.title}</h3>
            <p className="text-xs font-medium text-muted-foreground mb-2">{exp.organization}</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{exp.description}</p>
            {exp.tags && (
              <div className="flex flex-wrap gap-1">
                {exp.tags.map(t => <Badge key={t} variant="secondary" className="text-[9px] px-1.5 py-0">{t}</Badge>)}
              </div>
            )}
          </div>
        </BackgroundGradient>
      </div>

      {/* Center dot */}
      <div className="hidden md:flex flex-col items-center md:col-start-2">
        <motion.div
          variants={dotPop}
          className="w-9 h-9 rounded-full bg-card border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.25)] z-10"
        >
          <Icon className="w-3.5 h-3.5 text-emerald-500" />
        </motion.div>
      </div>

      {/* Spacer */}
      <div className={`hidden md:block ${isLeft ? 'md:col-start-3' : 'md:col-start-1 md:row-start-1'}`} />
    </motion.div>
  )
}

export default function Experience() {
  return (
    <section className="min-h-[100dvh] flex flex-col pt-20">
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        <motion.div variants={container} initial="hidden" animate="visible" className="flex-1 flex flex-col">

          <motion.div variants={fadeUp} className="mb-8">
            <span className="font-mono text-emerald-500 text-xs tracking-widest uppercase mb-1.5 block">04. experience</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">My journey</h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative flex-1 overflow-y-auto pb-4">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-emerald-500/25 to-transparent" />
            <div className="flex flex-col gap-6">
              {experiences.map((exp, i) => <TimelineCard key={exp.id} exp={exp} index={i} />)}
            </div>

            {/* Present dot */}
            <div className="flex flex-col items-center mt-6 gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">Present</span>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
