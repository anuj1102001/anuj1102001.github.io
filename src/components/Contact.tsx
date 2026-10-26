"use client";

import { useState } from "react";

const LINKS = [
  ["LinkedIn", "https://www.linkedin.com/in/anuj-m-622504221"],
  ["GitHub", "https://github.com/anuj1102001"],
  ["Design system (Figma)", "https://www.figma.com/design/QsLBb2Yx1R6BEPdDG282xE"],
] as const;

export default function Contact() {
  const [copied, setCopied] = useState(false);
  return (
    <section id="contact" className="relative overflow-hidden px-5 pb-16 pt-24 sm:px-8 md:pt-36">
      <div className="pointer-events-none absolute bottom-[-30%] left-1/2 h-[90vmin] w-[140vmin] -translate-x-1/2 rounded-full opacity-50 [background:radial-gradient(circle,#ff6a1f,transparent_62%)] [:root[data-mode=pixel]_&]:hidden" />
      {/* A slow marquee of the line, both directions */}
      <div className="pointer-events-none -mx-5 select-none overflow-hidden sm:-mx-8" aria-hidden>
        <div className="display flex w-max animate-[marquee_38s_linear_infinite] whitespace-nowrap text-[clamp(64px,11vw,190px)] font-semibold leading-none tracking-[-0.06em] text-paper/90">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="pr-[0.4em]">
              Let&apos;s design AI people can trust <span className="font-serif font-normal italic text-ember-400 [:root[data-mode=pixel]_&]:font-pixel [:root[data-mode=pixel]_&]:not-italic">—</span> Let&apos;s design AI people can trust <span className="font-serif font-normal italic text-ember-400 [:root[data-mode=pixel]_&]:font-pixel [:root[data-mode=pixel]_&]:not-italic">—</span>
            </span>
          ))}
        </div>
      </div>
      <div className="relative mx-auto mt-16 grid max-w-[1300px] gap-10 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div>
          <p className="mono text-[11px] uppercase tracking-[0.2em] text-ember-300">Contact</p>
          <p className="mt-4 max-w-[560px] text-[18px] leading-relaxed text-ink-300">
            I&apos;m looking for Product Designer and AI Product Designer roles, where I can own an AI feature from the first sketch to what ships. The quickest way to reach me:
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="mailto:anujleo46@gmail.com" className="display text-[clamp(26px,3.6vw,52px)] font-semibold tracking-[-0.04em] underline decoration-ember-500 decoration-2 underline-offset-[10px] hover:text-ember-300">
              anujleo46@gmail.com
            </a>
            <button
              onClick={() => navigator.clipboard?.writeText("anujleo46@gmail.com").then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); })}
              className="glass mono px-3.5 py-2 text-[11px] uppercase tracking-[0.14em]"
              style={{ borderRadius: "var(--pill)" }}
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
        </div>
        <ul className="grid gap-2">
          {LINKS.map(([l, h]) => (
            <li key={l}>
              <a href={h} target={h.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="glass group flex items-center justify-between px-5 py-4 text-[16px]">
                {l}
                <span className="transition-transform group-hover:translate-x-1">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
