import dynamic from 'next/dynamic'
import Hero from "@/components/section/HeroSection";
import { HomeFilter } from "@/components/ui/HomeFilter";

const CanvasRoot = dynamic(() => import('@/components/webgl/CanvasRoot'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#050810]" />
})

export default function Home() {
  return (
    <div className="flex flex-col flex-1 py-38 items-center justify-center font-sans text-foreground">
      <div className="fixed inset-0 -z-10">
        <CanvasRoot />
      </div>
      <Hero />
      <div className="sticky inset-0 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto responsive-filter">
          <HomeFilter />
        </div>
      </div>
    </div>
  );
}
