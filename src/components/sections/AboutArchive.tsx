import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/ui";

/**
 * About's Archive block (Figma "Archive Section", 1948px): an eyebrow, then a
 * collage of three bands on a 944px column (16px gutters, 8px vertical gaps).
 * Bands 1 and 3 are two 464px cells; in band 1 the left cell and in band 3 the
 * right cell are themselves stacks (a tall image with a small one beneath,
 * pushed to the outer edge). Band 2 is a single full-width image. Corners are
 * 56px on the rectangles and fully round on the band-2 banner and the two
 * portrait cells. Grid keeps the columns at exactly half the column minus the
 * gutter, which `w-1/2` inside a flex row cannot do.
 */
export function AboutArchive() {
  return (
    <section className="section flex flex-col gap-12">
      <Reveal>
        <Eyebrow>Archive</Eyebrow>
      </Reveal>

      <Reveal>
        <div className="flex flex-col gap-2">
          {/* Band 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/archive-r1-left-big.webp"
                alt="Archive work"
                loading="lazy"
                className="block w-full rounded-[56px] object-cover"
                style={{ aspectRatio: "464/443" }}
              />
              <div className="flex justify-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/archive-r1-left-small.webp"
                  alt=""
                  loading="lazy"
                  className="block w-1/2 rounded-[56px] object-cover"
                  style={{ aspectRatio: "232/155" }}
                />
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/archive-r1-right.webp"
              alt="Archive work"
              loading="lazy"
              className="block h-full w-full rounded-[56px] object-cover"
              style={{ aspectRatio: "464/606" }}
            />
          </div>

          {/* Band 2 — full-width pill */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/archive-wide.webp"
            alt="Archive banner"
            loading="lazy"
            className="block w-full rounded-full object-cover"
            style={{ aspectRatio: "944/462" }}
          />

          {/* Band 3 */}
          <div className="grid grid-cols-2 gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/archive-r2-left.webp"
              alt="Archive work"
              loading="lazy"
              className="block h-full w-full rounded-full object-cover"
              style={{ aspectRatio: "464/620" }}
            />
            <div className="flex flex-col gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/archive-r2-right-big.webp"
                alt="Archive work"
                loading="lazy"
                className="block w-full rounded-[56px] object-cover"
                style={{ aspectRatio: "464/457" }}
              />
              <div className="flex justify-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/archive-r2-right-small.webp"
                  alt=""
                  loading="lazy"
                  className="block w-1/2 rounded-[56px] object-cover"
                  style={{ aspectRatio: "232/155" }}
                />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
