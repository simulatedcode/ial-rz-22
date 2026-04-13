import Hero from "@/components/section/HeroSection";
import Info from "@/components/section/InfoSection";
import Pmem from "@/components/section/PmemSection";

export default function Home() {
  return (
    <main className="w-full font-sans text-foreground">
      <Hero />
      <Info />
      {/* Increased physical scroll distance between sections */}
      <div className="h-screen w-full" />
      <Pmem />
    </main>
  );
}