import type { Metadata } from "next";
import { CvPage } from "@/components/cv/CvPage";
import { cv } from "@/data/cv";

export const metadata: Metadata = {
  title: "CV",
  description: `${cv.name} — ${cv.role}. Printable CV.`,
  robots: { index: false, follow: false },
};

/**
 * Hosts the two printable CV pages off-screen. The printer mounts this route in
 * a hidden iframe, screenshots each page to a canvas, and uses the result as the
 * 3D sheet texture — so the sheet shows the real CV, not a mock-up. Also the
 * source for the downloadable PDF.
 */
export default function CvRoute() {
  return (
    <div
      data-cv-doc
      style={{
        position: "fixed",
        left: -10000,
        top: 0,
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <div data-cv-page="1" style={{ width: "fit-content" }}>
        <CvPage page={1} />
      </div>
      <div data-cv-page="2" style={{ width: "fit-content" }}>
        <CvPage page={2} />
      </div>
    </div>
  );
}
