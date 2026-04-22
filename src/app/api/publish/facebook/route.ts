import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { publishToFacebookPage } from "@/lib/facebook";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Find connected Facebook pages
    const pages = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.platform, "facebook"),
          eq(socialAccounts.connected, true)
        )
      );

    // Prefer pages over personal accounts
    const pageAccount = pages.find((p: { accountName: string }) => p.accountName.includes("(Pagina)")) || pages[0];

    if (!pageAccount || !pageAccount.accessToken) {
      return NextResponse.json(
        { error: "Nessuna pagina Facebook collegata. Vai su Collegamenti per connettere." },
        { status: 400 }
      );
    }

    const result = await publishToFacebookPage(
      pageAccount.accessToken,
      pageAccount.accountId,
      message
    );

    return NextResponse.json({
      success: true,
      postId: result.post_id,
      account: pageAccount.accountName,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Publish failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
