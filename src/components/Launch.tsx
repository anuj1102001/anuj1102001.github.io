"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

/**
 * Launching a live demo: links marked data-launch don't open their tab at once. Data lines draw
 * up from the button like a circuit, a small rocket rides the main line to the top of the screen,
 * and only then the demo opens in a new tab.
 *
 * Browsers only allow a new tab shortly after the click (Safari is strictest), so the flight is
 * kept under a second; if the tab is still blocked, a link appears instead. Modifier-clicks and
 * reduced motion open normally.
 */
type Flight = { id: number; href: string; label: string; x: number; y: number };

const ROCKET_GLASS = (
  <g>
    {/* flame */}
    <path className="lc-flame" d="M-5 14 Q0 30 5 14 Z" fill="#ffb36b" />
    <path className="lc-flame lc-flame-2" d="M-3 14 Q0 24 3 14 Z" fill="#fff3d6" />
    {/* body */}
    <path d="M0 -18 C9 -8 9 6 6 14 H-6 C-9 6 -9 -8 0 -18 Z" fill="#f3ede4" />
    <path d="M0 -18 C5 -12 7 -6 7 -2 H-7 C-7 -6 -5 -12 0 -18 Z" fill="#ff6a1f" />
    <circle cx="0" cy="3" r="3.2" fill="#08080a" stroke="#ff8a3d" strokeWidth="1.4" />
    {/* fins */}
    <path d="M-6 6 L-12 15 L-6 13 Z M6 6 L12 15 L6 13 Z" fill="#ff6a1f" />
  </g>
);

const ROCKET_PIXEL = (
  <g shapeRendering="crispEdges">
    <rect className="lc-flame" x="-3" y="14" width="6" height="8" fill="#ffb36b" />
    <rect x="-2" y="-18" width="4" height="4" fill="#ff6a1f" />
    <rect x="-4" y="-14" width="8" height="6" fill="#ff6a1f" />
    <rect x="-6" y="-8" width="12" height="22" fill="#f3ede4" />
    <rect x="-2" y="0" width="4" height="4" fill="#08080a" />
    <rect x="-12" y="8" width="6" height="6" fill="#ff6a1f" />
    <rect x="6" y="8" width="6" height="6" fill="#ff6a1f" />
  </g>
);

function nameFor(a: HTMLAnchorElement) {
  return a.dataset.launch && a.dataset.launch !== "true" ? a.dataset.launch : new URL(a.href).hostname.replace(/^www\./, "");
}

export default function Launch() {
  const [flight, setFlight] = useState<Flight | null>(null);
  const [blocked, setBlocked] = useState<{ href: string; label: string } | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const counter = useRef(0);

  // Catch clicks on any launch link on the page.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-launch]");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; // open normally
      e.preventDefault();
      const r = a.getBoundingClientRect();
      setBlocked(null);
      setFlight({ id: ++counter.current, href: a.href, label: nameFor(a), x: r.left + r.width / 2, y: r.top + r.height / 2 });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Fly.
  useEffect(() => {
    if (!flight || !svg.current) return;
    const s = svg.current;
    const q = (sel: string) => s.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(s, { opacity: 1 })
      .fromTo(q(".lc-line"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.32, ease: "power2.out", stagger: 0.04 })
      .fromTo(q(".lc-node"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.25, ease: "back.out(3)", stagger: 0.03 }, 0.08)
      .fromTo(q(".lc-pkt"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.1);
    q(".lc-pkt").forEach((p, i) =>
      tl.to(p, { motionPath: { path: `#lc-side-${flight.id}-${i}`, align: `#lc-side-${flight.id}-${i}`, alignOrigin: [0.5, 0.5] }, duration: 0.62, ease: "power1.inOut" }, 0.12 + i * 0.05),
    );
    tl.fromTo(q(".lc-rocket"), { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.1)
      .to(q(".lc-rocket"), { motionPath: { path: `#lc-main-${flight.id}`, align: `#lc-main-${flight.id}`, alignOrigin: [0.5, 0.5], autoRotate: 90 }, duration: 0.7, ease: "power1.inOut" }, 0.12)
      .fromTo(q(".lc-burst"), { scale: 0.2, opacity: 1, transformOrigin: "50% 50%" }, { scale: 2.4, opacity: 0, duration: 0.45, ease: "expo.out" }, 0.78)
      .fromTo(q(".lc-chip"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "power3.out" }, 0.7)
      .add(() => {
        // Opened without "noopener" (which always returns null) and detached by hand instead,
        // so a null result really means the browser blocked the tab.
        const w = window.open(flight.href, "_blank");
        if (w) w.opener = null;
        else setBlocked({ href: flight.href, label: flight.label });
      }, 0.86)
      .to(s, { opacity: 0, duration: 0.45, ease: "power2.out" }, 1.15)
      .add(() => setFlight(null));
    // Dev only: lets the screenshot script slow the flight down to inspect it.
    if (process.env.NODE_ENV !== "production") (window as unknown as { __lcTl?: gsap.core.Timeline }).__lcTl = tl;
    return () => {
      tl.kill();
    };
  }, [flight]);

  useEffect(() => {
    if (!blocked) return;
    const t = setTimeout(() => setBlocked(null), 6000);
    return () => clearTimeout(t);
  }, [blocked]);

  let main = "";
  const sides: string[] = [];
  const nodes: [number, number][] = [];
  if (flight) {
    const { x, y } = flight;
    const vw = typeof window !== "undefined" ? innerWidth : 1440;
    const lane = Math.min(vw - 40, Math.max(40, x + (x > vw / 2 ? -90 : 90)));
    const y1 = y - 50;
    const y2 = Math.max(90, y * 0.45);
    main = `M${x} ${y} V${y1} H${lane} V${y2} H${vw / 2} V-30`;
    nodes.push([x, y1], [lane, y1], [lane, y2], [vw / 2, y2]);
    // two thinner companion lines, offset like cables in a rack
    for (const off of [-16, 16]) {
      sides.push(`M${x + off} ${y} V${y1 + off * 0.4} H${lane + off} V${y2 + off * 0.4} H${vw / 2 + off} V-30`);
    }
  }

  return (
    <>
      {flight ? (
        <svg ref={svg} aria-hidden className="pointer-events-none fixed inset-0 z-[95] h-full w-full opacity-0" key={flight.id}>
          <defs>
            <filter id="lc-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {sides.map((d, i) => (
            <path key={i} id={`lc-side-${flight.id}-${i}`} d={d} pathLength={1} strokeDasharray="1" className="lc-line" fill="none" stroke="#7c8cff" strokeOpacity=".45" strokeWidth="1" />
          ))}
          <path id={`lc-main-${flight.id}`} d={main} pathLength={1} strokeDasharray="1" className="lc-line" fill="none" stroke="#ff8a3d" strokeWidth="1.6" filter="url(#lc-glow)" />
          {nodes.map(([nx, ny], i) => (
            <circle key={i} className="lc-node" cx={nx} cy={ny} r="5" fill="#08080a" stroke="#ff8a3d" strokeWidth="1.6" />
          ))}
          {sides.map((_, i) => (
            <circle key={`p${i}`} className="lc-pkt" r="2.5" fill="#c6ff3d" filter="url(#lc-glow)" />
          ))}
          <g className="lc-rocket" filter="url(#lc-glow)">
            <g transform="scale(1.8)">
              <g className="lc-glass">{ROCKET_GLASS}</g>
              <g className="lc-pixel">{ROCKET_PIXEL}</g>
            </g>
          </g>
          <circle className="lc-burst" cx={typeof window !== "undefined" ? innerWidth / 2 : 720} cy="8" r="26" fill="none" stroke="#ffb36b" strokeWidth="2" />
          <foreignObject x={(typeof window !== "undefined" ? innerWidth / 2 : 720) - 140} y="26" width="280" height="44">
            <div className="lc-chip mx-auto w-fit rounded-full border border-ember-500/60 bg-ink-950/90 px-4 py-2 text-center text-[13px] text-paper shadow-[0_0_30px_rgba(255,106,31,.4)] [:root[data-mode=pixel]_&]:rounded-none">
              Opening <span className="font-semibold">{flight.label}</span> ↗
            </div>
          </foreignObject>
        </svg>
      ) : null}
      {blocked ? (
        <div role="status" className="glass fixed left-1/2 top-20 z-[96] -translate-x-1/2 px-4 py-3 text-[14px]" style={{ background: "rgba(14,14,18,.94)" }}>
          Your browser held the new tab.{" "}
          <a href={blocked.href} target="_blank" rel="noreferrer" className="font-semibold text-ember-300 underline underline-offset-4" onClick={() => setBlocked(null)}>
            Open {blocked.label} ↗
          </a>
        </div>
      ) : null}
    </>
  );
}
