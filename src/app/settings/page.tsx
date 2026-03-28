"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

const DAILY_LIMIT = 10;

export default function SettingsPage() {
  const { showToast } = useToast();
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("groq_api_key") || "";
  });
  const [saved, setSaved] = useState(false);
  const [usage, setUsage] = useState(() => {
    if (typeof window === "undefined") return { used: 0, limit: DAILY_LIMIT };
    const today = new Date().toISOString().split("T")[0];
    const usageData = JSON.parse(localStorage.getItem("ai_usage") || "{}");
    return { used: usageData[today] || 0, limit: DAILY_LIMIT };
  });
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("groq_api_key", apiKey.trim());
      setSaved(true);
      showToast("API key salvata!", "success");
      setTimeout(() => setSaved(false), 2000);
    } else {
      localStorage.removeItem("groq_api_key");
      showToast("API key rimossa", "info");
    }
  };

  const handleRemove = () => {
    setApiKey("");
    localStorage.removeItem("groq_api_key");
    showToast("API key rimossa", "info");
  };

  const hasCustomKey = apiKey.length > 0;
  const remaining = usage.limit - usage.used;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Impostazioni</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Configura la tua API key per generazioni illimitate.
      </p>

      {/* Usage Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Utilizzo giornaliero
        </h2>

        {hasCustomKey ? (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-green-700 dark:text-green-300 font-medium">
              ✅ Usi la tua API key — generazioni illimitate
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Generazioni usate oggi
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {usage.used} / {usage.limit}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  remaining <= 0
                    ? "bg-red-500"
                    : remaining <= 3
                    ? "bg-amber-500"
                    : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(100, (usage.used / usage.limit) * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {remaining > 0
                ? `${remaining} generazioni rimaste oggi`
                : "Limite raggiunto. Aggiungi la tua API key per continuare."}
            </p>
          </>
        )}
      </div>

      {/* API Key Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          La tua API Key Groq
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Con la tua chiave personale hai generazioni illimitate e gratuite.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Groq API Key
          </label>
          <div className="flex gap-2">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="gsk_..."
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:outline-none text-gray-900 dark:text-white"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {showKey ? "🔒" : "👁️"}
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            {saved ? "✅ Salvata" : "Salva"}
          </button>
          {apiKey && (
            <button
              onClick={handleRemove}
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Rimuovi
            </button>
          )}
        </div>
      </div>

      {/* How to get API Key */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-xl border border-purple-200 dark:border-purple-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Come ottenere una API Key gratuita
        </h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              1
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Vai su console.groq.com
              </p>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                → Crea un account gratuito
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              2
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Crea una API Key
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Clicca &quot;Create API Key&quot;, dai un nome, copia la chiave
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Incolla qui sopra
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                La chiave inizia con <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">gsk_</code>
              </p>
            </div>
          </div>
        </div>
        <a
          href="https://console.groq.com/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
        >
          Vai a Groq Console →
        </a>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/compose"
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← Torna al compositore
        </Link>
      </div>
    </div>
  );
}
