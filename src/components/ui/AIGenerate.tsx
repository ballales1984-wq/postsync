"use client";

import { useState } from "react";
import { Platform } from "@/lib/types";

interface AIGenerateProps {
  onGenerated: (content: string) => void;
  selectedPlatform: Platform | null;
}

const TONES = [
  { value: "professionale", label: "Professionale", icon: "💼" },
  { value: "casual", label: "Casual", icon: "😊" },
  { value: "entusiasta", label: "Entusiasta", icon: "🔥" },
  { value: "informativo", label: "Informativo", icon: "📚" },
] as const;

export function AIGenerate({ onGenerated, selectedPlatform }: AIGenerateProps) {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<string>("professionale");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [variants, setVariants] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError("");
    setVariants([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          platform: selectedPlatform || "twitter",
          tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Errore nella generazione");
      }

      setVariants([data.content]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Errore sconosciuto";
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">✨</span>
        <h3 className="text-lg font-semibold text-gray-900">Genera con AI</h3>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Di cosa vuoi parlare?
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="es. Lancio della nuova versione 2.0 con dark mode e performance migliorate"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900 placeholder-gray-400"
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tono</label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTone(t.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tone === t.value
                  ? "bg-purple-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-purple-300"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !topic.trim()}
        className="w-full px-4 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generazione in corso...
          </>
        ) : (
          <>✨ Genera Post</>
        )}
      </button>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {variants.length > 0 && (
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Risultato generato:
          </label>
          {variants.map((variant, i) => (
            <div key={i} className="relative">
              <div className="bg-white rounded-lg border border-gray-200 p-3 text-sm text-gray-800 whitespace-pre-wrap">
                {variant}
              </div>
              <button
                onClick={() => onGenerated(variant)}
                className="mt-2 px-3 py-1.5 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700 transition-colors"
              >
                Usa questo testo
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
