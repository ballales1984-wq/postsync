import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-5xl mb-4">🚀</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Scarica PostSync Desktop
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          App desktop con AI locale. Zero costi, zero abbonamenti, totale privacy.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="bg-gradient-to-r from-black to-gray-800 text-white p-8 text-center">
          <div className="text-4xl mb-3">✨</div>
          <h2 className="text-2xl font-bold mb-2">PostSync Desktop</h2>
          <p className="text-gray-300 text-sm">AI per social media. Offline. Senza limiti.</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              "🤖 AI con Groq (tua key) o Ollama (locale)",
              "📱 5 piattaforme: X, Instagram, LinkedIn, Facebook, Threads",
              "🔗 Estrai contenuti da link YouTube, GitHub, siti web",
              "🎨 6 template: Virale, Professionale, Storytelling...",
              "📋 Copia e pubblica su qualsiasi social",
              "💾 Database SQLite locale (nessun server)",
              "🔒 Tutto in locale, privacy totale",
              "💰 Zero costi dopo l'acquisto",
            ].map((text) => (
              <div key={text} className="flex items-start gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">{text}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">€1</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">pagamento unico</span>
              </div>
              <span className="text-sm text-gray-400">Nessun abbonamento</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://www.paypal.com/ncp/payment/RSCNKYCL8JS3W"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 bg-[#0070BA] text-white rounded-lg font-semibold text-center hover:bg-[#005ea6] transition-colors"
              >
                Paga con PayPal (€1)
              </a>
              <a
                href="https://github.com/ballales1984-wq/postsync/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Scarica da GitHub
              </a>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
              Dopo il pagamento, ricevi il link per scaricare l&apos;app. Oppure scarica gratis da GitHub.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          Oppure usa la versione web gratuita
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Prova PostSync online con la tua API key Groq gratuita.
        </p>
        <Link
          href="/compose"
          className="inline-block px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Prova ora gratis
        </Link>
      </div>

      <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-500">
        <p className="mb-1">
          <strong>Requisiti:</strong> Windows 10+, macOS 10.15+, o Linux
        </p>
        <p>
          Per l&apos;AI: API key Groq gratuita oppure Ollama locale
        </p>
      </div>
    </div>
  );
}
