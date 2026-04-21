import { NextRequest, NextResponse } from "next/server";
import { generatePost, generateAllPlatforms, generateWeekContent, generateVariants } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, platform, template, language, allPlatforms, week, variants, apiKey } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Use custom key if provided, otherwise use env var
    const key = apiKey || process.env.GROQ_API_KEY;

    if (!key) {
      return NextResponse.json(
        { error: "Nessuna API key configurata. Aggiungi GROQ_API_KEY nelle variabili d'ambiente o inserisci la tua key nelle Impostazioni." },
        { status: 500 }
      );
    }

    // Generate multiple variants
    if (variants && platform) {
      const result = await generateVariants(topic, platform, variants, key);
      return NextResponse.json({ variants: result });
    }

    // Generate week content
    if (week) {
      const weekPlan = await generateWeekContent(topic, template, key);
      return NextResponse.json({ weekPlan });
    }

    // Generate for all platforms
    if (allPlatforms) {
      const posts = await generateAllPlatforms(topic, template, key);
      return NextResponse.json({ posts });
    }

    // Generate for single platform
    if (!platform) {
      return NextResponse.json({ error: "Platform is required" }, { status: 400 });
    }

    const content = await generatePost({ topic, platform, template, language, apiKey: key });
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Generate error:", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
