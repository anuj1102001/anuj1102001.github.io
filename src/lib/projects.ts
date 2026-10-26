/** The work, in the order it is shown. Facts here come from each project's README and case study. */
export type Project = {
  slug: string;
  name: string;
  kind: string;
  year: string;
  line: string;
  role: string;
  accent: string;
  cover: string; // image base path without width suffix
  shots: string[];
  live?: string;
  code?: string;
  lab?: boolean;
};

const img = (p: string) => `/img/work/${p}`;

export const PROJECTS: Project[] = [
  {
    slug: "shortlist",
    name: "Shortlist",
    kind: "AI resume assistant",
    year: "2026",
    line: "Judges a resume against a job ad requirement by requirement, quoting the evidence for every verdict.",
    role: "Product, UX, design system, full stack",
    accent: "#7c8cff",
    cover: img("shortlist/match"),
    shots: [img("shortlist/match"), img("shortlist/evidence"), img("shortlist/tailored-diff"), img("shortlist/landing")],
    live: "https://shortlist-resume-neon.vercel.app",
    code: "https://github.com/anuj1102001/AI-Resume-Assistant",
  },
  {
    slug: "margin",
    name: "Margin",
    kind: "Document assistant you can check",
    year: "2026",
    line: "Summaries and answers where every claim carries a quote, verified and highlighted on the page.",
    role: "Product, UX, retrieval and evaluation",
    accent: "#e9b949",
    cover: img("margin/summary-citation"),
    shots: [img("margin/summary-citation"), img("margin/key-facts"), img("margin/dark"), img("margin/home")],
    live: "https://margin-docs.vercel.app",
    code: "https://github.com/anuj1102001/AI-Document-Summarizer",
  },
  {
    slug: "fitflow",
    name: "FITFLOW AI",
    kind: "Prototype for fitness creators",
    year: "2026",
    line: "A Today queue that says who to message and why, so no interested lead or slipping client goes quiet.",
    role: "Product definition, UX/UI, motion, Figma",
    accent: "#3ddc97",
    cover: img("fitflow/today"),
    shots: [img("fitflow/today"), img("fitflow/landing"), img("fitflow/compose"), img("fitflow/overview-dark")],
    live: "https://fitflow-showcase.vercel.app",
    code: "https://github.com/anuj1102001/fitflow-showcase",
  },
  {
    slug: "creators-store",
    name: "Creators Store",
    kind: "Storefront for creators in every niche",
    year: "2026",
    line: "A store, UPI checkout and instant delivery in one bio link. Buyers pay the creator directly: 0% commission.",
    role: "Product, UX, payments, full stack",
    accent: "#8b9dff",
    cover: img("creators/home"),
    shots: [img("creators/home"), img("creators/payments"), img("creators/dashboard"), img("creators/fees")],
    live: "https://www.creators-store.site",
  },
  {
    slug: "comet",
    name: "COMET 2.0",
    kind: "Sneaker concept · brand & launch site",
    year: "2026",
    line: "A Mumbai sneaker collection told through local trains, postcards and street lettering, from shoe to site.",
    role: "Concept, art direction, packaging, motion",
    accent: "#e2703a",
    cover: img("comet/local-lateral-hero"),
    shots: [img("comet/local-lateral-hero"), img("comet/box-terracotta"), img("comet/postcard-lateral")],
    live: "https://comet-mumbai.vercel.app",
    lab: true,
  },
  {
    slug: "solune",
    name: "Solune & Afterdark",
    kind: "Coffee brand · interactive publication",
    year: "2026",
    line: "A liquid-coffee opening you can stir, a 3D pour bar and path-traced bottles from the site's own models.",
    role: "Concept, art direction, WebGL, motion",
    accent: "#c98247",
    cover: img("solune/hero-new"),
    shots: [img("solune/hero-new"), img("solune/trio"), img("solune/pour-bar")],
    live: "https://solune-afterdark.vercel.app",
    lab: true,
  },
];

export const srcset = (base: string, widths = [800, 1600]) => widths.map((w) => `${base}-${w}.webp ${w}w`).join(", ");
