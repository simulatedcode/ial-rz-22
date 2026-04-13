export default function Pmem() {
    return (
        <section className="flex flex-col min-h-screen w-full items-center justify-center">
            <div className="text-center font-pixel uppercase tracking-widest">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl text-primary drop-shadow-[0_0_8px_var(--color-flame-500)]">
                    Pseudo Memories
                </h2>
            </div>
            {/* Description */}
            <div className="mt-10 max-w-xl">
                <p className="text-center text-base sm:text-lg lg:text-xl text-muted-foreground drop-shadow-[0_0_2px_var(--color-ocean-500)]">
                    Not an archive of what happened, but a system that renders what could have been remembered.
                </p>
            </div>
        </section>
    )
}