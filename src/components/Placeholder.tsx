import { cn } from "@/components/ui";

/**
 * Deterministic gradient placeholder sized to fill its slot.
 *
 * Swap for real imagery by passing `src` (a /public path or remote URL) — the
 * component then renders an <img> instead of the gradient. Keeping the same
 * aspect ratio means the layout does not shift when assets arrive.
 */
export function Placeholder({
  src,
  alt = "",
  className,
  label,
  seed = 0,
}: {
  src?: string;
  alt?: string;
  className?: string;
  label?: string;
  seed?: number;
}) {
  const gradients = [
    "linear-gradient(140deg,#e7e5e4 0%,#c7c5c2 60%,#a8a29e 100%)",
    "linear-gradient(140deg,#dbeafe 0%,#bfdbfe 55%,#93c5fd 100%)",
    "linear-gradient(140deg,#fae8ff 0%,#f5d0fe 55%,#e9d5ff 100%)",
    "linear-gradient(140deg,#dcfce7 0%,#bbf7d0 55%,#86efac 100%)",
    "linear-gradient(140deg,#ffedd5 0%,#fed7aa 55%,#fdba74 100%)",
    "linear-gradient(140deg,#f4f4f5 0%,#d4d4d8 60%,#a1a1aa 100%)",
  ];

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn("h-full w-full object-cover", className)}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt || label || "Placeholder image"}
      className={cn(
        "relative grid h-full w-full place-items-center overflow-hidden",
        className,
      )}
      style={{ background: gradients[seed % gradients.length] }}
    >
      {label ? (
        <span className="rounded-full bg-black/45 px-3 py-1 text-xs font-medium tracking-[-0.02em] text-white/90 backdrop-blur">
          {label}
        </span>
      ) : null}
    </div>
  );
}
