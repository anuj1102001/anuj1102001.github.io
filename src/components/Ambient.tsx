"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The page's ambient light: soft colour fields behind everything, so the background is never a
 * flat black. Each section can set data-tint="#c1,#c2,#c3"; as it scrolls into view the light
 * crossfades to its colours. Two layers swap (A/B) so the change is a fade, not a jump. Only
 * opacity and transform animate; the fields are plain radial gradients (no CSS blur).
 */
const DEFAULT = ["#ff6a1f", "#7a2e12", "#e9b949"];

export default function Ambient() {
  const root = useRef<HTMLDivElement>(null);
  const layers = useRef<HTMLDivElement[]>([]);
  const front = useRef(0);
  const current = useRef(DEFAULT.join(","));
  const path = usePathname();

  useEffect(() => {
    const paint = (el: HTMLDivElement, c: string[]) => c.forEach((col, i) => el.style.setProperty(`--c${i + 1}`, col));
    paint(layers.current[0], DEFAULT);
    paint(layers.current[1], DEFAULT);
  }, []);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const setTint = (tint: string) => {
      if (tint === current.current) return;
      current.current = tint;
      const cols = tint.split(",").map((s) => s.trim());
      const a = layers.current[front.current];
      const b = layers.current[1 - front.current];
      cols.forEach((col, i) => b.style.setProperty(`--c${i + 1}`, col));
      gsap.to(b, { opacity: 1, duration: reduce ? 0 : 1.4, ease: "power2.inOut" });
      gsap.to(a, { opacity: 0, duration: reduce ? 0 : 1.4, ease: "power2.inOut" });
      front.current = 1 - front.current;
    };
    let triggers: ScrollTrigger[] = [];
    const id = setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-tint]"));
      setTint(els[0]?.dataset.tint ?? DEFAULT.join(","));
      triggers = els.map((el) =>
        ScrollTrigger.create({ trigger: el, start: "top 60%", end: "bottom 40%", onToggle: (st) => st.isActive && setTint(el.dataset.tint!) }),
      );
      // The light drifts up slowly as you read down the page.
      if (!reduce && root.current)
        triggers.push(
          ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: (st) => gsap.set(root.current, { y: `${-st.progress * 14}vh` }),
          }),
        );
    }, 200);
    return () => {
      clearTimeout(id);
      triggers.forEach((t) => t.kill());
    };
  }, [path]);

  return (
    <div ref={root} aria-hidden className="ambient pointer-events-none fixed inset-x-0 -top-[10vh] -z-10 h-[130vh] overflow-hidden">
      {[0, 1].map((k) => (
        <div
          key={k}
          ref={(el) => {
            if (el) layers.current[k] = el;
          }}
          className="absolute inset-0"
          style={{ opacity: k === 0 ? 1 : 0 }}
        >
          <div className="ambient-blob ambient-a" />
          <div className="ambient-blob ambient-b" />
          <div className="ambient-blob ambient-c" />
        </div>
      ))}
      {/* A soft lift from the top edge and a faint grid, so even dark sections have depth */}
      <div className="absolute inset-0 [background:linear-gradient(180deg,rgba(255,255,255,.035),transparent_30%,transparent_70%,rgba(255,255,255,.02))]" />
      <div className="dot-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_50%_40%,black_20%,transparent_75%)]" />
    </div>
  );
}
