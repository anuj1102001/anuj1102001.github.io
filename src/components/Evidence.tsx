"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Source } from "@/content/cases";

/**
 * "Every claim has a source": a numbered chip after a claim opens its evidence (a screen from
 * the product, the quoted line, a link to where it is documented) in a side panel.
 */
type Open = { n: number; source: Source } | null;
const Ctx = createContext<{ open: (n: number, s: Source) => void }>({ open: () => {} });

export function EvidenceProvider({ children }: { children: React.ReactNode }) {
  const [cur, setCur] = useState<Open>(null);
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = useCallback((n: number, source: Source) => {
    opener.current = document.activeElement as HTMLElement;
    setCur({ n, source });
  }, []);
  const close = useCallback(() => {
    setCur(null);
    opener.current?.focus();
  }, []);
  useEffect(() => {
    if (!cur) return;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [cur, close]);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <div className={`fixed inset-0 z-[70] transition-opacity duration-300 ${cur ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={!cur}>
        <button className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" aria-label="Close evidence" tabIndex={-1} onClick={close} />
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Evidence"
          tabIndex={-1}
          className={`glass absolute bottom-3 right-3 top-3 flex w-[min(520px,calc(100vw-1.5rem))] flex-col overflow-y-auto p-5 outline-none transition-transform duration-500 ease-[var(--ease-out-expo)] sm:p-6 ${cur ? "translate-x-0" : "translate-x-[110%]"}`}
          style={{ background: "rgba(14,14,18,.94)" }}
        >
          {cur ? (
            <>
              <div className="flex items-center justify-between">
                <p className="mono text-[11px] uppercase tracking-[0.18em] text-ember-300">Source [{cur.n}]</p>
                <button onClick={close} className="mono rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-ink-300 hover:bg-white/10 hover:text-paper">
                  Close · Esc
                </button>
              </div>
              <p className="display mt-3 text-[22px] font-semibold tracking-[-0.02em]">{cur.source.label}</p>
              {cur.source.img ? (
                <img src={`${cur.source.img}-1600.webp`} alt={cur.source.label} className="mt-4 w-full border border-[var(--line)] object-cover object-top" style={{ borderRadius: "var(--radius-sm)" }} />
              ) : null}
              {cur.source.quote ? (
                <blockquote className="mt-4 border-l-2 border-ember-500 pl-4 font-serif text-[19px] italic leading-snug text-paper [:root[data-mode=pixel]_&]:font-pixel [:root[data-mode=pixel]_&]:text-[15px] [:root[data-mode=pixel]_&]:not-italic">
                  “{cur.source.quote}”
                </blockquote>
              ) : null}
              {cur.source.href ? (
                <a href={cur.source.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-paper px-4 py-2 text-[13px] font-semibold text-ink-950 hover:bg-ember-300">
                  Open where it&apos;s documented ↗
                </a>
              ) : null}
              <p className="mt-auto pt-6 text-[12px] leading-relaxed text-ink-500">Every number and strong claim on this site links to its evidence, the same way the products do.</p>
            </>
          ) : null}
        </div>
      </div>
    </Ctx.Provider>
  );
}

/** The chip placed after a claim. */
export function Cite({ n, source }: { n: number; source: Source }) {
  const { open } = useContext(Ctx);
  return (
    <button
      type="button"
      onClick={() => open(n, source)}
      aria-label={`Source ${n}: ${source.label}`}
      className="mono relative -top-[0.35em] mx-0.5 inline-flex h-[1.5em] min-w-[1.5em] items-center justify-center rounded-full border border-ember-500/60 bg-ember-500/10 px-1 align-baseline text-[min(0.62em,13px)] font-semibold text-ember-300 transition hover:bg-ember-500 hover:text-ink-950 [:root[data-mode=pixel]_&]:rounded-none"
    >
      {n}
    </button>
  );
}
