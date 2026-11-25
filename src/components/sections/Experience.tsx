import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/ui";
import { experience } from "@/data/experience";

export function Experience() {
  return (
    <section id="experience" className="section">
      <div className="flex flex-col items-center gap-12">
        <Reveal>
          <SectionHead
            eyebrow="My Experience"
            align="center"
            heading={
              <>
                5.5 years of <span className="text-faint">building products.</span>
              </>
            }
          />
        </Reveal>

        <Reveal>
          <div className="w-full max-w-[624px] rounded-[56px] border border-line bg-card px-3 pt-3 pb-8">
            <div className="flex flex-col items-center rounded-[48px] bg-card-soft px-6 py-8 shadow-[0px_12px_30px_0px_rgba(0,0,0,0.15)]">
              {experience.map((r, i) => (
                <div key={`${r.company}-${r.period}`} className="contents">
                  <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                    <div className="flex flex-1 flex-col items-start text-left sm:items-end sm:text-right">
                      <p className="text-base leading-[1.25] font-medium">
                        {r.title}
                      </p>
                      <p className="text-base leading-[1.25] text-muted">
                        {r.company}
                      </p>
                      <p className="text-sm leading-[1.25] text-faint">{r.period}</p>
                    </div>

                    <span
                      className="hidden h-2 w-2 shrink-0 rounded-full bg-ink shadow-[0px_0px_0px_4px_rgba(9,9,11,0.08)] sm:block"
                      aria-hidden
                    />

                    <div className="w-full min-w-0 sm:w-[248px] sm:shrink-0">
                      <p className="text-sm leading-[1.45] text-muted">
                        {r.summary}
                      </p>
                    </div>
                  </div>
                  {i < experience.length - 1 ? (
                    <span className="h-12 w-px bg-line" aria-hidden />
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <a
                href="#contact"
                className="btn-dark inline-flex h-10 items-center gap-2 rounded-[10px] px-6 text-sm font-medium text-white"
              >
                Let&rsquo;s Work Together <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}