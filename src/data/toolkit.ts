/** Toolkit cards shown in the reference: logo, purpose and a level pill. */
export type ToolkitTool = {
  name: string;
  purpose: string;
  level: number;
  logo: string;
};

export const toolkitTools: ToolkitTool[] = [
  {
    name: "Figma",
    purpose: "Interface & system design",
    level: 95,
    logo: "/figma/toolkit/figma.webp",
  },
  {
    name: "Framer",
    purpose: "Interactive prototyping",
    level: 90,
    logo: "/figma/toolkit/framer.webp",
  },
  {
    name: "Adobe Photoshop",
    purpose: "Retouching & visual design",
    level: 88,
    logo: "/figma/toolkit/photoshop.webp",
  },
  {
    name: "After Effects",
    purpose: "Motion & micro-interactions",
    level: 80,
    logo: "/figma/toolkit/aftereffects.webp",
  },
  {
    name: "Adobe Illustrator",
    purpose: "Brand & illustration",
    level: 90,
    logo: "/figma/toolkit/illustrator.webp",
  },
  {
    name: "Blender",
    purpose: "3D & product visuals",
    level: 70,
    logo: "/figma/toolkit/blender.webp",
  },
];