import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/ui";
import { WorksGrid } from "@/components/WorksGrid";

export function Works() {
  return (
    <section id="works" className="section">
      <div className="flex flex-col gap-12">
        <Reveal>
          <SectionHead
            eyebrow="Latest Projects"
            heading={
              <>
                Projects that <br />
                tell you stories
              </>
            }
            aside={
              <p className="text-right text-[32px] leading-none font-medium tracking-display text-line-strong lg:text-[48px]">
                ©
                <br />
                24&ndash;26
              </p>
            }
          />
        </Reveal>

        <WorksGrid />
      </div>
    </section>
  );
}