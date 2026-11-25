import { Reveal } from "@/components/Reveal";
import { Eyebrow, Chip, cn } from "@/components/ui";
import { processSteps, processStat } from "@/data/process";

export function Process() {
  return (
    <section id="process" className="section">
      <div className="flex flex-col gap-20">
        <Reveal>
          <div className="flex flex-col gap-3">
            <Eyebrow>Process</Eyebrow>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
              <div className="flex flex-col gap-6">
                <h2 className="max-w-[720px] text-[32px] leading-[1.06] font-medium tracking-display text-balance sm:text-[40px] lg:text-[48px]">
                  A clear process
                </h2>
                <p className="max-w-[304px] text-base leading-5 text-muted">
                  Every project begins with understanding the brand&rsquo;s
                  purpose, then evolves into a visual system that is distinctive,
                  scalable and built to create lasting impact.
                </p>
              </div>
              <p className="text-right text-[32px] leading-none font-medium tracking-display text-line-strong lg:text-[48px]">
                04 Steps
              </p>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          <div className="grid gap-8 lg:grid-cols-4 lg:gap-0">
            {processSteps.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.05}>
                <div
                  className={cn(
                    "flex h-full flex-col justify-between gap-8 px-4 lg:h-[228px]",
                    i < processSteps.length - 1 &&
                      "lg:border-r lg:border-dashed lg:border-line",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-[#71717a]">
                      {s.step}
                    </span>
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-ink-2 text-white">
                      <s.icon size={22} />
                    </span>
                  </div>
                  <div className="flex flex-col gap-6">
                    <h3 className="text-2xl leading-[1.16] font-medium tracking-[-0.03em]">
                      {s.title}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {s.tags.map((t) => (
                        <Chip key={t} className="h-8">
                          {t}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="flex flex-col gap-8 rounded-[48px] bg-ink p-8 text-white shadow-[0_3px_3px_0_rgba(0,0,0,0.12),0_24px_40px_0_rgba(0,0,0,0.15)]">
              <div className="flex items-center gap-8 lg:gap-20">
                <div className="flex items-center gap-8">
                  <p className="text-[64px] leading-none font-medium tracking-display">
                    {processStat.value}
                  </p>
                  <div className="max-w-[433px]">
                    <p className="text-[18px] leading-[23.4px] font-medium">
                      {processStat.label}
                    </p>
                    <p className="mt-0.5 text-sm leading-5 text-white/70">
                      {processStat.note}
                    </p>
                  </div>
                </div>
                <div className="hidden h-[62px] flex-1 lg:block">
                  <DotMatrix />
                </div>
              </div>
              <div className="h-px w-full bg-white/15" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Decorative dot grid, echoing the reference's "dot matrix" panel. */
function DotMatrix() {
  return (
    <div
      aria-hidden
      className="grid h-full w-full grid-cols-12 gap-1 opacity-40"
      style={{
        maskImage: "linear-gradient(90deg,transparent,black 40%)",
        WebkitMaskImage: "linear-gradient(90deg,transparent,black 40%)",
      }}
    >
      {Array.from({ length: 48 }).map((_, i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/70" />
      ))}
    </div>
  );
}