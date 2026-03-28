import { NextRequest, NextResponse } from "next/server";
import { generatePost, generateAllPlatforms, generateWeekContent } from "@/lib/ai";

// Simple in-memory rate limiting (resets on server restart)
const usageMap: Record<string, { count: number; date: string }> = {};
const DAILY_LIMIT = 10;

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(ip: string, hasCustomKey: boolean): { allowed: boolean; remaining: number } {
  if (hasCustomKey) return { allowed: true, remaining: Infinity };

  const today = new Date().toISOString().split("T")[0];
  const key = `${ip}-${today}`;

  if (!usageMap[key]) {
    usageMap[key] = { count: 0, date: today };
  }

  // Reset if different day
  if (usageMap[key].date !== today) {
    usageMap[key] = { count: 0, date: today };
  }

  const remaining = DAILY_LIMIT - usageMap[key].count;
  return { allowed: remaining > 0, remaining };
}

function incrementUsage(ip: string) {
  const today = new Date().toISOString().split("T")[0];
  const key = `${ip}-${today}`;
  if (usageMap[key]) {
    usageMap[key].count++;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, platform, template, language, allPlatforms, week, apiKey } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const hasCustomKey = !!apiKey;
    const clientIp = getClientIp(request);
    const { allowed, remaining } = checkRateLimit(clientIp, hasCustomKey);

    if (!allowed) {
      return NextResponse.json(
        {
          error: "Limite giornaliero raggiunto (10 generazioni). Aggiungi la tua API key gratuita in Impostazioni.",
          remaining: 0,
        },
        { status: 429 }
      );
    }

    const options = { topic, platform, template, language, apiKey };

    // Generate week content
    if (week) {
      const weekPlan = await generateWeekContent(topic, template, apiKey);
      if (!hasCustomKey) incrementUsage(clientIp);
      return NextResponse.json({ weekPlan, remaining: hasCustomKey ? Infinity : remaining - 4 });
    }

    // Generate for all platforms
    if (allPlatforms) {
      const posts = await generateAllPlatforms(topic, template, apiKey);
      if (!hasCustomKey) incrementUsage(clientIp);
      return NextResponse.json({ posts, remaining: hasCustomKey ? Infinity : remaining - 1 });
    }

    // Generate for single platform
    if (!platform) {
      return NextResponse.json({ error: "Platform is required" }, { status: 400 });
    }

    const content = await generatePost(options);
    if (!hasCustomKey) incrementUsage(clientIp);
    return NextResponse.json({ content, remaining: hasCustomKey ? Infinity : remaining - 1 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
