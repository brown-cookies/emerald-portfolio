"use client";
import { useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useNav,
  SECTIONS,
  type SectionId,
} from "@/components/providers/NavProvider";

const variants = {
  enter: (dir: 1 | -1) => ({
    y: dir > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      y: { type: "spring" as const, stiffness: 280, damping: 30, mass: 0.8 },
      opacity: { duration: 0.2 },
      scale: {
        duration: 0.3,
        ease: [0.32, 0, 0.67, 0] as [number, number, number, number],
      },
    },
  },
  exit: (dir: 1 | -1) => ({
    y: dir > 0 ? "-30%" : "30%",
    opacity: 0,
    scale: 0.94,
    transition: {
      y: {
        duration: 0.3,
        ease: [0.32, 0, 0.67, 0] as [number, number, number, number],
      },
      opacity: { duration: 0.18 },
      scale: { duration: 0.25 },
    },
  }),
};

const SCROLLABLE_SECTIONS: SectionId[] = [
  "projects",
  "experience",
  "testimonials",
  "contact",
];

interface Props {
  sections: Record<string, React.ReactNode>;
}

export default function SectionTransition({ sections }: Props) {
  const { current, direction, goTo } = useNav();
  const idx = SECTIONS.indexOf(current);

  const containerRef = useRef<HTMLDivElement>(null); // stable outer div
  const panelRef = useRef<HTMLDivElement>(null); // scrollable inner panel

  // Always-fresh refs so the wheel handler never reads stale closures
  const idxRef = useRef(idx);
  const currentRef = useRef(current);
  idxRef.current = idx;
  currentRef.current = current;

  const cooldown = useRef(false);

  const tryNavigate = useCallback(
    (scrollingDown: boolean) => {
      if (cooldown.current) return;

      // For scrollable sections, only navigate when at the scroll boundary
      if (
        SCROLLABLE_SECTIONS.includes(currentRef.current) &&
        panelRef.current
      ) {
        const { scrollTop, scrollHeight, clientHeight } = panelRef.current;
        const atTop = scrollTop <= 2;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 2;

        if (scrollingDown && !atBottom) return;
        if (!scrollingDown && !atTop) return;
      }

      const i = idxRef.current;
      if (scrollingDown && i < SECTIONS.length - 1)
        goTo(SECTIONS[i + 1] as SectionId);
      else if (!scrollingDown && i > 0) goTo(SECTIONS[i - 1] as SectionId);
      else return;

      cooldown.current = true;
      setTimeout(() => {
        cooldown.current = false;
      }, 550);
    },
    [goTo],
  );

  // Attach to the OUTER container — it never unmounts, so the listener survives section changes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return; // ignore horizontal-dominant
      if (Math.abs(e.deltaY) < 20) return; // ignore trackpad noise

      tryNavigate(e.deltaY > 0);
    };

    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, [tryNavigate]);

  const handleDragEnd = (
    _: unknown,
    info: { offset: { y: number }; velocity: { y: number } },
  ) => {
    const { offset, velocity } = info;
    const swipedUp = offset.y < -80 || velocity.y < -500;
    const swipedDown = offset.y > 80 || velocity.y > 500;

    if (!swipedUp && !swipedDown) return;

    if (
      SCROLLABLE_SECTIONS.includes(current as SectionId) &&
      panelRef.current
    ) {
      const { scrollTop, scrollHeight, clientHeight } = panelRef.current;
      const atTop = scrollTop <= 2;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 2;

      if (swipedUp && !atBottom) return;
      if (swipedDown && !atTop) return;
    }

    if (swipedUp && idx < SECTIONS.length - 1)
      goTo(SECTIONS[idx + 1] as SectionId);
    if (swipedDown && idx > 0) goTo(SECTIONS[idx - 1] as SectionId);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[100dvh] overflow-hidden"
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          ref={panelRef}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.06}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden"
          style={{ willChange: "transform, opacity", touchAction: "pan-y" }}
        >
          {sections[current]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
