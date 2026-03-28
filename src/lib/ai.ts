export type Platform = "twitter" | "instagram" | "linkedin" | "facebook";

export interface GenerateOptions {
  topic: string;
  platform: Platform;
  template?: string;
  language?: string;
}

export interface WeekPlan {
  day: string;
  theme: string;
  posts: Record<Platform, string>;
}

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export const TEMPLATES = [
  {
    id: "viral",
    name: "🔥 Virale",
    description: "Post ad alto engagement, crea curiosità e condivisioni",
    instruction: "Crea un post VIRALE. Usa un hook potente nelle prime 2 righe. Crea curiosità. Usa emoji strategici. Includi una call-to-action chiara per generare commenti e condivisioni.",
  },
  {
    id: "professional",
    name: "💼 Professionale",
    description: "Tono business, perfetto per LinkedIn e contenuti aziendali",
    instruction: "Scrivi in tono PROFESSIONALE ma personale. Usa paragrafi brevi. Includi insight o dati. Chiudi con una domanda per stimolare la discussione nel settore.",
  },
  {
    id: "storytelling",
    name: "📖 Storytelling",
    description: "Racconta una storia che emoziona e coinvolge",
    instruction: "Racconta una STORIA personale o di brand legata al tema. Usa la struttura: situazione iniziale → sfida → trasformazione → lezione. Emoziona il lettore.",
  },
  {
    id: "tips",
    name: "💡 Tips & Consigli",
    description: "Lista di consigli pratici e azionabili",
    instruction: "Crea una lista di 3-5 CONSIGLI PRATICI e azionabili. Ogni punto deve dare valore immediato. Usa numeri o bullet points. Il post deve essere salvabile e condivisibile.",
  },
  {
    id: "announcement",
    name: "📢 Annuncio",
    description: "Annuncia novità, lanci, aggiornamenti",
    instruction: "Crea un ANNUNCIO coinvolgente. Genera hype. Usa parole d'azione. Sii chiaro su cosa cambia e perché dovrebbe interessare al lettore.",
  },
  {
    id: "question",
    name: "❓ Domanda",
    description: "Post che genera discussioni nei commenti",
    instruction: "Formula una DOMANDA provocatoria o interessante legata al tema. Dai il tuo punto di vista. Invita esplicitamente i lettori a commentare con la loro opinione.",
  },
];

const PLATFORM_INSTRUCTIONS: Record<Platform, string> = {
  twitter:
    "Max 280 caratteri. Usa 1-3 hashtag pertinenti. Emoji dove appropriato. Testo immediato e d'impatto. NON usare markdown.",
  instagram:
    "Caption coinvolgente. Includi call-to-action. Usa emoji. Metti 5-10 hashtag pertinenti alla fine dopo due linee vuote. NON usare markdown.",
  linkedin:
    "Paragrafi brevi con line breaks. Tono professionale ma personale. Includi insight. Chiudi con una domanda. NON usare markdown.",
  facebook:
    "Tono conversazionale. Max 1000 caratteri. Includi domanda o call-to-action per interazione. NON usare markdown.",
};

const PLATFORM_CONFIG: Record<Platform, { name: string; maxChars: number; icon: string }> = {
  twitter: { name: "X (Twitter)", maxChars: 280, icon: "𝕏" },
  instagram: { name: "Instagram", maxChars: 2200, icon: "📷" },
  linkedin: { name: "LinkedIn", maxChars: 3000, icon: "💼" },
  facebook: { name: "Facebook", maxChars: 63206, icon: "👤" },
};

export { PLATFORM_CONFIG };

async function callAI(systemPrompt: string, userPrompt: string, customApiKey?: string): Promise<string> {
  const apiKey = customApiKey || GROQ_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 800,
          temperature: 0.8,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content.trim();
      }
    } catch {
      // Groq failed, try Ollama
    }
  }

  // Fallback to Ollama (local)
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        system: systemPrompt,
        prompt: userPrompt,
        stream: false,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.response.trim();
    }
  } catch {
    // Ollama failed
  }

  throw new Error(
    "Nessun AI disponibile. Configura GROQ_API_KEY (gratis su groq.com) oppure avvia Ollama localmente."
  );
}

export async function generatePost(options: GenerateOptions & { apiKey?: string }): Promise<string> {
  const { topic, platform, template, language = "italiano", apiKey } = options;

  const templateObj = TEMPLATES.find((t) => t.id === template);
  const templateInstruction = templateObj?.instruction || "";

  const systemPrompt = `Sei un esperto di social media marketing e copywriting. Scrivi post pronti per essere pubblicati.

Regole:
- Scrivi SOLO il contenuto del post, senza prefissi o spiegazioni
- Scrivi in ${language}
- ${PLATFORM_INSTRUCTIONS[platform]}
- ${templateInstruction}
- Il post deve essere pronto per essere copiato e incollato così com'è`;

  return callAI(systemPrompt, `Tema: ${topic}`, apiKey);
}

export async function generateAllPlatforms(
  topic: string,
  template?: string,
  apiKey?: string
): Promise<Record<Platform, string>> {
  const platforms: Platform[] = ["twitter", "instagram", "linkedin", "facebook"];
  const results: Partial<Record<Platform, string>> = {};

  await Promise.all(
    platforms.map(async (platform) => {
      results[platform] = await generatePost({ topic, platform, template, apiKey });
    })
  );

  return results as Record<Platform, string>;
}

export async function generateWeekContent(
  theme: string,
  template?: string,
  apiKey?: string
): Promise<WeekPlan[]> {
  const days = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
  const dayThemes = [
    "Post motivazionale per iniziare la settimana",
    "Tips e consigli pratici",
    "Storytelling o esperienza personale",
    "Contenuto educativo o informativo",
    "Post virale o provocatorio",
    "Dietro le quinte o personale",
    "Riflessione o domanda per la community",
  ];

  const weekPlan: WeekPlan[] = [];

  for (let i = 0; i < 7; i++) {
    const dayTheme = `${theme} - ${dayThemes[i]} (${days[i]})`;
    const posts = await generateAllPlatforms(dayTheme, template, apiKey);
    weekPlan.push({
      day: days[i],
      theme: dayThemes[i],
      posts,
    });
  }

  return weekPlan;
}

export async function generateFromContent(
  extractedContent: { title: string; description: string; content: string; type: string; url: string },
  template?: string
): Promise<Record<Platform, string>> {
  const templateObj = TEMPLATES.find((t) => t.id === template);
  const templateInstruction = templateObj?.instruction || "";

  const systemPrompt = `Sei un esperto di social media marketing. Ti viene dato un contenuto e devi generare post social ORIGINALI basati sul tema.

Regole:
- NON copiare il testo originale, crea contenuto ORIGINALE
- Scrivi in italiano
- ${templateInstruction}
- NON usare markdown`;

  const contentBlock = `
Fonte: ${extractedContent.type}
Titolo: ${extractedContent.title}
Descrizione: ${extractedContent.description}
Contenuto:
${extractedContent.content}
`.trim();

  const platforms: Platform[] = ["twitter", "instagram", "linkedin", "facebook"];
  const results: Partial<Record<Platform, string>> = {};

  await Promise.all(
    platforms.map(async (platform) => {
      const platformRule = PLATFORM_INSTRUCTIONS[platform];
      const prompt = `${contentBlock}

Genera UN post per ${PLATFORM_CONFIG[platform].name}:
${platformRule}

Deve essere ORIGINALE, non copia. Trasforma il contenuto in un messaggio coinvolgente.`;

      try {
        results[platform] = await callAI(systemPrompt, prompt);
      } catch {
        results[platform] = `Errore: AI non disponibile`;
      }
    })
  );

  return results as Record<Platform, string>;
}
