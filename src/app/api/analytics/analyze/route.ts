import { NextRequest, NextResponse } from "next/server";

interface AnalyticsData {
  views: number;
  visitors: number;
  bounce_rate: string;
  sources: Record<string, number>;
  pages: Record<string, number>;
  daily_data: Array<{ date: string; views: number; visitors: number }>;
  period: number;
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d";

    const summaryRes = await fetch(
      `${request.nextUrl.origin}/api/analytics/summary?period=${period}`
    );
    const data: AnalyticsData = await summaryRes.json();

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured" },
        { status: 500 }
      );
    }

    const sourcesText = Object.entries(data.sources || {})
      .map(([s, c]) => `${s}: ${c}`);
      .join(", ");

    const pagesText = Object.entries(data.pages || {})
      .map(([p, v]) => `${p}: ${v} views`)
      .join(", ");

    const dailyText = (data.daily_data || [])
      .map((d) => `${d.date}: ${d.views} views, ${d.visitors} visitors`)
      .join(", ");

    const prompt = `Sei un data analyst esperto di web analytics e social media marketing.

Analizza questi dati di traffico del sito web per il periodo ${period}:

📊 VISITE TOTALI: ${data.views || 0}
👥 VISITATORI UNICI: ${data.visitors || 0}
📈 PAGINE PIÙ VISITATE:
${pagesText || "Nessun dato disponibile"}

🌐 SORGENTI DI TRAFFICO:
${sourcesText || "Nessun dato disponibile"}

📅 ANDAMENTO GIORNALIERO:
${dailyText || "Nessun dato disponibile"}

Genera un report di analisi in italiano che include:
1. 📈 TENDENZE: Cosa indicano questi dati?
2. 💡 INSIGHT: Almeno 3 osservazioni actionable
3. 🎯 AZIONI: Suggerimenti concreti per migliorare le performance
4. 📱 SOCIAL: Come applicare questi insight ai contenuti social?

Scrivi in modo chiaro e professionale. Usa emoji. Massimo 400 parole.`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "Sei un data analyst esperto di analytics web e social media marketing. Scrivi report chiari e azionabili in italiano.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 600,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API error:", err);
      return NextResponse.json(
        { error: "Failed to generate analysis" },
        { status: 500 }
      );
    }

    const result = await response.json();
    const analysis = result.choices[0].message.content;

    return NextResponse.json({ analysis, data });
  } catch (error) {
    console.error("Analytics analyze error:", error);
    return NextResponse.json(
      { error: "Failed to analyze analytics" },
      { status: 500 }
    );
  }
}