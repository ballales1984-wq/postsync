import { NextRequest, NextResponse } from "next/server";
import { extractFromUrl } from "@/lib/extractor";
import { generateFromContent } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, template, extractOnly } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const extracted = await extractFromUrl(url);

    if (extractOnly) {
      return NextResponse.json({ extracted });
    }

    const posts = await generateFromContent(extracted, template);
    return NextResponse.json({ extracted, posts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Extraction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
