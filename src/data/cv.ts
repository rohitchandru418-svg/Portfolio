/**
 * The CV that the printer prints.
 *
 * Assembled from the same data files that drive the site, so the printed pages
 * can never drift from the portfolio. Nothing here invents a metric or an
 * employer — it reshapes what `site`, `experience`, `projects`, `services` and
 * `tools` already say. Education comes from the project brief.
 */

import { site } from "./site";
import { experience } from "./experience";
import { projects } from "./projects";
import { tools, softSkills } from "./tools";
import { services } from "./services";

const featured = projects.filter((p) => p.featured).slice(0, 4);

/**
 * Each role as one CV paragraph, drawn from the brief's "core strengths" and
 * "industry verticals" — scope, not invented outcomes. A CV that claims a metric
 * nobody measured is worse than one that describes the work honestly.
 */
const ROLE_TEXT: Record<string, string> = {
  "Freelance UI/UX Designer|Self-employed":
    "Websites, mobile apps, pitch decks and email design for clients across SaaS, Web3 and civic tech. I run the full arc myself — research and user flows, wireframes, high-fidelity UI, prototypes and developer-ready hand-off — and stay involved through build and QA.",
  "UI/UX Designer|Service-based product studio":
    "Led design on a petition management platform for a political party, plus StartupTN (AI-native) and FameTN MSME Connect for government and civic programmes. Owned information architecture, workflow design and the high-fidelity UI, and worked shoulder to shoulder with engineering on the hand-off.",
  "UI/UX Designer|US SaaS company":
    "Designed SaaS application UI/UX for US clients, from dashboard architecture and data-dense screens to the component library the team shipped against. Set up the design system and hand-off that kept engineering moving without design debt.",
  "UI/UX Designer|Crypto / Web3 company":
    "Designed websites, mobile apps, web and Windows apps, plus on-device UI for a DePIN hardware product. Worked across GameFi, DeFi and DePIN — taking dense, unfamiliar mechanics and making them legible to people who had never used a wallet.",
};

export const cv = {
  name: site.name,
  monogram: site.monogram,
  role: site.role,
  handle: site.handle,

  contact: {
    email: site.email,
    phone: site.phone,
    location: site.location,
  },

  /** The large line under the name. */
  statement:
    "I design products people actually use — websites, apps and design systems, taken from research and flows through to developer-ready UI.",

  profile:
    "UI/UX designer with 5.5 years across crypto, SaaS, government and AI-native teams. I take products from research and user flows through high-fidelity UI, prototypes and design systems — with a bias for clarity, honest content and interfaces that feel obvious the first time you use them.",

  stats: site.stats,

  experience: experience.map((r) => ({
    title: r.title,
    company: r.company,
    period: r.period,
    body: ROLE_TEXT[`${r.title}|${r.company}`] ?? r.summary,
  })),

  education: [
    {
      title: "Bachelor of Media Technology",
      detail: "Specialised in UI/UX Design",
      period: "Graduated",
    },
  ],

  selectedWork: featured.map((p) => ({
    title: p.title,
    year: p.year,
    category: p.category,
    summary: p.summary,
    cover: p.cover?.replace("/figma/", "/cv/img/"),
  })),

  /** Smaller, CV-specific copies of the site imagery, generated at build. */
  portrait: "/cv/img/portrait.webp",

  tools: tools.map((t) => ({ name: t.name, purpose: t.purpose, group: t.group })),

  softSkills,

  services: services.map((s) => ({ title: s.title, description: s.description })),

  /** Page dimensions the renderer screenshots — A4 at 96dpi. */
  page: { width: 794, height: 1123 },
} as const;

export type Cv = typeof cv;