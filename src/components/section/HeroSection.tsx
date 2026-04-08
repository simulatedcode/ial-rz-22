export default function Hero() {
  return (
    <section id="hero" className="w-full h-screen flex flex-col items-center justify-center px-4">

      {/* Title */}
      <div className="text-center font-pixel uppercase tracking-widest">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl text-primary drop-shadow-[0_0_8px_var(--color-flame-500)]">
          Speculative
        </h2>
        <p className="text-4xl sm:text-5xl lg:text-6xl text-foreground">
          Future <span className="text-accent">memories</span>
        </p>
      </div>

      {/* Description */}
      <div className="mt-10 max-w-xl">
        <p className="text-center text-base sm:text-lg lg:text-xl text-muted-foreground drop-shadow-[0_0_2px_var(--color-ocean-500)]">
          The impression as a panorama is so real that it can be confused with reality itself.
        </p>
      </div>

    </section>
  )
}