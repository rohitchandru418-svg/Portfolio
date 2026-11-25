import type { ReactNode } from "react";
import Link from "next/link";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ---------------------------------------------------------------- Eyebrow */

/** Small pill label above section headings (dark gradient in the reference). */
export function Eyebrow({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-[50px] px-3.5 py-2 text-sm font-medium tracking-[-0.02em]",
        tone === "dark" ? "eyebrow-dark text-white" : "eyebrow-light text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ Chip */

/** Neutral tag chip used for skills, filters and categories. */
export function Chip({
  children,
  active = false,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[100px] px-4 py-2 text-sm font-medium tracking-[-0.02em] transition-colors",
        active
          ? "bg-ink text-white"
          : "bg-ink/[0.05] text-ink hover:bg-ink/[0.08]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- Buttons */

type ButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "dark" | "light" | "outline";
  ariaLabel?: string;
};

export function Button({
  children,
  href,
  className,
  onClick,
  type = "button",
  variant = "dark",
  ariaLabel,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[10px] px-6 py-2.5 text-sm font-medium tracking-[-0.02em] transition-colors";
  const variants = {
    dark: "btn-dark text-white",
    light: "bg-white text-ink border border-line hover:bg-card-soft",
    outline: "border border-line text-ink hover:bg-card",
  } as const;
  const classes = cn(base, variants[variant], className);

  if (href) {
    const external = href.startsWith("http") || href.endsWith(".pdf");
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          aria-label={ariaLabel}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

/* -------------------------------------------------------- SectionDivider */

/** 16px band between sections: soft fill with a hairline top and bottom. */
export function SectionDivider() {
  return <div aria-hidden className="h-4 border-y border-line bg-card-soft" />;
}

/* ------------------------------------------------------------ SectionHead */

/** Eyebrow + heading + optional description, matching the comp's Top block. */
export function SectionHead({
  eyebrow,
  heading,
  description,
  align = "left",
  aside,
  className,
}: {
  eyebrow: string;
  heading: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className={cn(align === "center" && "flex justify-center")}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <div
        className={cn(
          "flex gap-6",
          align === "center"
            ? "flex-col items-center text-center"
            : "flex-col lg:flex-row lg:items-end lg:justify-between",
        )}
      >
        <h2 className="max-w-[720px] text-[32px] leading-[1.06] font-medium tracking-display text-balance sm:text-[40px] lg:text-[48px]">
          {heading}
        </h2>
        {description ? (
          <p
            className={cn(
              "max-w-[400px] text-base leading-[1.45] text-muted",
              align === "center" && "mx-auto text-center",
            )}
          >
            {description}
          </p>
        ) : null}
        {aside}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Surface */

/** Rounded card used for most content blocks. */
export function Card({
  children,
  className,
  tone = "card",
}: {
  children: ReactNode;
  className?: string;
  tone?: "card" | "soft" | "white" | "dark";
}) {
  const tones = {
    card: "bg-card",
    soft: "bg-card-soft",
    white: "bg-white",
    dark: "bg-ink text-white",
  } as const;
  return (
    <div className={cn("rounded-[56px]", tones[tone], className)}>{children}</div>
  );
}

/* -------------------------------------------------------------- LiveBadge */

export function LiveBadge({ label = "Available" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex h-3 w-3 items-center justify-center rounded-full bg-live/20">
        <span className="h-1.5 w-1.5 rounded-full bg-live" />
      </span>
      <span className="text-base font-medium tracking-[-0.02em] text-muted">
        {label}
      </span>
    </span>
  );
}
