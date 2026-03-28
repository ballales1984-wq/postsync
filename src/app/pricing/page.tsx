import Link from "next/link";

const plans = [
  {
    name: "Gratis",
    price: "0€",
    period: "",
    posts: "5 post/giorno",
    features: [
      "Generazione AI base",
      "1 template",
      "Anteprima social",
      "Copia e incolla",
    ],
    cta: "Inizia gratis",
    href: "/compose",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "5€",
    period: "/mese",
    posts: "30 post/mese",
    features: [
      "Tutti i 6 template",
      "Generazione da link",
      "7 giorni di contenuti",
      "Supporto email",
    ],
    cta: "Abbonati ora",
    href: "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-0N388501LK139542ANHD2PEA",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "10€",
    period: "/mese",
    posts: "100 post/mese",
    features: [
      "Tutto di Starter",
      "Generazione illimitata",
      "Template personalizzati",
      "Supporto prioritario",
      "API access",
    ],
    cta: "Abbonati ora",
    href: "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-8US071724E291450ANHD2ROI",
    highlighted: true,
  },
  {
    name: "Business",
    price: "20€",
    period: "/mese",
    posts: "Illimitato",
    features: [
      "Tutto di Pro",
      "Multi account social",
      "Team (fino a 5 utenti)",
      "Analytics avanzate",
      "White label",
    ],
    cta: "Abbonati ora",
    href: "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-32F328862T727984CNHD2QIY",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Scegli il tuo piano
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Inizia gratis con 5 post al giorno. Sblocca generazioni illimitate con i piani a pagamento.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-6 ${
              plan.highlighted
                ? "bg-black dark:bg-white text-white dark:text-black ring-2 ring-black dark:ring-white"
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            }`}
          >
            {plan.highlighted && (
              <span className="inline-block px-3 py-1 bg-white dark:bg-black text-black dark:text-white text-xs font-bold rounded-full mb-4">
                Più popolare
              </span>
            )}

            <h3
              className={`text-lg font-bold ${
                plan.highlighted ? "" : "text-gray-900 dark:text-white"
              }`}
            >
              {plan.name}
            </h3>

            <div className="mt-2 mb-4">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-sm opacity-70">{plan.period}</span>
            </div>

            <p
              className={`text-sm mb-4 ${
                plan.highlighted ? "opacity-80" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {plan.posts}
            </p>

            <ul className="space-y-2 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <span className={plan.highlighted ? "opacity-80" : "text-green-500"}>✓</span>
                  <span className={plan.highlighted ? "" : "text-gray-600 dark:text-gray-300"}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {plan.href.startsWith("http") ? (
              <a
                href={plan.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-2.5 rounded-lg font-medium text-sm text-center ${
                  plan.highlighted
                    ? "bg-white dark:bg-black text-black dark:text-white hover:opacity-90"
                    : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                } transition-colors`}
              >
                {plan.cta}
              </a>
            ) : (
              <Link
                href={plan.href}
                className={`block w-full py-2.5 rounded-lg font-medium text-sm text-center ${
                  plan.highlighted
                    ? "bg-white dark:bg-black text-black dark:text-white hover:opacity-90"
                    : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                } transition-colors`}
              >
                {plan.cta}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Oppure usa la tua API key
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Hai una Groq API key gratuita? Generazioni illimitate, zero costi.
          </p>
          <Link
            href="/settings"
            className="inline-block px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            ⚙️ Configura la tua key
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-500">
        <p>I piani a pagamento saranno disponibili prossimamente.</p>
        <p>Intanto usa il piano gratuito o la tua API key.</p>
      </div>
    </div>
  );
}
