import { NextResponse } from "next/server";
import { getInstagramAuthUrl } from "@/lib/instagram";

export async function GET() {
  try {
    const url = getInstagramAuthUrl();
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: "Instagram OAuth non configurato" },
      { status: 500 }
    );
  }
}
