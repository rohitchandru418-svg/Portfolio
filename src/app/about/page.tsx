import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { SectionDivider } from "@/components/ui";
import { AboutHero } from "@/components/sections/AboutHero";
import { AboutPhilosophy } from "@/components/sections/AboutPhilosophy";
import { AboutExperience } from "@/components/sections/AboutExperience";
import { AboutArchive } from "@/components/sections/AboutArchive";
import { Contact } from "@/components/sections/Contact";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}, ${site.role} with ${site.yearsExperience} years of experience.`,
};

export default function AboutPage() {
  return (
    <AppShell>
      <AboutHero />
      <AboutPhilosophy />
      <AboutExperience />
      <SectionDivider />
      <AboutArchive />
      <SectionDivider />
      <Contact />
    </AppShell>
  );
}
