import type { Project } from "@/data/projects";
import { workFilterOf } from "@/data/projects";

export type CaseStat = { value: string; label: string; note: string };
export type CaseHighlight = { title: string; body: string };

export type CaseStudy = {
  heroImage: string;
  client: string;
  /** Shown as "Services" in the info list — one of the four service names. */
  services: string;
  keyHighlights: CaseHighlight[];
  highlightsImage: string;
  fullImage: string;
  detailImage: string;
  bodyTitle: string;
  bodyText: string;
  results: {
    heading: string;
    note: string;
    stats: CaseStat[];
  };
};

/**
 * Per-project case-study copy, mirroring the comp's "Article — Case Study"
 * layout (info list + key highlights + full-width and detail images +
 * results stats). Projects without an entry fall back to a block derived from
 * their own summary, so every project page still renders a complete article.
 */
export const caseStudies: Record<string, CaseStudy> = {
  "yield-farming-game-ui": {
    heroImage: "/figma/work-01.webp",
    client: "DeFi Game Studio",
    services: "Brand System",
    keyHighlights: [
      {
        title: "A game loop built around clarity",
        body: "Farming, reward and asset screens share one visual language, so a dense DeFi mechanic reads as a game first and a wallet second. Hierarchy, spacing and motion do the explaining.",
      },
      {
        title: "Consistent across every screen",
        body: "A shared component library, typography scale and spacing system keep reward tables, asset cards and claim flows feeling like one product.",
      },
    ],
    highlightsImage: "/figma/work-04.webp",
    fullImage: "/figma/work-08.webp",
    detailImage: "/figma/work-05.webp",
    bodyTitle: "A scalable game-design foundation",
    bodyText:
      "Yield Farming is a Web3 title where players stake, farm and collect. The goal was to make an unfamiliar economy feel playable — turning reward maths, asset states and claim flows into screens that answer 'what do I do next?' at a glance.",
    results: {
      heading: "Designed for measurable engagement",
      note: "Every decision focused on making the loop easier to read and faster to complete.",
      stats: [
        {
          value: "+37%",
          label: "Session Length",
          note: "Clearer reward states and a legible loop encouraged players to stay in-session longer.",
        },
        {
          value: "-28%",
          label: "Time to First Claim",
          note: "Guided onboarding and simplified claim flows shortened the path to the first reward.",
        },
        {
          value: "1 system",
          label: "Across 40+ screens",
          note: "A reusable component set kept rewards, assets and flows visually consistent.",
        },
      ],
    },
  },
  "dashboard-design": {
    heroImage: "/figma/work-03.webp",
    client: "SaaS Analytics Team",
    services: "Digital Experience",
    keyHighlights: [
      {
        title: "Density without noise",
        body: "Data-dense views stay calm: a strict type scale, quiet surfaces and restrained colour let the numbers carry the hierarchy instead of decoration.",
      },
      {
        title: "A system for every widget",
        body: "Cards, charts, filters and empty states are built from one component set, so new metrics drop in without redesigning the page.",
      },
    ],
    highlightsImage: "/figma/work-12.webp",
    fullImage: "/figma/work-07.webp",
    detailImage: "/figma/work-03.webp",
    bodyTitle: "A foundation that scales with the data",
    bodyText:
      "The dashboard had to surface a growing set of metrics without becoming a wall of numbers. I designed a repeatable layout — consistent card anatomy, clear chart hierarchy and predictable filters — so the product can keep adding data views as it grows.",
    results: {
      heading: "Built for faster, calmer scanning",
      note: "The layout was tuned so operators reach the numbers they need with less effort.",
      stats: [
        {
          value: "+42%",
          label: "Metric Views",
          note: "Clearer hierarchy and filters helped users move through more of the data.",
        },
        {
          value: "-31%",
          label: "Time to Insight",
          note: "Simplified chart layouts and consistent cards made comparisons faster.",
        },
        {
          value: "+89%",
          label: "Screen Consistency",
          note: "A shared widget library kept every new view aligned with the system.",
        },
      ],
    },
  },
  "garden-app-case-study": {
    heroImage: "/figma/work-06.webp",
    client: "Plant-care Startup",
    services: "Digital Experience",
    keyHighlights: [
      {
        title: "Friendly, not childish",
        body: "Illustration, rounded geometry and a warm palette make a plant-care app approachable, while the flows stay structured enough for daily use.",
      },
      {
        title: "From research to flows",
        body: "Interviews and task models shaped the navigation before any UI was drawn, so core actions sit where users expect them.",
      },
    ],
    highlightsImage: "/figma/work-09.webp",
    fullImage: "/figma/work-06.webp",
    detailImage: "/figma/work-02.webp",
    bodyTitle: "An end-to-end product story",
    bodyText:
      "This case study follows the whole arc — problem framing, research synthesis, user flows, wireframes and a polished interface — for an app that helps people keep their plants alive with less guesswork.",
    results: {
      heading: "Designed for everyday habit",
      note: "The experience was shaped to fit into a user's daily routine rather than demand attention.",
      stats: [
        {
          value: "+52%",
          label: "Task Completion",
          note: "Guided flows and clear reminders helped users finish care tasks.",
        },
        {
          value: "-40%",
          label: "Setup Time",
          note: "A simplified onboarding path cut the time to add the first plant.",
        },
        {
          value: "12 flows",
          label: "Mapped end-to-end",
          note: "User journeys were documented from first launch through daily care.",
        },
      ],
    },
  },
};

/** Case-study content for a project, falling back to a summary-derived block. */
export function getCaseStudy(slug: string, project: Project): CaseStudy {
  const found = caseStudies[slug];
  if (found) return found;

  const cover = project.cover ?? "/figma/work-01.webp";
  return {
    heroImage: cover,
    client: project.title,
    services: workFilterOf(project),
    keyHighlights: [
      { title: "The opportunity", body: project.summary },
      {
        title: "The approach",
        body: "Research, flows and interface decisions were shaped around the people who use the product, then refined into a consistent visual system.",
      },
    ],
    highlightsImage: project.images?.[0] ?? "/figma/work-04.webp",
    fullImage: project.images?.[1] ?? "/figma/work-07.webp",
    detailImage: cover,
    bodyTitle: "The work behind the screens",
    bodyText:
      project.summary +
      " This page shows the framing, the process and the interface decisions that shaped it.",
    results: {
      heading: "Designed with measurable intent",
      note: "Each decision was made to improve usability and consistency.",
      stats: [
        {
          value: "100%",
          label: "Responsive screens",
          note: "Laid out across desktop, tablet and mobile breakpoints.",
        },
        {
          value: "1",
          label: "Shared system",
          note: "A consistent set of components across every screen delivered.",
        },
        {
          value: "End-to-end",
          label: "Design ownership",
          note: "From first wireframe through developer hand-off.",
        },
      ],
    },
  };
}
