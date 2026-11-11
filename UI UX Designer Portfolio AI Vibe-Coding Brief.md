# UI/UX Designer Portfolio: AI Vibe-Coding Brief

How to use this doc: paste it (or attach it) into your AI coding tool (Claude Code, Cursor, Lovable, v0, Bolt, etc.) together with the reference design PDF. Replace every \[PLACEHOLDER\] with your real details first. Section 16 has a ready-to-paste starter prompt.

## 1. Project Overview

Build a single-page, scroll-based portfolio website for a **UI/UX Designer with 5.5 years of experience**. The site must feel premium, minimal and editorial, in the style of the attached reference: a light, rounded, card-based layout with large imagery, pill tags and a few dark accent cards.

**Goal:** convert visitors (recruiters, startup founders, agencies, freelance clients) into interview requests, calls or project enquiries.

**Primary CTA:** Book a Call / Contact Me **Secondary CTAs:** View Projects, Download Resume

## 2. About the Designer (source of truth for all copy)

- **Name:** \[YOUR NAME\]
- **Role:** UI/UX Designer (Product, Web and App) with branding and AI-assisted workflow skills
- **Experience:** 5.5 years across 3 companies plus freelance work for global clients
- **Education:** Bachelor of Media Technology, specialised in UI/UX Design
- **Location:** \[CITY, COUNTRY\] | Open to: \[Full-time / Freelance / Both\]
- **Email:** \[EMAIL\] | **Phone (optional):** \[PHONE\]
- **Links:** \[Behance\], \[Dribbble\], \[LinkedIn\], \[Instagram\], \[Resume PDF\]

**Core strengths**

- UI/UX design for websites, mobile apps, web apps, Windows/desktop apps and SaaS products
- Front-end knowledge (HTML, CSS, JS, responsive implementation, developer hand-off)
- AI knowledge: AI tools for design, vibe coding, vibe editing, and designing AI-native applications
- Graphic design: branding, logo design, visual design, illustrations, posters, banners
- Presentation design: pitch decks, one-pagers, presentations, email designs
- Strong team player with experience collaborating across product, engineering, marketing and business teams

**Industry verticals**

- Crypto / Web3: crypto market knowledge, GameFi, DeFi and DePIN products
- US SaaS products
- Government and civic tech: political party petition management, startup ecosystem platforms (StartupTN, FameTN MSME Connect)
- AI-native products

## 3. Target Audience

1. Recruiters and hiring managers at product companies and startups (need quick proof of skill and impact)
2. Startup founders and agencies looking for a product designer (need case studies and process)
3. Freelance clients needing websites, apps, decks or branding (need services and an easy way to get in touch)

## 4. Tech Stack (recommended)

- **Framework:** Next.js (App Router) + TypeScript, or Vite + React for a simpler static build
- **Styling:** Tailwind CSS with design tokens as CSS variables
- **Animation:** Framer Motion (scroll reveals, hover states, marquee), optional Lenis for smooth scroll
- **Icons:** Lucide
- **Content:** all content in typed data files (/data/\*.ts) or MDX so it can be edited without touching components
- **Forms:** Formspree, Resend or Web3Forms (no backend needed)
- **Hosting:** Vercel or Netlify with a custom domain
- **Analytics:** Plausible or Google Analytics

## 5. Design Direction (derived from the reference)

**Overall feel:** clean, airy, editorial, confident. Lots of white space, big rounded containers, bold imagery, small pill labels.

**Layout**

- Max content width about 1200px, centred; 96-140px vertical spacing between sections
- Bento-style grids for projects and gallery (mixed tall, wide and square tiles)
- Cards with large radius (24-32px), soft borders, very subtle shadows
- Small pill-shaped section labels above each heading (e.g. Services, Process)
- Row of rounded thumbnails below the hero headline

**Colour**

- Background: off-white (#F7F7F5); cards: white (#FFFFFF)
- Text: near-black (#111111); muted text: #6B6B6B
- Dark accent cards: #0D0D0D with white text (stats card, philosophy banner)
- One brand accent colour: \[ACCENT, e.g. #FF5A1F\]
- Light mode first; dark mode optional

**Typography**

- Headings: a modern grotesk (Inter Display, Geist, Satoshi or General Sans), weight 500-600, tight tracking (-0.02em)
- Body: Inter or Geist, 16-18px, line-height 1.6
- Hero heading: clamp(40px, 7vw, 88px); section headings: clamp(32px, 4vw, 56px)
- Use a lighter grey for the second half of a headline, as in the reference

**Components**

- Pill buttons (primary black, secondary outlined) with arrow icon and hover slide effect
- Tag chips for skills and categories
- Floating pill navigation (logo, links, Book a Call button), fixed on scroll, collapsing to a menu on mobile
- Available-for-work badge with a pulsing green dot

**Motion**

- Fade-up on scroll for each section (once only)
- Image hover: slight scale (1.03)
- Counter animation for stats; infinite marquee for tools or logos
- Respect prefers-reduced-motion

## 6. Site Map and Section Order

1. Navigation (sticky)
2. Hero
3. Selected Work (case study grid)
4. Services
5. Process
6. Experience (timeline)
7. Philosophy banner
8. Testimonials
9. Toolkit / Skills
10. Gallery (graphic design and branding work)
11. Blog / Journal (optional)
12. FAQ
13. Contact CTA + Footer

Also build: individual **case study pages** (/work/\[slug\]), a 404 page, and a Resume download link.

## 7. Section-by-Section Spec and Draft Copy

### 7.1 Navigation

- Left: logo or name monogram. Centre: About, Work, Services, Experience, Contact. Right: **Book a Call** button.
- Smooth-scroll anchors, active link highlight, mobile full-screen menu.

### 7.2 Hero

- Status badge: "Available for new projects" + location
- Headline: **"Hi, I'm \[NAME\]. UI/UX Designer crafting products people love to use."**
- Sub-copy: "5.5 years designing websites, mobile apps, SaaS platforms and AI-native products for startups, Web3 teams and global clients."
- Buttons: **View My Work** and **Download Resume**
- Below: thumbnail row of project screens and a stats strip (5.5+ years, 3 companies, \[X\]+ projects, global freelance clients)

### 7.3 Selected Work

Label: "Selected Work". Heading: **"Projects that solve real problems."** Each card: cover image, title, one-line outcome, category tags, year. Click opens the case study page. Filter row: All | Web3 | SaaS | Civic Tech | AI | Branding.

Planned projects (replace with your real details and visuals):

1. **Crypto platform: website, mobile app and web app** (Web3 company). Tags: Web3, Web, Mobile, Web App. Covers crypto market products, GameFi and DeFi interfaces.
2. **DePIN device UI** (Web3 company). Tags: DePIN, Embedded UI, Hardware. On-device screen design for a decentralised physical infrastructure product.
3. **Windows application design** (Web3 company). Tags: Desktop App, Web3.
4. **US SaaS application** (SaaS company). Tags: SaaS, UX, Dashboard.
5. **Petition Management Application** (political party project). Tags: Civic Tech, Web App, Workflow.
6. **StartupTN: AI-native application** (service company). Tags: AI, Government, Product Design.
7. **FameTN MSME Connect Application** (service company). Tags: MSME, Marketplace, App.
8. **Freelance work:** websites, apps, presentations and email design for global clients. Tags: Freelance, Web, Email.
9. **Branding and graphic design:** logos, posters, banners, illustrations. Tags: Branding, Visual.
10. **Pitch decks and presentations.** Tags: Deck, Presentation.

Note: confirm NDA limits before publishing screens. Where needed, blur sensitive data or label a project "Details available on request."

### 7.4 Services

Label: "Services". Heading: **"Design that works, from idea to interface."** Four cards (title, short description, tag list, CTA):

1. **Product UI/UX Design:** research, user flows, wireframes, high-fidelity UI, prototypes, design systems
2. **Website and Landing Page Design:** responsive, conversion-focused design with developer-ready hand-off or front-end build
3. **Brand and Visual Design:** logo, brand identity, illustrations, posters, banners, social creatives
4. **Decks, Presentations and Email Design:** pitch decks, one-pagers, investor and sales presentations, email templates

Optional: add "From $XXX" pricing as in the reference, or use "Let's talk".

### 7.5 Process

Label: "Process". Heading: **"A clear process, from problem to polish."** Four steps as columns or tabs:

1. **Discover:** stakeholder talks, user research, competitor and market analysis
2. **Define:** problem statement, user flows, information architecture
3. **Design:** wireframes, UI, design system, interactive prototypes
4. **Deliver:** hand-off, front-end support, QA, iteration

Dark stats card: **"\[98\]% client satisfaction"** (use a real number or remove it).

### 7.6 Experience (timeline)

Label: "Experience". Heading: **"5.5 years of building products."**

| Role | Company | Period | Summary |
| --- | --- | --- | --- |
| Freelance UI/UX Designer | Self-employed | \[DATES\] | Websites, apps, presentations and email designs for global clients |
| \[UI/UX Designer\] | \[Company 3: service-based\] | \[DATES\] | Petition management app, StartupTN AI-native app, FameTN MSME Connect |
| \[UI/UX Designer\] | \[Company 2: US SaaS project\] | \[DATES\] | SaaS application UI/UX for US clients |
| \[UI/UX Designer\] | \[Company 1: crypto\] | \[DATES\] | Websites, mobile apps, web and Windows apps, DePIN device UI across GameFi, DeFi and DePIN |

Reorder so the most recent role is first. Add 2-3 impact bullets per role with metrics where possible.

### 7.7 Philosophy banner (dark full-width card with background image)

Headline: **"Good design is clarity, not decoration."** Body: "I design with users, business goals and engineering reality in mind. I use AI tools to move faster, but every decision starts with understanding the problem."

### 7.8 Testimonials

Carousel with name, role, company, quote and optional photo. Add 3-5 real testimonials from managers, teammates or clients (\[PLACEHOLDER\]). Trust line: "Trusted by clients in \[countries\]."

### 7.9 Toolkit

Label: "Toolkit". Heading: **"Tools I use to design, build and ship faster."** Grid of tool cards with name, purpose and a proficiency bar or percentage.

- **Design:** Figma, FigJam, Adobe Photoshop, Adobe Illustrator, After Effects, Canva
- **Prototyping and Dev:** Framer, HTML/CSS/JS, basic React
- **AI and Vibe Coding:** ChatGPT, Claude, Cursor, Lovable or v0 (adjust to what you actually use), AI image and video tools for vibe editing
- **Collaboration:** Notion, Jira, Slack, Figma Dev Mode

Soft skills row: team collaboration, communication, stakeholder management, design thinking, rapid prototyping.

### 7.10 Gallery

Bento grid of 6-9 visuals: logos, brand boards, illustrations, posters, banners, pitch deck slides. Lightbox on click.

### 7.11 Blog / Journal (optional, can launch later)

Three article cards (title, excerpt, category, date). Suggested topics:

- Designing DeFi interfaces that normal people can understand
- How I use AI in my design workflow: vibe coding and vibe editing
- Lessons from designing for government and civic tech

### 7.12 FAQ

Accordion with 5-6 questions:

- What types of projects do you take on?
- Are you open to full-time roles or freelance only?
- Do you work with international clients and time zones?
- Do you also code the front end?
- How do you use AI in your design process?
- What do you need to get started?

### 7.13 Contact and Footer

- Heading: **"Let's build something people love."**
- Form fields: Name, Email, Project type (dropdown), Message, Submit. Show success state and validation errors.
- Also show email, phone (optional) and social links.
- Footer: quick links, social icons, "© 2026 \[NAME\]. All rights reserved."

## 8. Case Study Page Template (/work/\[slug\])

1. Hero: title, one-line summary, cover mockup
2. Quick facts: role, team, timeline, platform, tools, industry
3. Problem and context
4. Goals and success metrics
5. Research and insights
6. Process: user flows, wireframes, iterations
7. Final UI: full-width screens with captions
8. Design system or components (if relevant)
9. Outcome and impact (numbers where possible)
10. Learnings
11. Next project link and contact CTA

## 9. Data Model (keep content editable)

Create typed data files for projects, services, experience, testimonials, tools, FAQ and blog posts. A Project has these fields: slug, title, summary, year, category (Web3, SaaS, Civic Tech, AI, Branding or Presentation), cover, images, role, tools, platform, featured (boolean), and sections (each with heading, body and optional images).

## 10. Responsive Behaviour

- Breakpoints: mobile (under 640px), tablet (640-1024px), desktop (1024px and up)
- Bento grids collapse to one column on mobile; the hero thumbnail row becomes a horizontal scroll
- Touch targets at least 44px; body text never below 16px on mobile
- Navigation becomes a hamburger with a full-screen overlay

## 11. SEO, Performance and Accessibility

- Unique title and meta description per page; Open Graph and Twitter images
- Semantic HTML (header, main, section, footer), one H1 per page
- Person and Portfolio JSON-LD schema; sitemap.xml and robots.txt
- Optimised WebP/AVIF images with lazy loading; target Lighthouse 90+
- WCAG AA contrast, visible focus states, keyboard navigation, alt text on all images
- Honour prefers-reduced-motion

## 12. Assets Checklist (prepare before building)

- Profile photo or avatar
- Logo, favicon and OG image
- Cover image and 3-6 screens per project (export from Figma at 2x, WebP)
- Resume PDF
- Branding and graphic design samples
- Testimonials with permission
- Company logos (only if permitted)

## 13. Build Phases (for the AI to follow)

1. **Setup:** scaffolding, Tailwind config with design tokens, fonts, layout and navigation
2. **Static sections:** hero through footer with placeholder data
3. **Data layer:** move all copy into typed data files
4. **Case study pages:** dynamic routes and template
5. **Interactions:** scroll animations, filters, accordion, carousel, lightbox, form handling
6. **Polish:** responsive pass, SEO, accessibility, performance
7. **Deploy:** Vercel, domain and analytics

Ask the AI to complete one phase at a time and stop for review.

## 14. Acceptance Criteria

- All 13 sections render with the specified copy and match the reference's visual style
- Fully responsive at 375px, 768px and 1440px with no horizontal scroll
- Content editable from data files only
- Contact form works with success and error states
- Case study template works for at least 3 projects
- Lighthouse 90+ for Performance, Accessibility and SEO
- No console errors; no lorem ipsum left

## 15. Do Not

- Do not mix icon sets; use Lucide consistently
- Do not add heavy animations that hurt performance
- Do not hard-code copy inside components
- Do not invent metrics, clients or testimonials; use clearly marked placeholders
- Do not copy the reference's text or images; use it for layout and style only

## 16. Ready-to-Paste Starter Prompt

You are a senior front-end engineer with a strong design eye. Build a portfolio website for a UI/UX designer using the attached brief and reference design. Follow the brief exactly: stack (Next.js, TypeScript, Tailwind, Framer Motion), design tokens, section order, copy and data model. Work in the phases listed in section 13. Start with Phase 1 and Phase 2 only: set up the project and build all static sections with placeholder data from the brief. Keep all content in typed data files. Match the reference's look (rounded cards, bento grids, pill labels, dark accent cards, floating navigation) while using the brand accent colour and fonts specified. After each phase, summarise what you built and wait for my feedback before continuing.
