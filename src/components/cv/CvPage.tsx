import { cv } from "@/data/cv";

/**
 * The printable CV. Two A4 pages at 96dpi (794x1123), rendered off-screen by
 * the printer: each page is screenshotted to a texture for the 3D sheet, and
 * the same markup feeds the downloadable PDF. Editorial layout — big name and
 * statement, a stat band, image-led selected work, and tight lower columns.
 */

const INK = "#09090b";
const INK2 = "#27272a";
const MUTED = "#52525b";
const FAINT = "#a1a1aa";
const LINE = "#e4e4e7";
const SOFT = "#f4f4f5";
const ACCENT = "#7c3aed";

function Rule({ color = LINE, width = 1 }: { color?: string; width?: number }) {
  return <div style={{ height: width, background: color }} />;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: MUTED,
        marginBottom: 14,
      }}
    >
      <span
        aria-hidden
        style={{ width: 6, height: 6, borderRadius: 2, background: ACCENT, flexShrink: 0 }}
      />
      {children}
    </div>
  );
}

function Monogram({ size = 46 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 13,
        background: INK,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.36,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        flexShrink: 0,
      }}
    >
      {cv.monogram}
    </div>
  );
}

/** Small "label: value" pair used in the header and footer bands. */
function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED }}>
        {label}
      </div>
      <div style={{ fontSize: 11, color: INK2, marginTop: 3 }}>{value}</div>
    </div>
  );
}

function StatBand() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cv.stats.length}, 1fr)`,
        borderTop: `1px solid ${LINE}`,
        borderBottom: `1px solid ${LINE}`,
        padding: "20px 0",
      }}
    >
      {cv.stats.map((s, i) => (
        <div
          key={s.label}
          style={{ paddingLeft: i === 0 ? 0 : 20, borderLeft: i === 0 ? "none" : `1px solid ${LINE}` }}
        >
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
            {s.value}
          </div>
          <div style={{ fontSize: 10, color: MUTED, marginTop: 7, lineHeight: 1.35, maxWidth: 120 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkCard({ work }: { work: (typeof cv.selectedWork)[number] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 10",
          borderRadius: 10,
          overflow: "hidden",
          background: SOFT,
          border: `1px solid ${LINE}`,
        }}
      >
        {work.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={work.cover}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
          marginTop: 11,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700 }}>{work.title}</span>
        <span style={{ fontSize: 10, color: MUTED, whiteSpace: "nowrap" }}>
          {work.category} · {work.year}
        </span>
      </div>
      <div style={{ fontSize: 11, lineHeight: 1.55, color: MUTED, marginTop: 4 }}>{work.summary}</div>
    </div>
  );
}

export function CvPage({ page }: { page: 1 | 2 }) {
  const { width, height } = cv.page;

  return (
    <div
      style={{
        width,
        height,
        background: "#ffffff",
        color: INK,
        fontFamily: '"Satoshi", ui-sans-serif, system-ui, sans-serif',
        padding: "52px 54px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {page === 1 ? (
        <>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Monogram size={38} />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "-0.01em" }}>
                {cv.name}
              </span>
            </div>
            <div style={{ display: "flex", gap: 26, textAlign: "right" }}>
              <Meta label="Based" value={cv.contact.location} />
              <Meta label="Available" value="Full-time · Freelance" />
            </div>
          </div>

          {/* Name + statement + portrait */}
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start", marginTop: 30 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 68, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.98 }}>
                {cv.name}
              </div>
              <div style={{ fontSize: 15, color: MUTED, marginTop: 14 }}>
                {cv.role} · {cv.handle}
              </div>
              <p
                style={{
                  fontSize: 20,
                  lineHeight: 1.42,
                  letterSpacing: "-0.012em",
                  color: INK2,
                  margin: "20px 0 0",
                }}
              >
                {cv.statement}
              </p>
            </div>
            <div
              style={{
                width: 236,
                flexShrink: 0,
                aspectRatio: "4 / 5",
                borderRadius: 14,
                overflow: "hidden",
                border: `1px solid ${LINE}`,
                background: SOFT,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cv.portrait}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>

          {/* Contact */}
          <div style={{ marginTop: 26 }}>
            <Rule />
            <div style={{ display: "flex", gap: 34, paddingTop: 13, fontSize: 11.5, color: MUTED }}>
              <span>{cv.contact.email}</span>
              <span>{cv.contact.phone}</span>
              <span>{cv.contact.location}</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ marginTop: 22 }}>
            <StatBand />
          </div>

          {/* Profile */}
          <div style={{ marginTop: 26 }}>
            <SectionTitle>Profile</SectionTitle>
            <p style={{ fontSize: 12.5, lineHeight: 1.65, color: INK2, margin: 0 }}>{cv.profile}</p>
          </div>

          {/* Experience */}
          <div style={{ marginTop: 26 }}>
            <SectionTitle>Experience</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {cv.experience.map((r) => (
                <div key={r.title + r.period} style={{ display: "flex", gap: 18 }}>
                  <div style={{ width: 96, flexShrink: 0, fontSize: 10.5, color: MUTED, paddingTop: 2 }}>
                    {r.period}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>
                      {r.title}
                      <span style={{ fontWeight: 500, color: MUTED }}> · {r.company}</span>
                    </div>
                    <div style={{ fontSize: 11.5, lineHeight: 1.6, color: INK2, marginTop: 4 }}>
                      {r.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Selected work */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em" }}>Selected work</div>
            <div style={{ fontSize: 10.5, color: MUTED }}>
              {cv.name} · {cv.role}
            </div>
          </div>
          <div style={{ fontSize: 11.5, color: MUTED, marginTop: 6 }}>
            Each one links to the full case study on the portfolio.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "26px 22px",
              marginTop: 22,
            }}
          >
            {cv.selectedWork.map((w) => (
              <WorkCard key={w.title} work={w} />
            ))}
          </div>

          {/* Services */}
          <div style={{ marginTop: 30 }}>
            <SectionTitle>What I do</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 26px" }}>
              {cv.services.map((s) => (
                <div key={s.title}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{s.title}</div>
                  <div style={{ fontSize: 10.5, lineHeight: 1.5, color: MUTED, marginTop: 2 }}>
                    {s.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lower columns */}
          <div style={{ marginTop: 28, paddingTop: 22, borderTop: `1px solid ${LINE}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1.15fr 1fr", gap: 26 }}>
              <div>
                <SectionTitle>Education</SectionTitle>
                {cv.education.map((e) => (
                  <div key={e.title} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.4 }}>{e.title}</div>
                    <div style={{ fontSize: 10.5, color: MUTED, marginTop: 2 }}>{e.detail}</div>
                  </div>
                ))}
                <SectionTitle>Strengths</SectionTitle>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {cv.softSkills.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 10,
                        color: INK2,
                        background: SOFT,
                        borderRadius: 100,
                        padding: "4px 10px",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <SectionTitle>Toolkit</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {["Design", "Prototyping & Dev", "AI & Vibe Coding", "Collaboration"].map((g) => (
                    <div key={g}>
                      <div style={{ fontSize: 10.5, fontWeight: 700 }}>{g}</div>
                      <div style={{ fontSize: 10.5, lineHeight: 1.5, color: MUTED, marginTop: 2 }}>
                        {cv.tools
                          .filter((t) => t.group === g)
                          .map((t) => t.name)
                          .join(" · ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <SectionTitle>Languages</SectionTitle>
                <div style={{ fontSize: 11, color: INK2, lineHeight: 1.6 }}>
                  English (professional) · Tamil (native)
                </div>
                <div style={{ marginTop: 16 }}>
                  <SectionTitle>Contact</SectionTitle>
                  <div style={{ fontSize: 11, color: INK2, lineHeight: 1.7 }}>
                    <div>{cv.contact.email}</div>
                    <div>{cv.contact.phone}</div>
                    <div>{cv.contact.location}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer band */}
          <div
            style={{
              marginTop: "auto",
              background: INK,
              color: "#fff",
              borderRadius: 12,
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em" }}>
              {cv.name} — {cv.role}
            </div>
            <div style={{ fontSize: 10.5, color: "#d4d4d8" }}>
              {cv.contact.email} · {cv.contact.phone}
            </div>
          </div>
        </>
      )}
    </div>
  );
}