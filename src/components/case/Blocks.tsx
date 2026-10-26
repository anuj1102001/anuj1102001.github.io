"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ArchLane, Compare, FlowStep } from "@/content/depth";

gsap.registerPlugin(useGSAP);

const img = (base: string, w = 1600) => (base.endsWith(".webp") ? base : `${base}-${w}.webp`);

/* ---------------------------------------------------------------- user flow */

/** Sticky storytelling: on desktop the section pins and scrolling walks through the steps. */
export function FlowStory({ title, steps }: { title: string; steps: FlowStep[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: `+=${steps.length * 55}%`,
            pin: true,
            scrub: true,
            onUpdate: (st) => setI(Math.min(steps.length - 1, Math.floor(st.progress * steps.length * 0.999))),
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  const withImg = steps.map((s, k) => ({ ...s, k })).filter((s) => s.img);
  const shown = steps[i].img ? steps[i] : withImg.filter((s) => s.k <= i).at(-1) ?? withImg[0];
  return (
    <div ref={root} className="md:flex md:min-h-[100svh] md:items-center">
      <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-5 py-10 sm:px-8 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
        <div>
          <h3 className="display text-[clamp(26px,2.8vw,40px)] font-semibold leading-[1] tracking-[-0.035em]">{title}</h3>
          <ol className="mt-8 space-y-1">
            {steps.map((s, k) => (
              <li key={s.t}>
                <button onClick={() => setI(k)} className={`group grid w-full grid-cols-[2rem_1fr] gap-3 border-l-2 py-3 pl-4 text-left transition-colors ${k === i ? "border-ember-500" : "border-[var(--line)] hover:border-ink-500"}`}>
                  <span className={`mono text-[11px] ${k === i ? "text-ember-300" : "text-ink-500"}`}>{String(k + 1).padStart(2, "0")}</span>
                  <span>
                    <span className={`block text-[17px] font-medium transition-colors ${k === i ? "text-paper" : "text-ink-400"}`}>{s.t}</span>
                    <span className={`grid transition-all duration-500 ${k === i ? "mt-1 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <span className="overflow-hidden text-[14px] leading-relaxed text-ink-300">{s.d}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="glass relative aspect-[16/10] overflow-hidden p-2">
          {withImg.map((s) => (
            <img
              key={s.t}
              src={img(s.img!)}
              alt={s.t}
              loading="lazy"
              className={`absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] object-cover object-top transition-all duration-700 ease-[var(--ease-out-expo)] ${shown?.t === s.t ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[1.02] opacity-0"}`}
              style={{ borderRadius: "calc(var(--radius) - 8px)" }}
            />
          ))}
          <div className="mono absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-paper backdrop-blur [:root[data-mode=pixel]_&]:rounded-none">
            Step {i + 1} / {steps.length}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- architecture */

/** Lanes of steps with data moving through them; point at a step to read what it does. */
export function ArchDiagram({ title, lanes, principles }: { title: string; lanes: ArchLane[]; principles: string[] }) {
  const [sel, setSel] = useState<{ l: number; n: number }>({ l: 0, n: 0 });
  const node = lanes[sel.l].nodes[sel.n];
  return (
    <div>
      <h3 className="display text-[clamp(24px,2.4vw,34px)] font-semibold tracking-[-0.03em]">{title}</h3>
      <div className="mt-8 space-y-6">
        {lanes.map((lane, l) => (
          <div key={lane.name} className="glass relative overflow-hidden p-4 sm:p-5">
            <p className="mono mb-4 text-[10px] uppercase tracking-[0.18em] text-ink-500">{lane.name}</p>
            <div className="relative flex flex-wrap items-stretch gap-2 md:flex-nowrap">
              {/* the packet travelling along the lane */}
              <span aria-hidden className="pointer-events-none absolute left-0 top-1/2 hidden h-px w-full -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,106,31,.5),transparent)] md:block" />
              <span aria-hidden className="pointer-events-none absolute top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-ember-400 shadow-[0_0_14px_#ff6a1f] md:block [:root[data-mode=pixel]_&]:rounded-none" style={{ animation: `packet ${3 + lane.nodes.length * 0.6}s linear infinite`, animationDelay: `${l * 0.8}s` }} />
              {lane.nodes.map((n, k) => (
                <button
                  key={n.t}
                  onMouseEnter={() => setSel({ l, n: k })}
                  onFocus={() => setSel({ l, n: k })}
                  onClick={() => setSel({ l, n: k })}
                  className={`relative z-10 min-w-[120px] flex-1 border px-3 py-3 text-left text-[13px] transition-all duration-300 ${sel.l === l && sel.n === k ? "-translate-y-1 border-ember-500 bg-ember-500/10 text-paper" : "border-[var(--line)] bg-ink-900/80 text-ink-300 hover:text-paper"}`}
                  style={{ borderRadius: "var(--radius-sm)" }}
                >
                  <span className="mono block text-[10px] text-ink-500">{String(k + 1).padStart(2, "0")}</span>
                  <span className="mt-1 block font-medium leading-snug">{n.t}</span>
                  {n.ai ? <span className="mono mt-2 inline-block rounded-full bg-ember-500 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-950 [:root[data-mode=pixel]_&]:rounded-none">AI</span> : null}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="glass mt-4 p-5" aria-live="polite">
        <p className="mono text-[10px] uppercase tracking-[0.18em] text-ember-300">
          {lanes[sel.l].name} · step {sel.n + 1}
        </p>
        <p className="mt-2 text-[17px] font-medium text-paper">{node.t}</p>
        <p className="mt-1 text-[15px] leading-relaxed text-ink-300">{node.d}</p>
      </div>
      <ul className="mt-6 flex flex-wrap gap-2">
        {principles.map((p) => (
          <li key={p} className="mono rounded-full border border-[var(--line)] px-3 py-1.5 text-[11px] text-ink-300 [:root[data-mode=pixel]_&]:rounded-none">
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- before / after */

function Bars({ c }: { c: Extract<Compare, { kind: "metrics" }> }) {
  const root = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState<"a" | "b">("b");
  useGSAP(
    () => {
      gsap.from(root.current!.querySelectorAll(".bar-fill"), { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: root.current, start: "top 80%" } });
    },
    { scope: root },
  );
  return (
    <div ref={root} className="glass p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[17px] font-medium">{c.title}</h3>
        <div className="glass flex p-0.5" style={{ borderRadius: "var(--pill)" }} role="radiogroup" aria-label="Show">
          {(["a", "b"] as const).map((k) => (
            <button key={k} role="radio" aria-checked={on === k} onClick={() => setOn(k)} className={`mono rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em] [:root[data-mode=pixel]_&]:rounded-none ${on === k ? "bg-paper text-ink-950" : "text-ink-300"}`}>
              {k === "a" ? c.before : c.after}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {c.rows.map((r) => {
          const v = on === "a" ? r.a : r.b;
          return (
            <div key={r.label}>
              <div className="flex items-baseline justify-between text-[14px]">
                <span className="text-ink-300">{r.label}</span>
                <span className="mono text-paper">
                  {v.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")}
                  <span className="ml-2 text-ink-500">{on === "b" ? `from ${r.a}` : `to ${r.b}`}</span>
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden bg-white/[0.06]" style={{ borderRadius: "var(--pill)" }}>
                <div className="bar-fill h-full transition-[width] duration-700 ease-[var(--ease-out-expo)]" style={{ width: `${v * 100}%`, background: on === "b" ? "linear-gradient(90deg,#e4520c,#ffb36b)" : "#6b6b76", borderRadius: "var(--pill)" }} />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-[13px] leading-relaxed text-ink-500">{c.note}</p>
    </div>
  );
}

function Slider({ c }: { c: Extract<Compare, { kind: "slider" }> }) {
  const [x, setX] = useState(50);
  return (
    <div className="glass p-3 sm:p-4">
      <h3 className="px-1 pb-3 text-[17px] font-medium">{c.title}</h3>
      <div className="relative mx-auto aspect-[4/5] max-w-[620px] select-none overflow-hidden" style={{ borderRadius: "var(--radius-sm)" }}>
        <img src={c.after.img} alt={c.after.label} className="absolute inset-0 h-full w-full object-cover" loading="lazy" draggable={false} />
        <img src={c.before.img} alt={c.before.label} className="absolute inset-0 h-full w-full object-cover" loading="lazy" draggable={false} style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }} />
        <div className="pointer-events-none absolute inset-y-0 w-px bg-paper" style={{ left: `${x}%` }}>
          <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper text-[13px] font-semibold text-ink-950 shadow-lg [:root[data-mode=pixel]_&]:rounded-none">↔</span>
        </div>
        <span className="mono absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-paper [:root[data-mode=pixel]_&]:rounded-none">{c.before.label}</span>
        <span className="mono absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-paper [:root[data-mode=pixel]_&]:rounded-none">{c.after.label}</span>
        <input type="range" min={0} max={100} value={x} onChange={(e) => setX(+e.target.value)} aria-label="Compare before and after" className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
      </div>
      <p className="px-1 pt-3 text-[13px] leading-relaxed text-ink-500">{c.note}</p>
    </div>
  );
}

function Rows({ c }: { c: Extract<Compare, { kind: "list" }> }) {
  return (
    <div className="glass overflow-hidden">
      <h3 className="px-5 pt-5 text-[17px] font-medium sm:px-6">{c.title}</h3>
      <div className="mono mt-4 grid grid-cols-2 border-b border-[var(--line)] px-5 pb-2 text-[10px] uppercase tracking-[0.16em] sm:px-6">
        <span className="text-ink-500">{c.before}</span>
        <span className="text-ember-300">{c.after}</span>
      </div>
      {c.rows.map((r) => (
        <div key={r.a} className="grid grid-cols-2 gap-4 border-b border-[var(--line)] px-5 py-3.5 text-[14px] last:border-0 sm:px-6">
          <span className="text-ink-500 line-through decoration-ink-500/50">{r.a}</span>
          <span className="text-paper">{r.b}</span>
        </div>
      ))}
    </div>
  );
}

export function CompareBlock({ c }: { c: Compare }) {
  if (c.kind === "metrics") return <Bars c={c} />;
  if (c.kind === "slider") return <Slider c={c} />;
  return <Rows c={c} />;
}

/* ---------------------------------------------------------------- live prototype */

/** A live site in a browser frame, loaded only when asked (it is heavy and third-party). */
export function LiveEmbed({ src, title, note, poster, ratio = "16/10" }: { src: string; title: string; note: string; poster?: string; ratio?: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="glass overflow-hidden p-2">
      <div className="flex items-center gap-2 px-2 pb-2 pt-1">
        <span className="flex gap-1.5" aria-hidden>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} className="h-2.5 w-2.5 rounded-full [:root[data-mode=pixel]_&]:rounded-none" style={{ background: c }} />
          ))}
        </span>
        <span className="mono ml-2 truncate rounded-full bg-white/[0.06] px-3 py-1 text-[11px] text-ink-300 [:root[data-mode=pixel]_&]:rounded-none">{src.replace("https://", "")}</span>
        <a href={src} target="_blank" rel="noreferrer" className="mono ml-auto text-[11px] text-ink-400 hover:text-paper">
          Open ↗
        </a>
      </div>
      <div className="relative overflow-hidden bg-ink-900" style={{ aspectRatio: ratio, borderRadius: "calc(var(--radius) - 8px)" }}>
        {on ? (
          <iframe src={src} title={title} className="absolute inset-0 h-full w-full" loading="lazy" allow="fullscreen" />
        ) : (
          <button onClick={() => setOn(true)} className="group absolute inset-0 grid place-items-center">
            {poster ? <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover object-top opacity-40 transition-opacity group-hover:opacity-55" loading="lazy" /> : null}
            <span className="relative flex flex-col items-center gap-3">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-paper text-[20px] text-ink-950 shadow-[0_0_60px_rgba(255,106,31,.5)] transition-transform group-hover:scale-110 [:root[data-mode=pixel]_&]:rounded-none">▶</span>
              <span className="text-[15px] font-medium text-paper">Load the live prototype</span>
              <span className="max-w-[360px] text-center text-[13px] text-ink-300">{note}</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export function Walkthrough({ src, poster, title }: { src: string; poster?: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => () => ref.current?.pause(), []);
  return (
    <figure className="glass overflow-hidden p-2">
      <video ref={ref} src={src} poster={poster} controls preload="none" playsInline className="aspect-video w-full bg-ink-900 object-cover" style={{ borderRadius: "calc(var(--radius) - 8px)" }} />
      <figcaption className="px-2 pb-1 pt-3 text-[13px] text-ink-300">{title}</figcaption>
    </figure>
  );
}
