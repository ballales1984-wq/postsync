"use client";

import { useState } from "react";

export function ShareButtons() {
  const [copied, setCopied] = useState(false);
  const url = "https://github.com/ballales1984-wq/postsync";
  const text = encodeURIComponent("Scopri PostSync - L'AI che trasforma link in post social ✨");

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <span className="text-sm text-gray-400 dark:text-gray-500">Condividi:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
        title="Condividi su X"
      >
        𝕏
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#0A66C2] hover:text-white transition-colors"
        title="Condividi su LinkedIn"
      >
        💼
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#1877F2] hover:text-white transition-colors"
        title="Condividi su Facebook"
      >
        👤
      </a>
      <button
        onClick={handleCopy}
        className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
          copied
            ? "bg-green-100 text-green-600"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
        }`}
        title="Copia link"
      >
        {copied ? "✓" : "🔗"}
      </button>
    </div>
  );
}
