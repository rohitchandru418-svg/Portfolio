"use client";

import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { about, ORBIT_BOX, ORBIT_RADIUS, orbitTiles } from "@/data/about";

/**
 * The hero's orbit: circular tiles on a 944px ring whose centre sits 472px below
 * the top of the window, so only the upper arc is visible. The comp spins the
 * ring; we do the same and fade its lower edge with the comp's gradient mask
 * (transparent at 6%, opaque at 75%).
 */
function Orbit() {
  const centre = ORBIT_BOX / 2;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        maskImage: "linear-gradient(to top, transparent 6%, #000 75%)",
        WebkitMaskImage: "linear-gradient(to top, transparent 6%, #000 75%)",
      }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{ width: ORBIT_BOX, height: ORBIT_BOX }}
      >
        <div className="h-full w-full motion-safe:animate-[orbit-spin_60s_linear_infinite]">
          {orbitTiles.map((t) => {
            const rad = (t.angle * Math.PI) / 180;
            const x = centre + ORBIT_RADIUS * Math.cos(rad) - t.size / 2;
            const y = centre + ORBIT_RADIUS * Math.sin(rad) - t.size / 2;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${t.angle}-${t.src}`}
                src={t.src}
                alt=""
                loading="lazy"
                className="absolute rounded-full object-cover"
                style={{ left: x, top: y, width: t.size, height: t.size }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * About hero (Figma "Hero Section", 900px): the identity bar, then a 944x570
 * window showing the top arc of the orbit with the statement over it, and a
 * giant word on its own line below.
 */
export function AboutHero() {
  return (
    <section className="flex flex-col">
      <PageHeader />

      <div className="flex flex-col px-4 pt-6 pb-[23px] lg:px-6">
        <div className="relative h-[416px] overflow-hidden lg:h-[570px]">
          <Orbit />

          {/* pt-20 (80px) offsets the centring so the block lands where the comp
              puts it: heading top at 252px in the 570px window, not dead centre. */}
          <Reveal className="relative z-10 flex h-full items-center justify-center pt-12 lg:pt-20">
            <div className="flex max-w-[460px] flex-col items-center gap-3 text-center">
              <h1 className="text-[24px] leading-[31px] font-medium tracking-[-0.02em] text-ink text-balance">
                {about.statement}
              </h1>
              <p className="max-w-[304px] text-base leading-[20px] tracking-[-0.02em] text-muted">
                {about.statementSupport}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          {/* The comp renders this as an SVG spanning the column exactly.
              `textLength` + `lengthAdjust` forces the glyphs to fill the width
              at any breakpoint, so it can never overflow the main column. */}
          <svg
            viewBox="0 0 944 146"
            className="mt-[25px] w-full text-ink"
            role="img"
            aria-label="UI/UX Designer"
          >
            <text
              x="0"
              y="116"
              textLength="944"
              lengthAdjust="spacingAndGlyphs"
              fontSize="145.6"
              fontWeight="500"
              letterSpacing="-0.05em"
              fill="currentColor"
            >
              {about.displayWord}
            </text>
          </svg>
        </Reveal>
      </div>
    </section>
  );
}
