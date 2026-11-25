/**
 * EDIT ME — every personal detail lives here.
 *
 * Values marked "PLACEHOLDER" are intentional stand-ins taken from the brief.
 * Replace them with your real details and the whole site updates.
 */

export const site = {
  // --- Identity ---
  name: "Chandru M",
  monogram: "CM", // shown in the sidebar avatar
  handle: "@chandrum",
  role: "UI/UX Designer",
  tagline: "UI/UX Designer crafting products people love to use.",
  location: "India",
  availability: "Open to full-time, freelance and contract work",
  yearsExperience: 5.5,

  // --- Contact ---
  email: "rohitchandru418@gmail.com",
  phone: "9345291648",

  // --- Links ---
  url: "https://your-domain.com", // PLACEHOLDER — update after deploy
  resumeUrl: "/resume.pdf", // PLACEHOLDER — drop your PDF in /public
  socials: [
    // PLACEHOLDER — replace hrefs when you share your profiles
    { label: "Behance", href: "#" },
    { label: "Dribbble", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
  ],

  // --- SEO ---
  metaDescription:
    "UI/UX designer with 5.5 years of experience designing websites, mobile apps, SaaS platforms and AI-native products for startups, Web3 teams and global clients.",
  keywords: [
    "UI designer",
    "UX designer",
    "product designer",
    "web design",
    "mobile app design",
    "SaaS design",
    "Web3 design",
    "AI product design",
    "freelance designer",
  ],
  ogImage: "/og.png", // PLACEHOLDER — 1200x630 social card

  // --- Hero stats ---
  stats: [
    { value: "5.5+", label: "Years of experience" },
    { value: "3", label: "Companies" },
    { value: "30+", label: "Projects shipped" }, // PLACEHOLDER — confirm the real number
    { value: "Global", label: "Freelance clients" },
  ],
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Works", href: "/works" },
] as const;
