import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/ui";
import { toolkitTools } from "@/data/toolkit";

export function Toolkits() {
  return (
    <section className="section">
      <div className="flex flex-col gap-12">
        <Reveal>
          <div className="flex max-w-[624px] flex-col gap-3">
            <Eyebrow>Toolkits</Eyebrow>
            <h2 className="text-[28px] leading-[1.1] font-medium tracking-[-0.02em] sm:text-[32px]">
              Over the years I&rsquo;ve built a flexible toolkit that lets me move
              from concept to execution efficiently —{" "}
              <span className="text-line-strong">
                balancing creativity with precision across different mediums.
              </span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {toolkitTools.map((t, i) => (
            <Reveal key={t.name} delay={(i % 2) * 0.03}>
              <div className="flex h-20 items-center gap-3 rounded-[32px] border border-line bg-card p-2 sm:gap-6 sm:p-3">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[24px] bg-ink-2 shadow-[0_8px_8px_-3px_rgba(0,0,0,0.3),0_4px_4px_-2px_rgba(0,0,0,0.33)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.logo}
                    alt=""
                    className="h-8 w-8 object-contain"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-medium tracking-[-0.02em]">
                    {t.name}
                  </p>
                  <p className="truncate text-sm text-muted">{t.purpose}</p>
                </div>
                <span className="shrink-0 rounded-[100px] bg-ink-3/[0.05] px-3.5 py-2.5 text-sm font-medium backdrop-blur-[2.5px]">
                  {t.level}%
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}