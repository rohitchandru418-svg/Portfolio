import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/ui";

export function Archive() {
  return (
    <section className="section">
      <div className="flex flex-col gap-12">
        <Reveal>
          <Eyebrow>Archive</Eyebrow>
        </Reveal>

        <Reveal>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 items-stretch gap-4">
              <div className="flex flex-col items-end gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/archive-r1-left-big.webp"
                  alt="Brand identity work"
                  loading="lazy"
                  className="aspect-[464/443] w-full rounded-[56px] object-cover"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/archive-r1-left-small.webp"
                  alt="Poster series"
                  loading="lazy"
                  className="aspect-[232/155] w-1/2 rounded-[56px] object-cover"
                />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/archive-r1-right.webp"
                alt="Illustration work"
                loading="lazy"
                className="aspect-[464/606] h-full w-full rounded-[56px] object-cover"
              />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/archive-wide.webp"
              alt="Graphic design archive"
              loading="lazy"
              className="aspect-[944/462] w-full rounded-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}