import type { Service } from "@/data/services";

export type ServicePillar = {
  title: string;
  body?: string;
  items?: string[];
};

export type ServiceDetail = {
  /** Cover shown beside the hero. */
  image: string;
  /** Heading above the deliverables list. */
  deliverablesHeading: string;
  deliverablesNote: string;
  pillars: ServicePillar[];
};

export const serviceDetails: Record<string, ServiceDetail> = {
  "brand-essentials": {
    image: "/figma/work-03.webp",
    deliverablesHeading: "A strong foundation for every brand",
    deliverablesNote:
      "Everything your brand needs to stand out consistently.",
    pillars: [
      {
        title: "Overview",
        body: "Every memorable brand starts with a clear visual identity. Through research and strategic thinking, I craft logos, typography, colour palettes and essential brand assets that communicate who you are and why your audience should remember you.",
      },
      {
        title: "Our Approach",
        body: "Each project begins by understanding your business, audience and positioning. From there I explore creative directions, refine the strongest concepts, and build an identity that feels distinctive, timeless and flexible enough to grow with your brand.",
      },
      {
        title: "Deliveries",
        items: [
          "Logo Design & Variations",
          "Colour Palette & Typography",
          "Brand Guidelines",
          "Iconography & Visual Elements",
          "Social Media Assets",
          "Stationery & Brand Collateral",
          "Brand Style Guide",
          "Production-Ready Files",
        ],
      },
    ],
  },
  "digital-experience": {
    image: "/figma/work-06.webp",
    deliverablesHeading: "Digital products that convert and scale",
    deliverablesNote: "What you get across every screen and breakpoint.",
    pillars: [
      {
        title: "Overview",
        body: "Great digital products feel effortless. I design landing pages and product interfaces that balance clarity with personality, guiding people to the action that matters while staying consistent across the whole experience.",
      },
      {
        title: "Our Approach",
        body: "I start from the flow — who arrives, what they need and where they should land. Wireframes come first, then high-fidelity UI and an interactive prototype, so every decision is tested before a single line of code is written.",
      },
      {
        title: "Deliveries",
        items: [
          "Landing Page Design",
          "UI & Layout Systems",
          "Responsive Breakpoints",
          "Design Tokens & Styles",
          "Interactive Prototype",
          "Developer Handoff",
        ],
      },
    ],
  },
  "brand-system": {
    image: "/figma/work-01.webp",
    deliverablesHeading: "One system across brand and product",
    deliverablesNote: "A complete visual foundation that scales with you.",
    pillars: [
      {
        title: "Overview",
        body: "A brand system connects every touchpoint — from the logo to the marketing site — so the experience feels like one company no matter where your audience meets you.",
      },
      {
        title: "Our Approach",
        body: "I extend the core identity into a documented system: components, patterns and guidelines that your team and vendors can apply without diluting the brand.",
      },
      {
        title: "Deliveries",
        items: [
          "Full Brand Identity",
          "Website Design",
          "Visual Consistency Guidelines",
          "Component Library",
          "Template Assets",
          "Full Guideline Document",
        ],
      },
    ],
  },
  "creative-direction": {
    image: "/figma/work-05.webp",
    deliverablesHeading: "Direction that makes a brand stand out",
    deliverablesNote: "Concept through production, handled end to end.",
    pillars: [
      {
        title: "Overview",
        body: "Creative direction sets the tone for a campaign or launch. I define the concept, the visual language and the references that keep every asset pointed in the same direction.",
      },
      {
        title: "Our Approach",
        body: "I research the category, build a clear rationale and develop key visuals that carry the idea. Direction continues through production so the final work matches the intent.",
      },
      {
        title: "Deliveries",
        items: [
          "Concept & Campaign Direction",
          "Key Visual Development",
          "Shot List & References",
          "Visual Guidelines",
          "Production Oversight",
        ],
      },
    ],
  },
};

export function getServiceDetail(slug: string, service: Service): ServiceDetail {
  return (
    serviceDetails[slug] ?? {
      image: "/figma/work-01.webp",
      deliverablesHeading: `What ${service.title} includes`,
      deliverablesNote: "An overview of the work and deliverables.",
      pillars: [
        { title: "Overview", body: service.description },
        { title: "Deliveries", items: service.tags },
      ],
    }
  );
}
