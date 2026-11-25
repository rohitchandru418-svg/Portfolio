import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/ui";
import { about } from "@/data/about";
import { experience } from "@/data/experience";

/**
 * About's Experience block (Figma "Experience Section", 869px): a centred
 * eyebrow + heading (100px), a #F4F4F5 card (481px, 56px radius) holding a
 * centred strapline over a #FAFAFA roles panel (48px radius). Each role is one
 * 40px row — dot marker, title + dates, summary — joined by 48px connectors.
 *
 * The comp also has a six-bar ticker strip below the card, but it sits at
 * opacity 0, so it is not rendered here.
 */
export function AboutExperience() {
  return (
    <section id="experience" className="px-4 pt-12 pb-20 lg:px-6 lg:pt-20 lg:pb-40">
      <div className="flex flex-col gap-8 lg:gap-12">
        <Reveal>
          <div className="flex flex-col items-center gap-3 text-center">
            <Eyebrow>{about.experience.eyebrow}</Eyebrow>
            <h2 className="max-w-[720px] text-[32px] leading-[1.1] font-medium tracking-display text-balance sm:text-[40px] lg:text-[48px] lg:leading-[52px]">
              {about.experience.heading}
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-[56px] bg-card px-3 pt-[31px] pb-3">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-0.5 text-center">
                <p className="text-[18px] leading-[24px] font-medium text-ink">
                  {about.experience.title}
                </p>
                <p className="text-[14px] leading-[20px] text-faint">
                  {about.experience.note}
                </p>
              </div>

              <div className="rounded-[48px] bg-card-soft px-10 py-8">
                {experience.map((r, i) => (
                  <div key={`${r.company}-${r.period}`}>
                    <div className="flex items-start gap-6 xl:h-10 xl:items-center">
                      <span
                        className="mt-2 h-[7px] w-[7px] shrink-0 rounded-full bg-ink shadow-[0_0_0_4px_rgba(9,9,11,0.08)] xl:mt-0"
                        aria-hidden
                      />
                      <div className="flex min-w-0 flex-1 flex-col gap-1 xl:flex-row xl:gap-6">
                        <div className="min-w-0 xl:w-[392px] xl:flex-none">
                          <p className="text-[16px] leading-[20px] font-medium text-ink">
                            {r.title}
                          </p>
                          <p className="text-[14px] leading-[20px] text-faint">
                            {r.period}
                          </p>
                        </div>
                        <p className="min-w-0 flex-1 text-[14px] leading-[20px] text-muted">
                          {r.summary}
                        </p>
                      </div>
                    </div>
                    {i < experience.length - 1 ? (
                      <span
                        className="ml-[3px] block h-12 w-px bg-line"
                        aria-hidden
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
