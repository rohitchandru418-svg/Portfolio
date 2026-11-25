"use client";

import { useState } from "react";
import { Plus, Minus, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Eyebrow, cn } from "@/components/ui";
import { faqs } from "@/data/faq";
import { site } from "@/data/site";

export function Faq() {
  const [open, setOpen] = useState<number | null>(1);

  return (
    <section className="section">
      <div className="flex flex-col gap-12 lg:flex-row lg:justify-center lg:gap-[167px]">
        {/* Left */}
        <Reveal className="flex flex-col justify-between gap-8 lg:w-[305px]">
          <div className="flex flex-col gap-3">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="text-2xl leading-[1.15] font-medium tracking-[-0.03em]">
              Everything you need to know about my creative process,
              collaboration and project expectations.
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-base text-muted">
              Still have a question? Send me an email
            </p>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 text-base font-medium underline decoration-line underline-offset-4"
            >
              {site.email} <ArrowUpRight size={16} />
            </a>
          </div>
        </Reveal>

        {/* Right: accordion */}
        <div className="flex w-full flex-col gap-3 lg:w-[456px]">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className="flex items-center gap-3 rounded-[32px] border border-line bg-card p-2"
              >
                <div
                  className={cn(
                    "flex flex-1 flex-col rounded-[24px] bg-card-soft p-4 shadow-[0_10px_20px_0_rgba(0,0,0,0.1)]",
                    isOpen ? "gap-0.5" : "",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="text-left text-base leading-5 font-medium tracking-[-0.02em]"
                  >
                    {f.q}
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-1 text-sm leading-[1.5] text-muted">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-label={isOpen ? "Collapse answer" : "Expand answer"}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ink backdrop-blur-[2.5px]"
                >
                  {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}