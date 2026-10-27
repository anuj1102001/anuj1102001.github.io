import Hud from "@/components/Hud";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Triad from "@/components/Triad";
import Experience from "@/components/Experience";
import Approach from "@/components/Approach";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Hud />
      <main>
        <Hero />
        {/* Each section below the hero hydrates on its own, so a slow phone can paint in between. */}
        <Suspense>
          <Triad />
        </Suspense>
        <Suspense>
          <Work />
        </Suspense>
        <Suspense>
          <Approach />
        </Suspense>
        <Suspense>
          <Experience />
        </Suspense>
        <Suspense>
          <About />
        </Suspense>
        <Suspense>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
