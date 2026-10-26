"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";

/**
 * Page transition: a panel grows out of the clicked card to fill the screen, the route changes
 * underneath it, and the panel lifts away to reveal the case study. Lives in the root layout so
 * it survives client-side navigation. Reduced motion: plain navigation.
 */
export type WipeDetail = { href: string; rect?: DOMRect; color?: string; label?: string };

export function wipeTo(detail: WipeDetail) {
  dispatchEvent(new CustomEvent<WipeDetail>("page-wipe", { detail }));
}

export default function Transition() {
  const panel = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const router = useRouter();
  const path = usePathname();
  const busy = useRef(false);

  useEffect(() => {
    const onWipe = (e: Event) => {
      const { href, rect, color = "#ff6a1f", label: text = "" } = (e as CustomEvent<WipeDetail>).detail;
      const el = panel.current;
      if (!el || busy.current || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }
      busy.current = true;
      if (label.current) label.current.textContent = text;
      const r = rect ?? new DOMRect(innerWidth / 2 - 40, innerHeight / 2 - 40, 80, 80);
      gsap.killTweensOf(el);
      gsap.set(el, { display: "grid", background: color, clipPath: `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 20px)` });
      gsap.set(label.current, { opacity: 0, y: 20 });
      gsap
        .timeline()
        .to(el, { clipPath: "inset(0px 0px 0px 0px round 0px)", duration: 0.75, ease: "expo.inOut" })
        .to(label.current, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, "-=0.25")
        .add(() => {
          window.scrollTo(0, 0);
          router.push(href);
        });
    };
    addEventListener("page-wipe", onWipe);
    return () => removeEventListener("page-wipe", onWipe);
  }, [router]);

  // When the new route has rendered, lift the panel away.
  useEffect(() => {
    const el = panel.current;
    if (!el || !busy.current) return;
    const t = setTimeout(() => {
      gsap
        .timeline({ onComplete: () => { gsap.set(el, { display: "none" }); busy.current = false; } })
        .to(label.current, { opacity: 0, y: -20, duration: 0.25 })
        .to(el, { clipPath: "inset(0px 0px 100% 0px round 0px)", duration: 0.8, ease: "expo.inOut" }, "-=0.05");
    }, 120);
    return () => clearTimeout(t);
  }, [path]);

  return (
    <div ref={panel} aria-hidden className="pointer-events-none fixed inset-0 z-[90] hidden place-items-center">
      <p ref={label} className="display text-[clamp(48px,9vw,150px)] font-semibold tracking-[-0.06em] text-ink-950" />
    </div>
  );
}
