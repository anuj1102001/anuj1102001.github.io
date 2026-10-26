import Hud from "@/components/Hud";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Triad from "@/components/Triad";
import Experience from "@/components/Experience";
import Approach from "@/components/Approach";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hud />
      <main>
        <Hero />
        <Triad />
        <Work />
        <Approach />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
