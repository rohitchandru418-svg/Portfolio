import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/ui";
import { philosophy } from "@/data/philosophy";
import { philosophyImage } from "@/lib/assets";

export function Philosophy() {
  return (
    <section className="p-6">
      <Reveal>
        <div className="relative isolate flex min-h-[592px] flex-col justify-between overflow-hidden rounded-[56px] px-6 py-20">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={philosophy.image ?? philosophyImage}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="relative">
            <Eyebrow tone="light">My Philosophy</Eyebrow>
          </div>

          <div className="relative flex flex-col items-end gap-8">
            <h2 className="max-w-[900px] text-[32px] leading-[1.08] font-medium tracking-display text-white text-balance sm:text-[40px] lg:text-[48px]">
              {philosophy.heading}
            </h2>
            <div className="h-px w-full bg-white/10" />
            <div className="grid max-w-[680px] gap-10 sm:grid-cols-2">
              {philosophy.columns.map((c, i) => (
                <p key={i} className="text-base leading-[1.25] text-white/70">
                  {c}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}