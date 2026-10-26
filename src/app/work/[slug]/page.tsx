import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Hud from "@/components/Hud";
import CaseStudy from "@/components/CaseStudy";
import Footer from "@/components/Footer";
import { CASES, CASE_ORDER } from "@/content/cases";

export const dynamicParams = false;
export function generateStaticParams() {
  return CASE_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = CASES[(await params).slug];
  return c ? { title: `${c.title}: ${c.tagline}`, description: c.intro } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = CASES[slug];
  if (!c) notFound();
  const i = CASE_ORDER.indexOf(slug);
  const n = CASES[CASE_ORDER[(i + 1) % CASE_ORDER.length]];
  return (
    <>
      <Hud />
      <main>
        <CaseStudy c={c} next={{ slug: n.slug, title: n.title, tagline: n.tagline }} />
      </main>
      <Footer />
    </>
  );
}
