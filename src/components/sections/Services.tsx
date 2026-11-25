import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHead, Chip } from "@/components/ui";
import { services } from "@/data/services";

export function Services() {
  return (
    <section id="services" className="section">
      <div className="flex flex-col gap-12">
        <Reveal>
          <SectionHead
            eyebrow="Services"
            heading={
              <>
                Crafting visuals <br />
                that lead, not follow.
              </>
            }
            description="I help brands shape strong visual identities and digital experiences through thoughtful direction and design."
          />
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 2) * 0.05}>
              <article className="flex h-full min-h-[420px] flex-col justify-between rounded-[32px] bg-card p-6 sm:min-h-[564px] sm:rounded-[56px] sm:p-8">
                <div className="flex flex-col gap-10 pb-6">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-ink-2 text-white">
                    <s.icon size={22} />
                  </span>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-[26px] leading-[1.125] font-medium tracking-[-0.02em] sm:text-[32px]">
                        {s.title}
                      </h3>
                      <p className="max-w-[420px] text-base leading-5 text-muted">
                        {s.description}
                      </p>
                    </div>
                    <div className="flex min-h-[88px] flex-wrap content-start gap-2">
                      {s.tags.map((t) => (
                        <Chip key={t} className="h-10">
                          {t}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative flex items-end justify-between border-t border-dashed border-ink/20 pt-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-muted">From</span>
                    <span className="text-2xl font-medium tracking-[-0.03em]">
                      {s.price ?? "Let's talk"}
                    </span>
                  </div>
                  <a
                    href="#contact"
                    className="btn-dark inline-flex items-center gap-2 rounded-[10px] px-6 py-2.5 text-sm font-medium text-white"
                  >
                    Book a Call <ArrowUpRight size={16} />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}