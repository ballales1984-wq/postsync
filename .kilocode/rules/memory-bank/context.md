<<<<<<< HEAD
# Active Context: Next.js Starter Template

## Current State

**Template Status**: ✅ Ready for development

The template is a clean Next.js 16 starter with TypeScript and Tailwind CSS 4. It's ready for AI-assisted expansion to build any type of application.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

The template is ready. Next steps depend on user requirements:

1. What type of application to build
2. What features are needed
3. Design/branding preferences

## Quick Start Guide

### To add a new page:

Create a file at `src/app/[route]/page.tsx`:
```tsx
export default function NewPage() {
  return <div>New page content</div>;
}
```

### To add components:

Create `src/components/` directory and add components:
```tsx
// src/components/ui/Button.tsx
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>;
}
```

### To add a database:

Follow `.kilocode/recipes/add-database.md`

### To add API routes:

Create `src/app/api/[route]/route.ts`:
```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Pending Improvements

- [ ] Add more recipes (auth, email, etc.)
- [ ] Add example components
- [ ] Add testing setup recipe
=======
# Active Context: PostSync

## Current State

**Status**: ✅ Full Feature Set + AI + Real Publishing

PostSync is a complete social media management platform with AI text generation, real X/Twitter publishing via OAuth 2.0, image uploads, scheduling, and multi-platform previews.

## Recently Completed

- [x] Database: posts + socialAccounts tables
- [x] Post composer with text, images, scheduling
- [x] Real-time previews (X, Instagram, LinkedIn, Facebook)
- [x] Image upload with drag-and-drop
- [x] Post scheduling with date/time picker
- [x] Character limit warnings with progress bars
- [x] OAuth social account connections (Twitter real, others demo)
- [x] Full CRUD API routes
- [x] Dashboard with filtering (All/Drafts/Scheduled/Published)
- [x] AI text generation via OpenAI API
- [x] Real X/Twitter publishing via OAuth 2.0
- [x] Environment variable configuration (.env.example)

## Current Structure

| File/Directory | Purpose |
|---|---|
| `src/app/compose/page.tsx` | Post composer + AI generation + Twitter publish |
| `src/app/dashboard/page.tsx` | Post management dashboard |
| `src/app/connections/page.tsx` | Social account OAuth connections |
| `src/app/api/generate/route.ts` | AI text generation endpoint |
| `src/app/api/publish/twitter/route.ts` | Real Twitter publishing |
| `src/app/api/auth/twitter/callback/route.ts` | Twitter OAuth callback |
| `src/app/api/posts/route.ts` | Posts CRUD |
| `src/app/api/social-accounts/route.ts` | Social accounts CRUD |
| `src/components/ui/AIGenerate.tsx` | AI generation UI component |
| `src/lib/ai.ts` | OpenAI API integration |
| `src/lib/twitter.ts` | Twitter OAuth 2.0 + API v2 |
| `.env.example` | Environment variable template |

## What Works

- AI-powered post generation with tone selection
- Real Twitter/X publishing via OAuth 2.0
- Compose posts with text + images
- Real-time platform previews
- Drag-and-drop image upload
- Schedule posts for later
- Character limit warnings
- Social account management
- Dashboard with full filtering

## To Activate Real Features

1. Copy `.env.example` to `.env.local`
2. Add `OPENAI_API_KEY` for AI generation
3. Add `TWITTER_CLIENT_ID` + `TWITTER_CLIENT_SECRET` for Twitter OAuth
4. Connect Twitter account via `/connections`
>>>>>>> 71772c2f1f458ae834f7acdc35b3c10d96c6e547

## Session History

| Date | Changes |
|------|---------|
<<<<<<< HEAD
| Initial | Template created with base setup |
=======
| Initial | Template created |
| 2026-03-26 | PostSync MVP |
| 2026-03-26 | Images, scheduling, OAuth, char limits |
| 2026-03-26 | AI text generation, real Twitter publishing |
>>>>>>> 71772c2f1f458ae834f7acdc35b3c10d96c6e547
