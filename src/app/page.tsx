import { AppShell } from "@/components/AppShell";
import { SectionDivider } from "@/components/ui";
import { Hero } from "@/components/sections/Hero";
import { Works } from "@/components/sections/Works";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Experience } from "@/components/sections/Experience";
import { Philosophy } from "@/components/sections/Philosophy";
import { Testimonials } from "@/components/sections/Testimonials";
import { Toolkits } from "@/components/sections/Toolkits";
import { Archive } from "@/components/sections/Archive";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <AppShell>
      <Hero />
      <SectionDivider />
      <Works />
      <SectionDivider />
      <Services />
      <SectionDivider />
      <Process />
      <SectionDivider />
      <Experience />
      {/* The comp leaves the Philosophy image band flush against its
          neighbours — no separator above or below it. */}
      <Philosophy />
      <Testimonials />
      <SectionDivider />
      <Toolkits />
      <SectionDivider />
      <Archive />
      <SectionDivider />
      <Faq />
      <SectionDivider />
      <Contact />
    </AppShell>
  );
}
