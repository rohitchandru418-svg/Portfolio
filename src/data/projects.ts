/**
 * Projects / case studies.
 *
 * Titles, covers and links are Chandru's real public work from Behance
 * (behance.net/rohitchandru418). Each cover is exported to
 * /public/figma/work-*.webp and cropped square to match the tile.
 *
 * The write-ups are still to be filled in from the source galleries — until
 * then /work/[slug] shows a "case study coming soon" note.
 */

export type ProjectCategory =
  | "Web3"
  | "SaaS"
  | "Civic Tech"
  | "AI"
  | "Branding"
  | "Presentation";

export type CaseStudySection = {
  heading: string;
  body: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  category: ProjectCategory;
  tags: string[];
  cover?: string;
  images?: string[];
  /** Public Behance gallery for this project. */
  link?: string;
  featured?: boolean;
  confidential?: boolean;
  /** Case-study detail (used by /work/[slug]) */
  role?: string;
  team?: string;
  timeline?: string;
  platform?: string;
  tools?: string[];
  industry?: string;
  sections?: CaseStudySection[];
};

export const projects: Project[] = [
  {
    slug: "yield-farming-game-ui",
    title: "Yield Farming Game UI",
    summary:
      "Game interface for a yield-farming title — reward screens, farming flows and asset views designed to make a dense DeFi mechanic feel playable.",
    year: "2024",
    cover: "/figma/work-01.webp",
    link: "https://www.behance.net/gallery/199121171/Yield-Farming-Game-UI-design",
    category: "Web3",
    tags: ["Game UI", "Web3", "Mobile"],
    featured: true,
    role: "UI/UX Designer",
    platform: "Mobile",
    tools: ["Figma"],
    industry: "Crypto / Gaming",
  },
  {
    slug: "nfl-fantasy-game-ui",
    title: "NFL Fantasy Game UI",
    summary:
      "Fantasy-sports game UI covering roster building, live scoring and match-day views for a US audience.",
    year: "2023",
    cover: "/figma/work-02.webp",
    link: "https://www.behance.net/gallery/186362367/NFL-Fantasy-Game-UI-Design",
    category: "Web3",
    tags: ["Game UI", "Sports", "Mobile"],
    featured: true,
    role: "UI/UX Designer",
    platform: "Mobile",
    tools: ["Figma"],
    industry: "Sports / Gaming",
  },
  {
    slug: "dashboard-design",
    title: "Dashboard Design",
    summary:
      "Data-dense dashboard built for legibility — clear hierarchy, calm surfaces and fast scanning of key metrics.",
    year: "2023",
    cover: "/figma/work-03.webp",
    link: "https://www.behance.net/gallery/186361545/Dashboard-Design",
    category: "SaaS",
    tags: ["Dashboard", "SaaS", "Data"],
    featured: true,
    role: "UI/UX Designer",
    platform: "Web",
    tools: ["Figma"],
    industry: "SaaS",
  },
  {
    slug: "website-design",
    title: "Website Design",
    summary:
      "Marketing website design with an editorial layout, considered type scale and a clear path to conversion.",
    year: "2023",
    cover: "/figma/work-04.webp",
    link: "https://www.behance.net/gallery/186360611/Website-Design",
    category: "SaaS",
    tags: ["Web", "Marketing"],
    featured: true,
    role: "UI/UX Designer",
    platform: "Web",
    tools: ["Figma"],
    industry: "Technology",
  },
  {
    slug: "game-card-nft-design",
    title: "Game Card & NFT Design",
    summary:
      "Collectible card and NFT artwork system — rarity tiers, frames and traits designed to read at thumbnail size.",
    year: "2023",
    cover: "/figma/work-05.webp",
    link: "https://www.behance.net/gallery/184966815/Game-Card-NFT-Design",
    category: "Web3",
    tags: ["NFT", "Game Art", "Web3"],
    featured: true,
    role: "Visual / UI Designer",
    platform: "Web, Mobile",
    tools: ["Figma", "Photoshop"],
    industry: "Crypto / Gaming",
  },
  {
    slug: "garden-app-case-study",
    title: "Garden App — UI/UX Case Study",
    summary:
      "End-to-end case study for a plant-care app, from research and flows through to a polished, friendly interface.",
    year: "2022",
    cover: "/figma/work-06.webp",
    link: "https://www.behance.net/gallery/140931803/Garden-App-UIUX-Case-Study",
    category: "SaaS",
    tags: ["Case Study", "Mobile", "UX"],
    featured: true,
    role: "UI/UX Designer",
    platform: "Mobile",
    tools: ["Figma"],
    industry: "Lifestyle",
  },
  {
    slug: "web-design-ui",
    title: "Web Design UI",
    summary:
      "Website UI exploration balancing strong imagery with a restrained, readable content layout.",
    year: "2023",
    cover: "/figma/work-07.webp",
    link: "https://www.behance.net/gallery/183339671/Web-Design-UI",
    category: "SaaS",
    tags: ["Web", "UI"],
    role: "UI Designer",
    platform: "Web",
    tools: ["Figma"],
    industry: "Various",
  },
  {
    slug: "bitez-signup-page",
    title: "BITEZ Sign-Up Page",
    summary:
      "Sign-up and onboarding screen design for a food app, tuned to reduce friction at first contact.",
    year: "2023",
    cover: "/figma/work-08.webp",
    link: "https://www.behance.net/gallery/179875711/BITEZ-SIGN-UP-PAGE-UI-DESIGN",
    category: "SaaS",
    tags: ["Onboarding", "Mobile", "UI"],
    role: "UI Designer",
    platform: "Mobile",
    tools: ["Figma"],
    industry: "Food Tech",
  },
  {
    slug: "nike-landing-page",
    title: "NIKE Landing Page",
    summary:
      "Concept landing page with bold product framing and a campaign-led visual rhythm.",
    year: "2022",
    cover: "/figma/work-09.webp",
    link: "https://www.behance.net/gallery/140422889/NIKE-Landing-Page",
    category: "Branding",
    tags: ["Landing Page", "Concept"],
    role: "UI Designer",
    platform: "Web",
    tools: ["Figma", "Photoshop"],
    industry: "Retail",
  },
  {
    slug: "covid19-info-page",
    title: "COVID-19 Info Page",
    summary:
      "Public-information page design making health guidance and statistics easy to scan and trust.",
    year: "2022",
    cover: "/figma/work-10.webp",
    link: "https://www.behance.net/gallery/139625695/COVID-19-INFO-PAGE",
    category: "Civic Tech",
    tags: ["Civic Tech", "Web", "Information"],
    role: "UI Designer",
    platform: "Web",
    tools: ["Figma"],
    industry: "Public Health",
  },
  {
    slug: "game-asset-illustrations",
    title: "Game Asset Illustrations",
    summary:
      "Illustration set for game environments and props, built as a consistent, reusable asset library.",
    year: "2023",
    cover: "/figma/work-11.webp",
    link: "https://www.behance.net/gallery/184965937/Game-Asset-Illustrations",
    category: "Branding",
    tags: ["Illustration", "Game Art"],
    role: "Visual Designer",
    platform: "Digital",
    tools: ["Illustrator", "Photoshop"],
    industry: "Gaming",
  },
  {
    slug: "dashboard-analytics",
    title: "Dashboard Design — Analytics",
    summary:
      "Analytics view extending the dashboard system — charting, filters and comparison states.",
    year: "2023",
    cover: "/figma/work-12.webp",
    link: "https://www.behance.net/gallery/186360979/Dashboard-Design",
    category: "SaaS",
    tags: ["Dashboard", "Analytics", "SaaS"],
    role: "UI/UX Designer",
    platform: "Web",
    tools: ["Figma"],
    industry: "SaaS",
  },
];

/** The four tabs shown in the reference's filter row. */
export const workFilters = [
  "Brand Essentials",
  "Digital Experience",
  "Brand System",
  "Creative Direction",
] as const;

export type WorkFilter = (typeof workFilters)[number];

/** Map each project's category onto one of the four reference tabs. */
export function workFilterOf(p: Project): WorkFilter {
  switch (p.category) {
    case "Branding":
    case "Presentation":
      return "Brand Essentials";
    case "SaaS":
    case "AI":
      return "Digital Experience";
    case "Web3":
      return "Brand System";
    default:
      return "Creative Direction";
  }
}

export const projectCategories: ("All" | ProjectCategory)[] = [
  "All",
  "Web3",
  "SaaS",
  "Civic Tech",
  "AI",
  "Branding",
  "Presentation",
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}