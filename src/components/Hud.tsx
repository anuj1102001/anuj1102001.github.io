"use client";

import { useEffect, useState } from "react";
import { useMode } from "./Mode";

/** Bengaluru time, updated each minute. Rendered empty on the server to avoid a mismatch. */
function useBlrTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
    const tick = () => setT(f.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/** Largest Contentful Paint of this visit, measured in the browser (a real number, not a claim). */
function useLcp() {
  const [lcp, setLcp] = useState<number | null>(null);
  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") return;
    try {
      const po = new PerformanceObserver((list) => {
        const e = list.getEntries().at(-1);
        if (e) setLcp(e.startTime);
      });
      po.observe({ type: "largest-contentful-paint", buffered: true });
      return () => po.disconnect();
    } catch {}
  }, []);
  return lcp;
}

export function ModeSwitch({ className = "" }: { className?: string }) {
  const { mode, setMode } = useMode();
  return (
    <div role="radiogroup" aria-label="Display mode" className={`glass flex items-center gap-0.5 p-0.5 ${className}`} style={{ borderRadius: "999px" }}>
      {(["glass", "pixel"] as const).map((m) => (
        <button
          key={m}
          role="radio"
          aria-checked={mode === m}
          onClick={() => setMode(m)}
          className={`mono rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors ${mode === m ? "bg-paper text-ink-950" : "text-ink-300 hover:text-paper"}`}
        >
          {m === "glass" ? "Glass" : "Pixel"}
        </button>
      ))}
    </div>
  );
}

const NAV = [
  ["Work", "#work"],
  ["Approach", "#approach"],
  ["About", "#about"],
  ["Contact", "#contact"],
] as const;

export default function Hud() {
  const time = useBlrTime();
  const lcp = useLcp();
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* Status strip: real facts only (local time, availability, this page's measured load). */}
      <div className="mono hidden items-center gap-5 px-6 pt-2 text-[10px] uppercase tracking-[0.16em] text-ink-500 md:flex">
        <span>
          BLR <span className="text-ink-300">{time || "--:--"}</span> IST
        </span>
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
          </span>
          <span className="text-ink-300">Open to Product Designer roles</span>
        </span>
        <span>
          LCP <span className="text-ink-300">{lcp == null ? "…" : `${(lcp / 1000).toFixed(2)}s`}</span>
        </span>
        <span className="ml-auto">Portfolio · 2026</span>
      </div>
      <div className="flex items-center justify-between gap-4 px-4 pt-3 sm:px-6">
        <a href="#top" className="glass pointer-events-auto flex items-center gap-2 px-3.5 py-2" style={{ borderRadius: "999px" }} aria-label="Anuj M, back to top">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-ember-500 text-[12px] font-bold text-ink-950 [:root[data-mode=pixel]_&]:rounded-none">A</span>
          <span className="display text-[14px] font-semibold tracking-tight">Anuj M</span>
        </a>
        <nav aria-label="Sections" className="glass pointer-events-auto hidden items-center gap-1 px-1.5 py-1.5 md:flex" style={{ borderRadius: "999px" }}>
          {NAV.map(([label, href]) => (
            <a key={href} href={href} className="rounded-full px-3.5 py-1.5 text-[13px] text-ink-300 transition-colors hover:bg-white/[0.07] hover:text-paper">
              {label}
            </a>
          ))}
        </nav>
        <div className="pointer-events-auto flex items-center gap-2">
          <ModeSwitch />
        </div>
      </div>
    </header>
  );
}
