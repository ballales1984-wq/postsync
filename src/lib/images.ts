// Generate placeholder images as SVG data URLs (no external dependencies)

function generateSvgImage(seed: string, index: number): string {
  const colors = [
    ["#667eea", "#764ba2"],
    ["#f093fb", "#f5576c"],
    ["#4facfe", "#00f2fe"],
    ["#43e97b", "#38f9d7"],
    ["#fa709a", "#fee140"],
    ["#a18cd1", "#fbc2eb"],
    ["#ffecd2", "#fcb69f"],
    ["#89f7fe", "#66a6ff"],
  ];
  const [c1, c2] = colors[(seed.length + index) % colors.length];

  const icons = ["🚀", "✨", "💡", "📱", "🎯", "🔥", "⭐", "💪"];
  const icon = icons[(seed.length + index * 3) % icons.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${c1}"/>
        <stop offset="100%" style="stop-color:${c2}"/>
      </linearGradient>
    </defs>
    <rect width="512" height="512" fill="url(#g)"/>
    <text x="256" y="220" text-anchor="middle" font-size="120">${icon}</text>
    <text x="256" y="340" text-anchor="middle" font-size="24" fill="white" font-family="system-ui" opacity="0.9">${seed.substring(0, 30)}</text>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export async function generateImage(prompt: string): Promise<string> {
  return generateSvgImage(prompt, 0);
}

export async function generateImages(
  prompt: string,
  count: number = 3
): Promise<string[]> {
  const images: string[] = [];
  for (let i = 0; i < count; i++) {
    images.push(generateSvgImage(prompt, i));
  }
  return images;
}

export async function generateCarousel(
  topic: string,
  slideCount: number = 5
): Promise<{ title: string; content: string; imagePrompt: string }[]> {
  const slideTopics = [
    { title: "Introduzione", content: `Scopri ${topic}`, imagePrompt: `intro-${topic}` },
    { title: "Problema", content: `La sfida di ${topic}`, imagePrompt: `problem-${topic}` },
    { title: "Soluzione", content: `Come risolvere ${topic}`, imagePrompt: `solution-${topic}` },
    { title: "Benefici", content: `I vantaggi di ${topic}`, imagePrompt: `benefits-${topic}` },
    { title: "Call to Action", content: `Inizia con ${topic} oggi!`, imagePrompt: `cta-${topic}` },
    { title: "Tip", content: `Consiglio su ${topic}`, imagePrompt: `tip-${topic}` },
    { title: "Statistica", content: `Dati su ${topic}`, imagePrompt: `stats-${topic}` },
    { title: "Citazione", content: `Frase su ${topic}`, imagePrompt: `quote-${topic}` },
  ];
  return slideTopics.slice(0, Math.min(slideCount, slideTopics.length));
}
