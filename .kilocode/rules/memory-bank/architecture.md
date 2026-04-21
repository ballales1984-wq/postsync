<<<<<<< HEAD
# System Patterns: Next.js Starter Template
=======
# System Patterns: PostSync
>>>>>>> 71772c2f1f458ae834f7acdc35b3c10d96c6e547

## Architecture Overview

```
src/
<<<<<<< HEAD
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Home page
│   ├── globals.css         # Tailwind imports + global styles
│   └── favicon.ico         # Site icon
└── (expand as needed)
    ├── components/         # React components (add when needed)
    ├── lib/                # Utilities and helpers (add when needed)
    └── db/                 # Database files (add via recipe)
=======
├── app/
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Landing page
│   ├── compose/page.tsx         # Post composer (text, images, schedule, previews)
│   ├── dashboard/page.tsx       # Post management dashboard
│   ├── connections/page.tsx     # Social account OAuth connections
│   └── api/
│       ├── posts/               # Posts CRUD
│       └── social-accounts/     # Social accounts CRUD
├── components/
│   ├── ui/
│   │   ├── ImageUpload.tsx      # Drag-and-drop image upload
│   │   ├── SchedulePicker.tsx   # Date/time scheduling
│   │   ├── CharLimitWarning.tsx # Character limit warnings
│   │   └── PostCard.tsx         # Post display card
│   └── previews/
│       ├── TwitterPreview.tsx   # X format preview (with image)
│       ├── InstagramPreview.tsx # Instagram format preview
│       ├── LinkedInPreview.tsx  # LinkedIn format preview
│       └── FacebookPreview.tsx  # Facebook format preview
├── db/
│   ├── schema.ts                # Posts + socialAccounts tables
│   ├── index.ts                 # Database client
│   └── migrations/              # Generated SQL migrations
└── lib/
    └── types.ts                 # Platform, Post, SocialAccount types
>>>>>>> 71772c2f1f458ae834f7acdc35b3c10d96c6e547
```

## Key Design Patterns

<<<<<<< HEAD
### 1. App Router Pattern

Uses Next.js App Router with file-based routing:
```
src/app/
├── page.tsx           # Route: /
├── about/page.tsx     # Route: /about
├── blog/
│   ├── page.tsx       # Route: /blog
│   └── [slug]/page.tsx # Route: /blog/:slug
└── api/
    └── route.ts       # API Route: /api
```

### 2. Component Organization Pattern (When Expanding)

```
src/components/
├── ui/                # Reusable UI components (Button, Card, etc.)
├── layout/            # Layout components (Header, Footer)
├── sections/          # Page sections (Hero, Features, etc.)
└── forms/             # Form components
```

### 3. Server Components by Default

All components are Server Components unless marked with `"use client"`:
```tsx
// Server Component (default) - can fetch data, access DB
export default function Page() {
  return <div>Server rendered</div>;
}

// Client Component - for interactivity
"use client";
export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### 4. Layout Pattern

Layouts wrap pages and can be nested:
```tsx
// src/app/layout.tsx - Root layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// src/app/dashboard/layout.tsx - Nested layout
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

## Styling Conventions

### Tailwind CSS Usage
- Utility classes directly on elements
- Component composition for repeated patterns
- Responsive: `sm:`, `md:`, `lg:`, `xl:`

### Common Patterns
```tsx
// Container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Flexbox centering
<div className="flex items-center justify-center">
```

## File Naming Conventions

- Components: PascalCase (`Button.tsx`, `Header.tsx`)
- Utilities: camelCase (`utils.ts`, `helpers.ts`)
- Pages/Routes: lowercase (`page.tsx`, `layout.tsx`)
- Directories: kebab-case (`api-routes/`) or lowercase (`components/`)

## State Management

For simple needs:
- `useState` for local component state
- `useContext` for shared state
- Server Components for data fetching

For complex needs (add when necessary):
- Zustand for client state
- React Query for server state
=======
### 1. Server Components by Default
- Layout and static pages are Server Components
- Interactive pages use `"use client"`

### 2. RESTful API Routes
CRUD for both posts and social accounts.

### 3. Platform Type System
- `PLATFORM_CONFIG` maps platform to display info
- `OAUTH_CONFIG` maps platform to OAuth settings
- Platforms stored as JSON string in DB

### 4. Preview Components with Image Support
- Accept both `content` and `imageUrl` props
- Faithful UI representation per platform

### 5. Image Handling
- Base64 data URLs for demo
- Drag-and-drop with FileReader API

### 6. OAuth Architecture (Demo Mode)
- `socialAccounts` table with accessToken/refreshToken fields
- Demo mode with manual account input
- Ready for real OAuth flows
>>>>>>> 71772c2f1f458ae834f7acdc35b3c10d96c6e547
