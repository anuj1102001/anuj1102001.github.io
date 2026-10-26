/**
 * The deeper layers of each case study: research status, user flow, architecture, how the AI
 * works, challenges, before/after and live prototypes. Taken from each project's README, case
 * study and evaluation results. Where something doesn't exist (no user research, no wireframes),
 * it is said plainly or left out.
 */

const W = (p: string) => `/img/work/${p}`;

export type FlowStep = { t: string; d: string; img?: string };
export type ArchLane = { name: string; note?: string; nodes: { t: string; d: string; ai?: boolean }[] };
export type Compare =
  | { kind: "metrics"; title: string; before: string; after: string; rows: { label: string; a: number; b: number; fmt?: "ratio" | "pct" }[]; note: string }
  | { kind: "slider"; title: string; before: { img: string; label: string }; after: { img: string; label: string }; note: string }
  | { kind: "list"; title: string; before: string; after: string; rows: { a: string; b: string }[] };

export type Depth = {
  research: { status: string; items: string[] };
  flow?: { title: string; steps: FlowStep[] };
  arch?: { title: string; lanes: ArchLane[]; principles: string[] };
  ai?: { title: string; items: { t: string; d: string }[] };
  compare?: Compare[];
  challenges?: { t: string; d: string }[];
  embed?: { src: string; title: string; note: string; ratio?: string };
  video?: { src: string; poster?: string; title: string };
  explorations?: { t: string; d: string; href?: string }[];
};

export const DEPTH: Record<string, Depth> = {
  shortlist: {
    research: {
      status: "Desk research and my own v1 audit. No usability testing yet; a study plan is written in the case study.",
      items: [
        "Audited my own first version line by line: what it claimed, what it actually computed",
        "Six synthetic resumes in different formats (one two-column PDF, one Word file) and four job ads as test material",
        "74 hand-labelled requirement judgements to measure matching against",
      ],
    },
    flow: {
      title: "From a file to a tailored resume",
      steps: [
        { t: "Upload", d: "PDF or Word. Parsing is column-aware and needs no AI: sections, bullets, roles, dates and contact details.", img: W("shortlist/landing") },
        { t: "Correct", d: "Check what the parser found and fix it (section types, contact details, skills); the checks re-run." },
        { t: "Review", d: "13 explainable readability checks, each showing the lines involved and a fix. No score.", img: W("shortlist/overview") },
        { t: "Match", d: "Paste a job ad. Each requirement is judged met, partly or not shown, with resume quotes as evidence.", img: W("shortlist/match") },
        { t: "Tailor", d: "Three rewrites per bullet aimed at the job, with flags for anything the original doesn't say.", img: W("shortlist/tailored-diff") },
        { t: "Edit & export", d: "Original beside your version for every bullet, undo/redo, and a clean single-column Word export.", img: W("shortlist/evidence") },
      ],
    },
    arch: {
      title: "Deterministic first, one AI call where judgement is needed",
      lanes: [
        {
          name: "On upload · no AI",
          nodes: [
            { t: "PDF / DOCX", d: "File type detected from bytes; Word and PDF supported." },
            { t: "Column-aware text", d: "Reads two-column layouts in the right order and records layout facts." },
            { t: "Sections & roles", d: "Sections, bullets, roles, dates and contact details extracted by rules, tested against gold labels." },
            { t: "13 checks", d: "Readability checks that run instantly and work with AI off." },
            { t: "Embeddings → SQLite", d: "Section chunks embedded locally and stored for retrieval." },
          ],
        },
        {
          name: "On match · one AI call",
          nodes: [
            { t: "Requirements", d: "The job ad's requirements, extracted once per job, each with a citation into the ad." },
            { t: "Hybrid retrieval", d: "Per requirement, the top 3 resume passages from dense + BM25 search, fused with reciprocal rank fusion." },
            { t: "Gemini judges", d: "The model judges each requirement against its passages and must quote them.", ai: true },
            { t: "Quote check", d: "Every quote is verified against the resume; a “met” with an unverifiable quote becomes “partial”." },
            { t: "Score in code", d: "Required items count double, partial evidence half. The model never sets the number." },
          ],
        },
      ],
      principles: ["The model judges, code scores", "Guardrails on rewrites: new numbers and unlisted skills are flagged", "Shared, tested core with Margin: ingestion, retrieval, quote verification"],
    },
    ai: {
      title: "How the AI is kept honest",
      items: [
        { t: "Structured outputs", d: "Gemini returns typed JSON per requirement: verdict, quotes, reasoning. Prompts are versioned." },
        { t: "Grounding", d: "Quotes must exist in the resume. Unverifiable evidence is downgraded in front of the user." },
        { t: "Guardrails on rewrites", d: "Numbers not in the original and skills that appear nowhere on the resume are flagged beside each suggestion." },
        { t: "Adversarial tests", d: "A fake model that misbehaves on purpose: invented evidence must be downgraded, inflated rewrites must be flagged." },
      ],
    },
    compare: [
      {
        kind: "metrics",
        title: "v1 against v2, on the same labelled set",
        before: "v1 keywords",
        after: "v2 with AI",
        rows: [
          { label: "Requirement accuracy (3-class)", a: 0.216, b: 0.905 },
          { label: "Evidence F1", a: 0.174, b: 0.965 },
          { label: "Can assess the requirement", a: 0.5, b: 1.0 },
          { label: "Section F1 (parsing)", a: 0.732, b: 1.0 },
        ],
        note: "From the README's evaluation tables. Six synthetic resumes, four job ads, 74 labels written by me: the change on known cases, not accuracy on unseen resumes.",
      },
      {
        kind: "list",
        title: "What v1 actually did",
        before: "v1",
        after: "v2",
        rows: [
          { a: "An “ATS score” that gave 10 points to any resume", b: "13 explainable checks with the lines and a fix" },
          { a: "37 hard-coded substrings (“ai” matched “maintain”)", b: "Requirements judged with quoted, verified evidence" },
          { a: "One global resume and chat shared by every visitor", b: "Private workspaces, exportable and deletable" },
          { a: "Parser hard-coded to the author's own job titles", b: "Rules tested on six resume formats, 6/6 parsed" },
        ],
      },
    ],
    challenges: [
      { t: "Free hosting sleeps", d: "The backend sleeps after idle minutes, so the first request can take up to a minute. The app shows a “waking the server” notice instead of failing silently." },
      { t: "Evaluating honestly", d: "The test set was written by the same person who built v2, so the README says exactly that next to the numbers." },
      { t: "Resumes aren't text", d: "Two-column PDFs and Word files read out of order; parsing had to be column-aware before any AI could help." },
    ],
  },

  margin: {
    research: {
      status: "Desk research and a v1 audit. No usability testing yet; a study plan is in the case study.",
      items: ["Four synthetic documents (15 pages, 47 chunks) written as test material", "47 answerable questions labelled with the page holding the answer, plus unanswerable ones", "An ablation of dense, BM25 and hybrid retrieval"],
    },
    flow: {
      title: "From a document to answers you can point at",
      steps: [
        { t: "Upload", d: "PDF, Word or text. Type checked from the bytes; scanned PDFs are detected and explained.", img: W("margin/home") },
        { t: "Summary", d: "Executive summary, takeaways and section summaries, every claim with a verified quote.", img: W("margin/summary-citation") },
        { t: "Ask", d: "Answers only from the document, “the document doesn't say” when it doesn't, and the passages searched.", img: W("margin/ask") },
        { t: "Key facts", d: "People, dates, figures, decisions, risks and action items, each with its page.", img: W("margin/key-facts") },
        { t: "Compare", d: "Two documents side by side: in common, different, only in one." },
      ],
    },
    arch: {
      title: "Verify, don't trust, citations",
      lanes: [
        {
          name: "On upload",
          nodes: [
            { t: "Type & limits", d: "File type from bytes, size and page limits, path-safe storage." },
            { t: "Per-page parsing", d: "PyMuPDF / python-docx, column-aware, keeping page numbers." },
            { t: "Page-aware chunks", d: "Chunks that never cross a page, with detected headings." },
            { t: "Local embeddings", d: "bge-small via local ONNX: no key, no per-call cost, ~130 MB RAM." },
          ],
        },
        {
          name: "On request",
          nodes: [
            { t: "Fits in one call?", d: "Whole document for summaries and extraction up to ~180k characters; map-reduce above that." },
            { t: "Hybrid retrieval", d: "For questions: dense + BM25, fused with reciprocal rank fusion." },
            { t: "Gemini, structured", d: "The model cites passage labels and verbatim quotes in typed output.", ai: true },
            { t: "Quote verification", d: "The server normalises each quote and finds it in the document before the UI may call it verified." },
            { t: "Cache", d: "Keyed on content, prompt version and model; only real model calls count toward the hourly limit." },
          ],
        },
      ],
      principles: ["Fact and interpretation labelled on every claim", "Failures shown, not hidden", "Anonymous workspaces scoped by a hashed token"],
    },
    ai: {
      title: "How the AI is kept honest",
      items: [
        { t: "Stated or interpretation", d: "Every claim says whether the document states it or the model inferred it." },
        { t: "Three-level quote check", d: "Verified (word for word), approximate, or not found, shown on each claim." },
        { t: "Refusal by design", d: "Questions the document can't answer get “the document doesn't say”, with the passages searched." },
        { t: "End-to-end eval", d: "The real Ask pipeline run over 47 answerable and 7 unanswerable questions, failures written up." },
      ],
    },
    compare: [
      {
        kind: "metrics",
        title: "Retrieval: which search finds the right page",
        before: "BM25",
        after: "Hybrid (RRF)",
        rows: [
          { label: "hit@1", a: 0.681, b: 0.787 },
          { label: "hit@3", a: 0.872, b: 0.915 },
          { label: "hit@6", a: 0.936, b: 1.0 },
          { label: "MRR", a: 0.787, b: 0.866 },
        ],
        note: "From the README's retrieval table. Dense search alone is as good or better than hybrid except at hit@6; hybrid is kept for identifier-heavy queries. A small regression suite, not a benchmark.",
      },
      {
        kind: "list",
        title: "What v1 actually was",
        before: "v1",
        after: "v2",
        rows: [
          { a: "One endpoint sending a PDF's text to a model", b: "Summary, Ask, Key facts, Compare, Library" },
          { a: "No citations", b: "Every claim quoted, verified and highlighted on the page" },
          { a: "Uploads saved with the client's filename (path traversal)", b: "Validated uploads, workspace-scoped storage" },
          { a: "Crashed without a key; every error a 500", b: "Clear errors; works without a key for reading and search" },
        ],
      },
    ],
    challenges: [
      { t: "The one wrong answer", d: "It inferred “at least twelve months” from a termination clause instead of the stated 24-month term. Written up, not hidden." },
      { t: "Free-tier latency", d: "p50 1.9 s but p95 14.5 s on the free tier, so caching and a waking notice matter." },
      { t: "Scanned PDFs", d: "No OCR yet: scanned files are detected and explained rather than read badly." },
    ],
  },

  fitflow: {
    research: {
      status: "Design hypotheses only: no interviews or usability tests yet. The problem statements and persona are labelled as hypotheses.",
      items: ["Target user and problem framed from how creators sell coaching through DMs, WhatsApp and spreadsheets", "Scope decisions written down: what FITFLOW should not do (payments, real data, sending messages)"],
    },
    flow: {
      title: "One loop: capture, prioritise, follow up, retain",
      steps: [
        { t: "Today", d: "A ranked queue of who to message and why: replies, due sequence steps, overdue leads, slipping clients.", img: W("fitflow/today") },
        { t: "Compose", d: "Opened from Today with the step pre-set: goal, tone, channel → a streamed draft with “Why this draft”.", img: W("fitflow/compose") },
        { t: "Sequences", d: "Four cadences with the reason for each step; they pause when someone replies.", img: W("fitflow/sequences") },
        { t: "Retain", d: "Clients with program progress and check-ins; a rescue sequence for anyone slipping.", img: W("fitflow/overview-dark") },
      ],
    },
    arch: {
      title: "A prototype that behaves like the product",
      lanes: [
        {
          name: "In the browser",
          nodes: [
            { t: "Seed data", d: "A deterministic sample-data generator with dates relative to today." },
            { t: "Store", d: "Zustand store holding the data and every action, persisted to localStorage." },
            { t: "Follow-up engine", d: "Sequences, the Today queue ranking and the draft explanations." },
            { t: "Simulated AI", d: "Templates over the sample data for drafts, offers and the assistant, plus a claims check.", ai: true },
          ],
        },
      ],
      principles: ["No backend, no accounts, no messages ever sent", "Every route pre-rendered", "Unit tests on the logic and a browser interaction test"],
    },
    explorations: [
      { t: "Figma file", d: "Colour variables mirrored 1:1 with the code tokens, styles and components.", href: "https://www.figma.com/design/tplM1llRbk13QxwC9bzAxU" },
      { t: "From template to product", d: "The first version looked too much like an AI-made template; it was pushed toward a cleaner, Figma-based product design with light and dark themes." },
      { t: "No WebGL", d: "Restrained CSS 3D with spring parallax was chosen over WebGL for the product shots." },
    ],
    challenges: [
      { t: "Looking like a template", d: "The first pass read as generic; the redesign started in Figma with tokens and a single accent." },
      { t: "Simulated AI, honestly", d: "Drafts come from templates, so every screen and the README say the AI is simulated." },
    ],
    embed: { src: "https://fitflow-showcase.vercel.app/app", title: "FITFLOW, live", note: "The real prototype, running here. Open the top task in Today and read “Why this draft”.", ratio: "16/10" },
    video: { src: "https://fitflow-showcase.vercel.app/walkthrough.mp4", title: "Narrated walkthrough (1:39)" },
  },

  "creators-store": {
    research: {
      status: "Desk research on how creators sell today and what creator platforms charge. Early stage: no paying customers yet, so no outcome data.",
      items: ["Compared commission and payout models of creator-commerce tools", "Mapped the DM-and-screenshot selling flow the product replaces"],
    },
    flow: {
      title: "From sign-up to money in the creator's bank",
      steps: [
        { t: "Build the store", d: "Templates, colours, typography, sections and SEO with a live mobile/desktop preview.", img: W("creators/home") },
        { t: "Connect Razorpay", d: "A step-by-step guide; keys verified with Razorpay and stored encrypted; a test purchase before going live.", img: W("creators/payments") },
        { t: "Buyer pays", d: "UPI, cards or net banking on the creator's own Razorpay account." },
        { t: "Verified, delivered", d: "Fulfilled only after server-side verification; instant delivery and receipt emails." },
        { t: "You kept", d: "The dashboard compares ₹0 commission with a typical 10% platform.", img: W("creators/dashboard") },
      ],
    },
    arch: {
      title: "The platform never holds the money",
      lanes: [
        {
          name: "Checkout",
          nodes: [
            { t: "Storefront", d: "The creator's public store and product pages." },
            { t: "Creator's Razorpay", d: "Checkout runs on the creator's own account; Razorpay settles to their bank." },
            { t: "Server verification", d: "Signatures and amounts verified on the server before anything is delivered; tampered amounts rejected." },
            { t: "Delivery", d: "Private files and booking details released only after a verified payment." },
          ],
        },
        {
          name: "Reliability",
          nodes: [
            { t: "Reconciliation", d: "For buyers who close the tab: on page load and on a scheduled job." },
            { t: "Webhooks as hints", d: "Optional per-creator webhooks, always re-verified, never trusted alone." },
            { t: "Encrypted keys", d: "Stored payment credentials encrypted with AES-256-GCM." },
          ],
        },
      ],
      principles: ["0% commission, flat subscription", "Idempotent payment handling", "33 automated tests on payments, refunds and webhooks"],
    },
    challenges: [
      { t: "Buyers who close the tab", d: "A payment can succeed after the buyer leaves, so orders are reconciled on load and on a schedule." },
      { t: "AI that isn't real yet", d: "AI tools run on sample output until a model is configured, so they live in a labelled preview, not in any plan." },
    ],
    video: { src: "https://anuj1102001.github.io/creators-store-showcase/media/creators-store-walkthrough.mp4", poster: "https://anuj1102001.github.io/creators-store-showcase/media/walkthrough-poster.jpg", title: "Narrated walkthrough (1:53), test mode" },
  },

  comet: {
    research: { status: "Desk research, labelled as such: every statement in the case study is marked desk research, hypothesis, proposal or built.", items: [] },
    explorations: [{ t: "Real-time 3D, dropped", d: "A parametric WebGL shoe was built and then replaced by the approved renders, labelled as renders, because it looked worse." }],
    embed: { src: "https://comet-mumbai.vercel.app", title: "COMET 2.0 launch site, live", note: "The scroll-driven launch site, running here.", ratio: "16/10" },
  },

  solune: {
    research: { status: "A design exercise; facts on the site come only from the brand boards.", items: [] },
    compare: [
      {
        kind: "slider",
        title: "Real-time render against path-traced",
        before: { img: W("solune/compare-realtime-1200.webp"), label: "Real-time (before)" },
        after: { img: W("solune/compare-pathtraced-1200.webp"), label: "Path-traced (after)" },
        note: "The same 3D bottle. Path tracing simulates light bounce by bounce: real glass thickness, coffee that light passes through, soft shadows.",
      },
    ],
    challenges: [
      { t: "The GPU watchdog", d: "Long path-traced renders tripped the graphics driver; each shot became short passes from different seeds in 4×4 tiles, then averaged." },
      { t: "Grey cutouts", d: "Cut-out bottles lost the light through the coffee, so the body takes its colour from the render on white and only thin glass stays see-through." },
    ],
    embed: { src: "https://solune-afterdark.vercel.app", title: "Solune & Afterdark, live", note: "Move the cursor through the coffee.", ratio: "16/10" },
  },
};
