import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { SectionDivider, Chip } from "@/components/ui";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { services } from "@/data/services";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Services",
  description: `Services offered by ${site.name} — brand essentials, digital experience, brand systems and creative direction.`,
};

export default function ServicesPage() {
  return (
    <AppShell>
      <section className="flex flex-col">
        <PageHeader />

        <div className="section pt-0">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <h1 className="max-w-[600px] text-[36px] leading-[1.08] font-medium tracking-display sm:text-[52px] lg:text-[64px]">
                Crafting visuals <br />
                that lead, not follow.
              </h1>
              <p className="max-w-[304px] text-base leading-[1.45] text-muted">
                I help brands shape strong visual identities and digital
                experiences through thoughtful direction and design.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {services.map((s, i) => (
                <Reveal key={s.slug} delay={(i % 2) * 0.05}>
                  <article className="flex flex-col gap-6 rounded-[32px] border border-line bg-card p-6 sm:gap-8 sm:rounded-[40px] sm:p-8">
                    <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink-2 text-white">
                        <s.icon size={22} />
                      </span>

                      <div className="flex flex-col gap-6 lg:flex-1">
                        <div className="flex flex-col gap-2">
                          <h2 className="text-[26px] leading-[1.125] font-medium tracking-[-0.02em] sm:text-[32px]">
                            {s.title}
                          </h2>
                          <p className="max-w-[420px] text-base leading-5 text-muted">
                            {s.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap content-start gap-2">
                          {s.tags.map((t) => (
                            <Chip key={t} className="h-10">
                              {t}
                            </Chip>
                          ))}
                        </div>
                      </div>

                      <ul className="flex flex-col gap-2 lg:w-[322px] lg:shrink-0">
                        {s.checklist.map((c) => (
                          <li key={c} className="flex items-start gap-3">
                            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-card-soft">
                              <Check size={14} />
                            </span>
                            <span className="text-sm leading-5 font-medium">
                              {c}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-6 border-t border-dashed border-ink/20 pt-6 sm:flex-row sm:items-end sm:justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted">
                          From
                        </span>
                        <span className="text-2xl font-medium tracking-[-0.03em]">
                          {s.price}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href="/#contact"
                          className="btn-dark inline-flex h-10 items-center gap-2 rounded-[10px] px-6 text-sm font-medium text-white"
                        >
                          Book a Call <ArrowUpRight size={16} />
                        </Link>
                        <Link
                          href={`/services/${s.slug}`}
                          className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-line px-6 text-sm font-medium text-ink transition-colors hover:bg-line/60"
                        >
                          View Detail <ArrowUpRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />
      <Faq />
      <SectionDivider />
      <Contact />
    </AppShell>
  );
}
