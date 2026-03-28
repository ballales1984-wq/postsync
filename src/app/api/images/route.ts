import { NextRequest, NextResponse } from "next/server";
import { generateImage, generateImages, generateCarousel } from "@/lib/images";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, type, count } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (type === "carousel") {
      const slides = await generateCarousel(prompt, count || 5);
      return NextResponse.json({ slides });
    }

    if (type === "multiple") {
      const images = await generateImages(prompt, count || 3);
      return NextResponse.json({ images });
    }

    // Single image
    const image = await generateImage(prompt);
    return NextResponse.json({ image });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
