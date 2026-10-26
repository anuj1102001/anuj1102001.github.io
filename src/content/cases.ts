/**
 * Case study content. Every number or strong claim carries a `source`: the evidence the reader
 * can open in place (an image from the product and/or a link to where it is documented).
 * Facts come from each project's README, case study and evaluation results; nothing here is
 * invented. Where there is no research or metric, the copy says so.
 */

export type Source = { label: string; img?: string; quote?: string; href?: string };
export type Claim = { text: string; source?: Source };
export type Metric = { value: string; label: string; source: Source };
export type Shot = { img: string; caption: string; phone?: boolean };
export type Decision = { title: string; body: string; cut?: string; source?: Source };

export type Case = {
  slug: string;
  title: string;
  tagline: string;
  intro: string;
  meta: { role: string; type: string; stack: string; status: string };
  links: { label: string; href: string }[];
  problem: Claim[];
  users: string;
  decisions: Decision[];
  shots: Shot[];
  metrics?: Metric[];
  metricsNote?: string;
  next: string[];
  honesty: string;
};

const W = (p: string) => `/img/work/${p}`;
const GH = "https://github.com/anuj1102001";

export const CASES: Record<string, Case> = {
  shortlist: {
    slug: "shortlist",
    title: "Shortlist",
    tagline: "Show your real experience, clearly.",
    intro:
      "A resume assistant that judges a resume against a job ad requirement by requirement, quotes the resume as evidence for every verdict, and suggests rewrites that are checked for invented facts.",
    meta: {
      role: "Product direction, UX and interface, design system, evaluation design",
      type: "AI product · rebuild of my own v1",
      stack: "Python, FastAPI, Gemini, hybrid RAG, Next.js, TypeScript",
      status: "Live working prototype · evaluations run in CI",
    },
    links: [
      { label: "Live demo", href: "https://shortlist-resume-neon.vercel.app" },
      { label: "Their case study", href: "https://shortlist-resume-neon.vercel.app/case-study" },
      { label: "Design system", href: "https://shortlist-resume-neon.vercel.app/design-system" },
      { label: "Code", href: `${GH}/AI-Resume-Assistant` },
    ],
    problem: [
      { text: "Resume tools hand out a mysterious “ATS score” and rewrite bullets with numbers you never achieved." },
      {
        text: "My own first version was guilty of both: its score gave 10 points to any resume, and its job matching was 37 hard-coded substrings, so “ai” matched inside “maintain”.",
        source: { label: "README · What changed from v1", href: `${GH}/AI-Resume-Assistant#what-changed-from-v1`, quote: "the ATS score gave 10 points to any resume … job matching used 37 hard-coded substrings (\"ai\" matched inside \"maintain\")" },
      },
      { text: "So the rebuild started from one question: what would a resume tool look like if every judgement had to show its evidence?" },
    ],
    users: "Job seekers tailoring one resume to a specific job ad, who want to know what a recruiter will actually find, not a number.",
    decisions: [
      {
        title: "No made-up score",
        body: "The “ATS score” became 13 readability checks. Each one shows the lines it is about and a fix, so a user can see why, not just how much.",
        cut: "Cut: the single score",
        source: { label: "Readability checks", img: W("shortlist/overview"), href: `${GH}/AI-Resume-Assistant#what-it-does` },
      },
      {
        title: "The model judges, code scores",
        body: "The AI decides met, partly or not shown for each requirement, with quotes. Coverage is computed in code: required items count double, partial evidence half.",
        source: { label: "Match report", img: W("shortlist/match"), href: `${GH}/AI-Resume-Assistant#architecture` },
      },
      {
        title: "Quotes or it didn't happen",
        body: "Every verdict quotes the resume, and each quote is checked against the file. A “met” whose quote can't be found is downgraded to “partial”, in front of the user.",
        source: { label: "Evidence for one requirement", img: W("shortlist/evidence"), href: `${GH}/AI-Resume-Assistant#architecture` },
      },
      {
        title: "Rewrites that keep to the facts",
        body: "Suggestions are flagged beside the text when they add a number the original doesn't contain or a skill that appears nowhere on the resume.",
        source: { label: "Tailored rewrite with a word diff", img: W("shortlist/tailored-diff") },
      },
      {
        title: "Deterministic first",
        body: "Parsing, layout facts, checks and the keyword view are instant, free and tested, and still work with the AI switched off. The model is only called where judgement is needed.",
      },
    ],
    shots: [
      { img: W("shortlist/match"), caption: "Match report: every requirement judged, with the resume quoted as evidence" },
      { img: W("shortlist/evidence"), caption: "One requirement, its verdict and the highlighted quote" },
      { img: W("shortlist/tailored-diff"), caption: "Rewrites aimed at the job, with a word diff and fact flags" },
      { img: W("shortlist/landing"), caption: "Marketing site, built from the same design system" },
      { img: W("shortlist/mobile"), caption: "Phone layout", phone: true },
    ],
    metrics: [
      {
        value: "0.22 → 0.91",
        label: "Requirement-matching accuracy, v1 to v2 with AI",
        source: { label: "README · Evaluation", href: `${GH}/AI-Resume-Assistant#evaluation`, quote: "Accuracy (3-class): v1 keywords 0.216 · v2 AI 0.905, on 74 hand-labelled requirement judgements" },
      },
      {
        value: "0.97",
        label: "Evidence F1: the right resume lines quoted",
        source: { label: "README · Evaluation", href: `${GH}/AI-Resume-Assistant#evaluation`, quote: "Evidence F1: v1 0.174 · v2 AI 0.965" },
      },
      {
        value: "0",
        label: "Missing requirements marked as met",
        source: { label: "README · Evaluation", href: `${GH}/AI-Resume-Assistant#evaluation`, quote: "Over-claim rate: 0.0" },
      },
      {
        value: "6 / 6",
        label: "Resume files parsed, including a two-column PDF and Word",
        source: { label: "README · Evaluation", href: `${GH}/AI-Resume-Assistant#evaluation`, quote: "Files parsed: v1 5/6 (no DOCX) · v2 6/6; Section F1 0.732 → 1.0" },
      },
    ],
    metricsNote:
      "Measured on six synthetic resumes and four job ads that I labelled myself while building v2. They show the change from v1 on known cases, not accuracy on unseen resumes.",
    next: ["Real, consented resumes labelled by someone else", "A usability study (the plan is in the case study)", "OCR for image-only resumes"],
    honesty: "Built with Claude Code under my direction: I set the product direction and requirements, and reviewed the design, code and evaluations.",
  },

  margin: {
    slug: "margin",
    title: "Margin",
    tagline: "A document assistant you can check.",
    intro:
      "Upload a contract, paper, policy or report. Margin summarises it, answers questions, pulls out key facts and compares documents, and every claim comes with a quote that is verified and highlighted on the real page in one click.",
    meta: {
      role: "Product direction, UX and interface, retrieval and evaluation design",
      type: "AI product · rebuild of my own v1",
      stack: "Python, FastAPI, Gemini, local embeddings, Next.js",
      status: "Live working prototype · evaluations run",
    },
    links: [
      { label: "Live demo", href: "https://margin-docs.vercel.app" },
      { label: "Their case study", href: "https://margin-docs.vercel.app/case-study" },
      { label: "Code", href: `${GH}/AI-Document-Summarizer` },
    ],
    problem: [
      { text: "AI summaries of contracts and reports sound confident, but you can't tell which parts are true." },
      {
        text: "Version 1 was one endpoint that sent a PDF's text to a model: no chunking, no retrieval, no citations, no interface.",
        source: { label: "README · What changed from v1", href: `${GH}/AI-Document-Summarizer#what-changed-from-v1` },
      },
    ],
    users: "People who have to act on long documents (contracts, policies, papers) and need to point at the sentence an answer came from.",
    decisions: [
      {
        title: "Verify, don't trust, citations",
        body: "The model cites passages and verbatim quotes; the server finds each quote in the document before the interface is allowed to call it verified.",
        source: { label: "Summary with a citation on the page", img: W("margin/summary-citation"), href: `${GH}/AI-Document-Summarizer#architecture` },
      },
      {
        title: "Fact and judgement, labelled",
        body: "Every claim is marked stated (the document says it) or interpretation, and every quote verified, approximate or not found.",
        source: { label: "Key facts, each with its page", img: W("margin/key-facts") },
      },
      {
        title: "Show the failure, don't hide it",
        body: "When 27 of 28 claims verify, the screen says so in an amber banner and flags the one it couldn't find in red.",
        source: { label: "README · screenshot note", img: W("margin/summary-citation"), quote: "27 of 28 claims verified, and the one it couldn't find in the document is flagged in red rather than hidden." },
      },
      {
        title: "“The document doesn't say”",
        body: "Questions are answered only from the document. When it has no answer, Margin says so, and shows which passages it searched.",
        source: { label: "Ask, with the source highlighted", img: W("margin/ask") },
      },
    ],
    shots: [
      { img: W("margin/summary-citation"), caption: "Summary: click any claim and its quote lights up on the page" },
      { img: W("margin/ask"), caption: "Ask: answers only from the document, with the passage highlighted" },
      { img: W("margin/key-facts"), caption: "Key facts: people, dates, figures, risks, each with its page" },
      { img: W("margin/dark"), caption: "Dark theme" },
      { img: W("margin/mobile"), caption: "Phone layout", phone: true },
    ],
    metrics: [
      {
        value: "46 / 47",
        label: "Answers containing every expected fact",
        source: { label: "README · Evaluation", href: `${GH}/AI-Document-Summarizer#evaluation`, quote: "Answers containing every expected fact: 0.979 (46/47)" },
      },
      {
        value: "6 / 7",
        label: "Unanswerable questions correctly refused",
        source: { label: "README · Evaluation", href: `${GH}/AI-Document-Summarizer#evaluation`, quote: "Unanswerable questions correctly refused: 0.857 (6/7) · Answerable questions wrongly refused: 0.0" },
      },
      {
        value: "100%",
        label: "Cited quotes verified in the source",
        source: { label: "README · Evaluation", href: `${GH}/AI-Document-Summarizer#evaluation`, quote: "Claims whose quote verified in the source: 1.0 · Claims labelled \"stated\" that didn't verify: 0" },
      },
      {
        value: "1.0",
        label: "Right page in the top 6 results (hit@6)",
        source: { label: "README · Retrieval", href: `${GH}/AI-Document-Summarizer#evaluation`, quote: "Hybrid (RRF): hit@6 1.0 on 47 labelled questions" },
      },
    ],
    metricsNote: "A small synthetic set written by the person who built the pipeline: evidence that grounding holds, not a benchmark. The one wrong answer and the failed refusal are described in the README.",
    next: ["OCR for scanned PDFs", "Accounts and sharing", "A usability study (the plan is in the case study)"],
    honesty: "Built with Claude Code under my direction: I set the product direction and requirements, and reviewed the design, code and evaluations.",
  },

  fitflow: {
    slug: "fitflow",
    title: "FITFLOW AI",
    tagline: "Every lead followed up. Every client kept.",
    intro:
      "An interactive product prototype for fitness influencers and creators who coach their followers. A Today queue says who to message and why, sequences pause when someone replies, and every AI draft explains its reasoning. The creator always presses send.",
    meta: {
      role: "Problem and users, product definition, UX/UI, design system, motion",
      type: "Product prototype · sample data, simulated AI",
      stack: "Figma, Next.js, TypeScript, Tailwind, GSAP",
      status: "Live interactive prototype",
    },
    links: [
      { label: "Live demo", href: "https://fitflow-showcase.vercel.app" },
      { label: "Their case study", href: "https://fitflow-showcase.vercel.app/case-study" },
      { label: "Figma file", href: "https://www.figma.com/design/tplM1llRbk13QxwC9bzAxU" },
      { label: "Walkthrough", href: "https://fitflow-showcase.vercel.app/walkthrough.mp4" },
    ],
    problem: [
      { text: "Fitness creators build an audience long before they build a business. Enquiries arrive as DMs and comments, and follow-ups live in memory." },
      { text: "Interested people rarely say no; they go quiet when nobody checks back in. Clients drift the same way after a tough week." },
    ],
    users: "Fitness influencers and creators, including coaches and trainers with a following, who run their business from Instagram DMs, WhatsApp and spreadsheets. (A design hypothesis: no research yet.)",
    decisions: [
      {
        title: "One loop, not a suite",
        body: "Version 2 focuses on a single loop: capture, prioritise, follow up, retain. Everything on screen serves it.",
        cut: "Cut: v1's storefront builder",
        source: { label: "README · Product overview", href: "https://github.com/anuj1102001/fitflow-showcase#product-overview", quote: "Version 2 dropped the storefront builder from version 1 to focus on that loop." },
      },
      {
        title: "Today, ranked",
        body: "The home screen is a queue of who to message and why: replies first, then due steps, overdue leads and slipping clients, each with one action.",
        source: { label: "Today queue", img: W("fitflow/today") },
      },
      {
        title: "AI drafts, people decide",
        body: "Every draft opens with “Why this draft”: the signals it used and the checks it ran. Nothing is ever sent by the product.",
        source: { label: "Compose with its reasoning", img: W("fitflow/compose") },
      },
      {
        title: "A system, designed in Figma first",
        body: "Light and dark themes, one lime accent for primary actions, Geist type, one easing curve. Every colour token in code is mirrored by a variable in the Figma file.",
        source: { label: "Figma file", href: "https://www.figma.com/design/tplM1llRbk13QxwC9bzAxU" },
      },
    ],
    shots: [
      { img: W("fitflow/today"), caption: "Today: who to message and why, ranked" },
      { img: W("fitflow/landing"), caption: "Landing page with a live product shot" },
      { img: W("fitflow/compose"), caption: "Compose: a streamed draft with “Why this draft”" },
      { img: W("fitflow/overview-dark"), caption: "Dark theme" },
      { img: W("fitflow/mobile-today"), caption: "Phone layout", phone: true },
    ],
    next: ["Interviews with fitness creators who sell coaching online", "A real model behind the drafts, with the same explanations", "Usability testing of the Today queue"],
    honesty: "A portfolio prototype: fictional creator, sample data, simulated AI; no messages are ever sent. Built with Claude Code under my direction.",
  },

  "creators-store": {
    slug: "creators-store",
    title: "Creators Store",
    tagline: "Keep every rupee.",
    intro:
      "A store, UPI checkout and instant delivery in one bio link for Indian creators in every niche. Buyers pay straight into the creator's own Razorpay account, so the platform takes 0% commission and never holds the money.",
    meta: {
      role: "Product, UX and interface, payments flow, full stack",
      type: "Live product · early stage",
      stack: "Next.js, TypeScript, PostgreSQL, Drizzle, Razorpay API",
      status: "Live on its own domain · no paying customers yet",
    },
    links: [
      { label: "Live site", href: "https://www.creators-store.site" },
      { label: "Walkthrough", href: "https://anuj1102001.github.io/creators-store-showcase/watch.html" },
      { label: "Showcase", href: `${GH}/creators-store-showcase` },
    ],
    problem: [
      { text: "Creators who sell on Instagram take orders in DMs and check UPI screenshots by hand." },
      { text: "The tools that fix that take a cut of every sale, or hold the money and pay out later." },
    ],
    users: "Indian influencers and creators in every niche who sell programs, courses, downloads, calls or services to their followers.",
    decisions: [
      {
        title: "The creator's own Razorpay",
        body: "Checkout runs on the creator's account and Razorpay settles to their bank. The platform never touches the money, so it can't hold it.",
        source: { label: "Guided Razorpay setup", img: W("creators/payments") },
      },
      {
        title: "Earn from a flat plan, not a cut",
        body: "0% commission on every plan; the business is a flat subscription. A fee calculator lets creators see the difference on their own numbers.",
        source: { label: "Fee calculator", img: W("creators/fees") },
      },
      {
        title: "Fulfil only after verification",
        body: "Orders are delivered only after the payment is verified on the server, with reconciliation for buyers who close the tab before returning.",
        source: { label: "Showcase · Features", href: `${GH}/creators-store-showcase#features` },
      },
      {
        title: "AI only when it's real",
        body: "The AI tools are built, but until a real model runs them they sit in a clearly labelled preview, not advertised and not in any plan.",
        cut: "Cut from marketing: AI features on sample output",
      },
    ],
    shots: [
      { img: W("creators/home"), caption: "Home: the money path, from buyer to the creator's bank" },
      { img: W("creators/fees"), caption: "Fee calculator: 0% commission against a typical platform" },
      { img: W("creators/dashboard"), caption: "Dashboard with the “You kept” card" },
      { img: W("creators/payments"), caption: "Guided payments setup with a test purchase" },
      { img: W("creators/home-mobile"), caption: "Phone layout", phone: true },
    ],
    metrics: [
      {
        value: "33",
        label: "Automated tests on payments, refunds and webhooks",
        source: { label: "Showcase · Quality", href: `${GH}/creators-store-showcase#quality`, quote: "33 automated tests … covering checkout, payment verification, tampered amounts, forged signatures, refunds, webhooks …" },
      },
      {
        value: "0%",
        label: "Commission, on every plan",
        source: { label: "Showcase · Why it's different", href: `${GH}/creators-store-showcase#why-its-different` },
      },
    ],
    metricsNote: "Tested end to end on production in Razorpay test mode. Early stage, with no paying customers yet.",
    next: ["First creators onboarded, with their feedback", "Custom domains for stores", "The AI tools on a real model"],
    honesty: "The application source is private; the showcase repository documents it. Built with Claude Code under my direction.",
  },

  comet: {
    slug: "comet",
    title: "COMET 2.0",
    tagline: "Mumbai in Motion.",
    intro:
      "An original sneaker concept told through everyday Mumbai (local trains, the CSMT terminus, vintage postcards, street lettering), carried from the shoe to the box, the campaign and a scroll-driven launch site.",
    meta: { role: "Concept, art direction, packaging, motion, launch site", type: "Brand concept · fictional label", stack: "AI image tools (art-directed), Next.js, Lenis", status: "Live launch site" },
    links: [
      { label: "Launch site", href: "https://comet-mumbai.vercel.app" },
      { label: "Case study", href: "https://comet-mumbai.vercel.app/case-study" },
      { label: "Code", href: `${GH}/comet-2-mumbai-in-motion` },
    ],
    problem: [{ text: "City-themed products tend to become souvenirs: every landmark at once, flattened into a collage." }],
    users: "A design exercise: a launch story for a collection, not a product for sale.",
    decisions: [
      { title: "Everyday life, not landmarks", body: "Three editions on one silhouette, each drawn from daily Mumbai rather than postcard sights." },
      { title: "Drop the weak 3D", body: "A parametric real-time WebGL shoe looked worse than the approved renders, so it was replaced by them, labelled as renders.", cut: "Cut: the real-time 3D shoe" },
      { title: "Label every claim", body: "The case study marks each statement as desk research, hypothesis, proposal or built." },
    ],
    shots: [
      { img: W("comet/local-lateral-hero"), caption: "The Local edition" },
      { img: W("comet/box-terracotta"), caption: "Poster-box packaging" },
      { img: W("comet/postcard-lateral"), caption: "The Postcard edition" },
    ],
    next: [],
    honesty: "A fictional label made for this portfolio, not affiliated with any brand. Imagery made with AI image tools under my art direction.",
  },

  solune: {
    slug: "solune",
    title: "Solune & Afterdark",
    tagline: "Two coffees, one for each half of the day.",
    intro:
      "A coffee brand concept presented as an interactive publication: a liquid-coffee opening you can stir with the cursor, a 3D pour bar that builds a serve, and photoreal bottles path-traced from the site's own 3D models.",
    meta: { role: "Concept, art direction, WebGL, motion, sound", type: "Brand concept · interactive publication", stack: "Raw WebGL2 / GLSL, Three.js, path tracing, GSAP", status: "Live site" },
    links: [{ label: "Live site", href: "https://solune-afterdark.vercel.app" }],
    problem: [{ text: "Brand concepts usually stop at a moodboard and flat mockups, so you never get a feel for the product." }],
    users: "A design exercise in product storytelling and interaction.",
    decisions: [
      { title: "Touch the product", body: "The opening is a ribbon of about 120,000 grains of liquid coffee in raw WebGL2, with the real bottle rising out of it." },
      { title: "Photoreal from our own models", body: "Product shots are path-traced in the browser: glass with wall thickness, coffee as a volume light passes through." },
      {
        title: "Measure the speed",
        body: "An audit of the previous version cut total blocking time from 5,435 ms to 537 ms (production build, desktop, on my machine).",
        source: { label: "README · Performance", quote: "Total blocking time (CPU 1×): 5,435 ms → 537 ms" },
      },
    ],
    shots: [
      { img: W("solune/hero-new"), caption: "The liquid opening, Afterdark, with the path-traced bottle" },
      { img: W("solune/trio"), caption: "Path-traced studio shot of the three Afterdark blends" },
      { img: W("solune/pour-bar"), caption: "The 3D pour bar" },
      { img: W("solune/night-dial"), caption: "The night dial" },
    ],
    next: [],
    honesty: "A concept: brands, bottles and labels designed by me; campaign imagery made with AI image tools under my art direction. Nothing is for sale.",
  },
};

export const CASE_ORDER = ["shortlist", "margin", "fitflow", "creators-store", "comet", "solune"];
