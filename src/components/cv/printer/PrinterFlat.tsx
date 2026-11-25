"use client";

import { useEffect, useState } from "react";

/**
 * The fallback for machines without WebGL: the real CV pages as flat images
 * with a small, CSS-only entrance, so the interaction is identical even though
 * there is no 3D. `request` bumps on each print so the entrance replays; the
 * download and status copy are handled by the parent.
 */
export function PrinterFlat({
  front,
  back,
  printed,
  request,
}: {
  front: string;
  back: string;
  printed: boolean;
  request: number;
}) {
  const [shown, setShown] = useState(false);

  // Re-run the entrance each time the drawer is (re)opened or reprinted.
  useEffect(() => {
    setShown(false);
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [request]);

  return (
    <div className="cvp-flat" aria-hidden>
      <img className="cvp-flat-back" src={back} alt="" width={768} height={1086} />
      <img
        className={`cvp-flat-front${printed || shown ? " is-in" : ""}`}
        src={front}
        alt=""
        width={768}
        height={1086}
      />
    </div>
  );
}
