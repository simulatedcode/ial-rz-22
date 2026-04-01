"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const filters = [
  { label: "HELAS_FICTION", state: "PROGRESS" },
  { label: "LANDSCAPE_SCAN", state: "ACTIVE" },
  { label: "MEMORY_FRAGMENT", state: "STANDBY" },
  { label: "TIMELINE", state: "ACTIVE" }
];

const stateStyles = {
  ACTIVE: "text-primary",
  PROGRESS: "text-yellow-400",
  STANDBY: "text-muted-foreground",
};

export function HomeFilter() {
  const [index, setIndex] = useState(0);

  const labelRef = useRef<HTMLSpanElement>(null);
  const stateRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % filters.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const labelEl = labelRef.current;
    const stateEl = stateRef.current;
    if (!labelEl || !stateEl) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      // animate OUT (both)
      gsap.to([labelEl, stateEl], {
        y: -6,
        opacity: 0.85,
        duration: 0.22,
        ease: "power1.inOut",
        onComplete: () => {
          // reset below
          gsap.set([labelEl, stateEl], { y: 6, opacity: 0.85 });

          // animate IN
          gsap.to([labelEl, stateEl], {
            y: 0,
            opacity: 1,
            duration: 0.38,
            ease: "power2.out",
          });
        },
      });
    }, 70);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index]);

  const current = filters[index];

  return (
    <div className="inline-flex items-center gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 py-2 border-2 border-primary/30 bg-ocean-800/30 backdrop-blur-sm">

      <span className="text-muted-foreground text-xs sm:text-sm tracking-[0.3em] font-pixel">
        SYSTEM
      </span>

      {/* LABEL */}
      <span className="inline-block">
        <span
          ref={labelRef}
          className="inline-block text-primary font-pixel tracking-[0.3em] text-xs sm:text-sm whitespace-nowrap will-change-transform"
        >
          {current.label}
        </span>
      </span>

      {/* STATUS DOT */}
      <div className="w-2 sm:w-3 h-2 sm:h-3 bg-primary animate-pulse" />

      {/* STATE */}
      <span
        ref={stateRef}
        className={`font-pixel text-xs sm:text-sm tracking-[0.3em] will-change-transform ${stateStyles[current.state as keyof typeof stateStyles]}`}
      >
        {current.state}
      </span>
    </div>
  );
}
