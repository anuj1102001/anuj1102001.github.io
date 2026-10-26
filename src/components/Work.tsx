"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { PROJECTS, srcset } from "@/lib/projects";

/**
 * Selected work: an index on the left; the screen on the right swaps to whichever project
 * you point at (or scroll to on phones).
 */
export default function Work() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const p = PROJECTS[active];

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.from(q(".w-row"), { opacity: 0, y: 40, stagger: 0.06, duration: 1, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%" } });
    },
    { scope: root },
  );

  return (
    <section id="work" ref={root} className="relative px-5 py-24 sm:px-8 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <p className="mono text-[11px] uppercase tracking-[0.2em] text-ember-300">Selected work</p>
          <h2 className="display mt-3 text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.95] tracking-[-0.045em]">
            Products that show
            <br />
            their working.
          </h2>
          <ol className="mt-10 border-t border-[var(--line)]">
            {PROJECTS.map((x, i) => (
              <li key={x.slug} id={`work-${x.slug}`} className="w-row border-b border-[var(--line)]">
                <a
                  href={x.live}
                  target="_blank"
                  rel="noreferrer"
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group grid grid-cols-[2.2rem_1fr_auto] items-baseline gap-3 py-5"
                >
                  <span className="mono text-[11px] text-ink-500">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className={`display block text-[clamp(22px,2.4vw,34px)] font-semibold tracking-[-0.03em] transition-colors ${active === i ? "text-paper" : "text-ink-400 group-hover:text-paper"}`}>
                      {x.name}
                      {x.lab ? <span className="mono ml-3 align-middle text-[10px] uppercase tracking-[0.16em] text-ink-500">Lab</span> : null}
                    </span>
                    <span className="mt-1 block text-[14px] text-ink-500">{x.kind}</span>
                  </span>
                  <span className="mono text-[11px] text-ink-500 transition-transform group-hover:translate-x-1">↗</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:sticky lg:top-24 lg:h-[calc(100svh-8rem)]">
          <div className="glass relative h-full min-h-[360px] overflow-hidden p-2.5">
            {PROJECTS.map((x, i) => (
              <img
                key={x.slug}
                src={`${x.cover}-1600.webp`}
                srcSet={srcset(x.cover)}
                sizes="(min-width: 1024px) 55vw, 100vw"
                alt={`${x.name}: ${x.kind}`}
                loading="lazy"
                className={`absolute inset-2.5 h-[calc(100%-1.25rem)] w-[calc(100%-1.25rem)] object-cover object-top transition-all duration-700 ease-[var(--ease-out-expo)] ${i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"}`}
                style={{ borderRadius: "calc(var(--radius) - 8px)" }}
              />
            ))}
            <div className="glass absolute inset-x-5 bottom-5 p-4 sm:p-5">
              <p className="mono text-[10px] uppercase tracking-[0.18em]" style={{ color: p.accent }}>
                {p.role}
              </p>
              <p className="mt-2 text-[15px] leading-snug text-paper">{p.line}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
