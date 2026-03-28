"use client";

import { useState } from "react";
import { TwitterPreview } from "@/components/previews/TwitterPreview";
import { InstagramPreview } from "@/components/previews/InstagramPreview";
import { LinkedInPreview } from "@/components/previews/LinkedInPreview";
import { FacebookPreview } from "@/components/previews/FacebookPreview";
import { useToast } from "@/components/ui/Toast";
import { SkeletonList } from "@/components/ui/Skeleton";
import { Platform, PLATFORM_CONFIG, TEMPLATES, WeekPlan } from "@/lib/ai";

type Tab = "single" | "all" | "week" | "link" | "variants" | "images";

export default function ComposePage() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>("single");
  const [topic, setTopic] = useState("");
  const [template, setTemplate] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Single platform state
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("twitter");
  const [generatedContent, setGeneratedContent] = useState("");

  // All platforms state
  const [allPosts, setAllPosts] = useState<Partial<Record<Platform, string>>>({});

  // Week plan state
  const [weekPlan, setWeekPlan] = useState<WeekPlan[]>([]);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // Variants state
  const [variants, setVariants] = useState<{ variant: number; content: string; tone: string }[]>([]);

  // Images state
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [carouselSlides, setCarouselSlides] = useState<{ title: string; content: string; imagePrompt: string }[]>([]);

  // Link extraction state
  const [inputUrl, setInputUrl] = useState("");
  const [extractedInfo, setExtractedInfo] = useState<{ title: string; type: string } | null>(null);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    // Try Clipboard API first, fallback to execCommand
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  const getApiKey = () => localStorage.getItem("groq_api_key") || undefined;

  const handleGenerateSingle = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    
    setGeneratedContent("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          platform: selectedPlatform,
          template: template || undefined,
          apiKey: getApiKey(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGeneratedContent(data.content);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Errore", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAll = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    
    setAllPosts({});

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          allPlatforms: true,
          template: template || undefined,
          apiKey: getApiKey(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAllPosts(data.posts);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Errore", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateWeek = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    
    setWeekPlan([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          week: true,
          template: template || undefined,
          apiKey: getApiKey(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setWeekPlan(data.weekPlan);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Errore", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateFromLink = async () => {
    if (!inputUrl.trim()) return;
    setIsGenerating(true);
    
    setAllPosts({});
    setExtractedInfo(null);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: inputUrl.trim(),
          template: template || undefined,
          apiKey: getApiKey(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAllPosts(data.posts);
      setExtractedInfo({ title: data.extracted.title, type: data.extracted.type });
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Errore", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVariants = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setVariants([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          platform: selectedPlatform,
          variants: 5,
          apiKey: localStorage.getItem("groq_api_key") || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVariants(data.variants);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Errore", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImages = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setGeneratedImages([]);

    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: topic.trim(), type: "multiple", count: 3 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGeneratedImages(data.images);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Errore", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCarousel = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setCarouselSlides([]);

    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: topic.trim(), type: "carousel", count: 5 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCarouselSlides(data.slides);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Errore", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const platforms: Platform[] = ["twitter", "instagram", "linkedin", "facebook"];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Genera Post con AI</h1>
      <p className="text-gray-500 mb-8">Scrivi il tema, scegli il template, genera e copia.</p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {([
          { key: "single" as Tab, label: "📱 Singolo" },
          { key: "all" as Tab, label: "🌐 Tutti" },
          { key: "link" as Tab, label: "🔗 Da Link" },
          { key: "variants" as Tab, label: "🔄 Varianti" },
          { key: "images" as Tab, label: "🖼️ Immagini" },
          { key: "week" as Tab, label: "📅 7 giorni" },
        ]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === key
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Input section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        {tab === "link" ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inserisci un link
            </label>
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=... oppure https://github.com/... oppure un sito web"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none text-gray-900 placeholder-gray-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGenerateFromLink();
              }}
            />
            <p className="mt-1 text-xs text-gray-400">
              Funziona con YouTube, GitHub e qualsiasi sito web
            </p>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Di cosa vuoi parlare?
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="es. Lancio della nuova feature dark mode, Consigli per aumentare la produttività..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none text-gray-900 placeholder-gray-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  tab === "single" ? handleGenerateSingle() : tab === "all" ? handleGenerateAll() : handleGenerateWeek();
                }
              }}
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(template === t.id ? "" : t.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  template === t.id
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                }`}
                title={t.description}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {tab === "single" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Piattaforma</label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPlatform(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedPlatform === p
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  {PLATFORM_CONFIG[p].icon} {PLATFORM_CONFIG[p].name}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={
            tab === "single"
              ? handleGenerateSingle
              : tab === "all"
              ? handleGenerateAll
              : tab === "link"
              ? handleGenerateFromLink
              : tab === "variants"
              ? handleGenerateVariants
              : tab === "images"
              ? handleGenerateImages
              : handleGenerateWeek
          }
          disabled={isGenerating || (tab === "link" ? !inputUrl.trim() : !topic.trim())}
          className="w-full px-6 py-3 bg-black text-white rounded-lg font-semibold text-base hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generazione in corso...
            </>
          ) : (
            <>
              {tab === "link" ? "🔗" : tab === "images" ? "🖼️" : "✨"}{" "}
              {tab === "single"
                ? `Genera per ${PLATFORM_CONFIG[selectedPlatform].name}`
                : tab === "all"
                ? "Genera per tutti i social"
                : tab === "link"
                ? "Estrai contenuto e genera post"
                : tab === "variants"
                ? "Genera 5 varianti diverse"
                : tab === "images"
                ? "Genera 3 immagini AI"
                : "Genera 7 giorni di contenuti"}
            </>
          )}
        </button>
      </div>

      {/* Loading skeleton */}
      {isGenerating && <SkeletonList />}

      {/* Single platform result */}
      {tab === "single" && generatedContent && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">
              {PLATFORM_CONFIG[selectedPlatform].icon} {PLATFORM_CONFIG[selectedPlatform].name}
            </h3>
            <button
              onClick={() => handleCopy(generatedContent, "single")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                copiedKey === "single"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {copiedKey === "single" ? "✓ Copiato!" : "📋 Copia"}
            </button>
            <button
              onClick={() => {
                const tags = generateHashtags(generatedContent, selectedPlatform);
                handleCopy(generatedContent + "\n\n" + tags, "single-tags");
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                copiedKey === "single-tags"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {copiedKey === "single-tags" ? "✓ Copiato!" : "#️⃣ + Hashtag"}
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap">
            {generatedContent}
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Anteprima</h4>
            {selectedPlatform === "twitter" && <TwitterPreview content={generatedContent} />}
            {selectedPlatform === "instagram" && <InstagramPreview content={generatedContent} />}
            {selectedPlatform === "linkedin" && <LinkedInPreview content={generatedContent} />}
            {selectedPlatform === "facebook" && <FacebookPreview content={generatedContent} />}
          </div>
        </div>
      )}

      {/* All platforms result (also used for link tab) */}
      {(tab === "all" || tab === "link") && Object.keys(allPosts).length > 0 && (
        <div className="space-y-4">
          {extractedInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
              <span className="font-medium">Contenuto estratto da:</span> {extractedInfo.title}
              <span className="ml-2 text-xs bg-blue-100 px-2 py-0.5 rounded">{extractedInfo.type}</span>
            </div>
          )}
          {platforms.map((p) => {
            const content = allPosts[p];
            if (!content) return null;
            return (
              <div key={p} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">
                    {PLATFORM_CONFIG[p].icon} {PLATFORM_CONFIG[p].name}
                  </h3>
                  <button
                    onClick={() => handleCopy(content, p)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      copiedKey === p
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {copiedKey === p ? "✓ Copiato!" : "📋 Copia"}
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap mb-4">
                  {content}
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Anteprima</h4>
                  {p === "twitter" && <TwitterPreview content={content} />}
                  {p === "instagram" && <InstagramPreview content={content} />}
                  {p === "linkedin" && <LinkedInPreview content={content} />}
                  {p === "facebook" && <FacebookPreview content={content} />}
                </div>
              </div>
            );
          })}
          <button
            onClick={() => {
              const allText = platforms
                .filter((p) => allPosts[p])
                .map((p) => `--- ${PLATFORM_CONFIG[p].name} ---\n${allPosts[p]}`)
                .join("\n\n");
              handleCopy(allText, "all-copy");
            }}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
              copiedKey === "all-copy"
                ? "bg-green-100 text-green-700"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {copiedKey === "all-copy" ? "✓ Tutto copiato!" : "📋 Copia tutti i post"}
          </button>
        </div>
      )}

      {/* Variants result */}
      {tab === "variants" && variants.length > 0 && (
        <div className="space-y-4">
          {variants.map((v) => (
            <div key={v.variant} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-medium text-gray-900">Variante {v.variant}</span>
                  <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded">{v.tone}</span>
                </div>
                <button
                  onClick={() => handleCopy(v.content, `variant-${v.variant}`)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    copiedKey === `variant-${v.variant}`
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {copiedKey === `variant-${v.variant}` ? "✓ Copiato!" : "📋 Copia"}
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap">
                {v.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Images result */}
      {tab === "images" && generatedImages.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {generatedImages.map((img, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Generated ${i + 1}`} className="w-full aspect-square object-cover" />
                <div className="p-3">
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = img;
                      link.download = `postsync-image-${i + 1}.jpg`;
                      link.click();
                    }}
                    className="w-full px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    📥 Scarica
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleGenerateCarousel}
            disabled={isGenerating}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            🎠 Genera Carousel (5 slide)
          </button>
          {carouselSlides.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Carousel Slide</h3>
              <div className="grid grid-cols-5 gap-2">
                {carouselSlides.map((slide, i) => (
                  <div key={i} className="text-center">
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-2xl mb-1">
                      {i + 1}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{slide.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Week plan result */}
      {tab === "week" && weekPlan.length > 0 && (
        <div className="space-y-3">
          {weekPlan.map((day) => (
            <div
              key={day.day}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{day.day}</h3>
                  <p className="text-sm text-gray-500">{day.theme}</p>
                </div>
                <span className="text-gray-400">{expandedDay === day.day ? "−" : "+"}</span>
              </button>
              {expandedDay === day.day && (
                <div className="border-t border-gray-100 p-6 space-y-4">
                  {platforms.map((p) => {
                    const content = day.posts[p];
                    if (!content) return null;
                    return (
                      <div key={p} className="flex items-start gap-3">
                        <span className="text-sm font-medium text-gray-500 mt-1">
                          {PLATFORM_CONFIG[p].icon}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm text-gray-800 whitespace-pre-wrap">{content}</div>
                        </div>
                        <button
                          onClick={() => handleCopy(content, `${day.day}-${p}`)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors shrink-0 ${
                            copiedKey === `${day.day}-${p}`
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {copiedKey === `${day.day}-${p}` ? "✓" : "📋"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          {weekPlan.length > 0 && (
            <button
              onClick={() => exportWeekToCSV(weekPlan)}
              className="mt-4 w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              📁 Esporta 7 giorni in CSV
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function generateHashtags(text: string, platform: Platform): string {
  const words = text
    .toLowerCase()
    .replace(/[^a-zà-ÿ0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 5);

  const tags = words.map((w) => `#${w.replace(/\s+/g, "")}`);

  const limits: Record<Platform, number> = {
    twitter: 3,
    instagram: 10,
    linkedin: 5,
    facebook: 5,
    threads: 3,
  };

  const generic = ["#socialmedia", "#contentcreator", "#marketing", "#ai", "#postsync"];
  const all = [...tags, ...generic].slice(0, limits[platform]);

  return all.join(" ");
}

function exportWeekToCSV(weekPlan: WeekPlan[]): void {
  const platforms: Platform[] = ["twitter", "instagram", "linkedin", "facebook"];
  const header = ["Giorno", "Tema", ...platforms.map((p) => PLATFORM_CONFIG[p].name)];
  const rows = weekPlan.map((day) => [
    day.day,
    day.theme,
    ...platforms.map((p) => `"${(day.posts[p] || "").replace(/"/g, '""')}"`),
  ]);

  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `postsync-7-giorni-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
