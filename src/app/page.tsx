import { HomeFilter } from "@/components/ui/HomeFilter";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans text-foreground">

      <main className="flex flex-1 w-full max-w-5xl flex-col items-center responsive-container">

        {/* Project Label */}
        <div className="mb-6 sm:mb-8 lg:mb-11 font-pixel text-xs sm:text-sm tracking-widest text-muted-foreground">
          PROJECT: IAL-RZ-22
        </div>

        {/* Title */}
        <div className="relative text-center font-pixel uppercase tracking-widest px-4">
          <h2 className="responsive-title text-4xl sm:text-5xl lg:text-6xl leading-tight text-primary">
            Speculative
          </h2>
          <p className="responsive-title text-4xl sm:text-5xl lg:text-6xl leading-tight text-foreground">
            Future <span className="text-accent">memories</span>
          </p>
        </div>

        {/* Description */}
        <div className="relative mt-5 sm:mt-6 lg:mt-7 responsive-description">
          <p className="responsive-description text-center text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground">
            The impression as a panorama is so real that it can be confused with reality itself.
          </p>
        </div>
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto responsive-filter">
            <HomeFilter />
          </div>
        </div>
      </main>
    </div>
  );
}
