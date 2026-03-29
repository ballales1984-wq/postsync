import * as cheerio from "cheerio";

export interface ExtractedContent {
  title: string;
  description: string;
  content: string;
  type: "youtube" | "github" | "website";
  url: string;
}

export async function extractFromUrl(url: string): Promise<ExtractedContent> {
  const normalizedUrl = url.trim().toLowerCase();

  if (normalizedUrl.includes("youtube.com") || normalizedUrl.includes("youtu.be")) {
    return extractFromYouTube(url);
  }

  if (normalizedUrl.includes("github.com")) {
    return extractFromGitHub(url);
  }

  return extractFromWebsite(url);
}

async function extractFromYouTube(url: string): Promise<ExtractedContent> {
  // Extract video ID
  let videoId = "";
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  const embedMatch = url.match(/embed\/([^?&]+)/);

  if (watchMatch) videoId = watchMatch[1];
  else if (shortMatch) videoId = shortMatch[1];
  else if (embedMatch) videoId = embedMatch[1];

  if (!videoId) {
    throw new Error("URL YouTube non valido");
  }

  // Use oEmbed API
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  const response = await fetch(oembedUrl);
  if (!response.ok) throw new Error("Impossibile recuperare info video YouTube");
  const data = await response.json();

  // Fetch the page to get description
  const pageResponse = await fetch(url);
  const html = await pageResponse.text();
  const $ = cheerio.load(html);

  const description =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") || "";

  return {
    title: data.title || "",
    description: description,
    content: `Titolo: ${data.title}\nAutore: ${data.author_name}\nDescrizione: ${description}`,
    type: "youtube",
    url,
  };
}

async function extractFromGitHub(url: string): Promise<ExtractedContent> {
  // Parse GitHub URL
  const parts = url.replace("https://github.com/", "").split("/");
  const owner = parts[0];
  const repo = parts[1];

  if (!owner || !repo) {
    throw new Error("URL GitHub non valido");
  }

  // Fetch repo info
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const response = await fetch(apiUrl, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });

  if (!response.ok) throw new Error("Impossibile recuperare info repository GitHub");
  const data = await response.json();

  // Try to fetch README
  let readme = "";
  try {
    const readmeResponse = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`
    );
    if (readmeResponse.ok) {
      readme = await readmeResponse.text();
      // Truncate if too long
      if (readme.length > 3000) readme = readme.substring(0, 3000) + "...";
    }
  } catch {
    // README not found, continue without it
  }

  const content = [
    `Repository: ${data.full_name}`,
    `Descrizione: ${data.description || "N/A"}`,
    `Linguaggio: ${data.language || "N/A"}`,
    `Stars: ${data.stargazers_count}`,
    `Topics: ${(data.topics || []).join(", ")}`,
    readme ? `\nREADME:\n${readme}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    title: data.full_name,
    description: data.description || "",
    content,
    type: "github",
    url,
  };
}

async function extractFromWebsite(url: string): Promise<ExtractedContent> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; PostSync/1.0)",
    },
  });

  if (!response.ok) throw new Error(`Impossibile accedere al sito: ${response.status}`);
  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove scripts, styles, nav, footer
  $("script, style, nav, footer, header, aside, .ad, .advertisement").remove();

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text() ||
    $("h1").first().text() ||
    "";

  const description =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    "";

  // Extract main content
  const article = $("article, main, .content, .post, .entry").first();
  let content = "";

  if (article.length) {
    content = article.text();
  } else {
    content = $("body").text();
  }

  // Clean up whitespace
  content = content.replace(/\s+/g, " ").trim();
  if (content.length > 5000) content = content.substring(0, 5000) + "...";

  return {
    title: title.trim(),
    description: description.trim(),
    content: content.substring(0, 3000),
    type: "website",
    url,
  };
}
