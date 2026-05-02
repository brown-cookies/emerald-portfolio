'use client'
import { motion } from 'framer-motion'
import { MapPin, Code2, Brain, Shield, Zap } from 'lucide-react'
import { GlowingCard } from '@/components/21st/glowing-card'
import { StaggerContainer, staggerItem } from '@/components/shared/ScrollReveal'
import { siteConfig, techStack } from '@/data/config'

const SPECIALTIES = [
  { icon: Code2,  label: 'Full-Stack Dev',  desc: 'React, Django, Laravel', color: 'text-blue-400',   bg: 'bg-blue-400/10'   },
  { icon: Brain,  label: 'AI Engineering',  desc: 'Gemini, LangChain, Ollama', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { icon: Shield, label: 'CyberSecurity',   desc: 'Network & IR',           color: 'text-red-400',    bg: 'bg-red-400/10'    },
  { icon: Zap,    label: 'DevOps',          desc: 'Docker, AWS, CI/CD',     color: 'text-amber-400',  bg: 'bg-amber-400/10'  },
]

// Section-level animation — fires on every mount (good for section switching)
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] } },
}

export default function About() {
  return (
    <section className="min-h-[100dvh] flex flex-col bg-card/20 pt-20">
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 overflow-y-auto">
        <motion.div variants={container} initial="hidden" animate="visible">

          {/* Header */}
          <motion.div variants={fadeUp} className="mb-10">
            <span className="font-mono text-emerald-500 text-xs tracking-widest uppercase mb-2 block">01. about me</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">The person behind the code</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Left */}
            <div className="space-y-6">
              <motion.p variants={fadeUp} className="text-muted-foreground text-base leading-relaxed">
                {siteConfig.bio}
              </motion.p>

              <motion.div variants={fadeUp} className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                {siteConfig.location}
              </motion.div>

              <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
                {SPECIALTIES.map(({ icon: Icon, label, desc, color, bg }) => (
                  <GlowingCard key={label}>
                    <div className="p-3.5 flex flex-col gap-2">
                      <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center`}>
                        <Icon className={`w-3.5 h-3.5 ${color}`} />
                      </div>
                      <p className="font-display font-semibold text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground font-mono">{desc}</p>
                    </div>
                  </GlowingCard>
                ))}
              </motion.div>
            </div>

            {/* Right — tech stack */}
            <div>
              <motion.h3 variants={fadeUp} className="font-display font-semibold text-sm text-muted-foreground mb-4">
                Technologies I work with
              </motion.h3>
              <StaggerContainer className="grid grid-cols-4 gap-2" staggerDelay={0.03}>
                {techStack.map(({ name, color }) => (
                  <motion.div
                    key={name}
                    variants={staggerItem}
                    whileHover={{ y: -3, scale: 1.04 }}
                    transition={{ duration: 0.15 }}
                  >
                    <GlowingCard className="p-2.5 flex flex-col items-center gap-1.5 text-center group">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold"
                        style={{ background: `${color}15`, color }}
                      >
                        {name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[9px] text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                        {name}
                      </span>
                    </GlowingCard>
                  </motion.div>
                ))}
              </StaggerContainer>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
