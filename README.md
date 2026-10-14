# Now CV — Professional CV Builder

A production-ready CV builder with authentication, database persistence, AI-powered CV generation, drag-and-drop editing, and PDF export.

## Features

- **Authentication**: Secure sign-up and sign-in with NextAuth.js (Credentials provider + JWT sessions)
- **Database Persistence**: Neon PostgreSQL via Prisma for authenticated users
- **Guest Mode**: Full CV editing with localStorage persistence
- **AI Assistant**: Gemini AI-powered CV content generation
- **Drag-and-Drop**: Reorder sections and entries with dnd-kit
- **PDF Export**: High-quality PDF generation with Puppeteer
- **Templates**: 7 professional CV templates
- **Responsive**: Works on desktop, tablet, and mobile

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:

- `AUTH_SECRET` / `NEXTAUTH_SECRET` — Secret used by NextAuth.js to sign session JWTs. Generate with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- `NEXTAUTH_URL` — The canonical URL of the app (e.g. `http://localhost:3000`)
- `GEMINI_API_KEY` — Google Gemini API key for AI features (from https://aistudio.google.com)

### Database Setup

The app uses Neon PostgreSQL through Prisma 7 (`prisma/schema.prisma`).
Set `DATABASE_URL` in `.env`, then sync the schema (creates the
`users`/`cvs` tables if missing — no data migration needed):

```bash
npx prisma db push
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production

```bash
npm run build
npm start
```

## Usage

### Guest Mode

1. Visit the landing page and click "Continue as Guest" or "Create CV"
2. Build your CV with full editing capabilities
3. Your CV is automatically saved to localStorage
4. Export as PDF anytime

### Authenticated Mode

1. Sign up for an account or sign in
2. Create, edit, and manage multiple CVs
3. Your CVs are saved to the database
4. Import guest CVs when you create an account

### AI Assistant

1. Open the builder and click the "AI" button
2. Choose an AI action (summary, improve, experience, extract, tailor, complete, ATS)
3. Provide your information and click "Generate"
4. AI content is automatically applied to your CV

### Drag-and-Drop

- Drag sections to reorder them
- Drag experience, education, and project entries to reorder
- Drag handles appear on hover

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: 19
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: Neon PostgreSQL via Prisma 7
- **Authentication**: NextAuth.js v5 (Credentials provider, JWT strategy) + bcryptjs
- **AI**: Google Gemini API
- **PDF**: Puppeteer + @sparticuz/chromium
- **Drag-and-Drop**: @dnd-kit

## Project Structure

```
src/
  auth.ts               # NextAuth.js configuration (Credentials + JWT)
  proxy.ts              # Route protection (authed pages)
  app/                    # Next.js App Router
    (auth)/              # Auth layout (signin, signup)
    api/                 # API routes
      auth/              # NextAuth handler + register endpoint
      cvs/               # CV CRUD endpoints
      ai/                # AI generation endpoint
      generate-pdf/      # PDF generation endpoint
    builder/             # CV builder page
    dashboard/           # User dashboard
    settings/            # Account settings
    page.tsx             # Landing page
  components/
    auth/                # Auth components
    builder/             # Builder components
    CVForm/              # CV form components
    dnd/                 # Drag-and-drop components
    home/                # Landing page components
    layout/              # Layout components
    ui/                  # shadcn/ui components
  lib/
    features/            # Redux slices
    persistence.ts       # Persistence abstraction
    auth.ts              # Auth utilities
    db.ts                # Database setup
    validation.ts        # Zod schemas
  templates/             # CV templates
```

## API Endpoints

- `GET /api/auth/[...nextauth]` — NextAuth.js handlers (sign in, sign out, session)
- `POST /api/auth/register` — Create account (credentials, server-side)
- `GET /api/user` — Get the current user
- `PATCH /api/user` — Update the current user's profile
- `GET /api/cvs` — List user CVs
- `POST /api/cvs` — Create CV
- `GET /api/cvs/[id]` — Get CV
- `PATCH /api/cvs/[id]` — Update CV
- `DELETE /api/cvs/[id]` — Delete CV
- `POST /api/cvs/import` — Import guest CVs
- `POST /api/ai/generate` — AI content generation
- `POST /api/generate-pdf` — PDF generation
