/**
 * The About page's own copy.
 *
 * Layout follows the Figma comp; the words are Chandru's. Nothing here claims a
 * metric he has not given — the reference's stat figures are deliberately absent.
 */

export const about = {
  /** Giant word under the hero (comp: "ART DIRECTOR" at 145.6px). */
  displayWord: "UI/UX DESIGNER",

  statement:
    "I’ve spent 5.5 years designing digital products people actually use — across crypto, SaaS, government and AI-native teams.",

  statementSupport:
    "I care about clarity: strong hierarchy, honest content, and interfaces that feel obvious the first time you use them.",

  philosophy: {
    eyebrow: "My Philosophy",
    heading:
      "Good design is clarity, not decoration — and it only counts if it ships.",
    paragraphs: [
      "I design with users, business goals and engineering reality in mind. The best interface is the one people never have to think about.",
      "My work sits where user needs meet business goals, where honest content and clear hierarchy do the persuading.",
    ],
    checklist: [
      "Research-led, not guesswork",
      "Developer-ready hand-off",
      "Built to scale with the product",
    ],
  },

  experience: {
    eyebrow: "My Experience",
    /** One line at 48px, as in the comp (610px frame). */
    heading: "Building products through design",
    /** Centred strapline inside the card (comp: "My work sits at the intersection…"). */
    title: "My work sits where user needs meet business goals.",
    note: "Studio, in-house and freelance practice.",
  },
} as const;

/**
 * The hero's orbit ring. Geometry measured off the comp: 13 circular tiles on a
 * ring of radius 422.7px inside a 944px box, spaced 18° apart.
 *
 * The comp only draws the 13 tiles that fall inside the 944x570 window at rest;
 * the 7 slots below it (36°-144°) are omitted because they are never seen in a
 * still. A rotating ring does bring them into view, and leaving them out tears a
 * 126° hole that sweeps across the hero once per turn. So we complete the ring
 * to its full 20 slots, deriving each size from the comp's pattern (which
 * repeats every 180°) and reusing the comp's own crops.
 */
export const ORBIT_BOX = 944;
export const ORBIT_RADIUS = 422.7;

/** Tile sizes around the ring, 18° apart, starting at -180°. */
const ORBIT_SIZES = [
  84, 105, 117, 117, 105, 84, 105, 117, 117, 105, 84, 105, 117, 117, 105, 84,
  105, 117, 117, 105,
];

/** The comp's 13 crops, indexed by slot. */
const ORBIT_IMAGES: Record<number, string> = {
  0: "o01",
  1: "o02",
  2: "o03",
  3: "o04",
  4: "o05",
  5: "o06",
  6: "o07",
  7: "o08",
  8: "o09",
  9: "o10",
  10: "o11",
  11: "o12",
  19: "o13",
};

/**
 * Fill the slots the comp omits by reusing its crops. A filled slot and its
 * original sit 216° apart, while the visible window spans about 193°, so the two
 * are never on screen together.
 */
const ORBIT_FILL = ["o01", "o02", "o03", "o04", "o05", "o06", "o07"];

export const orbitTiles = ORBIT_SIZES.map((size, i) => {
  const angle = -180 + 18 * i;
  const name = ORBIT_IMAGES[i] ?? ORBIT_FILL[i - 12];
  return { angle, size, src: `/figma/orbit/${name}.webp` };
});
