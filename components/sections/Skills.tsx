'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { GlowingCard } from '@/components/21st/glowing-card'
import { AnimatedCounter } from '@/components/21st/animated-counter'
import { skillCategories } from '@/data/config'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] } },
}

function SkillBar({ name, level, idx }: { name: string; level: number; idx: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false }) // re-animate on section switch

  return (
    <motion.div ref={ref} variants={fadeUp} className="space-y-1.5">
      <div className="flex justify-between">
        <span className="text-xs font-medium">{name}</span>
        <span className="font-mono text-[11px] text-emerald-500">{level}%</span>
      </div>
      <Progress value={inView ? level : 0} />
    </motion.div>
  )
}

const STATS = [
  { label: 'Years coding',     to: 4,  suffix: '+' },
  { label: 'Projects shipped', to: 15, suffix: '+' },
  { label: 'Tech in stack',    to: 16, suffix: '+' },
  { label: 'Certifications',   to: 6,  suffix: '+' },
]

export default function Skills() {
  return (
    <section className="min-h-[100dvh] flex flex-col bg-card/20 pt-20">
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        <motion.div variants={container} initial="hidden" animate="visible">

          <motion.div variants={fadeUp} className="mb-8">
            <span className="font-mono text-emerald-500 text-xs tracking-widest uppercase mb-1.5 block">03. skills</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">My toolkit</h2>
          </motion.div>

          {/* Skill grids */}
          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            {skillCategories.map((cat, ci) => (
              <motion.div key={cat.category} variants={fadeUp}>
                <GlowingCard className="p-5 h-full">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-1 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
                    <h3 className="font-display font-bold text-base">{cat.category}</h3>
                  </div>
                  <div className="space-y-4">
                    {cat.skills.map((skill, si) => (
                      <SkillBar key={skill.name} name={skill.name} level={skill.level} idx={ci * 10 + si} />
                    ))}
                  </div>
                </GlowingCard>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div variants={fadeUp}>
            <GlowingCard className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                {STATS.map(({ label, to, suffix }) => (
                  <div key={label}>
                    <div className="font-display text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                      <AnimatedCounter to={to} suffix={suffix} duration={1.6} />
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </GlowingCard>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
