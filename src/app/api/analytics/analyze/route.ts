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

    const demoData = {
      views: 1247,
      visitors: 892,
      sources: { "direct": 445, "google": 380, "twitter": 245, "linkedin": 120, "facebook": 57 },
      pages: { "/": 520, "/compose": 380, "/dashboard": 210, "/analytics": 137 },
      daily_data: [
        { date: "2026-04-15", views: 145, visitors: 98 },
        { date: "2026-04-16", views: 189, visitors: 134 },
        { date: "2026-04-17", views: 167, visitors: 112 },
        { date: "2026-04-18", views: 234, visitors: 178 },
        { date: "2026-04-19", views: 198, visitors: 145 },
        { date: "2026-04-20", views: 176, visitors: 124 },
        { date: "2026-04-21", views: 138, visitors: 101 },
      ],
    };

    if (!apiKey) {
      // Return demo analysis when no API key
      const demoAnalysis = `📈 TENDENZE DEL PERIODO

Il traffico mostra un trend positivo con ${demoData.views} visualizzazioni totali e ${demoData.visitors} visitatori unici. I weekend registrano meno attività rispetto ai giorni lavorativi.

💡 INSIGHT

1. Il canale DIRECT è il principale referrer (35.7%) - gli utenti arrivano direttamente al sito, probabilmente tramite bookmark o digitazione diretta dell'URL
2. Google rappresenta il 30.5% del traffico - la SEO sta funzionando! Mantieni i contenuti ottimizzati
3. Twitter/X contribute il 19.6% - i tuoi post social stanno guidando traffico qualificato

🎯 AZIONI CONSIGLIATE

• Rafforza la presenza su Twitter - è il canale social più performante
• Ottimizza la pagina /compose che ha 380 visualizzazioni
• Considera campagne su LinkedIn (9.6%) per B2B
• Aggiungi più riferimenti diretti al sito nelle bio dei profili social

📱 APPLICAZIONE SOCIAL

Per i prossimi post, usa questi dati:
- Focus su Twitter (miglior ROI)
- Post suLinkedIn per reach professionale
- Drive utenti alla landing /compose`;

      return NextResponse.json({ analysis: demoAnalysis, data: demoData });
    }

    const sourcesText = Object.entries(data.sources || {})
      .map(([s, c]) => `${s}: ${c}`)
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