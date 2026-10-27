"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { PROJECTS, type Project } from "@/lib/projects";
import { wipeTo } from "@/lib/wipe";

/* Custom artwork per project, drawn from the product's own idea. Animates on hover. */
function Artwork({ slug, accent }: { slug: string; accent: string }) {
  switch (slug) {
    case "shortlist":
      return (
        <svg viewBox="0 0 400 240" className="h-full w-full" aria-hidden>
          {[
            ["Go, PostgreSQL", "met", "#3ddc97"],
            ["Kafka, latency", "met", "#3ddc97"],
            ["Payments domain", "partly", "#e9b949"],
            ["Kubernetes", "not shown", "#ff6b6b"],
          ].map(([t, v, c], i) => (
            <g key={t} className="art-row" style={{ transitionDelay: `${i * 70}ms` }}>
              <rect x="24" y={34 + i * 44} width="230" height="32" rx="8" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.1)" />
              <text x="40" y={55 + i * 44} fontSize="12" fill="#f3ede4" fontFamily="var(--font-geist)">{t}</text>
              <rect x="176" y={42 + i * 44} width="66" height="16" rx="8" fill={c} fillOpacity=".18" />
              <text x="209" y={54 + i * 44} fontSize="9" textAnchor="middle" fill={c} fontFamily="var(--font-geist-mono)">{v}</text>
            </g>
          ))}
          <circle cx="318" cy="112" r="50" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="10" />
          <circle cx="318" cy="112" r="50" fill="none" stroke={accent} strokeWidth="10" strokeLinecap="round" strokeDasharray="314" className="art-ring" transform="rotate(-90 318 112)" />
          <text x="318" y="120" textAnchor="middle" fontSize="24" fontWeight="600" fill="#f3ede4" fontFamily="var(--font-geist)">74%</text>
          <text x="318" y="190" textAnchor="middle" fontSize="10" fill="#b4b4bd" fontFamily="var(--font-geist-mono)">5 of 7 required shown</text>
        </svg>
      );
    case "margin":
      return (
        <svg viewBox="0 0 400 240" className="h-full w-full" aria-hidden>
          <rect x="40" y="18" width="190" height="210" rx="6" fill="#f3ede4" />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x="58" y={40 + i * 14} width={i % 4 === 3 ? 110 : 154} height="5" rx="2.5" fill="#08080a" fillOpacity=".18" />
          ))}
          <rect x="54" y="105" width="162" height="22" rx="3" fill={accent} fillOpacity=".55" className="art-hl" />
          <path d="M218 116 C 260 116, 260 92, 290 92" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="4 4" className="art-dash" />
          <g className="art-pop">
            <rect x="290" y="74" width="92" height="36" rx="18" fill="rgba(8,8,10,.85)" stroke={accent} />
            <text x="336" y="96" textAnchor="middle" fontSize="11" fill="#f3ede4" fontFamily="var(--font-geist-mono)">✓ verified · p.4</text>
          </g>
          <text x="290" y="140" fontSize="10" fill="#b4b4bd" fontFamily="var(--font-geist-mono)">stated</text>
          <text x="290" y="156" fontSize="10" fill="#b4b4bd" fontFamily="var(--font-geist-mono)">27 / 28 verified</text>
        </svg>
      );
    case "fitflow":
      return (
        <svg viewBox="0 0 400 240" className="h-full w-full" aria-hidden>
          {[
            ["Replied", "Answer now", 0],
            ["Sequence step due", "Draft ready", 1],
            ["Slipping client", "Start rescue", 2],
          ].map(([t, s, i]) => (
            <g key={t as string} className="art-queue">
              <rect x="60" y={40 + (i as number) * 58} width="280" height="46" rx="12" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.12)" />
              <circle cx="84" cy={63 + (i as number) * 58} r="6" fill={i === 0 ? accent : "rgba(255,255,255,.3)"} />
              <text x="100" y={60 + (i as number) * 58} fontSize="13" fill="#f3ede4" fontFamily="var(--font-geist)">{t}</text>
              <text x="100" y={76 + (i as number) * 58} fontSize="10" fill="#b4b4bd" fontFamily="var(--font-geist-mono)">{s}</text>
              <rect x="268" y={52 + (i as number) * 58} width="56" height="22" rx="11" fill={i === 0 ? accent : "rgba(255,255,255,.1)"} />
              <text x="296" y={67 + (i as number) * 58} fontSize="10" textAnchor="middle" fill={i === 0 ? "#08080a" : "#f3ede4"} fontFamily="var(--font-geist)">Draft</text>
            </g>
          ))}
        </svg>
      );
    case "creators-store":
      return (
        <svg viewBox="0 0 400 240" className="h-full w-full" aria-hidden>
          {(
            [
              [70, "Buyer", "₹2,999 · UPI", "🛍"],
              [200, "Creator's Razorpay", "+₹2,999", "₹"],
              [330, "Creator's bank", "settled", "🏦"],
            ] as const
          ).map(([x, t, s, g]) => (
            <g key={t}>
              <circle cx={x} cy="104" r="30" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.15)" />
              <text x={x} y="111" textAnchor="middle" fontSize="18" fill="#f3ede4">{g}</text>
              <text x={x} y="158" textAnchor="middle" fontSize="11" fill="#f3ede4" fontFamily="var(--font-geist)">{t}</text>
              <text x={x} y="174" textAnchor="middle" fontSize="10" fill="#b4b4bd" fontFamily="var(--font-geist-mono)">{s}</text>
            </g>
          ))}
          <path d="M100 104 H170 M230 104 H300" stroke={accent} strokeWidth="2" strokeDasharray="5 5" className="art-dash" />
          <circle cx="100" cy="104" r="7" fill="#e9b949" className="art-coin" />
          <g transform="translate(200 40)">
            <rect x="-52" y="-14" width="104" height="26" rx="13" fill="rgba(8,8,10,.8)" stroke="#3ddc97" />
            <text y="4" textAnchor="middle" fontSize="11" fill="#3ddc97" fontFamily="var(--font-geist-mono)">Platform cut ₹0</text>
          </g>
        </svg>
      );
    case "comet":
      return (
        <svg viewBox="0 0 400 240" className="h-full w-full" aria-hidden>
          <path d="M60 170 C 140 150, 210 120, 280 92" fill="none" stroke={accent} strokeWidth="18" strokeLinecap="round" strokeOpacity=".25" className="art-tail" />
          <path d="M290 60 L298 84 L322 92 L298 100 L290 124 L282 100 L258 92 L282 84 Z" fill="#f3ede4" className="art-star" />
          <text x="40" y="214" fontSize="11" fill="#b4b4bd" fontFamily="var(--font-geist-mono)">MUMBAI IN MOTION · LOCAL · POSTCARD · HARBOUR</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 400 240" className="h-full w-full" aria-hidden>
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M-20 ${150 + i * 14} C 80 ${90 + i * 10}, 160 ${210 - i * 8}, 260 ${130 + i * 12} S 420 ${100 + i * 6}, 440 ${140 + i * 10}`} fill="none" stroke={i === 1 ? accent : "#7a3a12"} strokeWidth={i === 1 ? 10 : 6} strokeLinecap="round" strokeOpacity={i === 1 ? 0.9 : 0.6} className="art-wave" style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
          <text x="24" y="40" fontSize="11" fill="#b4b4bd" fontFamily="var(--font-geist-mono)">~120,000 GRAINS · RAW WEBGL2</text>
        </svg>
      );
  }
}

function Card({ p, i, big }: { p: Project; i: number; big?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    gsap.to(el, { rotateY: (x - 0.5) * 6, rotateX: -(y - 0.5) * 5, duration: 0.6, ease: "power3.out" });
  };
  const onLeave = () => ref.current && gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "expo.out" });
  const go = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    wipeTo({ href: `/work/${p.slug}/`, rect: ref.current?.getBoundingClientRect(), color: p.accent, label: p.name });
  };
  return (
    <div className={`w-card [perspective:1200px] ${big ? "md:col-span-7" : "md:col-span-5"}`}>
      <a
        ref={ref}
        href={`/work/${p.slug}/`}
        onClick={go}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group glass relative block overflow-hidden p-2 [transform-style:preserve-3d]"
        aria-label={`${p.name}: ${p.kind}. Open the case study`}
      >
        <span aria-hidden className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(500px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.09), transparent 40%)" }} />
        <div className="relative aspect-[16/10] overflow-hidden" style={{ borderRadius: "calc(var(--radius) - 8px)", background: `radial-gradient(120% 90% at 20% 0%, ${p.accent}33, transparent 60%), linear-gradient(160deg, #15151a, #0b0b0e)` }}>
          <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-[18%] group-hover:scale-[0.96]">
            <Artwork slug={p.slug} accent={p.accent} />
          </div>
          <img
            src={`${p.cover}-800.webp`}
            alt=""
            loading="lazy"
            className="absolute inset-x-[8%] bottom-0 w-[84%] translate-y-[78%] border border-white/10 object-cover object-top shadow-[0_-20px_60px_rgba(0,0,0,.6)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-[28%]"
            style={{ borderRadius: "var(--radius-sm) var(--radius-sm) 0 0", aspectRatio: "16/10" }}
          />
          <span className="mono absolute left-4 top-4 z-10 text-[11px] text-ink-300">{String(i + 1).padStart(2, "0")}</span>
          {p.lab ? <span className="mono absolute right-4 top-4 z-10 rounded-full border border-white/15 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-ink-300 [:root[data-mode=pixel]_&]:rounded-none">Lab · brand</span> : null}
        </div>
        <div className="flex items-end justify-between gap-4 px-3 pb-3 pt-4">
          <div className="min-w-0">
            <p className="display text-[clamp(22px,2.2vw,32px)] font-semibold leading-none tracking-[-0.035em]">{p.name}</p>
            <p className="mt-2 truncate text-[14px] text-ink-400">{p.kind}</p>
          </div>
          <span className="mono flex shrink-0 items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-300 transition-colors group-hover:text-paper">
            Case study
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-transparent group-hover:bg-paper group-hover:text-ink-950 [:root[data-mode=pixel]_&]:rounded-none">→</span>
          </span>
        </div>
        <p className="px-3 pb-3 text-[14px] leading-relaxed text-ink-500">{p.line}</p>
      </a>
    </div>
  );
}

export default function Work() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(root);
      q(".w-card").forEach((el, k) => {
        gsap.from(el, { y: 90, opacity: 0, duration: 1.2, ease: "expo.out", delay: (k % 2) * 0.08, scrollTrigger: { trigger: el, start: "top 90%" } });
        // A gentle parallax: every other card drifts a little.
        if (k % 2) gsap.to(el, { yPercent: -6, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
    },
    { scope: root },
  );
  const products = PROJECTS.filter((p) => !p.lab);
  const lab = PROJECTS.filter((p) => p.lab);
  return (
    <section id="work" ref={root} data-tint="#7c8cff,#3ddc97,#ff6a1f" className="relative px-5 py-24 sm:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.2em] text-ember-300">Selected work · AI products</p>
            <h2 className="display mt-3 text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.95] tracking-[-0.045em]">
              Products that show
              <br />
              their working.
            </h2>
          </div>
          <p className="max-w-[380px] text-[15px] leading-relaxed text-ink-400">Each one is live. Open a case study for the problem, the decisions, the architecture, the AI and the evidence.</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-12">
          {products.map((p, k) => (
            <Card key={p.slug} p={p} i={k} big={k === 0 || k === 3} />
          ))}
        </div>
        <p className="mono mt-20 text-[11px] uppercase tracking-[0.2em] text-ember-300">Lab · brand, motion and WebGL</p>
        <div className="mt-6 grid gap-4 md:grid-cols-12">
          {lab.map((p, k) => (
            <Card key={p.slug} p={p} i={products.length + k} big={k === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
