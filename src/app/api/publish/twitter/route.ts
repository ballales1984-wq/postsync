import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { publishTweet, refreshTwitterToken } from "@/lib/twitter";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (text.length > 280) {
      return NextResponse.json(
        { error: `Tweet troppo lungo: ${text.length}/280 caratteri` },
        { status: 400 }
      );
    }

    const accounts = await db
      .select()
      .from(socialAccounts)
      .where(
        and(eq(socialAccounts.platform, "twitter"), eq(socialAccounts.connected, true))
      );

    if (accounts.length === 0) {
      return NextResponse.json(
        { error: "Nessun account Twitter collegato. Vai su Collegamenti per connettere." },
        { status: 400 }
      );
    }

    const account = accounts[0];
    let accessToken = account.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Token di accesso mancante. Riconnetti l'account Twitter." },
        { status: 400 }
      );
    }

    if (account.tokenExpiresAt && new Date(account.tokenExpiresAt) < new Date()) {
      if (!account.refreshToken) {
        return NextResponse.json(
          { error: "Token scaduto. Riconnetti l'account Twitter." },
          { status: 400 }
        );
      }

      const refreshed = await refreshTwitterToken(account.refreshToken);
      accessToken = refreshed.access_token;

      await db
        .update(socialAccounts)
        .set({
          accessToken: refreshed.access_token,
          refreshToken: refreshed.refresh_token,
          tokenExpiresAt: new Date(Date.now() + refreshed.expires_in * 1000),
        })
        .where(eq(socialAccounts.id, account.id));
    }

    const result = await publishTweet(accessToken, text);

    return NextResponse.json({
      success: true,
      tweetId: result.id,
      text: result.text,
      account: account.accountName,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Publish failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
