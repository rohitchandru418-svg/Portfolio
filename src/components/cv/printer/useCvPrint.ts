"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The print sequence, decoupled from WebGL so the 2D fallback and the 3D scene
 * share one timing model. Durations are milliseconds.
 */
export const PHASES = ["idle", "warm", "feed", "print", "settled"] as const;
export type Phase = (typeof PHASES)[number];

export const DURATIONS: Record<Phase, number> = {
  idle: 0,
  warm: 1400,
  feed: 1500,
  print: 900,
  settled: 0,
};

const NEXT: Record<Phase, Phase> = {
  idle: "idle",
  warm: "feed",
  feed: "print",
  print: "settled",
  settled: "settled",
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export type PrintState = {
  phase: Phase;
  /** Progress within the current phase, 0..1. */
  progress: number;
  /** How far the sheet has emerged, 0..1 across feed + print. */
  feed: number;
  /** True once the sheet can be flipped. */
  flipped: boolean;
  start: () => void;
  flip: () => void;
  reset: () => void;
};

export function useCvPrint(enabled: boolean, onSettled?: () => void): PrintState {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const raf = useRef<number | null>(null);
  const phaseRef = useRef<Phase>("idle");
  const startedAt = useRef(0);
  const settled = useRef(onSettled);
  settled.current = onSettled;

  const stop = useCallback(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
  }, []);

  const tick = useCallback((now: number) => {
    const cur = phaseRef.current;
    const dur = DURATIONS[cur];
    const t = now - startedAt.current;

    if (dur > 0 && t >= dur) {
      const next = NEXT[cur];
      phaseRef.current = next;
      startedAt.current = now;
      setPhase(next);
      setProgress(0);
      if (next === "settled") settled.current?.();
    } else {
      setProgress(dur > 0 ? Math.min(t / dur, 1) : 1);
    }

    if (phaseRef.current !== "settled") {
      raf.current = requestAnimationFrame(tick);
    } else {
      raf.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    setFlipped(false);
    phaseRef.current = "warm";
    setPhase("warm");
    setProgress(0);
    startedAt.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  }, [stop, tick]);

  const flip = useCallback(() => setFlipped((f) => !f), []);

  const reset = useCallback(() => {
    stop();
    phaseRef.current = "idle";
    setPhase("idle");
    setProgress(0);
    setFlipped(false);
  }, [stop]);

  useEffect(() => {
    if (!enabled) reset();
    return stop;
  }, [enabled, reset, stop]);

  // The sheet emerges across feed + print so it reads as one continuous motion.
  let feed = 0;
  if (phase === "feed") feed = 0.82 * easeInOut(progress);
  else if (phase === "print") feed = 0.82 + 0.18 * easeInOut(progress);
  else if (phase === "settled") feed = 1;

  return { phase, progress, feed, flipped, start, flip, reset };
}
