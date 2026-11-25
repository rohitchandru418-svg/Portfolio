import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Placeholder } from "@/components/Placeholder";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/data/site";
import { heroStrip } from "@/lib/assets";

export function Hero() {
  return (
    <section id="about" className="flex flex-col">
      <PageHeader />

      {/* Main: featured pill, headline, image strip */}
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col items-center gap-6 pt-4 text-center">
          <Reveal>
            <a
              href="#works"
              className="inline-flex items-center gap-3 rounded-[24px] bg-ink py-2 pr-3 pl-2 text-white transition-transform hover:-translate-y-0.5"
            >
              <span className="block h-[34px] w-[52px] overflow-hidden rounded-[16px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/hero-featured-3a8f85.webp"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                Featured project
                <span className="grid h-4 w-4 place-items-center">
                  <ArrowUpRight size={16} />
                </span>
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="flex flex-col items-center gap-2 text-[36px] leading-[1.06] font-medium tracking-display text-balance sm:text-[52px] lg:text-[64px]">
              <span>Hi I&rsquo;m {site.name}</span>
              <span className="flex flex-wrap items-center justify-center gap-4">
                <span>UI/UX</span>
                <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-[10px] bg-ink-2 shadow-[0_8px_14px_-2px_rgba(0,0,0,0.25),0_4px_10px_-4px_rgba(0,0,0,0.5)]">
                  <span className="text-2xl leading-none font-medium text-white">
                    {site.monogram}
                  </span>
                  <span className="pointer-events-none absolute inset-0 rounded-[10px] bg-[radial-gradient(circle_at_28%_8%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%)]" />
                </span>
                <span>&amp; Product Designer</span>
              </span>
            </h1>
          </Reveal>
        </div>

        {/* Image strip: 290px band of 160x160 tiles, 12px gap, edge fade */}
        <Reveal delay={0.1}>
          <div className="mask-fade-x relative flex h-[200px] items-center overflow-hidden sm:h-[290px]">
            <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-3">
              {[...heroStrip, ...heroStrip, ...heroStrip].map((src, i) => (
                <div
                  key={i}
                  className="h-[110px] w-[110px] shrink-0 overflow-hidden rounded-[32px] sm:h-[160px] sm:w-[160px]"
                >
                  <Placeholder src={src} alt={`Selected work ${i + 1}`} seed={i} />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}