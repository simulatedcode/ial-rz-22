"use client";

import { useEffect, useRef } from "react";
import { updates } from "@/components/data/history";
import gsap from "gsap";

export default function HistoryPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current.querySelector(".header-title"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    gsap.fromTo(
      itemsRef.current,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.3
      }
    );
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Background Data Grid (Consolidated from layout.tsx) */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, var(--color-ocean-900) 1px, transparent 1px), linear-gradient(to bottom, var(--color-ocean-900) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background"></div>
      </div>

      <div
        ref={containerRef}
        className="relative z-10 flex flex-col min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full"
      >
      <header className="mb-12 border-b border-border pb-8 header-title">
        <h1 className="text-xl md:text-2xl lg:text-4xl font-bold font-sans tracking-tighter text-primary mb-4 uppercase drop-shadow-[0_0_8px_var(--color-flame-500)]">
          Operational History
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest font-pixel">
          Archive // Chronological // Exhibitions & Affairs
        </p>
      </header>

      <div className="relative w-full overflow-hidden mt-12 mb-8 rounded-sm bg-panel/20 border border-primary/20 shadow-[0_0_20px_rgba(246,103,55,0.05)] backdrop-blur-md">
        {/* Inner glowing edge */}
        <div className="absolute inset-0 pointer-events-none border border-primary/10 shadow-[inset_0_0_30px_rgba(246,103,55,0.03)] rounded-sm" />

        <div className="w-full overflow-x-auto relative z-10 hidden-scrollbar">
          <table className="w-full text-left font-pixel text-xs sm:text-sm min-w-[900px]">
            <thead className="bg-panel/90 text-primary border-b border-primary/40 sticky top-0 backdrop-blur-xl z-20 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
              <tr>
                <th className="p-5 font-normal w-1/4 tracking-widest uppercase">
                  <span className="opacity-50 mr-2 text-accent">/</span>TITLE
                </th>
                <th className="p-5 font-normal w-2/5 tracking-widest uppercase">
                  <span className="opacity-50 mr-2 text-accent">/</span>DESCRIPTION
                </th>
                <th className="p-5 font-normal w-1/6 tracking-widest uppercase">
                  <span className="opacity-50 mr-2 text-accent">/</span>LOCATION
                </th>
                <th className="p-5 font-normal w-1/6 tracking-widest uppercase">
                  <span className="opacity-50 mr-2 text-accent">/</span>DATE
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {updates.map((update, index) => (
                <tr
                  key={update.id}
                  ref={(el) => { itemsRef.current[index] = el; }}
                  className="group relative transition-all duration-300 hover:bg-primary/10"
                >
                  <td className="p-5 align-top text-foreground group-hover:text-white transition-colors relative">
                    {/* Hover indicator strip */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300 ease-out shadow-[0_0_8px_var(--color-flame-400)]" />
                    <div className="leading-relaxed text-sm md:text-base font-sans font-bold tracking-wide group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                      {update.title}
                    </div>
                  </td>
                  <td className="p-5 align-top text-foreground/70 font-sans text-sm md:text-base leading-relaxed group-hover:text-foreground/90 transition-colors pr-8">
                    {update.description || <span className="text-muted-foreground/30 text-[10px] tracking-widest block mt-1 uppercase">NO_DATA</span>}
                  </td>
                  <td className="p-5 align-top text-secondary-foreground text-xs md:text-sm uppercase tracking-wider group-hover:text-accent transition-colors">
                    {update.location ? (
                      <div className="inline-flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-none bg-accent/30 group-hover:bg-accent group-hover:shadow-[0_0_8px_var(--color-flame-400)] transition-all"></span>
                        {update.location}
                      </div>
                    ) : (
                      <span className="text-muted-foreground/30">—</span>
                    )}
                  </td>
                  <td className="p-5 align-top text-muted-foreground whitespace-nowrap text-xs md:text-sm font-mono tracking-widest group-hover:text-primary transition-colors">
                    [{update.date}]
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
}
