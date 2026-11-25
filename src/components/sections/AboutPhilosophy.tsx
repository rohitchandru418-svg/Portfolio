import { ArrowUpRight, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/ui";
import { about } from "@/data/about";
import { philosophyImage } from "@/lib/assets";

/**
 * About's Philosophy block (Figma "Philosophy Section", 770px): a photograph
 * with a 480px panel floating over its right side — an intro card (eyebrow +
 * heading) above a body card (paragraphs, checklist, "Talk With Me").
 * Cards are #FAFAFA at 48px radius; the checklist chips are #F5F5F5 at 12px.
 */
export function AboutPhilosophy() {
  return (
    <section className="p-4 lg:p-6">
      <Reveal>
        <div className="relative min-h-[640px] overflow-hidden rounded-[56px] lg:min-h-[722px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={philosophyImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 lg:flex-row lg:justify-end">
            <div className="flex w-full max-w-[480px] flex-col gap-3">
              <div className="flex flex-col gap-10 rounded-[48px] bg-[#fafafa] p-8">
                <Eyebrow>{about.philosophy.eyebrow}</Eyebrow>
                <h2 className="text-[24px] leading-[1.15] font-medium tracking-[-0.03em] text-ink text-balance">
                  {about.philosophy.heading}
                </h2>
              </div>

              <div className="flex flex-col gap-10 rounded-[32px] bg-[#fafafa] p-6 sm:gap-20 sm:rounded-[48px] sm:p-8">
                <div className="flex flex-col gap-6">
                  {about.philosophy.paragraphs.map((p, i) => (
                    <p key={i} className="text-base leading-[1.35] text-muted">
                      {p}
                    </p>
                  ))}
                </div>

                <div className="flex flex-col gap-4">
                  <ul className="flex flex-col gap-1">
                    {about.philosophy.checklist.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[12px] bg-[#f5f5f5] text-ink">
                          <Check size={14} />
                        </span>
                        <span className="text-sm font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className="inline-flex h-10 w-fit items-center gap-2 rounded-[10px] bg-ink-2 px-6 text-sm font-medium text-white"
                  >
                    Talk With Me <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
