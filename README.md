# Mielle Almedejar — Portfolio

Production-level portfolio website for **Mielle Almedejar**, Web / Software / AI Engineer.

## Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Primitives**: Radix UI
- **Fonts**: Syne (display) + DM Sans (body) + Fira Code (mono)
- **Theme**: dark/light via `next-themes`
- **Notifications**: react-hot-toast

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Folder Structure

```
app/
  layout.tsx          # Root layout, fonts, metadata
  page.tsx            # Main page (all sections)
  globals.css         # Global styles + CSS vars
  certifications/
    page.tsx          # Dedicated certifications page

components/
  layout/
    Navbar.tsx        # Sticky nav with scroll links + certs page link
    Footer.tsx
  sections/
    Hero.tsx          # Typewriter + particles + CTAs
    About.tsx         # Bio + tech stack grid
    Projects.tsx      # Filterable project cards
    Skills.tsx        # Animated skill bars
    Experience.tsx    # Timeline (work + education)
    Contact.tsx       # Email copy button + social links
    CertificationsGrid.tsx
  shared/
    CustomCursor.tsx  # Emerald dot + ring cursor
    ParticlesBackground.tsx
    ScrollReveal.tsx  # Framer Motion scroll reveal
    ThemeToggle.tsx
  providers/
    ThemeProvider.tsx

data/
  config.ts           # ALL content: personal info, projects, skills, experience, certs

lib/
  utils.ts            # cn(), formatDate(), slugify()
```

## Customization

All content lives in `data/config.ts`. Edit:
- `siteConfig` — name, email, bio, links
- `projects` — add/remove/edit projects
- `skillCategories` — adjust skill levels
- `experiences` — work history + education
- `certifications` — add new certs

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Deploy (auto-detects Next.js, no config needed)

Or use the included `vercel.json` for CLI:

```bash
npm i -g vercel
vercel --prod
```

## PDF Resume

Place your resume at `public/resume.pdf` — the download button will work automatically.

## Environment Variables

None required for basic setup. Add `.env.local` if you integrate a contact form service (Resend, EmailJS, etc.).
