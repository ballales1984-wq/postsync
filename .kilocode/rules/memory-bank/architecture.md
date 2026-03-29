# System Patterns: PostSync

## Architecture Overview

```
src/
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
```

## Key Design Patterns

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
