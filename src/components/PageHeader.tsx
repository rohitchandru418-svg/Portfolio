import Link from "next/link";
import { site } from "@/data/site";

/**
 * The identity bar every screen opens with (Figma "Header - Variant 1", 112px):
 * a pill holding the monogram, handle and availability, and the location on the
 * right. On Home this sits inside the hero; on every sub-page it is its own bar.
 * The monogram doubles as the link back to Home.
 */
export function PageHeader() {
  return (
    <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative inline-flex items-center gap-2 self-start rounded-[24px] border border-line bg-card p-2">
        <Link
          href="/"
          aria-label="Home"
          className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-[16px] bg-ink text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {site.monogram}
        </Link>
        <span className="inline-flex h-full items-center rounded-[16px] bg-ink/[0.05] px-4 py-2 text-sm font-medium">
          {site.handle}
        </span>
        <span className="hidden items-center gap-3 rounded-[16px] bg-ink/[0.05] px-4 py-2 text-sm sm:inline-flex">
          <span className="text-muted">New work</span>
          <span className="flex items-center gap-1">
            <span className="grid h-3 w-3 place-items-center rounded-full bg-live/20">
              <span className="h-1.5 w-1.5 rounded-full bg-live" />
            </span>
            <span className="text-sm">Available</span>
          </span>
        </span>
      </div>

      <div className="flex items-center sm:border-r-2 sm:border-line sm:pr-4">
        <span className="text-right">
          <span className="block text-base text-muted">Based in</span>
          <span className="block text-base font-bold">{site.location}</span>
        </span>
      </div>
    </div>
  );
}
