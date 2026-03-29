import { NextResponse } from "next/server";
import { getLinkedInAuthUrl } from "@/lib/linkedin";

export async function GET() {
  try {
    const url = getLinkedInAuthUrl();
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: "LinkedIn OAuth non configurato" },
      { status: 500 }
    );
  }
}
