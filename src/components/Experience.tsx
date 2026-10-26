"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

type Area = { t: string; d: string[]; seen?: [string, string] };
type Role = {
  id: string;
  year: string;
  when: string;
  chapter: string;
  role: string;
  org: string;
  summary: string;
  highlight?: string;
  areas?: Area[];
  points?: string[];
  skills: string[];
  ai?: boolean;
};

/** The career story, oldest first. Every line comes from the résumé. */
const ROLES: Role[] = [
  {
    id: "edu",
    year: "2020",
    when: "Aug 2020 – Jun 2024",
    chapter: "Learning the foundations",
    role: "B.Tech, Computer Science and Engineering (AI & ML)",
    org: "Presidency University, Bengaluru",
    summary: "Machine learning and software engineering, and two published papers before graduating.",
    points: ["Published: Exploring the Evolution of GenAI in Music Composition (IJFMR, 2024)", "Published: Medicine Strip Recognition using Deep Learning (IJCRT, 2024), a Keras CNN built with a team of four"],
    skills: ["Machine learning", "Deep learning", "Python", "Keras", "SQL"],
  },
  {
    id: "build",
    year: "2024",
    when: "Oct 2024 – May 2025",
    chapter: "Learning to ship",
    role: "Python Full Stack bootcamp · Web Development Intern",
    org: "QSpiders (8 months) · Robowaves (Feb – May 2025)",
    summary: "Eight months of full-stack training, then an internship building a responsive storefront.",
    points: ["Built BookYourShow, a movie-ticket booking site in Django and MySQL: listings, seat booking, authentication", "Built Shoply at Robowaves: product listings, cart, checkout and responsive layouts in HTML, CSS and JavaScript"],
    skills: ["Django", "JavaScript", "HTML/CSS", "MySQL", "REST APIs"],
  },
  {
    id: "ra",
    year: "2025",
    when: "Jul 2025 – Nov 2025",
    chapter: "Learning how models fail",
    role: "Research Associate, AI",
    org: "Keywords Studios",
    summary: "Generative AI model training: writing prompts, evaluating responses, annotating data and keeping datasets clean.",
    ai: true,
    areas: [
      { t: "Model training & response evaluation", d: ["Prompt creation, response evaluation, data annotation and structured review for Generative AI model training"], seen: ["Shortlist's labelled evaluation set", "/work/shortlist/"] },
      { t: "Dataset quality", d: ["Built and validated high-quality datasets, tracking accuracy, consistency, quality metrics and evaluation benchmarks"] },
      { t: "Documentation", d: ["Wrote documentation supporting model evaluation, fine-tuning workflows and continuous quality improvement"] },
    ],
    skills: ["Prompt writing", "Response evaluation", "Annotation", "Dataset QA"],
  },
  {
    id: "tra",
    year: "2025",
    when: "Nov 2025 – Jul 2026",
    chapter: "Leading the evaluation",
    role: "Technical Research Associate, AI",
    org: "Keywords Studios",
    summary: "Promoted after four months. Led a team of Research Associates on a client project for Amazon AGI Lab.",
    highlight: "Promoted after four months · Led a team on an Amazon AGI Lab project",
    ai: true,
    areas: [
      { t: "Prompt engineering & optimisation", d: ["Prompted agentic AI models to complete multi-step task workflows across evaluation, functional and standard Gym environments", "Refined prompts and instructions to improve task completion and consistency"], seen: ["FITFLOW's “Why this draft”", "/work/fitflow/"] },
      { t: "LLM output evaluation", d: ["Evaluated high-volume LLM outputs for accuracy, factual consistency, safety, quality and compliance with structured evaluation criteria"], seen: ["Margin's verified quotes", "/work/margin/"] },
      { t: "Hallucination & edge-case analysis", d: ["Ran root-cause analysis to identify hallucinations, recurring errors, edge cases and failure trends"], seen: ["Shortlist downgrading unverifiable “met”", "/work/shortlist/"] },
      { t: "Training data & team lead", d: ["Contributed to pre-training, fine-tuning and RLHF workstreams with Product teams, delivering traceable, production-ready data", "Gave the team direction, feedback and performance support to keep delivery consistent"] },
    ],
    skills: ["Agentic AI", "LLM evaluation", "Hallucination analysis", "RLHF data", "Team lead"],
  },
  {
    id: "togle",
    year: "2026",
    when: "Jul 2026 – now",
    chapter: "Turning data into decisions",
    role: "Data Analyst",
    org: "Togle Labs",
    summary: "Operational and revenue analytics for the software behind visitor services at Global Village UAE.",
    points: ["Analyse operational and revenue data for shopping trolley, balloon and rickshaw services", "Design Power BI dashboards and software prototypes for service performance, KPIs, revenue and profitability", "Analyse historical revenue, escalations and margins for annual tender planning and projections"],
    skills: ["Power BI", "SQL", "Python", "Excel", "Prototyping"],
  },
];

const SKILLS = [
  ["AI", ["Prompt engineering", "LLM evaluation", "RAG", "Embeddings", "Hallucination analysis", "Structured outputs", "Annotation", "RLHF data"]],
  ["Design", ["Product design", "UX flows", "Design systems", "Figma", "Prototyping", "Motion (GSAP)", "Interaction design"]],
  ["Build", ["TypeScript", "React", "Next.js", "Python", "FastAPI", "SQL", "WebGL", "Git & CI"]],
] as const;

function RoleCard({ r, open, toggle }: { r: Role; open: boolean; toggle: () => void }) {
  return (
    <article className={`ex-card glass relative overflow-hidden transition-colors duration-500 ${open ? "" : "hover:bg-white/[0.06]"}`} style={r.ai && open ? { background: "linear-gradient(160deg, rgba(255,106,31,.10), rgba(255,255,255,.03) 40%)" } : undefined}>
      <button onClick={toggle} aria-expanded={open} className="flex w-full items-start gap-4 p-5 text-left sm:p-6">
        <span className="min-w-0 flex-1">
          <span className="mono block text-[10px] uppercase tracking-[0.18em] text-ember-300">
            {r.when} · {r.chapter}
          </span>
          <span className="display mt-2 block text-[clamp(20px,2vw,28px)] font-semibold leading-tight tracking-[-0.03em]">{r.role}</span>
          <span className="mt-1 block text-[15px] text-ink-400">{r.org}</span>
          {r.highlight ? (
            <span className="mono mt-3 inline-flex rounded-full bg-lime/15 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-lime [:root[data-mode=pixel]_&]:rounded-none">★ {r.highlight}</span>
          ) : null}
        </span>
        <span className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--line)] text-[18px] transition-transform duration-500 [:root[data-mode=pixel]_&]:rounded-none ${open ? "rotate-45 border-ember-500 text-ember-300" : "text-ink-300"}`} aria-hidden>
          +
        </span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="px-5 pb-6 sm:px-6">
            <p className="text-[16px] leading-relaxed text-ink-300">{r.summary}</p>
            {r.areas ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {r.areas.map((a, k) => (
                  <div key={a.t} className="border border-[var(--line)] bg-ink-950/50 p-4" style={{ borderRadius: "var(--radius-sm)" }}>
                    <p className="mono text-[10px] text-ember-400">{String(k + 1).padStart(2, "0")}</p>
                    <p className="mt-2 text-[15px] font-medium text-paper">{a.t}</p>
                    <ul className="mt-2 space-y-1.5">
                      {a.d.map((x) => (
                        <li key={x} className="text-[13px] leading-relaxed text-ink-300">
                          {x}
                        </li>
                      ))}
                    </ul>
                    {a.seen ? (
                      <Link href={a.seen[1]} className="mono mt-3 inline-block text-[10px] uppercase tracking-[0.12em] text-ember-300 hover:text-paper">
                        Shows up in: {a.seen[0]} →
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
            {r.points ? (
              <ul className="mt-4 space-y-2">
                {r.points.map((x) => (
                  <li key={x} className="flex gap-3 text-[14px] leading-relaxed text-ink-300">
                    <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-ember-400" />
                    {x}
                  </li>
                ))}
              </ul>
            ) : null}
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {r.skills.map((s) => (
                <li key={s} className="mono rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-ink-300 [:root[data-mode=pixel]_&]:rounded-none">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({ tra: true });
  const [year, setYear] = useState("2020");
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      // The line fills as you read down the story; the year follows the card in view.
      if (!reduce) gsap.fromTo(q(".ex-fill"), { scaleY: 0 }, { scaleY: 1, ease: "none", transformOrigin: "top", scrollTrigger: { trigger: q(".ex-track")[0], start: "top 60%", end: "bottom 60%", scrub: true } });
      q(".ex-item").forEach((el) => {
        const y = (el as HTMLElement).dataset.year!;
        gsap.timeline({ scrollTrigger: { trigger: el, start: "top 60%", end: "bottom 60%", onToggle: (st) => st.isActive && setYear(y) } });
        if (!reduce) gsap.from(el, { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });
    },
    { scope: root },
  );

  return (
    <section id="experience" ref={root} className="relative px-5 py-24 sm:px-8 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="mono text-[11px] uppercase tracking-[0.2em] text-ember-300">Experience</p>
          <h2 className="display mt-3 text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.95] tracking-[-0.045em]">
            From building software to finding where AI fails.
          </h2>
          <p className="mt-5 max-w-[460px] text-[16px] leading-relaxed text-ink-300">
            Open any chapter. The AI years at Keywords Studios are the reason my products show their evidence.
          </p>
          <p className="display mt-10 hidden select-none text-[clamp(90px,11vw,170px)] font-semibold leading-none tracking-[-0.07em] text-paper/90 lg:block" aria-hidden>
            {year}
          </p>
          <div className="mt-8 hidden space-y-4 lg:block">
            {SKILLS.map(([g, list]) => (
              <div key={g}>
                <p className="mono text-[10px] uppercase tracking-[0.18em] text-ink-500">{g}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-300">{list.join(" · ")}</p>
              </div>
            ))}
          </div>
        </div>
        <ol className="ex-track relative space-y-5 pl-8 sm:pl-10">
          <span aria-hidden className="absolute bottom-2 left-[9px] top-2 w-px bg-[var(--line)] sm:left-[13px]" />
          <span aria-hidden className="ex-fill absolute bottom-2 left-[9px] top-2 w-px bg-gradient-to-b from-ember-300 to-ember-600 sm:left-[13px]" />
          {ROLES.map((r) => (
            <li key={r.id} className="ex-item relative" data-year={r.year}>
              <span aria-hidden className={`absolute -left-8 top-7 grid h-5 w-5 place-items-center rounded-full border-2 bg-ink-950 sm:-left-10 sm:h-7 sm:w-7 [:root[data-mode=pixel]_&]:rounded-none ${r.ai ? "border-ember-500" : "border-ink-500"}`}>
                <span className={`h-1.5 w-1.5 rounded-full [:root[data-mode=pixel]_&]:rounded-none ${r.ai ? "bg-ember-400" : "bg-ink-400"}`} />
              </span>
              <RoleCard r={r} open={!!open[r.id]} toggle={() => setOpen((o) => ({ ...o, [r.id]: !o[r.id] }))} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
