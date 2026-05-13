"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Download,
  Sparkles,
  MapPin,
  User,
} from "lucide-react";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { Spotlight } from "@/components/aceternity/spotlight";
import { TypewriterLoop } from "@/components/aceternity/typewriter-effect";
import { SparklesCore } from "@/components/aceternity/sparkles";
import { MovingBorderButton } from "@/components/aceternity/moving-border";
import { MagneticButton } from "@/components/21st/magnetic-button";
import { Button } from "@/components/ui/button";
import { useNav } from "@/components/providers/NavProvider";
import { siteConfig } from "@/data/config";

const ROLES = [
  "Web Engineer",
  "Software Engineer",
  "AI Engineer",
  "Full-Stack Developer",
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
    },
  },
};
const photoVariant = {
  hidden: { opacity: 0, scale: 0.88, x: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay: 0.3,
      ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
    },
  },
};

export default function Hero() {
  const { goTo } = useNav();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const shouldReduce = useReducedMotion();

  return (
    <section className="relative h-[100dvh] flex items-center overflow-hidden bg-background">
      {/* Background layers */}
      <BackgroundBeams className="opacity-30" />
      <Spotlight
        className="-top-40 -left-20 md:left-40 md:-top-20"
        fill="#10b981"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[500px] rounded-full bg-emerald-500/3 blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ── LEFT: text content ── */}
          <motion.div variants={container} initial="hidden" animate="visible">
            {/* Status badge */}
            <motion.div variants={item} className="mb-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/5 text-emerald-500 text-xs font-mono backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                {siteConfig.availableForWork
                  ? "Available for new projects"
                  : "Open to opportunities"}
              </span>
            </motion.div>

            {/* Name */}
            <motion.div variants={item} className="mb-3">
              <p className="font-body text-muted-foreground/80 text-base mb-1">
                Hi, I&apos;m
              </p>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1]">
                <SparklesCore color="#10b981">
                  <span className="bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Mielle
                  </span>
                </SparklesCore>
                <span className="block bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                  Almedejar
                </span>
              </h1>
            </motion.div>

            {/* Typewriter role */}
            <motion.div
              variants={item}
              className="flex items-center gap-2 text-lg sm:text-xl font-display font-semibold text-muted-foreground mb-4 h-8"
            >
              <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <TypewriterLoop strings={ROLES} className="text-foreground" />
            </motion.div>

            {/* Tagline */}
            <motion.p
              variants={item}
              className="text-muted-foreground text-base leading-relaxed mb-2 max-w-lg"
            >
              {siteConfig.tagline}
            </motion.p>

            {/* Location */}
            <motion.div
              variants={item}
              className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground mb-8"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              {siteConfig.location}
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={item}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <MagneticButton>
                <Button
                  size="lg"
                  className="gap-2 shadow-lg shadow-emerald-500/25"
                  onClick={() => goTo("projects")}
                >
                  View My Work <ArrowRight className="w-4 h-4" />
                </Button>
              </MagneticButton>
              <MagneticButton href={siteConfig.resumeUrl} download>
                <MovingBorderButton
                  duration={3000}
                  className="flex items-center gap-2 text-foreground font-medium"
                >
                  <Download className="w-4 h-4" /> Resume
                </MovingBorderButton>
              </MagneticButton>
            </motion.div>

            {/* Social row */}
            <motion.div variants={item} className="flex items-center gap-5">
              {[
                { href: siteConfig.github, icon: Github, label: "GitHub" },
                {
                  href: siteConfig.linkedin,
                  icon: Linkedin,
                  label: "LinkedIn",
                },
                {
                  href: `mailto:${siteConfig.email}`,
                  icon: Mail,
                  label: "Email",
                },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex items-center gap-1.5 text-muted-foreground hover:text-emerald-500 transition-colors duration-200"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {label}
                  </span>
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: profile photo ── */}
          <motion.div
            variants={photoVariant}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex items-center justify-center relative"
          >
            {/* Outer spinning ring */}
            <motion.div
              className="absolute w-[340px] h-[340px] rounded-full border border-emerald-500/15"
              animate={shouldReduce ? {} : { rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
            </motion.div>

            {/* Second ring, counter-rotating */}
            <motion.div
              className="absolute w-[380px] h-[380px] rounded-full border border-dashed border-emerald-500/8"
              animate={shouldReduce ? {} : { rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            {/* Photo container */}
            <div className="relative w-[280px] h-[280px]">
              {/* Emerald glow behind photo */}
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-[30px] scale-110" />

              {/* Photo frame */}
              <div className="relative w-full h-full rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] border-2 border-emerald-500/30 overflow-hidden bg-card">
                {/* ── Placeholder: visible until image loads or on error ── */}
                <div
                  className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 gap-4 transition-opacity duration-300 ${
                    imgLoaded && !imgError
                      ? "opacity-0 pointer-events-none"
                      : "opacity-100"
                  }`}
                >
                  <div className="w-28 h-28 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <User className="w-10 h-10 text-emerald-500/60" />
                  </div>
                  <p className="font-mono text-[10px] text-emerald-500/50 text-center px-4 leading-relaxed">
                    Add your photo at
                    <br />
                    <span className="text-emerald-500/80">
                      public/images/profile.jpg
                    </span>
                  </p>
                </div>

                {/* ── Real photo — always mounted so browser can cache it ── */}
                {!imgError && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/images/profile.jpg"
                    alt={`${siteConfig.name} profile photo`}
                    className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${
                      imgLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgError(true)}
                  />
                )}

                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Emerald corner accent */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.7)] flex items-center justify-center">
                <span className="text-[9px]">✓</span>
              </div>
            </div>

            {/* Floating stat cards */}
            <motion.div
              className="absolute -left-4 top-8 px-3 py-2 rounded-xl bg-card/90 border border-border backdrop-blur-sm shadow-xl"
              animate={shouldReduce ? {} : { y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="font-display font-bold text-lg text-emerald-500">
                4+
              </p>
              <p className="text-[10px] text-muted-foreground font-mono">
                Years coding
              </p>
            </motion.div>

            <motion.div
              className="absolute -right-4 bottom-14 px-3 py-2 rounded-xl bg-card/90 border border-border backdrop-blur-sm shadow-xl"
              animate={shouldReduce ? {} : { y: [0, 6, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <p className="font-display font-bold text-lg text-emerald-500">
                15+
              </p>
              <p className="text-[10px] text-muted-foreground font-mono">
                Projects shipped
              </p>
            </motion.div>

            <motion.div
              className="absolute right-8 -top-4 px-3 py-1.5 rounded-xl bg-card/90 border border-emerald-500/20 backdrop-blur-sm shadow-xl"
              animate={shouldReduce ? {} : { y: [0, -4, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <p className="text-[10px] font-mono text-emerald-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Open to work
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Explore hint */}
      <motion.button
        onClick={() => goTo("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-emerald-500 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">
          explore
        </span>
        <motion.div
          animate={shouldReduce ? {} : { y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <svg
            className="w-4 h-4 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  );
}
