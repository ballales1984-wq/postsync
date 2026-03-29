import { NextRequest, NextResponse } from "next/server";
import { exchangeFacebookCode, getFacebookUser, getFacebookPages } from "@/lib/facebook";
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
    const tokens = await exchangeFacebookCode(code);
    const user = await getFacebookUser(tokens.access_token);

    // Save the main user account
    const existing = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.platform, "facebook"),
          eq(socialAccounts.accountId, user.id)
        )
      );

    if (existing.length > 0) {
      await db
        .update(socialAccounts)
        .set({
          accountName: user.name,
          accessToken: tokens.access_token,
          tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
          connected: true,
        })
        .where(eq(socialAccounts.id, existing[0].id));
    } else {
      await db.insert(socialAccounts).values({
        platform: "facebook",
        accountId: user.id,
        accountName: user.name,
        accessToken: tokens.access_token,
        tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        connected: true,
      });
    }

    // Also save available pages for publishing
    try {
      const pages = await getFacebookPages(tokens.access_token);
      for (const page of pages) {
        const existingPage = await db
          .select()
          .from(socialAccounts)
          .where(
            and(
              eq(socialAccounts.platform, "facebook"),
              eq(socialAccounts.accountId, page.id)
            )
          );

        if (existingPage.length > 0) {
          await db
            .update(socialAccounts)
            .set({
              accountName: page.name,
              accessToken: page.access_token,
              connected: true,
            })
            .where(eq(socialAccounts.id, existingPage[0].id));
        } else {
          await db.insert(socialAccounts).values({
            platform: "facebook",
            accountId: page.id,
            accountName: `${page.name} (Pagina)`,
            accessToken: page.access_token,
            connected: true,
          });
        }
      }
    } catch {
      // Pages fetch is optional, main account is already saved
    }

    return NextResponse.redirect(
      new URL("/connections?success=facebook", request.url)
    );
  } catch (err) {
    console.error("Facebook OAuth error:", err);
    return NextResponse.redirect(
      new URL("/connections?error=oauth_failed", request.url)
    );
  }
}
