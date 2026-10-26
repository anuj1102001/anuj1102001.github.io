import Hud from "@/components/Hud";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
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
        <Work />
        <Approach />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
