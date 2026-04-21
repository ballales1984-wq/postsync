"use client";

import { useState } from "react";
import { Platform, PLATFORM_CONFIG } from "@/lib/types";

interface PostComposerProps {
  onSubmit: (data: { content: string; platforms: Platform[] }) => Promise<void>;
  initialContent?: string;
  initialPlatforms?: Platform[];
  isEditing?: boolean;
}

export function PostComposer({
  onSubmit,
  initialContent = "",
  initialPlatforms = [],
  isEditing = false,
}: PostComposerProps) {
  const [content, setContent] = useState(initialContent);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(initialPlatforms);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const getMinCharLimit = () => {
    if (selectedPlatforms.length === 0) return Infinity;
    return Math.min(...selectedPlatforms.map((p) => PLATFORM_CONFIG[p].maxChars));
  };

  const charLimit = getMinCharLimit();
  const isOverLimit = content.length > charLimit;

  const handleSubmit = async (status: "draft" | "published") => {
    if (!content.trim() || selectedPlatforms.length === 0 || isOverLimit) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ content: content.trim(), platforms: selectedPlatforms });
      if (!isEditing) {
        setContent("");
        setSelectedPlatforms([]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const platforms: Platform[] = ["twitter", "instagram", "linkedin", "facebook"];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {isEditing ? "Modifica Post" : "Componi un nuovo Post"}
      </h2>

      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Scrivi il tuo post qui..."
          rows={5}
          className={`w-full px-4 py-3 rounded-lg border ${
            isOverLimit ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
          } focus:outline-none focus:ring-2 resize-none text-gray-900 placeholder-gray-400`}
        />
        <div className="flex justify-between mt-1 text-sm">
          <span className={isOverLimit ? "text-red-500" : "text-gray-500"}>
            {content.length} / {charLimit === Infinity ? "∞" : charLimit} caratteri
          </span>
          {selectedPlatforms.length > 0 && (
            <span className="text-gray-400">
              Limite: {PLATFORM_CONFIG[selectedPlatforms.sort((a, b) => PLATFORM_CONFIG[a].maxChars - PLATFORM_CONFIG[b].maxChars)[0]].name}
            </span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pubblica su:
        </label>
        <div className="flex flex-wrap gap-3">
          {platforms.map((platform) => {
            const config = PLATFORM_CONFIG[platform];
            const isSelected = selectedPlatforms.includes(platform);
            return (
              <button
                key={platform}
                type="button"
                onClick={() => togglePlatform(platform)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <span className="text-lg">{config.icon}</span>
                <span className="font-medium text-sm">{config.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleSubmit("draft")}
          disabled={isSubmitting || !content.trim() || selectedPlatforms.length === 0 || isOverLimit}
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Salva Bozza
        </button>
        <button
          onClick={() => handleSubmit("published")}
          disabled={isSubmitting || !content.trim() || selectedPlatforms.length === 0 || isOverLimit}
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Pubblicazione..." : "Pubblica Ora"}
        </button>
      </div>
    </div>
  );
}
