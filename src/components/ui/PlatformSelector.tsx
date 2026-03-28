"use client";

import { Platform, PLATFORM_CONFIG } from "@/lib/types";

interface PlatformSelectorProps {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
}

export function PlatformSelector({ selected, onChange }: PlatformSelectorProps) {
  const platforms: Platform[] = ["twitter", "instagram", "linkedin", "facebook"];

  const toggle = (platform: Platform) => {
    if (selected.includes(platform)) {
      onChange(selected.filter((p) => p !== platform));
    } else {
      onChange([...selected, platform]);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {platforms.map((platform) => {
        const config = PLATFORM_CONFIG[platform];
        const isSelected = selected.includes(platform);
        return (
          <button
            key={platform}
            type="button"
            onClick={() => toggle(platform)}
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
  );
}
