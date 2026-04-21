import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { publishInstagramPost } from "@/lib/instagram";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { caption, imageUrl } = body;

    if (!caption) {
      return NextResponse.json({ error: "Caption is required" }, { status: 400 });
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Instagram richiede un'immagine. Aggiungi un'immagine per pubblicare." },
        { status: 400 }
      );
    }

    const accounts = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.platform, "instagram"),
          eq(socialAccounts.connected, true)
        )
      );

    if (accounts.length === 0 || !accounts[0].accessToken) {
      return NextResponse.json(
        { error: "Nessun account Instagram collegato. Vai su Collegamenti per connettere." },
        { status: 400 }
      );
    }

    const account = accounts[0];
    const result = await publishInstagramPost(
      account.accessToken!,
      account.accountId,
      imageUrl,
      caption
    );

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
