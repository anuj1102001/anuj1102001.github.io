"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { Case } from "@/content/cases";
import { Cite, EvidenceProvider } from "./Evidence";
import { wipeTo } from "@/lib/wipe";
import { PROJECTS } from "@/lib/projects";
import { DEPTH } from "@/content/depth";
import { ArchDiagram, CompareBlock, Evolution, FlowStory, LiveEmbed, Walkthrough } from "./case/Blocks";

gsap.registerPlugin(useGSAP);

function Chapter({ n, title, children, id }: { n: string; title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="cs-chapter scroll-mt-16 mx-auto grid max-w-[1400px] gap-6 px-5 py-16 sm:px-8 md:grid-cols-[220px_1fr] md:gap-12 md:py-24">
      <div className="md:sticky md:top-28 md:self-start">
        <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink-500">{n}</p>
        <h2 className="display mt-2 text-[22px] font-semibold tracking-[-0.02em]">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

export default function CaseStudy({ c, next }: { c: Case; next: { slug: string; title: string; tagline: string } }) {
  const root = useRef<HTMLDivElement>(null);
  let cite = 0;
  const nextCite = () => ++cite;
  let ch = 0;
  const nc = () => String(++ch).padStart(2, "0");
  const d = DEPTH[c.slug];

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.from(q(".cs-in"), { y: 40, opacity: 0, duration: 1.2, stagger: 0.07, ease: "expo.out" });
      if (reduce) return;
      gsap.from(q(".cs-cover"), { y: 120, rotateX: 18, opacity: 0, duration: 1.6, ease: "expo.out", delay: 0.2 });
      q(".cs-reveal").forEach((el) => gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%" } }));

      // The gallery scrolls sideways while the page is pinned (desktop).
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        const track = q(".cs-track")[0] as HTMLElement | undefined;
        const wrap = q(".cs-gallery")[0] as HTMLElement | undefined;
        if (!track || !wrap) return;
        const dist = () => Math.max(0, track.scrollWidth - innerWidth + 64);
        gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: wrap, start: "top top", end: () => `+=${dist()}`, scrub: 0.6, pin: true, invalidateOnRefresh: true } });
      });

      // The cover leans toward the cursor.
      const cover = q(".cs-cover")[0] as HTMLElement | undefined;
      const onMove = (e: PointerEvent) => {
        if (!cover) return;
        const nx = e.clientX / innerWidth - 0.5;
        const ny = e.clientY / innerHeight - 0.5;
        gsap.to(cover, { rotateY: nx * 8, rotateX: -ny * 6, duration: 1, ease: "power3.out" });
      };
      addEventListener("pointermove", onMove);
      return () => {
        removeEventListener("pointermove", onMove);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <EvidenceProvider>
      <div ref={root} data-tint={`${PROJECTS.find((x) => x.slug === c.slug)?.accent ?? "#ff6a1f"},#ff6a1f,${PROJECTS.find((x) => x.slug === c.slug)?.accent ?? "#e9b949"}`}>
        {/* Hero */}
        <header className="relative overflow-hidden px-5 pb-10 pt-32 sm:px-8 md:pt-40">
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[80vmin] w-[120vmin] -translate-x-1/2 rounded-full opacity-40 [background:radial-gradient(circle,#ff6a1f,transparent_65%)]" />
          <div className="relative mx-auto max-w-[1400px]">
            <Link href="/#work" className="cs-in mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-400 hover:text-paper">
              ← All work
            </Link>
            <p className="cs-in mono mt-8 text-[11px] uppercase tracking-[0.2em] text-ember-300">{c.meta.type}</p>
            <h1 className="cs-in display mt-3 text-[clamp(56px,11vw,180px)] font-semibold leading-[0.85] tracking-[-0.06em]">{c.title}</h1>
            <p className="cs-in mt-5 font-serif text-[clamp(26px,3vw,44px)] italic leading-tight text-ember-300 [:root[data-mode=pixel]_&]:font-pixel [:root[data-mode=pixel]_&]:not-italic">{c.tagline}</p>
            <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
              <p className="cs-in max-w-[620px] text-[18px] leading-relaxed text-ink-300">{c.intro}</p>
              <dl className="cs-in grid grid-cols-2 gap-x-6 gap-y-5 text-[14px]">
                {(
                  [
                    ["Role", c.meta.role],
                    ["Status", c.meta.status],
                    ["Stack", c.meta.stack],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className={k === "Role" ? "col-span-2" : ""}>
                    <dt className="mono text-[10px] uppercase tracking-[0.18em] text-ink-500">{k}</dt>
                    <dd className="mt-1 text-paper">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="cs-in mt-8 flex flex-wrap gap-2">
              {c.links.map((l, i) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" data-launch={/^(Live|Launch)/.test(l.label) ? c.title : "true"} className={i === 0 ? "rounded-full bg-paper px-5 py-2.5 text-[14px] font-semibold text-ink-950 hover:bg-ember-300 [:root[data-mode=pixel]_&]:rounded-none [:root[data-mode=pixel]_&]:shadow-[4px_4px_0_#ff6a1f]" : "glass px-5 py-2.5 text-[14px]"} style={i === 0 ? undefined : { borderRadius: "var(--pill)" }}>
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
          {/* The 90-second version */}
          <div className="cs-in relative mx-auto mt-10 max-w-[1400px]">
            <div className="glass grid gap-px overflow-hidden md:grid-cols-3" style={{ background: "linear-gradient(160deg, rgba(255,106,31,.10), rgba(255,255,255,.035) 45%)" }}>
              {(
                [
                  ["The problem", c.tldr.problem],
                  ["My role", c.tldr.role],
                  ["Outcome", c.tldr.outcome],
                ] as const
              ).map(([k, v], i) => (
                <div key={k} className={`p-5 sm:p-6 ${i ? "border-t border-[var(--line)] md:border-l md:border-t-0" : ""}`}>
                  <p className="mono flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ember-300">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-ember-500/15 text-[10px] text-ember-300 [:root[data-mode=pixel]_&]:rounded-none">{i + 1}</span>
                    {k}
                  </p>
                  <p className="mt-3 text-[16px] leading-relaxed text-paper">{v}</p>
                </div>
              ))}
            </div>
            <nav aria-label="Jump to" className="mt-3 flex flex-wrap items-center gap-2">
              <span className="mono mr-1 text-[10px] uppercase tracking-[0.16em] text-ink-500">Jump to</span>
              {(
                [
                  ["How it evolved", "#evolution", !!d?.evolution],
                  ["User flow", "#flow", !!d?.flow],
                  ["Architecture", "#architecture", !!d?.arch],
                  ["Before & after", "#before-after", !!d?.compare],
                  ["Try it", "#try", !!(d?.embed || d?.video)],
                  ["Outcomes", "#outcomes", !!c.metrics],
                ] as const
              )
                .filter(([, , on]) => on)
                .map(([l, h]) => (
                  <a key={h} href={h} className="mono rounded-full border border-[var(--line)] px-3 py-1.5 text-[11px] text-ink-300 transition-colors hover:border-ember-500 hover:text-paper [:root[data-mode=pixel]_&]:rounded-none">
                    {l} ↓
                  </a>
                ))}
            </nav>
          </div>
          <div className="relative mx-auto mt-12 max-w-[1400px] [perspective:1400px]">
            <div className="cs-cover glass overflow-hidden p-2 [transform-style:preserve-3d] sm:p-3">
              <img src={`${c.shots[0].img}-1600.webp`} srcSet={`${c.shots[0].img}-800.webp 800w, ${c.shots[0].img}-1600.webp 1600w`} sizes="(min-width: 1400px) 1400px, 100vw" alt={c.shots[0].caption} className="w-full object-cover object-top" style={{ borderRadius: "calc(var(--radius) - 8px)" }} fetchPriority="high" />
            </div>
          </div>
        </header>

        <Chapter n={nc()} title="The problem">
          <div className="max-w-[760px] space-y-5 text-[clamp(20px,2vw,28px)] leading-snug tracking-[-0.01em]">
            {c.problem.map((p, i) => (
              <p key={i} className="cs-reveal">
                {p.text}
                {p.source ? <Cite n={nextCite()} source={p.source} /> : null}
              </p>
            ))}
          </div>
          <div className="cs-reveal glass mt-10 max-w-[760px] p-6">
            <p className="mono text-[10px] uppercase tracking-[0.18em] text-ink-500">Who it&apos;s for</p>
            <p className="mt-2 text-[16px] leading-relaxed text-ink-300">{c.users}</p>
          </div>
        </Chapter>

        {d?.research ? (
          <Chapter n={nc()} title="Research">
            <div className="cs-reveal glass max-w-[760px] border-l-2 !border-l-ember-500 p-6">
              <p className="mono text-[10px] uppercase tracking-[0.18em] text-ember-300">Status, honestly</p>
              <p className="mt-2 text-[17px] leading-relaxed text-paper">{d.research.status}</p>
            </div>
            {d.research.items.length ? (
              <ul className="mt-6 max-w-[760px] space-y-3">
                {d.research.items.map((x) => (
                  <li key={x} className="cs-reveal flex gap-3 text-[16px] leading-relaxed text-ink-300">
                    <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-ember-400" />
                    {x}
                  </li>
                ))}
              </ul>
            ) : null}
          </Chapter>
        ) : null}

        {d?.flow ? (
          <section id="flow" aria-label="User flow" className="scroll-mt-20 border-y border-[var(--line)] bg-ink-900/40">
            <p className="mono mx-auto max-w-[1400px] px-5 pt-14 text-[11px] uppercase tracking-[0.2em] text-ink-500 sm:px-8 md:pt-0">{nc()} · User flow</p>
            <FlowStory title={d.flow.title} steps={d.flow.steps} />
          </section>
        ) : null}

        <Chapter n={nc()} title="Key decisions">
          <div className="grid gap-4 md:grid-cols-2">
            {c.decisions.map((d, i) => (
              <article key={d.title} className="cs-reveal glass flex flex-col p-6">
                <p className="mono text-[11px] text-ink-500">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="display mt-3 text-[22px] font-semibold tracking-[-0.02em]">
                  {d.title}
                  {d.source ? <Cite n={nextCite()} source={d.source} /> : null}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-300">{d.body}</p>
                {d.cut ? <p className="mono mt-4 w-fit rounded-full border border-[var(--line)] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-ember-300 line-through decoration-ember-500/70 [:root[data-mode=pixel]_&]:rounded-none">{d.cut}</p> : null}
              </article>
            ))}
          </div>
        </Chapter>

        {d?.evolution ? (
          <Chapter id="evolution" n={nc()} title="How it evolved">
            <Evolution title={d.evolution.title} note={d.evolution.note} stages={d.evolution.stages} />
          </Chapter>
        ) : null}

        {/* Gallery */}
        <section className="cs-gallery relative overflow-hidden py-16 md:flex md:h-[100svh] md:items-center md:py-0" aria-label="Screens">
          <div className="cs-track flex gap-5 overflow-x-auto px-5 pb-4 sm:px-8 md:overflow-visible md:pb-0">
            <div className="flex w-[240px] shrink-0 flex-col justify-end pb-2 md:w-[300px]">
              <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink-500">{nc()}</p>
              <h2 className="display mt-2 text-[clamp(30px,3.4vw,48px)] font-semibold leading-[0.95] tracking-[-0.04em]">Final interface</h2>
              <p className="mt-3 text-[14px] text-ink-500">Real screens from the live product.</p>
            </div>
            {c.shots.map((s) => (
              <figure key={s.img} className={`glass shrink-0 p-2 ${s.phone ? "w-[46vw] max-w-[300px] md:w-[22vw]" : "w-[84vw] md:w-[58vw]"}`}>
                <img src={`${s.img}-1600.webp`} srcSet={`${s.img}-800.webp 800w, ${s.img}-1600.webp 1600w`} sizes={s.phone ? "300px" : "(min-width: 900px) 58vw, 84vw"} alt={s.caption} loading="lazy" className={`w-full object-cover object-top ${s.phone ? "aspect-[9/19]" : "aspect-[16/10]"}`} style={{ borderRadius: "calc(var(--radius) - 8px)" }} />
                <figcaption className="px-2 pb-1 pt-3 text-[13px] text-ink-300">{s.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {d?.explorations ? (
          <Chapter n={nc()} title="UI explorations">
            <div className="grid gap-4 md:grid-cols-2">
              {d.explorations.map((x) => (
                <div key={x.t} className="cs-reveal glass p-6">
                  <p className="text-[18px] font-medium">{x.t}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-300">{x.d}</p>
                  {x.href ? (
                    <a href={x.href} target="_blank" rel="noreferrer" data-launch="true" className="mono mt-4 inline-block text-[11px] uppercase tracking-[0.14em] text-ember-300 hover:text-paper">
                      Open ↗
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </Chapter>
        ) : null}

        {d?.arch ? (
          <Chapter id="architecture" n={nc()} title="Technical architecture">
            <ArchDiagram title={d.arch.title} lanes={d.arch.lanes} principles={d.arch.principles} />
          </Chapter>
        ) : null}

        {d?.ai ? (
          <Chapter n={nc()} title="AI implementation">
            <h3 className="display text-[clamp(24px,2.4vw,34px)] font-semibold tracking-[-0.03em]">{d.ai.title}</h3>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {d.ai.items.map((x, k) => (
                <div key={x.t} className="cs-reveal glass p-6">
                  <p className="mono text-[11px] text-ember-400">{String(k + 1).padStart(2, "0")}</p>
                  <p className="mt-3 text-[18px] font-medium">{x.t}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-300">{x.d}</p>
                </div>
              ))}
            </div>
          </Chapter>
        ) : null}

        {d?.compare ? (
          <Chapter id="before-after" n={nc()} title="Before & after">
            <div className="grid gap-4">
              {d.compare.map((x) => (
                <div key={x.title} className="cs-reveal">
                  <CompareBlock c={x} />
                </div>
              ))}
            </div>
          </Chapter>
        ) : null}

        {d?.embed || d?.video ? (
          <Chapter id="try" n={nc()} title="Try it">
            <div className="grid gap-4">
              {d.embed ? <LiveEmbed src={d.embed.src} title={d.embed.title} note={d.embed.note} ratio={d.embed.ratio} poster={`${c.shots[0].img}-1600.webp`} /> : null}
              {d.video ? <Walkthrough src={d.video.src} poster={d.video.poster} title={d.video.title} /> : null}
            </div>
          </Chapter>
        ) : null}

        {d?.challenges ? (
          <Chapter n={nc()} title="Challenges">
            <div className="grid gap-4 md:grid-cols-2">
              {d.challenges.map((x) => (
                <div key={x.t} className="cs-reveal glass p-6">
                  <p className="text-[18px] font-medium">{x.t}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-300">{x.d}</p>
                </div>
              ))}
            </div>
          </Chapter>
        ) : null}

        {c.metrics ? (
          <Chapter id="outcomes" n={nc()} title="Outcomes">
            <div className="grid gap-4 sm:grid-cols-2">
              {c.metrics.map((m) => (
                <div key={m.label} className="cs-reveal glass p-6">
                  <p className="display text-[clamp(40px,5vw,72px)] font-semibold leading-none tracking-[-0.05em] text-paper">
                    {m.value}
                    <Cite n={nextCite()} source={m.source} />
                  </p>
                  <p className="mt-3 text-[15px] text-ink-300">{m.label}</p>
                </div>
              ))}
            </div>
            {c.metricsNote ? <p className="cs-reveal mt-6 max-w-[760px] text-[14px] leading-relaxed text-ink-500">{c.metricsNote}</p> : null}
          </Chapter>
        ) : null}

        <Chapter n={nc()} title="What's next">
          {c.next.length ? (
            <ul className="max-w-[760px] space-y-3">
              {c.next.map((x) => (
                <li key={x} className="cs-reveal flex items-baseline gap-3 border-b border-[var(--line)] pb-3 text-[18px]">
                  <span className="text-ember-400">→</span>
                  {x}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="cs-reveal mt-6 max-w-[760px] text-[14px] leading-relaxed text-ink-500">{c.honesty}</p>
        </Chapter>

        {/* Next project */}
        <a
          href={`/work/${next.slug}/`}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey) return;
            e.preventDefault();
            const p = PROJECTS.find((x) => x.slug === next.slug);
            wipeTo({ href: `/work/${next.slug}/`, rect: e.currentTarget.getBoundingClientRect(), color: p?.accent, label: next.title });
          }}
          className="group relative block overflow-hidden border-t border-[var(--line)] px-5 py-20 sm:px-8 md:py-28"
        >
          <div className="mx-auto max-w-[1400px]">
            <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink-500">Next project</p>
            <p className="display mt-3 text-[clamp(48px,9vw,150px)] font-semibold leading-[0.88] tracking-[-0.06em] text-ink-400 transition-colors duration-500 group-hover:text-paper">
              {next.title} <span className="inline-block transition-transform duration-500 group-hover:translate-x-4">→</span>
            </p>
            <p className="mt-3 font-serif text-[24px] italic text-ember-300 [:root[data-mode=pixel]_&]:font-pixel [:root[data-mode=pixel]_&]:not-italic">{next.tagline}</p>
          </div>
        </a>
      </div>
    </EvidenceProvider>
  );
}
