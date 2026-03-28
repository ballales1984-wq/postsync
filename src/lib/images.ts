// Free image generation using Pollinations.ai (no API key needed)

export async function generateImage(prompt: string): Promise<string> {
  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Date.now()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Image generation failed");
  }

  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}

export async function generateImages(
  prompt: string,
  count: number = 3
): Promise<string[]> {
  const images: string[] = [];

  for (let i = 0; i < count; i++) {
    try {
      const variationPrompt = `${prompt}, variation ${i + 1}, unique perspective`;
      const image = await generateImage(variationPrompt);
      images.push(image);
    } catch {
      // Skip failed generations
    }
  }

  return images;
}

export async function generateCarousel(
  topic: string,
  slideCount: number = 5
): Promise<{ title: string; content: string; imagePrompt: string }[]> {
  const slides: { title: string; content: string; imagePrompt: string }[] = [];

  const slideTopics = [
    { title: "Introduzione", content: `Scopri ${topic}`, imagePrompt: `modern infographic about ${topic}, clean design` },
    { title: "Problema", content: `La sfida di ${topic}`, imagePrompt: `problem illustration for ${topic}, minimal` },
    { title: "Soluzione", content: `Come risolvere ${topic}`, imagePrompt: `solution concept for ${topic}, bright colors` },
    { title: "Benefici", content: `I vantaggi di ${topic}`, imagePrompt: `benefits chart for ${topic}, professional` },
    { title: "Call to Action", content: `Inizia con ${topic} oggi!`, imagePrompt: `call to action design for ${topic}, bold` },
    { title: "Extra 1", content: `Tip su ${topic}`, imagePrompt: `tip design for ${topic}, creative` },
    { title: "Extra 2", content: `Statistica su ${topic}`, imagePrompt: `statistic infographic for ${topic}, data viz` },
    { title: "Extra 3", content: `Citazione su ${topic}`, imagePrompt: `quote design for ${topic}, elegant` },
  ];

  for (let i = 0; i < Math.min(slideCount, slideTopics.length); i++) {
    slides.push(slideTopics[i]);
  }

  return slides;
}
