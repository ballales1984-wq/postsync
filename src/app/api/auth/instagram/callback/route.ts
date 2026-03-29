import { NextRequest, NextResponse } from "next/server";
import { exchangeInstagramCode, getInstagramAccounts } from "@/lib/instagram";
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
    const tokens = await exchangeInstagramCode(code);
    const igAccounts = await getInstagramAccounts(tokens.access_token);

    if (igAccounts.length === 0) {
      return NextResponse.redirect(
        new URL("/connections?error=no_instagram_account", request.url)
      );
    }

    for (const ig of igAccounts) {
      const existing = await db
        .select()
        .from(socialAccounts)
        .where(
          and(
            eq(socialAccounts.platform, "instagram"),
            eq(socialAccounts.accountId, ig.id)
          )
        );

      if (existing.length > 0) {
        await db
          .update(socialAccounts)
          .set({
            accountName: `@${ig.username}`,
            accessToken: tokens.access_token,
            tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
            connected: true,
          })
          .where(eq(socialAccounts.id, existing[0].id));
      } else {
        await db.insert(socialAccounts).values({
          platform: "instagram",
          accountId: ig.id,
          accountName: `@${ig.username}`,
          accessToken: tokens.access_token,
          tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
          connected: true,
        });
      }
    }

    return NextResponse.redirect(
      new URL("/connections?success=instagram", request.url)
    );
  } catch (err) {
    console.error("Instagram OAuth error:", err);
    return NextResponse.redirect(
      new URL("/connections?error=oauth_failed", request.url)
    );
  }
}
