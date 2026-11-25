"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/components/ui";
import { projects, workFilters, workFilterOf } from "@/data/projects";

/** The comp shows the six featured tiles until a tab narrows the grid. */
const MAX_TILES = 6;

export function ProjectTile({ slug }: { slug: string }) {
  const p = projects.find((x) => x.slug === slug)!;
  const inner = (
    <div className="group relative aspect-square overflow-hidden rounded-[32px] bg-card lg:rounded-[56px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.cover ?? "/figma/work-01.webp"}
        alt={p.title}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="text-xl font-medium tracking-[-0.02em]">{p.title}</h3>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium">
          {p.confidential ? "Details on request" : "View case study"}
          <ArrowUpRight size={15} />
        </span>
      </div>
    </div>
  );

  if (p.confidential) return inner;

  return (
    <Link href={`/work/${p.slug}`} className="block" aria-label={p.title}>
      {inner}
    </Link>
  );
}

/**
 * The four category tabs plus the six-square project grid. Shared by the Home
 * Works section and the dedicated /works page so the two never drift.
 */
export function WorksGrid() {
  const [filter, setFilter] = useState<string | null>(null);

  const visible = useMemo(() => {
    const pool = filter
      ? projects.filter((p) => workFilterOf(p) === filter)
      : projects.filter((p) => p.featured);
    return pool.slice(0, MAX_TILES);
  }, [filter]);

  return (
    <div className="flex flex-col gap-12">
      {/* Category tabs — one per row on mobile (the comp stacks them at 390),
          four equal columns from lg up */}
      <Reveal>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {workFilters.map((c) => {
            const active = filter === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(active ? null : c)}
                aria-pressed={active}
                className={cn(
                  "flex h-12 items-center justify-between gap-4 rounded-[16px] border border-line py-2 pr-2 pl-4 text-left text-base font-medium tracking-[-0.02em] transition-colors",
                  active
                    ? "bg-ink text-white"
                    : "bg-card text-ink hover:bg-line/60",
                )}
              >
                <span className="truncate">{c}</span>
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-[12px] shadow-[0px_12px_10px_0px_rgba(0,0,0,0.1)]",
                    active ? "bg-white/15 text-white" : "bg-card-soft text-ink",
                  )}
                >
                  <ArrowUpRight size={12} />
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Grid — two columns, square tiles, matching the comp's 464px cells */}
      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((p, i) => (
          <Reveal key={p.slug} as="article" delay={(i % 2) * 0.05}>
            <ProjectTile slug={p.slug} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
