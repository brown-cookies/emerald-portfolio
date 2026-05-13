"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Award, Download, Sparkles, Album } from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useNav, type SectionId } from "@/components/providers/NavProvider";
import { useBg } from "@/components/providers/BgProvider";
import { siteConfig } from "@/data/config";

const NAV_LINKS: { label: string; id: SectionId }[] = [
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Skills", id: "skills" },
  { label: "Experience", id: "experience" },
  { label: "Testimonials", id: "testimonials" },
  { label: "Contact", id: "contact" },
];

// Particles toggle button
function BgToggle() {
  const { bgEnabled, toggleBg } = useBg();
  return (
    <button
      onClick={toggleBg}
      title={bgEnabled ? "Turn off particles" : "Turn on particles"}
      aria-label={
        bgEnabled ? "Disable animated background" : "Enable animated background"
      }
      className={`relative w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 ${
        bgEnabled
          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500"
          : "border-border text-muted-foreground hover:border-emerald-500/30 hover:text-emerald-500"
      }`}
    >
      {/* Animated sparkle dots when active */}
      {bgEnabled && (
        <>
          <motion.span
            className="absolute top-1 right-1 w-1 h-1 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 0.6, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            className="absolute bottom-1.5 left-1.5 w-0.5 h-0.5 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 0.6, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}
      <Sparkles className="w-4 h-4" />
    </button>
  );
}

export default function Navbar() {
  const { current, goTo } = useNav();
  const [mobileOpen, setMobile] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const handleNav = (id: SectionId) => {
    setMobile(false);
    if (isHome) goTo(id);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="fixed top-0 inset-x-0 z-50 py-3.5 bg-background/75 backdrop-blur-xl border-b border-border/50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNav("hero")}
            className="group flex items-center gap-1.5"
          >
            <span className="font-display font-extrabold text-xl tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                M
              </span>
              <span>ielle</span>
            </span>
            <span className="font-mono text-[10px] text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
              .dev
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, id }) => {
              const isActive = isHome && current === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNav(id)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-200 ${
                    isActive
                      ? "text-emerald-500"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-emerald-500/8 rounded-xl border border-emerald-500/15"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/certifications"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border border-border text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-500 transition-all duration-200"
            >
              <Award className="w-3.5 h-3.5" /> Certs
            </Link>
            <Link
              href="/blog"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border border-border text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-500 transition-all duration-200"
            >
              Blog
            </Link>

            {/* Particles toggle */}
            <BgToggle />

            <ThemeToggle />

            <Button asChild size="sm" className="gap-1.5">
              <a href={siteConfig.resumeUrl} download>
                <Download className="w-3.5 h-3.5" /> Resume
              </a>
            </Button>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <BgToggle />
            <ThemeToggle />
            <button
              onClick={() => setMobile((v) => !v)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-border"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setMobile(false)}
            />
            <motion.aside
              className="absolute top-0 right-0 bottom-0 w-72 bg-card border-l border-border p-8 pt-24 flex flex-col gap-1"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              {NAV_LINKS.map(({ label, id }, i) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <button
                    onClick={() => handleNav(id)}
                    className={`w-full text-left px-4 py-3 text-base font-display font-semibold rounded-xl transition-colors ${
                      current === id
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "hover:bg-emerald-500/8 hover:text-emerald-500"
                    }`}
                  >
                    {label}
                  </button>
                </motion.div>
              ))}
              <Link
                href="/certifications"
                onClick={() => setMobile(false)}
                className="flex items-center gap-2 px-4 py-3 text-base font-display font-semibold rounded-xl hover:bg-emerald-500/8 hover:text-emerald-500 transition-colors"
              >
                <Award className="w-4 h-4" /> Certifications
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobile(false)}
                className="flex items-center gap-2 px-4 py-3 text-base font-display font-semibold rounded-xl hover:bg-emerald-500/8 hover:text-emerald-500 transition-colors"
              >
                <Album className="w-4 h-4" /> Blog
              </Link>
              <div className="mt-6 pt-4 border-t border-border space-y-2">
                <Button asChild className="w-full gap-2">
                  <a href={siteConfig.resumeUrl} download>
                    <Download className="w-4 h-4" /> Download Resume
                  </a>
                </Button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
