# Project Brief: PostSync - Social Media Management Platform

## Purpose

PostSync is a social media management platform where users compose posts and publish them across multiple social networks from a single interface. Real-time previews, image uploads, scheduling, and OAuth connection management.

## Target Users

- Content creators managing multiple social media accounts
- Social media managers
- Small businesses streamlining social media posting

## Core Use Case

1. User composes a post with text and optional images
2. Selects target platforms
3. Sees real-time previews formatted per platform
4. Optionally schedules for future date/time
5. Saves as draft, schedules, or publishes immediately
6. Manages posts and social account connections from dashboard

## Key Requirements

### Must Have
- Post composer with text and image input
- Platform selection (X, Instagram, LinkedIn, Facebook)
- Real-time preview per platform with images
- Save as draft, schedule, or publish
- Character limit warnings per platform
- Social account connection management (OAuth infrastructure)
- Dashboard with post history and filtering

### Nice to Have
- Real OAuth integration with platform APIs
- Cron job for scheduled publishing
- Image cropping/editing
- Post analytics per platform
- Team collaboration

## Constraints

- Framework: Next.js 16 + React 19 + Tailwind CSS 4
- Database: SQLite with Drizzle ORM
- Package manager: Bun
- OAuth is in demo mode (simulated connections)
