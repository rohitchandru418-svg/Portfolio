import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Eyebrow, Chip, SectionDivider } from "@/components/ui";
import { ProjectTile } from "@/components/WorksGrid";
import { Contact } from "@/components/sections/Contact";
import { getProject, projects } from "@/data/projects";
import { getCaseStudy } from "@/data/caseStudies";
import { site } from "@/data/site";

export function generateStaticParams() {
  return projects
    .filter((p) => !p.confidential)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };
  return { title: project.title, description: project.summary };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const cs = getCaseStudy(slug, project);

  const facts = [
    { label: "CLIENT", value: cs.client },
    { label: "YEAR", value: project.year },
    { label: "INDUSTRY", value: project.industry },
    { label: "SERVICES", value: cs.services },
  ];

  const more = projects
    .filter((p) => p.slug !== slug && !p.confidential)
    .slice(0, 2);

  return (
    <AppShell>
      <article className="flex flex-col">
        <PageHeader />

        <div className="section pt-0">
          <Link
            href="/works"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft size={16} /> All work
          </Link>

          {/* Hero image */}
          <Reveal>
            <div className="mt-6 aspect-[16/9] overflow-hidden rounded-[32px] border border-line bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cs.heroImage}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>

          {/* Title */}
          <Reveal delay={0.05}>
            <div className="mt-8 flex flex-col gap-4">
              <h1 className="text-[36px] leading-[1.05] font-medium tracking-display sm:text-[48px] lg:text-[64px]">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <Chip active>{project.category}</Chip>
                {project.tags.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Body */}
          <div className="mt-12 flex flex-col gap-10">
            {/* Row: info list + key highlights */}
            <div className="flex flex-col gap-10 lg:flex-row">
              <Reveal className="lg:w-[300px] lg:shrink-0">
                <dl className="flex flex-col">
                  {facts.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-center justify-between gap-4 border-b border-line py-3"
                    >
                      <dt className="text-sm text-muted">{f.label}</dt>
                      <dd className="text-sm font-medium">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <div className="flex flex-1 flex-col gap-8">
                <Reveal>
                  <h2 className="text-2xl font-medium tracking-[-0.03em]">
                    Key Highlights
                  </h2>
                </Reveal>
                {cs.keyHighlights.map((h, i) => (
                  <Reveal key={h.title} delay={0.05 + i * 0.05}>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-medium tracking-[-0.02em]">
                        {h.title}
                      </h3>
                      <p className="max-w-[452px] text-base leading-[1.5] text-muted">
                        {h.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
                <Reveal delay={0.15}>
                  <div className="aspect-[4/3] overflow-hidden rounded-[32px] border border-line bg-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cs.highlightsImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Reveal>
              </div>
            </div>

            {/* Full-width image */}
            <Reveal>
              <div className="aspect-[2/1] overflow-hidden rounded-[32px] border border-line bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cs.fullImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>

            {/* Row: detail image + closing copy */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
              <Reveal className="lg:w-[304px] lg:shrink-0">
                <div className="aspect-square overflow-hidden rounded-[32px] border border-line bg-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cs.detailImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              </Reveal>
              <Reveal delay={0.05} className="flex flex-1 flex-col gap-3">
                <h2 className="text-2xl font-medium tracking-[-0.03em]">
                  {cs.bodyTitle}
                </h2>
                <p className="max-w-[452px] text-base leading-[1.5] text-muted">
                  {cs.bodyText}
                </p>
              </Reveal>
            </div>
          </div>

          {/* Results card */}
          <Reveal>
            <section className="mt-12 flex flex-col gap-8 rounded-[32px] border border-line bg-card p-8">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-medium tracking-[-0.02em]">
                  {cs.results.heading}
                </h2>
                <p className="text-sm text-muted">{cs.results.note}</p>
              </div>
              <div className="grid gap-8 sm:grid-cols-3">
                {cs.results.stats.map((s) => (
                  <div key={s.label} className="flex flex-col gap-3">
                    <span className="text-[40px] leading-none font-medium tracking-display lg:text-[56px]">
                      {s.value}
                    </span>
                    <span className="text-base font-medium">{s.label}</span>
                    <p className="text-base leading-[1.4] text-muted">
                      {s.note}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          {project.link && (
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-6 py-3 text-sm font-medium transition-colors hover:bg-line/60"
              >
                View the full project on Behance <ArrowUpRight size={15} />
              </a>
            </div>
          )}
        </div>
      </article>

      {/* More works */}
      <SectionDivider />
      <section className="section">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <Eyebrow>Works</Eyebrow>
            <h2 className="text-[32px] leading-[1.06] font-medium tracking-display sm:text-[40px] lg:text-[48px]">
              Explore More Works
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {more.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 0.05}>
                <ProjectTile slug={p.slug} />
              </Reveal>
            ))}
          </div>
          <Link
            href="/works"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            See all work <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>

      <SectionDivider />
      <Contact />
    </AppShell>
  );
}
