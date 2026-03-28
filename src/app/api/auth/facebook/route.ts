import { NextResponse } from "next/server";
import { getFacebookAuthUrl } from "@/lib/facebook";

export async function GET() {
  try {
    const url = getFacebookAuthUrl();
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: "Facebook OAuth non configurato" },
      { status: 500 }
    );
  }
}
