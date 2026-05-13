"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  ExternalLink,
  Shield,
  Brain,
  Wifi,
  Globe,
  Cloud,
  School,
} from "lucide-react";
import { BackgroundGradient } from "@/components/aceternity/background-gradient";
import { Badge } from "@/components/ui/badge";
import { type Certification } from "@/data/config";

const META = {
  web: {
    label: "Web Dev",
    icon: Globe,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    badge: "blue" as const,
  },
  ai: {
    label: "AI / ML",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    badge: "purple" as const,
  },
  security: {
    label: "Security",
    icon: Shield,
    color: "text-red-400",
    bg: "bg-red-400/10",
    badge: "default" as const,
  },
  networking: {
    label: "Networking",
    icon: Wifi,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    badge: "amber" as const,
  },
  cloud: {
    label: "Cloud",
    icon: Cloud,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    badge: "emerald" as const,
  },
  literacy: {
    label: "Literature/University",
    icon: School,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    badge: "emerald" as const,
  },
};

const FILTERS = [
  "All",
  "web",
  "ai",
  "security",
  "networking",
  "cloud",
] as const;

export default function CertificationsGrid({
  certifications,
}: {
  certifications: Certification[];
}) {
  const [filter, setFilter] = useState<string>("All");
  const filtered =
    filter === "All"
      ? certifications
      : certifications.filter((c) => c.category === filter);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono capitalize transition-all duration-200 ${
              filter === f
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                : "border border-border text-muted-foreground hover:border-emerald-500/40 hover:text-foreground"
            }`}
          >
            {f === "All" ? "All" : META[f as keyof typeof META].label}
          </button>
        ))}
      </div>

      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((cert, i) => {
            const m = META[cert.category];
            const Icon = m.icon;
            return (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                whileHover={{ y: -4 }}
              >
                <BackgroundGradient
                  animate={false}
                  containerClassName="h-full"
                  className="h-full"
                >
                  <div className="p-6 flex flex-col gap-4 h-full">
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${m.color}`} />
                      </div>
                      <Badge
                        variant={
                          m.badge as
                            | "blue"
                            | "purple"
                            | "default"
                            | "amber"
                            | "emerald"
                        }
                      >
                        {m.label}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-base leading-snug mb-1">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuer}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="font-mono text-xs text-muted-foreground">
                        {cert.date}
                      </span>
                      {cert.credentialUrl ? (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
                        >
                          Verify <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                          <Award className="w-3 h-3" /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                </BackgroundGradient>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
