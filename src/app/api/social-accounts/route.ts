import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const accounts = await db.select().from(socialAccounts).orderBy(desc(socialAccounts.createdAt));
    return NextResponse.json(accounts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, accountId, accountName } = body;

    if (!platform || !accountId || !accountName) {
      return NextResponse.json(
        { error: "Platform, accountId, and accountName are required" },
        { status: 400 }
      );
    }

    const newAccount = await db
      .insert(socialAccounts)
      .values({
        platform,
        accountId,
        accountName,
        connected: true,
      })
      .returning();

    return NextResponse.json(newAccount[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to connect account" }, { status: 500 });
  }
}
