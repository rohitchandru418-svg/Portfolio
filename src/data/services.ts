import type { LucideIcon } from "lucide-react";
import {
  MonitorSmartphone,
  Layers,
  PenTool,
  Presentation,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  /** Deliverables listed beside the tags on the Services page. */
  checklist: string[];
  price: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    slug: "brand-essentials",
    title: "Brand Essentials",
    description:
      "A strong starting point for brands that need clarity and direction.",
    tags: [
      "Logo Design",
      "Basic Visual System",
      "Color & Typography",
      "Mini Brand Guidelines",
    ],
    checklist: [
      "Build memorable foundations for brands.",
      "Essential identity assets for growing businesses.",
      "Strong branding starts with solid foundations.",
    ],
    price: "$800/project",
    icon: PenTool,
  },
  {
    slug: "digital-experience",
    title: "Digital Experience",
    description:
      "Modern, conversion-focused design for web and digital products.",
    tags: [
      "Landing Page Design",
      "UI & Layout Systems",
      "Responsive Design",
      "Prototyping",
    ],
    checklist: [
      "Responsive across three breakpoints",
      "Interactive prototype",
      "Developer-ready handoff",
    ],
    price: "$1,500/project",
    icon: MonitorSmartphone,
  },
  {
    slug: "brand-system",
    title: "Brand System",
    description:
      "A complete visual foundation across brand and digital touchpoints.",
    tags: [
      "Full Brand Identity",
      "Website Design",
      "Visual Consistency Guidelines",
    ],
    checklist: [
      "Complete identity kit",
      "Website design included",
      "Full guideline document",
    ],
    price: "$2,500/project",
    icon: Layers,
  },
  {
    slug: "creative-direction",
    title: "Creative Direction",
    description: "End-to-end art direction for brands aiming to stand out.",
    tags: ["Concept & Campaign Direction", "Key Visual Development"],
    checklist: [
      "Campaign concept and rationale",
      "Shot list and references",
      "Ongoing direction through production",
    ],
    price: "$3,500/project",
    icon: Presentation,
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
