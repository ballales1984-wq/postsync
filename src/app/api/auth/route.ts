import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const APP_PASSWORD = process.env.APP_PASSWORD || "postsync2026";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password !== APP_PASSWORD) {
      return NextResponse.json({ error: "Password non valida" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("postsync_auth", "authenticated", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Errore" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("postsync_auth");
  return NextResponse.json({ success: true });
}
