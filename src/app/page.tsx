import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12 sm:py-20">
        <div className="text-5xl sm:text-6xl mb-4 animate-bounce">✨</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          PostSync
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-2 max-w-2xl mx-auto">
          L&apos;AI che trasforma contenuti in post social perfetti.
        </p>
        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Da link a post in 1 click. Zero costi, copia e pubblica.
        </p>
        <Link
          href="/compose"
          className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold text-base sm:text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl"
        >
          ✨ Genera il tuo primo post
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 py-8 sm:py-12">
        {[
          { icon: "🔗", title: "Da Link", desc: "Incolla un URL (YouTube, GitHub, sito) e l'AI genera post pronti." },
          { icon: "🤖", title: "Genera con AI", desc: "Scrivi un tema e l'AI crea il post perfetto per ogni piattaforma." },
          { icon: "📋", title: "Copia e pubblica", desc: "Un click per copiare. Oppure usa i pulsanti Condividi." },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white dark:bg-gray-900 rounded-xl p-5 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {item.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-800 my-8 sm:my-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Come funziona
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[
            { n: "1", text: "Inserisci tema o link" },
            { n: "2", text: "Scegli un template" },
            { n: "3", text: "L'AI genera i post" },
            { n: "4", text: "Copia e pubblica" },
          ].map((step) => (
            <div key={step.n} className="text-center">
              <div className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold mx-auto mb-3 text-sm">
                {step.n}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl p-6 sm:p-8 my-8 text-center">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
          Zero costi API. AI locale con Ollama.
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Privacy totale. Nessun dato esce dalla tua macchina.
        </p>
        <Link
          href="/compose"
          className="inline-block px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Prova ora
        </Link>
      </div>

      <div className="text-center py-8 border-t border-gray-200 dark:border-gray-800 mt-8">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Ti piace PostSync? Offrici un caffè ☕
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="https://www.paypal.com/ncp/payment/RSCNKYCL8JS3W"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0070BA] text-white rounded-lg font-medium hover:bg-[#005ea6] transition-colors text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H9.603c-.526 0-.973.385-1.055.9l-1.472 8.11z"/>
            </svg>
            PayPal
          </a>
          <a
            href="https://ko-fi.com/YOUR_USERNAME"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF5E5B] text-white rounded-lg font-medium hover:bg-[#e54b48] transition-colors text-sm"
          >
            ☕ Ko-fi
          </a>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
          PostSync — open source, zero tracking, fatto con ❤️
        </p>
      </div>
    </div>
  );
}
