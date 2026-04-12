import Image from 'next/image'

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

          <div className="mt-6 mb-4">
            <p className="font-mono text-base leading-relaxed text-muted-foreground drop-shadow-[0_0_2px_var(--color-ocean-500)] lg:text-lg">
              {sentence}
            </p>
          </div>

          <div className="mt-8 aspect-video overflow-hidden rounded-sm border border-primary/30 relative">
            <Image
              src="/images/placeholder.jpg"
              alt="Project preview"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
