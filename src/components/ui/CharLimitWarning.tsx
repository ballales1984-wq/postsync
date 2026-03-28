"use client";

import { Platform, PLATFORM_CONFIG } from "@/lib/types";

interface CharLimitWarningProps {
  content: string;
  selectedPlatforms: Platform[];
}

export function CharLimitWarning({ content, selectedPlatforms }: CharLimitWarningProps) {
  if (selectedPlatforms.length === 0) return null;

  const charCount = content.length;
  const warnings = selectedPlatforms
    .map((platform) => {
      const config = PLATFORM_CONFIG[platform];
      const remaining = config.maxChars - charCount;
      return { platform, config, remaining, exceeded: remaining < 0 };
    })
    .filter((w) => w.remaining < configMaxWarningThreshold(w.config.maxChars));

  if (warnings.length === 0) return null;

  const anyExceeded = warnings.some((w) => w.exceeded);

  return (
    <div
      className={`rounded-lg border p-3 text-sm ${
        anyExceeded
          ? "bg-red-50 border-red-200 text-red-700"
          : "bg-amber-50 border-amber-200 text-amber-700"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span>{anyExceeded ? "⚠️" : "ℹ️"}</span>
        <span className="font-medium">
          {anyExceeded
            ? "Il post supera il limite di caratteri"
            : "Attenzione ai limiti di caratteri"}
        </span>
      </div>
      <div className="space-y-1">
        {warnings.map(({ platform, config, remaining }) => (
          <div key={platform} className="flex items-center gap-2 text-xs">
            <span>{config.icon}</span>
            <span>{config.name}:</span>
            <span className={remaining < 0 ? "font-bold" : ""}>
              {remaining < 0
                ? `${Math.abs(remaining)} caratteri in eccesso`
                : `${remaining} caratteri rimanenti`}
            </span>
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  remaining < 0
                    ? "bg-red-500"
                    : charCount / config.maxChars > 0.8
                    ? "bg-amber-500"
                    : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(100, (charCount / config.maxChars) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function configMaxWarningThreshold(maxChars: number): number {
  if (maxChars <= 280) return 30;
  if (maxChars <= 3000) return 300;
  return 5000;
}
