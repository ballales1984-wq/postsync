import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
    return NextResponse.json(allPosts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, platforms, status = "draft", imageUrl, scheduledAt } = body;

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: "Content and at least one platform are required" },
        { status: 400 }
      );
    }

    const values = {
      content,
      platforms: JSON.stringify(platforms),
      status,
      ...(imageUrl ? { imageUrl } : {}),
      ...(scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
    } as typeof posts.$inferInsert;

    const newPost = await db.insert(posts).values(values).returning();

    return NextResponse.json(newPost[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
