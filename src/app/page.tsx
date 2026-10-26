import Hud from "@/components/Hud";
import Hero from "@/components/Hero";
import Work from "@/components/Work";

export default function Home() {
  return (
    <>
      <Hud />
      <main>
        <Hero />
        <Work />
        <div className="h-[60vh]" />
      </main>
    </>
  );
}
