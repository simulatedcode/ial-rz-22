import Hero from "@/components/section/HeroSection";
import { HomeFilter } from "@/components/ui/HomeFilter";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 py-38 items-center justify-center font-sans text-foreground">
      <Hero />
      <div className="sticky inset-0 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto responsive-filter">
          <HomeFilter />
        </div>
      </div>
    </div>
  );
}
