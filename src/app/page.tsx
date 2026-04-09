import Hero from "@/components/section/HeroSection";
import Info from "@/components/section/InfoSection";

export default function Home() {
  return (
    <main className="w-full font-sans text-foreground">
      <Hero />
      <Info />
    </main>
  );
}