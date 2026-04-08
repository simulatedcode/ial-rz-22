const sentence = `A speculative interface exploring how memory, perception, and synthetic reality merge into a single timeline. This project blends WebGL environments with cinematic transitions to simulate fragmented futures—where what you see may not be what truly exists, but what your system chooses to remember.`

export default function Info() {
    return (
        <section className="w-full h-screen grid grid-cols-1 lg:grid-cols-2">

            {/* LEFT COLUMN (visual / empty space) */}
            <div className="hidden lg:block" />

            {/* RIGHT COLUMN (content) */}
            <div className="flex py-20 px-6 lg:px-16">

                <div className="max-w-xl w-full">

                    {/* Title */}
                    <div className="font-pixel uppercase tracking-widest">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl leading-tight text-primary drop-shadow-[0_0_8px_var(--color-flame-500)]">
                            About Project
                        </h2>
                    </div>

                    {/* Description */}
                    <div className="mt-6">
                        <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground drop-shadow-[0_0_2px_var(--color-ocean-500)]">
                            {sentence}
                        </p>
                    </div>

                </div>

            </div>

        </section>
    )
}