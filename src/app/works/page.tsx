import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { SectionDivider } from "@/components/ui";
import { WorksGrid } from "@/components/WorksGrid";
import { Contact } from "@/components/sections/Contact";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Works",
  description: `Selected work by ${site.name} — brand systems, digital experiences and creative direction.`,
};

export default function WorksPage() {
  return (
    <AppShell>
      <section className="flex flex-col">
        <PageHeader />
        <div className="section pt-0">
          <div className="flex flex-col gap-12">
            <h1 className="text-[36px] leading-[1.08] font-medium tracking-display sm:text-[52px] lg:text-[64px]">
              Projects that <br />
              tell you stories
            </h1>
            <WorksGrid />
          </div>
        </div>
      </section>
      <SectionDivider />
      <Contact />
    </AppShell>
  );
}