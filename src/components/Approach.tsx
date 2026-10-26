"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const W = (p: string) => `/img/work/${p}`;

/** The five principles, each shown with the screen where it lives. Cards stack as you scroll. */
const PRINCIPLES = [
  {
    t: "Show the evidence.",
    d: "Every AI claim links to the passage it came from, and the quote is checked against the source before it's shown.",
    img: W("margin/summary-citation"),
    seen: ["Margin", "Shortlist"],
    href: "/work/margin/",
  },
  {
    t: "Separate fact from judgement.",
    d: "Users can see what the document says and what the model inferred, labelled on every claim.",
    img: W("margin/key-facts"),
    seen: ["Margin"],
    href: "/work/margin/",
  },
  {
    t: "“I don't know” is a feature.",
    d: "When the sources don't support an answer, the product says so instead of guessing, and shows what it searched.",
    img: W("margin/ask"),
    seen: ["Margin", "Shortlist"],
    href: "/work/shortlist/",
  },
  {
    t: "AI drafts, people decide.",
    d: "Nothing is sent, published or overwritten without a person choosing to. Drafts explain their reasoning.",
    img: W("fitflow/compose"),
    seen: ["FITFLOW", "Creators Store"],
    href: "/work/fitflow/",
  },
  {
    t: "Measure before claiming.",
    d: "I build labelled test sets and report the results, including the failures and the caveats.",
    img: W("shortlist/evidence"),
    seen: ["Shortlist", "Margin"],
    href: "/work/shortlist/",
  },
];

export default function Approach() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(root);
      const cards = q(".ap-card") as HTMLElement[];
      // Each card scales back slightly as the next one slides over it.
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        gsap.to(card, {
          scale: 0.92,
          opacity: 0.35,
          filter: "blur(2px)",
          ease: "none",
          scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 18%", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="approach" ref={root} data-tint="#e9b949,#ff8a3d,#7c8cff" className="relative px-5 py-24 sm:px-8 md:py-36">
      <div className="mx-auto max-w-[1200px]">
        <p className="mono text-[11px] uppercase tracking-[0.2em] text-ember-300">Approach</p>
        <h2 className="display mt-3 max-w-[900px] text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.95] tracking-[-0.045em]">
          Five rules I design AI by. You&apos;ll find each one in the work.
        </h2>
        <div className="mt-14 space-y-6">
          {PRINCIPLES.map((p, i) => (
            <a
              key={p.t}
              href={p.href}
              className="ap-card glass group sticky top-[14vh] grid origin-top gap-6 overflow-hidden p-5 sm:p-7 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-10"
              style={{ background: "linear-gradient(160deg, #17171b, #0f0f12)" }}
            >
              <div>
                <p className="mono text-[12px] text-ember-400">{String(i + 1).padStart(2, "0")} / 05</p>
                <h3 className="display mt-4 text-[clamp(28px,3.2vw,48px)] font-semibold leading-[1] tracking-[-0.04em]">{p.t}</h3>
                <p className="mt-4 max-w-[440px] text-[16px] leading-relaxed text-ink-300">{p.d}</p>
                <p className="mono mt-6 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-ink-500">
                  Seen in
                  {p.seen.map((s) => (
                    <span key={s} className="rounded-full border border-[var(--line)] px-2.5 py-1 text-ink-300 [:root[data-mode=pixel]_&]:rounded-none">
                      {s}
                    </span>
                  ))}
                </p>
              </div>
              <div className="overflow-hidden border border-[var(--line)]" style={{ borderRadius: "var(--radius-sm)" }}>
                <img src={`${p.img}-1600.webp`} srcSet={`${p.img}-800.webp 800w, ${p.img}-1600.webp 1600w`} sizes="(min-width: 768px) 560px, 100vw" alt="" loading="lazy" className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
