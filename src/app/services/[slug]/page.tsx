import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Chip, SectionDivider } from "@/components/ui";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { getService, services } from "@/data/services";
import { getServiceDetail } from "@/data/serviceDetails";
import { site } from "@/data/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Not found" };
  return { title: service.title, description: service.description };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const detail = getServiceDetail(slug, service);
  const others = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <AppShell>
      <article className="flex flex-col">
        <PageHeader />

        <div className="section pt-0">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft size={16} /> All services
          </Link>

          {/* Hero: icon + title/description/tags + checklist, and a cover */}
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <Reveal className="flex flex-col gap-6">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-ink-2 text-white">
                <service.icon size={22} />
              </span>
              <div className="flex flex-col gap-2">
                <h1 className="text-[36px] leading-[1.06] font-medium tracking-display sm:text-[44px] lg:text-[48px]">
                  {service.title}
                </h1>
                <p className="max-w-[460px] text-base leading-[1.45] text-muted">
                  {service.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((t) => (
                  <Chip key={t} className="h-10">
                    {t}
                  </Chip>
                ))}
              </div>
              <ul className="mt-2 flex flex-col gap-2">
                {service.checklist.map((c) => (
                  <li key={c} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-card-soft">
                      <Check size={14} />
                    </span>
                    <span className="text-sm leading-5 font-medium">{c}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="aspect-square overflow-hidden rounded-[40px] border border-line bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={detail.image}
                  alt={service.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
          </div>

          {/* Deliverables */}
          <section className="mt-16 flex flex-col gap-8 rounded-[40px] border border-line bg-card p-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium tracking-[-0.02em]">
                {detail.deliverablesHeading}
              </h2>
              <p className="text-sm text-muted">{detail.deliverablesNote}</p>
            </div>

            <div className="flex flex-col">
              {detail.pillars.map((p, i) => (
                <div key={p.title}>
                  <div className="flex items-start gap-6 py-6">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-card-soft text-sm font-medium">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-3">
                      <h3 className="text-lg font-medium tracking-[-0.02em]">
                        {p.title}
                      </h3>
                      {p.body ? (
                        <p className="max-w-[752px] text-base leading-[1.5] text-muted">
                          {p.body}
                        </p>
                      ) : null}
                      {p.items ? (
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {p.items.map((it) => (
                            <li
                              key={it}
                              className="flex items-center gap-2 text-base text-muted"
                            >
                              <span className="h-1 w-1 shrink-0 rounded-full bg-faint" />
                              {it}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                  {i < detail.pillars.length - 1 ? (
                    <div className="h-px bg-line" />
                  ) : null}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-6 border-t border-dashed border-ink/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted">From</span>
                <span className="text-2xl font-medium tracking-[-0.03em]">
                  {service.price}
                </span>
              </div>
              <Link
                href="/#contact"
                className="btn-dark inline-flex h-10 items-center gap-2 rounded-[10px] px-6 text-sm font-medium text-white"
              >
                Book a Call <ArrowUpRight size={16} />
              </Link>
            </div>
          </section>

          {/* Other services */}
          <section className="mt-16 flex flex-col gap-8">
            <h2 className="text-2xl font-medium tracking-[-0.03em]">
              Other services
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {others.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group flex flex-col gap-3 rounded-[32px] border border-line bg-card p-6 transition-colors hover:bg-line/60"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-ink-2 text-white">
                    <s.icon size={18} />
                  </span>
                  <span className="text-lg font-medium tracking-[-0.02em]">
                    {s.title}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                    View detail
                    <ArrowUpRight size={15} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </article>

      <SectionDivider />
      <Faq />
      <SectionDivider />
      <Contact />
    </AppShell>
  );
}
