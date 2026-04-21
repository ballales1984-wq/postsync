import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { publishLinkedInPost } from "@/lib/linkedin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const accounts = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.platform, "linkedin"),
          eq(socialAccounts.connected, true)
        )
      );

    if (accounts.length === 0 || !accounts[0].accessToken) {
      return NextResponse.json(
        { error: "Nessun account LinkedIn collegato. Vai su Collegamenti per connettere." },
        { status: 400 }
      );
    }

    const account = accounts[0];
    const personUrn = `urn:li:person:${account.accountId}`;

    const result = await publishLinkedInPost(account.accessToken!, personUrn, text);

    return NextResponse.json({
      success: true,
      postId: result.id,
      account: account.accountName,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Publish failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
