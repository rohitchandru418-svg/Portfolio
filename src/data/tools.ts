export type ToolGroup = "Design" | "Prototyping & Dev" | "AI & Vibe Coding" | "Collaboration";

export type Tool = {
  name: string;
  purpose: string;
  level: number; // 0-100 proficiency, rendered as a bar
  group: ToolGroup;
};

export const tools: Tool[] = [
  { name: "Figma", purpose: "Product & UI design", level: 95, group: "Design" },
  { name: "FigJam", purpose: "Workshops & flows", level: 90, group: "Design" },
  { name: "Photoshop", purpose: "Retouching & visuals", level: 85, group: "Design" },
  { name: "Illustrator", purpose: "Brand & illustration", level: 85, group: "Design" },
  { name: "After Effects", purpose: "Motion & prototypes", level: 70, group: "Design" },
  { name: "Canva", purpose: "Fast social creatives", level: 80, group: "Design" },
  { name: "Framer", purpose: "Interactive prototypes", level: 75, group: "Prototyping & Dev" },
  { name: "HTML / CSS / JS", purpose: "Front-end build", level: 70, group: "Prototyping & Dev" },
  { name: "React (basic)", purpose: "Component hand-off", level: 55, group: "Prototyping & Dev" },
  { name: "ChatGPT", purpose: "Drafting & ideation", level: 90, group: "AI & Vibe Coding" },
  { name: "Claude", purpose: "Research & copy", level: 90, group: "AI & Vibe Coding" },
  { name: "Cursor", purpose: "Vibe coding", level: 80, group: "AI & Vibe Coding" },
  { name: "Lovable / v0", purpose: "Rapid app scaffolds", level: 75, group: "AI & Vibe Coding" },
  { name: "Notion", purpose: "Docs & planning", level: 85, group: "Collaboration" },
  { name: "Jira", purpose: "Sprint tracking", level: 80, group: "Collaboration" },
  { name: "Slack", purpose: "Team comms", level: 90, group: "Collaboration" },
  { name: "Figma Dev Mode", purpose: "Developer hand-off", level: 85, group: "Collaboration" },
];

export const softSkills = [
  "Team collaboration",
  "Communication",
  "Stakeholder management",
  "Design thinking",
  "Rapid prototyping",
];
