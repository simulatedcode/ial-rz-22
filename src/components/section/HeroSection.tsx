export default function Hero() {
  return (
    <>
      <section className="flex flex-1 w-full max-full flex-col items-center responsive-container">

        {/* Title */}
        <div className="relative text-center font-pixel uppercase tracking-widest px-4">
          <h2 className="responsive-title text-4xl sm:text-5xl lg:text-6xl leading-tight text-primary  drop-shadow-[0_0_8px_var(--color-flame-500)]">
            Speculative
          </h2>
          <p className="responsive-title text-4xl sm:text-5xl lg:text-6xl leading-tight text-foreground">
            Future <span className="text-accent">memories</span>
          </p>
        </div>

        {/* Description */}
        <div className="relative mt-12 sm:mt-10 lg:mt-8 mb-8 responsive-description">
          <p className="responsive-description text-center text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground  drop-shadow-[0_0_2px_var(--color-ocean-500)]">
            The impression as a panorama is so real that it can be confused with reality itself.
          </p>
        </div>

      </section>

    </>
  )
}
