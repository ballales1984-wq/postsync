import { NextResponse } from "next/server";
import { getTwitterAuthUrl } from "@/lib/twitter";

export async function GET() {
  try {
    const url = getTwitterAuthUrl();
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: "Twitter OAuth non configurato" },
      { status: 500 }
    );
  }
}
