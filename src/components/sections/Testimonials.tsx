"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/ui";
import { testimonials, testimonialsTrustLine } from "@/data/testimonials";
import { clientPhotos } from "@/lib/assets";

export function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const prev = () =>
    setI((v) => (v - 1 + testimonials.length) % testimonials.length);
  const next = () => setI((v) => (v + 1) % testimonials.length);

  return (
    <section className="section">
      <div className="flex flex-col gap-12">
        <Reveal>
          <SectionHead
            eyebrow="Testimonials"
            heading={
              <>
                What people <span className="text-faint">say about my work</span>
              </>
            }
            aside={
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[0, 1, 2].map((n) => (
                    <span
                      key={n}
                      className="-ml-2 grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-white bg-card text-[10px] font-medium first:ml-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={clientPhotos[n]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </span>
                  ))}
                </div>
                <p className="max-w-[180px] text-sm text-muted">
                  {testimonialsTrustLine}
                </p>
              </div>
            }
          />
        </Reveal>

        <Reveal>
          <div className="grid overflow-hidden rounded-[56px] border border-line bg-card p-4 lg:h-[471px] lg:grid-cols-[0.5fr_1fr] lg:p-4 lg:pl-10">
            {/* Image column */}
            <div className="hidden grid-rows-[1fr_0.5fr_0.5fr] gap-4 py-2 lg:grid">
              {clientPhotos.map((src, n) => (
                <div
                  key={n}
                  className="overflow-hidden rounded-[48px] border border-line"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Quote card */}
            <div className="relative flex flex-col justify-between rounded-[48px] bg-card-soft p-8 shadow-[0_12px_30px_0_rgba(0,0,0,0.15)] lg:p-12">
              <div className="flex flex-col gap-6">
                <div className="flex gap-1 text-brand">
                  {Array.from({ length: 5 }).map((_, n) => (
                    <Star key={n} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-base leading-5 font-medium tracking-[-0.02em]">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-8">
                <div className="flex items-center gap-4">
                  <span className="h-12 w-12 overflow-hidden rounded-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={clientPhotos[i % clientPhotos.length]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-muted">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 flex gap-2 lg:bottom-12 lg:right-12">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white transition-colors hover:bg-card"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next testimonial"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white transition-colors hover:bg-card"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}