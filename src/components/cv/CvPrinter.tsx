"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Printer } from "lucide-react";
import { site } from "@/data/site";
import { PrinterFlat } from "./printer/PrinterFlat";
import { webglAvailable, type Phase as CorePhase } from "./printer/printerCore";

/**
 * The floating CV tab and its printer drawer.
 *
 * The 3D scene is a vanilla three.js module (printerCore.ts) mounted into a
 * plain <div>; it is imported lazily so three.js only downloads once the drawer
 * opens. A CSS fallback covers machines without WebGL, and the whole thing
 * degrades to a direct PDF link if the scene cannot start.
 *
 * Layout and copy follow the reference: the stage fills the drawer, and a
 * status line plus a single button sit under it.
 */

const PDF = "/cv/Chandru-M-CV.pdf";
const PDF_NAME = "Chandru-M-CV.pdf";
const FRONT = "/cv/page-1.webp";
const BACK = "/cv/page-2.webp";

type UiPhase = "idle" | "warm" | "feed" | "hold" | "fall" | "settled";
const toUiPhase = (p: CorePhase): UiPhase => (p === "clear" ? "warm" : (p as UiPhase));

export function CvPrinter() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"3d" | "2d" | null>(null);
  const [phase, setPhase] = useState<UiPhase>("idle");
  const [done, setDone] = useState(false);
  const [flipRequest, setFlipRequest] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const handle = useRef<{ print: () => void; destroy: () => void } | null>(null);

  const download = useCallback(() => {
    const a = document.createElement("a");
    a.href = PDF;
    a.download = PDF_NAME;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  // Mount the 3D core when the drawer opens; fall back to CSS on any failure.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    let created: { destroy: () => void } | null = null;

    (async () => {
      if (!webglAvailable()) {
        setMode("2d");
        return;
      }
      try {
        const mod = await import("./printer/printerCore");
        if (cancelled || !stageRef.current) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const compact = window.innerWidth < 760;
        const printer = mod.mountPrinter(stageRef.current, {
          reduced,
          compact,
          frame: { w: compact ? 1.9 : 1.75, bottomPx: 28 },
          onPhase: (p) => setPhase(toUiPhase(p)),
          onPrinted: () => {
            download();
            setDone(true);
          },
          onError: () => {
            created?.destroy();
            created = null;
            handle.current = null;
            if (!cancelled) setMode("2d");
          },
        });
        created = printer;
        handle.current = printer;
        setMode("3d");
      } catch {
        if (!cancelled) setMode("2d");
      }
    })();

    return () => {
      cancelled = true;
      created?.destroy();
      handle.current = null;
    };
  }, [open, download]);

  // Esc closes; focus lands on the close button when the drawer opens.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    setDone(false);
    setPhase("idle");
  }, []);

  const runPrint = useCallback(() => {
    setDone(false);
    if (mode === "2d") {
      setFlipRequest((n) => n + 1);
      download();
      setDone(true);
      setPhase("settled");
      return;
    }
    handle.current?.print();
  }, [mode, download]);

  const running = phase === "warm" || phase === "feed" || phase === "hold" || phase === "fall";
  const label = done ? "Print another" : running ? "Printing…" : "Print my CV";

  return (
    <>
      <button
        type="button"
        data-cvtab
        aria-haspopup="dialog"
        aria-controls="cv-drawer"
        aria-label="Print my CV"
        onClick={() => setOpen(true)}
        className="cv-tab"
      >
        <span className="cv-tab-pg" aria-hidden>
          <span className="cv-tab-sheet">
            <span className="cv-tab-mark">
              <svg className="cv-tab-star" viewBox="0 0 100 100" width="100%" height="100%" aria-hidden focusable="false">
                <defs>
                  <linearGradient id="cv-tab-star-fill" gradientUnits="userSpaceOnUse" x1="0" y1="8" x2="36" y2="92">
                    <stop offset="0" stopColor="#ddd6fe" />
                    <stop offset="0.24" stopColor="#a78bfa" />
                    <stop offset="0.44" stopColor="#7c3aed" />
                    <stop offset="0.52" stopColor="#4c1d95" />
                    <stop offset="0.62" stopColor="#8b5cf6" />
                    <stop offset="0.8" stopColor="#6d28d9" />
                    <stop offset="1" stopColor="#c4b5fd" />
                  </linearGradient>
                  <linearGradient id="cv-tab-star-rim" gradientUnits="userSpaceOnUse" x1="8" y1="8" x2="92" y2="92">
                    <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
                    <stop offset="0.45" stopColor="#fff" stopOpacity="0.4" />
                    <stop offset="0.56" stopColor="#fff" stopOpacity="0" />
                    <stop offset="0.62" stopColor="#000" stopOpacity="0" />
                    <stop offset="1" stopColor="#000" stopOpacity="0.55" />
                  </linearGradient>
                  <clipPath id="cv-tab-star-clip">
                    <path d="M39 34.86 L39 9 L61 9 L61 34.86 L85.59 26.87 L92.39 47.79 L67.8 55.78 L83 76.7 L65.2 89.64 L50 68.71 L34.8 89.64 L17 76.7 L32.2 55.78 L7.61 47.79 L14.41 26.87 Z" />
                  </clipPath>
                </defs>
                <path
                  d="M39 34.86 L39 9 L61 9 L61 34.86 L85.59 26.87 L92.39 47.79 L67.8 55.78 L83 76.7 L65.2 89.64 L50 68.71 L34.8 89.64 L17 76.7 L32.2 55.78 L7.61 47.79 L14.41 26.87 Z"
                  fill="url(#cv-tab-star-fill)"
                />
                <path
                  d="M39 34.86 L39 9 L61 9 L61 34.86 L85.59 26.87 L92.39 47.79 L67.8 55.78 L83 76.7 L65.2 89.64 L50 68.71 L34.8 89.64 L17 76.7 L32.2 55.78 L7.61 47.79 L14.41 26.87 Z"
                  fill="none"
                  stroke="url(#cv-tab-star-rim)"
                  strokeWidth="4.4"
                  strokeLinejoin="miter"
                  clipPath="url(#cv-tab-star-clip)"
                />
              </svg>
            </span>
            <span className="cv-tab-text">CV</span>
            <span className="cv-tab-line" style={{ "--w": "3.4em", top: "5.3em" } as CSSProperties} />
            <span className="cv-tab-line" style={{ "--w": "2.7em", top: "5.95em" } as CSSProperties} />
            <span className="cv-tab-line" style={{ "--w": "3.1em", top: "6.6em" } as CSSProperties} />
            <span className="cv-tab-curl" />
          </span>
        </span>
      </button>

      {open && (
        <div
          className="cvd"
          role="dialog"
          aria-modal="true"
          aria-label="CV printer"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="cvd-in">
            <div className="cvd-head">
              <span className="cvd-mark" aria-hidden>
                {site.monogram}
              </span>
              <div>
                <p className="cvd-name">{site.name}</p>
                <p className="cvd-sub">CV printer</p>
              </div>
            </div>
            <button
              type="button"
              className="cvd-x"
              aria-label="Close the CV printer"
              onClick={close}
              ref={closeRef}
            >
              <span aria-hidden>×</span>
            </button>

            <div
              className={`cvp cvp--overlay${mode === "3d" ? " is-3d" : mode === "2d" ? " is-2d" : ""}${running ? " is-busy" : ""}${done ? " is-printed" : ""}`}
              data-cvp
              data-phase={phase}
            >
              <div
                className="cvp-stage"
                data-cvp-stage
                role="button"
                tabIndex={0}
                aria-label="Print my CV"
                aria-busy={running}
                ref={stageRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    runPrint();
                  }
                }}
              >
                {mode === null && <span className="cvp-warm" aria-hidden />}
                {mode === "2d" && (
                  <PrinterFlat front={FRONT} back={BACK} printed={done} request={flipRequest} />
                )}
              </div>

              <div className="cvp-ui">
                <button
                  type="button"
                  data-cvp-print
                  className="cvp-btn"
                  disabled={running}
                  aria-busy={running}
                  onClick={runPrint}
                >
                  <span className="cvp-btn-icon" aria-hidden>
                    <Printer size={17} />
                  </span>
                  <span className="cvp-label">{label}</span>
                </button>
                <p className="cvp-status" data-cvp-status aria-live="polite">
                  {running && <>Printing your&nbsp;CV…</>}
                  {done && (
                    <>
                      <span className="cvp-ok">Printed. Check your&nbsp;downloads.</span> Nothing
                      &nbsp;there?{" "}
                      <a className="link" href={PDF} download={PDF_NAME}>
                        Grab the&nbsp;PDF
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
