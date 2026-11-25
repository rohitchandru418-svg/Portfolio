import type { LucideIcon } from "lucide-react";
import { Search, Compass, PenTool, Rocket } from "lucide-react";

export type ProcessStep = {
  step: string;
  title: string;
  tags: string[];
  icon: LucideIcon;
};

export const processSteps: ProcessStep[] = [
  {
    step: "Step 01",
    title: "Discover & Define",
    tags: ["Research", "Stakeholders", "Market"],
    icon: Search,
  },
  {
    step: "Step 02",
    title: "Structure & Flows",
    tags: ["Flows", "IA", "Wireframes"],
    icon: Compass,
  },
  {
    step: "Step 03",
    title: "Design & System",
    tags: ["UI", "Design System", "Prototype"],
    icon: PenTool,
  },
  {
    step: "Step 04",
    title: "Refine & Deliver",
    tags: ["Hand-off", "QA", "Iteration"],
    icon: Rocket,
  },
];

export const processStat = {
  value: "98%",
  label: "Client satisfaction rate",
  note: "Trusted by founders and brands to deliver thoughtful creative direction, refined execution, and consistent design quality.",
};
