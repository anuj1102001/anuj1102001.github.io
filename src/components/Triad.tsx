"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * The three things a recruiter should leave with: I design, I understand AI, I build.
 * Each panel widens when you point at it and shows its proof (facts from the work only).
 */
const PILLARS = [
  {
    k: "design",
    n: "01",
    t: "I design.",
    sub: "Product, UX, systems, motion",
    body: "From the problem and the user flow to the interface, the design system and the motion: dark and light themes, Figma variables mirrored in code, and interactions that explain themselves.",
    proof: [
      ["FITFLOW Figma file", "https://www.figma.com/design/tplM1llRbk13QxwC9bzAxU"],
      ["Shortlist design system", "https://shortlist-resume-neon.vercel.app/design-system"],
      ["COMET 2.0 brand & site", "/work/comet/"],
    ],
    art: "design",
  },
  {
    k: "ai",
    n: "02",
    t: "I understand AI.",
    sub: "LLMs, prompting, evaluation, RAG",
    body: "A year evaluating LLM outputs for accuracy, factual consistency and safety, then leading a team on a client project for Amazon AGI Lab. In my products: hybrid retrieval, structured outputs, quote verification and labelled evaluation sets.",
    proof: [
      ["Experience at Keywords Studios", "#experience"],
      ["Margin: verified citations", "/work/margin/"],
      ["Shortlist: 0.22 → 0.91 accuracy", "/work/shortlist/"],
    ],
    art: "ai",
  },
  {
    k: "build",
    n: "03",
    t: "I build.",
    sub: "Next.js, TypeScript, Python, FastAPI",
    body: "Every project here is live. Full-stack products with tests and CI, payments verified on the server, WebGL and path tracing in the browser. I build with AI coding agents, and I review the code and the evaluations.",
    proof: [
      ["Creators Store: 33 payment tests", "/work/creators-store/"],
      ["Solune: raw WebGL2, path tracing", "/work/solune/"],
      ["Code on GitHub", "https://github.com/anuj1102001"],
    ],
    art: "build",
  },
] as const;

function Art({ kind }: { kind: string }) {
  if (kind === "design")
    return (
      <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden>
        <rect x="10" y="12" width="84" height="56" rx="6" fill="none" stroke="currentColor" strokeOpacity=".5" />
        <rect x="18" y="20" width="40" height="6" rx="3" fill="#ff8a3d" className="tr-pulse" />
        <rect x="18" y="32" width="64" height="4" rx="2" fill="currentColor" fillOpacity=".3" />
        <rect x="18" y="40" width="52" height="4" rx="2" fill="currentColor" fillOpacity=".3" />
        <rect x="104" y="12" width="86" height="96" rx="6" fill="none" stroke="currentColor" strokeOpacity=".5" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={112 + (i % 2) * 38} y={22 + Math.floor(i / 2) * 40} width="32" height="32" rx="4" fill={i === 1 ? "#ff6a1f" : "currentColor"} fillOpacity={i === 1 ? 0.9 : 0.15} className={i === 1 ? "tr-float" : ""} />
        ))}
        <circle cx="30" cy="92" r="12" fill="#c6ff3d" fillOpacity=".85" className="tr-float" />
        <circle cx="62" cy="92" r="12" fill="currentColor" fillOpacity=".25" />
      </svg>
    );
  if (kind === "ai")
    return (
      <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x="12" y={14 + i * 18} width={i === 2 ? 120 : 150 - i * 12} height="6" rx="3" fill="currentColor" fillOpacity=".22" />
        ))}
        <rect x="12" y="50" width="120" height="6" rx="3" fill="#ff8a3d" className="tr-sweep" />
        <g className="tr-float">
          <rect x="146" y="40" width="44" height="26" rx="13" fill="none" stroke="#ff8a3d" />
          <text x="168" y="57" textAnchor="middle" fontSize="11" fill="#ffb36b" fontFamily="monospace">✓ src</text>
        </g>
        <text x="12" y="112" fontSize="9" fill="currentColor" fillOpacity=".6" fontFamily="monospace">stated · verified · p.4</text>
      </svg>
    );
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full font-mono" aria-hidden>
      <rect x="10" y="10" width="180" height="100" rx="8" fill="none" stroke="currentColor" strokeOpacity=".4" />
      {["$ npm run check", "✓ typecheck  ✓ lint", "✓ 33 tests passed", "$ deploy → live"].map((l, i) => (
        <text key={l} x="22" y={34 + i * 20} fontSize="10" fill={i === 2 ? "#c6ff3d" : i === 3 ? "#ffb36b" : "currentColor"} fillOpacity={i < 2 ? 0.7 : 1} className="tr-type" style={{ animationDelay: `${i * 0.5}s` }}>
          {l}
        </text>
      ))}
      <rect x="22" y="96" width="7" height="2" fill="#ffb36b" className="tr-blink" />
    </svg>
  );
}

export default function Triad() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(1);
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(root);
      gsap.from(q(".tr-col"), { y: 80, opacity: 0, duration: 1.2, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 75%" } });
      gsap.from(q(".tr-head span"), { yPercent: 110, duration: 1.1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 80%" } });
    },
    { scope: root },
  );
  return (
    <section ref={root} aria-labelledby="triad-h" className="relative px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="mono text-[11px] uppercase tracking-[0.2em] text-ember-300">Three things, in one person</p>
        <h2 id="triad-h" className="tr-head display mt-3 flex flex-wrap gap-x-[0.3em] overflow-hidden text-[clamp(36px,5.4vw,84px)] font-semibold leading-[0.95] tracking-[-0.05em]">
          <span className="inline-block">Design.</span>
          <span className="inline-block text-ember-400">AI.</span>
          <span className="inline-block">Build.</span>
        </h2>
        <div className="mt-12 flex flex-col gap-3 lg:h-[520px] lg:flex-row">
          {PILLARS.map((p, i) => {
            const on = open === i;
            return (
              <article
                key={p.k}
                onPointerEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                tabIndex={0}
                className={`tr-col glass group relative flex flex-col overflow-hidden p-6 outline-none transition-[flex-grow] duration-700 ease-[var(--ease-out-expo)] focus-visible:ring-2 focus-visible:ring-ember-500 sm:p-7 lg:min-w-0 ${on ? "lg:flex-[2.4]" : "lg:flex-1"}`}
                style={on ? { background: "linear-gradient(160deg, rgba(255,106,31,.12), rgba(255,255,255,.03))" } : undefined}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="mono text-[12px] text-ember-400">{p.n}</p>
                  <p className="mono text-right text-[10px] uppercase tracking-[0.16em] text-ink-500">{p.sub}</p>
                </div>
                <h3 className="display mt-6 text-[clamp(30px,3vw,46px)] font-semibold leading-[1] tracking-[-0.04em]">{p.t}</h3>
                <div className={`mt-6 h-[120px] text-ink-300 transition-opacity duration-500 lg:h-[150px] ${on ? "opacity-100" : "lg:opacity-40"}`}>
                  <Art kind={p.art} />
                </div>
                <div className={`mt-auto grid transition-all duration-700 ease-[var(--ease-out-expo)] ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[1fr] opacity-100 lg:grid-rows-[0fr] lg:opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="pt-6 text-[15px] leading-relaxed text-ink-300">{p.body}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {p.proof.map(([label, href]) => {
                        const ext = href.startsWith("http");
                        const cls = "mono inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3 py-1.5 text-[11px] text-ink-300 transition-colors hover:border-ember-500 hover:text-paper [:root[data-mode=pixel]_&]:rounded-none";
                        return (
                          <li key={label}>
                            {ext ? (
                              <a href={href} target="_blank" rel="noreferrer" className={cls}>
                                {label} ↗
                              </a>
                            ) : (
                              <Link href={href} className={cls}>
                                {label} →
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
