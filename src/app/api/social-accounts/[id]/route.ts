import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await db
      .delete(socialAccounts)
      .where(eq(socialAccounts.id, parseInt(id)))
      .returning();
    if (deleted.length === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Account disconnected" });
  } catch {
    return NextResponse.json({ error: "Failed to disconnect account" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await db
      .update(socialAccounts)
      .set({ ...body })
      .where(eq(socialAccounts.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    return NextResponse.json(updated[0]);
  } catch {
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
  }
}
