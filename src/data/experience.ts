/**
 * Experience timeline, most recent first.
 *
 * Company names are descriptive rather than literal: the brief leaves them
 * blank, so nothing here claims an employer Chandru has not named.
 */

export type Role = {
  title: string;
  company: string;
  period: string;
  summary: string;
};

export const experience: Role[] = [
  {
    title: "Freelance UI/UX Designer",
    company: "Self-employed",
    period: "2024 — Present",
    summary:
      "Websites, apps, presentations and email design for global clients across SaaS, Web3 and civic tech.",
  },
  {
    title: "UI/UX Designer",
    company: "Service-based product studio",
    period: "2022 — 2024",
    summary:
      "Petition management app, StartupTN AI-native app and FameTN MSME Connect for government and civic programmes.",
  },
  {
    title: "UI/UX Designer",
    company: "US SaaS company",
    period: "2021 — 2022",
    summary:
      "SaaS application UI/UX for US clients, from dashboard architecture to component libraries.",
  },
  {
    title: "UI/UX Designer",
    company: "Crypto / Web3 company",
    period: "2019 — 2021",
    summary:
      "Websites, mobile apps, web and Windows apps, and DePIN device UI across GameFi, DeFi and DePIN products.",
  },
];
