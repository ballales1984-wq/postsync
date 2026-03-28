import { NextRequest, NextResponse } from "next/server";
import { exchangeTwitterCode, getTwitterUser } from "@/lib/twitter";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/connections?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/connections?error=missing_code", request.url)
    );
  }

  try {
    const tokens = await exchangeTwitterCode(code);
    const user = await getTwitterUser(tokens.access_token);

    const existing = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.platform, "twitter"),
          eq(socialAccounts.accountId, user.id)
        )
      );

    if (existing.length > 0) {
      await db
        .update(socialAccounts)
        .set({
          accountName: user.name,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
          connected: true,
        })
        .where(eq(socialAccounts.id, existing[0].id));
    } else {
      await db.insert(socialAccounts).values({
        platform: "twitter",
        accountId: user.id,
        accountName: `${user.name} (@${user.username})`,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        connected: true,
      });
    }

    return NextResponse.redirect(
      new URL("/connections?success=twitter", request.url)
    );
  } catch (err) {
    console.error("Twitter OAuth error:", err);
    return NextResponse.redirect(
      new URL("/connections?error=oauth_failed", request.url)
    );
  }
}
