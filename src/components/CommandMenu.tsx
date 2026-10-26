"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PROJECTS } from "@/lib/projects";
import { useMode } from "./Mode";

type Item = { label: string; hint: string; run: () => void };

/** ⌘K / Ctrl K: jump to any project or section, switch mode, copy the email, get the résumé. */
export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toggle, mode } = useMode();

  const items: Item[] = useMemo(() => {
    const go = (href: string) => () => router.push(href);
    return [
      ...PROJECTS.map((p) => ({ label: p.name, hint: `Case study · ${p.kind}`, run: go(`/work/${p.slug}/`) })),
      { label: "Work", hint: "Section", run: go("/#work") },
      { label: "Approach", hint: "Section", run: go("/#approach") },
      { label: "About", hint: "Section", run: go("/#about") },
      { label: "Contact", hint: "Section", run: go("/#contact") },
      { label: mode === "pixel" ? "Switch to Glass" : "Switch to Pixel", hint: "Display mode", run: toggle },
      { label: "Copy email", hint: "anujleo46@gmail.com", run: () => navigator.clipboard?.writeText("anujleo46@gmail.com") },
      { label: "Download résumé", hint: "PDF", run: () => window.open("/Anuj_M_Resume.pdf", "_blank") },
      { label: "LinkedIn", hint: "External", run: () => window.open("https://www.linkedin.com/in/anuj-m-622504221", "_blank") },
      { label: "GitHub", hint: "External", run: () => window.open("https://github.com/anuj1102001", "_blank") },
    ];
  }, [router, toggle, mode]);

  const list = items.filter((i) => (i.label + " " + i.hint).toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    addEventListener("keydown", onKey);
    addEventListener("open-command-menu", onOpen);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("open-command-menu", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 20);
  }, [open]);

  const run = (i: Item) => {
    setOpen(false);
    setQ("");
    setSel(0);
    i.run();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[14vh]" role="dialog" aria-modal="true" aria-label="Command menu">
      <button className="absolute inset-0 bg-black/55 backdrop-blur-[3px]" aria-label="Close" onClick={() => setOpen(false)} tabIndex={-1} />
      <div className="glass relative w-full max-w-[560px] overflow-hidden" style={{ background: "rgba(16,16,20,.94)" }}>
        <input
          ref={input}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSel(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSel((s) => Math.min(list.length - 1, s + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSel((s) => Math.max(0, s - 1));
            } else if (e.key === "Enter" && list[sel]) run(list[sel]);
          }}
          placeholder="Jump to a project, a section, or an action…"
          aria-label="Search"
          className="w-full border-b border-[var(--line)] bg-transparent px-5 py-4 text-[16px] text-paper outline-none placeholder:text-ink-500"
        />
        <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
          {list.map((i, k) => (
            <li key={i.label} role="option" aria-selected={k === sel}>
              <button onMouseEnter={() => setSel(k)} onClick={() => run(i)} className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-left text-[14px] [:root[data-mode=pixel]_&]:rounded-none ${k === sel ? "bg-white/[0.08] text-paper" : "text-ink-300"}`}>
                {i.label}
                <span className="mono text-[10px] uppercase tracking-[0.14em] text-ink-500">{i.hint}</span>
              </button>
            </li>
          ))}
          {!list.length ? <li className="px-3 py-6 text-center text-[14px] text-ink-500">Nothing matches “{q}”.</li> : null}
        </ul>
        <p className="mono flex justify-between border-t border-[var(--line)] px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] text-ink-500">
          <span>↑↓ to move · Enter to open</span>
          <span>Esc to close</span>
        </p>
      </div>
    </div>
  );
}
