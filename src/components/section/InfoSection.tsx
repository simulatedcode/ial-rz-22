const sentence = `A speculative interface exploring how memory, perception, and synthetic reality merge into a single timeline. This project blends WebGL environments with cinematic transitions to simulate fragmented futures—where what you see may not be what truly exists, but what your system chooses to remember.`

export default function Info() {
  return (
    <section className="grid min-h-screen w-full grid-cols-1 px-4 py-12 lg:grid-cols-2 lg:px-8 lg:py-0">
      <div className="hidden lg:block" />

      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl px-4 sm:px-8 lg:px-16">
          <div className="font-pixel uppercase tracking-widest">
            <h2 className="text-base leading-tight text-primary drop-shadow-[0_0_8px_var(--color-flame-500)] sm:text-lg lg:text-xl">
              About Project
            </h2>
          </div>

          <div className="mt-6">
            <p className="text-base leading-relaxed text-muted-foreground drop-shadow-[0_0_2px_var(--color-ocean-500)] sm:text-lg lg:text-xl">
              {sentence}
            </p>
          </div>

          <div className="mt-8 aspect-[4/3] max-w-xl overflow-hidden rounded-sm border border-primary/30 bg-[radial-gradient(circle_at_top,var(--color-ocean-500)/0.2,transparent_55%),linear-gradient(135deg,var(--color-background),color-mix(in_oklab,var(--color-foreground)_8%,transparent))] p-4 shadow-[0_0_30px_color-mix(in_oklab,var(--color-flame-500)_12%,transparent)]">
            <div className="flex h-full w-full items-center justify-center border border-dashed border-accent/40 text-center font-pixel text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Placeholder 01
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
