# Product Context: PostSync

## Why This Exists

Managing multiple social media accounts requires composing the same content multiple times, each in a different format. PostSync solves this by letting users write once and preview the content in each platform's format before publishing.

## Problems It Solves

1. **Duplicate Work**: Write once, publish everywhere
2. **Format Confusion**: Real-time previews show exactly how each platform will display the post
3. **Character Limits**: Visual feedback on platform-specific character limits
4. **Content Management**: Single dashboard to track all posts and their status

## User Flow

1. User lands on the home page with feature overview
2. Clicks "Componi un Post" to open the editor
3. Writes post content in the text area
4. Selects target social platforms (toggle buttons)
5. Sees real-time previews for each selected platform
6. Saves as draft or publishes immediately
7. Views and manages all posts from the Dashboard

## Key UX Goals

- **Immediate Feedback**: Previews update as you type
- **Platform Awareness**: Clear visual indication of which platforms are selected
- **Simple Workflow**: Minimal clicks to compose and publish
- **Draft Support**: Save work in progress without publishing

## What This Provides

1. **Compose Page**: Editor with platform selection and live previews
2. **Dashboard**: Filterable list of all posts with status management
3. **API**: REST endpoints for full post CRUD
4. **Database**: Persistent storage with Drizzle ORM + SQLite
