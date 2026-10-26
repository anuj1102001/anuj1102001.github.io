"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";


export default function About() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(root);
      gsap.fromTo(q(".ab-photo"), { clipPath: "inset(18% 18% 18% 18% round 28px)", scale: 1.15 }, { clipPath: "inset(0% 0% 0% 0% round 20px)", scale: 1, ease: "none", scrollTrigger: { trigger: q(".ab-photo")[0], start: "top 90%", end: "top 30%", scrub: true } });
      q(".ab-row").forEach((el) => gsap.from(el, { x: -30, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } }));
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className="relative px-5 py-24 sm:px-8 md:py-36">
      <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="ab-photo relative overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
            <img src="/img/me/profile-1400.webp" srcSet="/img/me/profile-800.webp 800w, /img/me/profile-1400.webp 1400w" sizes="(min-width: 1024px) 560px, 100vw" alt="Anuj M, portrait" loading="lazy" className="aspect-[4/5] w-full object-cover object-[78%_center]" />
            <p className="mono absolute bottom-4 left-4 rounded-full bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-paper backdrop-blur [:root[data-mode=pixel]_&]:rounded-none">Bengaluru, India</p>
          </div>
        </div>
        <div>
          <p className="mono text-[11px] uppercase tracking-[0.2em] text-ember-300">About</p>
          <h2 className="display mt-3 text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.95] tracking-[-0.045em]">
            I spent a year finding where AI goes wrong.
            <span className="text-ink-400"> Now I design around it.</span>
          </h2>
          <div className="mt-8 max-w-[620px] space-y-5 text-[17px] leading-relaxed text-ink-300">
            <p>
              At Keywords Studios I reviewed model outputs for accuracy and safety and traced the patterns behind hallucinations, then led a small team doing that work on a client project for Amazon AGI Lab. It taught me that the hard part of an AI product isn&apos;t the model; it&apos;s helping people know when to trust it.
            </p>
            <p>
              So I design AI features around what models get wrong: evidence you can open, fact kept apart from judgement, an honest “I don&apos;t know”, and a person who makes the final call. I take an idea from the problem and the user flow to the interface, the design system and a working, deployed product.
            </p>
            <p>
              I build with AI coding agents, mainly Claude Code. I choose the problem, set the product direction and the design, review the code and the evaluations, and decide what ships. Ask me about any decision in this portfolio and I&apos;ll walk you through it.
            </p>
          </div>


          <div className="mt-8 flex flex-wrap gap-2.5">
            <a href="https://www.linkedin.com/in/anuj-m-622504221" target="_blank" rel="noreferrer" className="rounded-full bg-paper px-5 py-3 text-[14px] font-semibold text-ink-950 hover:bg-ember-300 [:root[data-mode=pixel]_&]:rounded-none [:root[data-mode=pixel]_&]:shadow-[4px_4px_0_#ff6a1f]">
              LinkedIn ↗
            </a>
            <a href="/Anuj_M_Resume.pdf" target="_blank" rel="noreferrer" className="glass px-5 py-3 text-[14px]" style={{ borderRadius: "var(--pill)" }}>
              Résumé (PDF)
            </a>
            <button
              onClick={() => {
                navigator.clipboard?.writeText("anujleo46@gmail.com").then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                });
              }}
              className="glass px-5 py-3 text-[14px]"
              style={{ borderRadius: "var(--pill)" }}
            >
              {copied ? "Email copied ✓" : "Copy email"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
