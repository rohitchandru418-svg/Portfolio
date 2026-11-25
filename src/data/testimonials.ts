/**
 * Testimonials. These are stand-in quotes — replace with real, permission-cleared
 * ones before launch. Attribution is by role only; do not publish invented names.
 */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "He turned a messy brief into a clear, structured product flow — and the hand-off was spotless. The right questions get asked early, so there are no surprises later.",
    name: "Product Lead",
    role: "SaaS platform",
    company: "United States",
  },
  {
    quote:
      "Fast, thoughtful and genuinely easy to work with. The design system he set up still guides everything we ship today.",
    name: "Founder",
    role: "Web3 startup",
    company: "Remote",
  },
  {
    quote:
      "He understood both our users and our constraints, then delivered interfaces that simply work. A rare mix of craft and pragmatism.",
    name: "Programme Manager",
    role: "Civic tech",
    company: "India",
  },
];

export const testimonialsTrustLine = "Trusted by clients across India, the US and Europe.";
