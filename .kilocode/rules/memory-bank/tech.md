# Technical Context: PostSync

## Technology Stack

| Technology   | Version | Purpose                         |
| ------------ | ------- | ------------------------------- |
| Next.js      | 16.x    | React framework with App Router |
| React        | 19.x    | UI library                      |
| TypeScript   | 5.9.x   | Type-safe JavaScript            |
| Tailwind CSS | 4.x     | Utility-first CSS               |
| Bun          | Latest  | Package manager & runtime       |
| Drizzle ORM  | 0.45.x  | Database ORM                    |
| SQLite       | -       | Database (via app-builder-db)   |

## Database

### Tables

**posts**
```typescript
id: integer (auto-increment PK)
content: text (required)
platforms: text (JSON array, required)
status: text (draft | scheduled | published, default: draft)
imageUrl: text (nullable)
scheduledAt: timestamp (nullable)
createdAt / updatedAt: timestamp
```

**social_accounts**
```typescript
id: integer (auto-increment PK)
platform: text (required)
accountId / accountName: text (required)
accessToken / refreshToken: text (nullable)
tokenExpiresAt: timestamp (nullable)
connected: boolean (default: false)
createdAt: timestamp
```

## API Endpoints

### Posts
| Method | Route           | Purpose          |
|--------|-----------------|------------------|
| GET    | /api/posts      | List all posts   |
| POST   | /api/posts      | Create new post  |
| GET    | /api/posts/:id  | Get single post  |
| PUT    | /api/posts/:id  | Update post      |
| DELETE | /api/posts/:id  | Delete post      |

### Social Accounts
| Method | Route                    | Purpose               |
|--------|--------------------------|-----------------------|
| GET    | /api/social-accounts     | List all accounts     |
| POST   | /api/social-accounts     | Connect new account   |
| PUT    | /api/social-accounts/:id | Update account        |
| DELETE | /api/social-accounts/:id | Disconnect account    |

## Development Commands

```bash
bun install / bun dev / bun build / bun lint / bun typecheck
bun db:generate / bun db:migrate
```
