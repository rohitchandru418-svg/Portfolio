"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ArrowUpRight,
  ArrowUp,
  Home,
  User,
  Layers,
  LayoutGrid,
  Instagram,
  Twitter,
  Dribbble,
  Linkedin,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/components/ui";
import { site, nav } from "@/data/site";
import { CvPrinter } from "@/components/cv/CvPrinter";

const NAV_ICON: Record<string, LucideIcon> = {
  Home,
  About: User,
  Services: Layers,
  Works: LayoutGrid,
};

/**
 * App shell from the reference: a 1296px bordered page column (304px sidebar +
 * 992px main), a dark rounded sidebar on the left and a single scrolling main
 * column on the right. The tiled "Pixels Texture" overlays the whole page.
 * Collapses to a top bar + overlay menu below lg.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="grain min-h-screen bg-page">
      <div className="overflow-x-clip lg:px-[72px]">
        {/* The page texture lives on the outer wrapper, so this white column
            masks it across the middle; the dots only show in the side gutters. */}
        <div className="mx-auto flex max-w-[1296px] border-x border-line bg-page">
          {/* Desktop sidebar */}
          <aside className="hidden w-[304px] shrink-0 px-4 py-4 lg:block">
            <div className="sticky top-4 h-[calc(100vh-2rem)]">
              <Sidebar />
            </div>
          </aside>

          {/* Mobile top bar */}
          <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-line bg-page/90 px-4 py-3 backdrop-blur lg:hidden">
            <Link href="/" className="flex items-center gap-2 font-medium">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-sm text-white">
                {site.monogram}
              </span>
              {site.name}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-xl bg-card"
            >
              <Menu size={20} />
            </button>
          </header>

          {/* Mobile overlay menu */}
          {open ? (
            <div className="fixed inset-0 z-50 bg-ink text-white lg:hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-medium">{site.name}</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-2 px-6 pt-8">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-white/10 py-4 text-2xl font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-[10px] bg-white px-6 py-3 font-medium text-ink"
                >
                  Book a Call <ArrowUpRight size={18} />
                </Link>
              </nav>
            </div>
          ) : null}

          {/* Main column */}
          <main className="min-w-0 flex-1 border-l border-line pt-16 lg:pt-0">
            {children}
            <BackToTop />
          </main>
        </div>
      </div>
      <CvPrinter />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="flex h-full w-[272px] flex-col rounded-[32px] bg-ink-3 p-2 shadow-[0_5px_12px_-4px_rgba(0,0,0,0.5),0_12px_20px_0_rgba(0,0,0,0.2)]">
      {/* Banner, with the profile overlapping its lower edge. The 52px bottom
          padding reserves the space the 82px profile hangs into, so the body
          below never collides with it. */}
      <div className="relative shrink-0 pb-[52px]">
        <div className="mask-fade-b h-[93px] overflow-hidden rounded-[24px] border border-white/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/sidebar-banner-96c3b9.webp"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-x-0 top-[63px] flex h-[82px] items-center gap-4 px-4">
          <span className="grid h-[82px] w-[82px] shrink-0 place-items-center rounded-full bg-white/5 p-[3px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/avatar-sidebar-56586a.webp"
              alt={site.name}
              className="h-full w-full rounded-full object-cover"
            />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate text-sm leading-5 font-medium text-white">
              {site.name}
            </p>
            <span className="inline-flex w-fit items-center rounded-[100px] border border-white/10 bg-white/10 px-2.5 py-1 text-xs leading-4 font-medium text-white">
              {site.role}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1 flex-col justify-between px-4 pb-4">
        <div className="flex flex-col gap-6 pt-6">
          <p className="text-sm leading-5 text-faint">{site.tagline}</p>
          <nav className="relative flex flex-col gap-2 border-t border-dashed border-white/20 pt-6">
            {nav.map((item) => {
              const Icon = NAV_ICON[item.label] ?? User;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex h-10 items-center gap-2 rounded-[16px] px-3 text-sm font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Icon size={16} className="opacity-70" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-4 gap-1">
            {site.socials.map((s) => {
              const Icon = SOCIAL_ICON[s.label];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-10 place-items-center rounded-[16px] bg-ink-2 text-white/80 shadow-[inset_0_3px_1px_0_rgba(255,255,255,0.1)] transition-colors hover:text-white"
                >
                  {Icon ? <Icon size={16} /> : <span className="text-xs font-medium">Be</span>}
                </a>
              );
            })}
          </div>
          <a
            href="/#contact"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[16px] bg-card px-6 text-sm font-medium text-ink shadow-[0_-6px_24px_-2px_rgba(255,255,255,0.2),0_2px_10px_0_rgba(255,255,255,0.4)]"
          >
            Book a Call <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

const SOCIAL_ICON: Record<string, LucideIcon> = {
  Instagram,
  LinkedIn: Linkedin,
  X: Twitter,
  Dribbble,
};

function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed right-6 bottom-6 z-40 inline-flex h-[38px] items-center gap-2 rounded-[10px] border border-line bg-white px-4 text-sm font-medium text-ink shadow-[0_6px_20px_-6px_rgba(0,0,0,0.25)]"
    >
      Back to top <ArrowUp size={16} />
    </button>
  );
}

export { cn };