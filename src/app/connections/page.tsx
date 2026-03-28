"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Platform, PLATFORM_CONFIG, SocialAccount } from "@/lib/types";

const OAUTH_CONFIG: Record<
  Platform,
  { description: string; scopes: string[] }
> = {
  twitter: {
    description: "Pubblica tweet, risposte e media sulla tua timeline.",
    scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
  },
  instagram: {
    description: "Pubblica post e storie sul tuo profilo Instagram.",
    scopes: ["instagram_basic", "instagram_content_publish"],
  },
  linkedin: {
    description: "Pubblica aggiornamenti sulla tua rete LinkedIn.",
    scopes: ["w_member_social", "r_liteprofile"],
  },
  facebook: {
    description: "Pubblica post sulle tue pagine Facebook.",
    scopes: ["pages_manage_posts", "pages_read_engagement", "pages_show_list"],
  },
};

function ConnectionsContent() {
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<Platform | null>(null);
  const [simulateForm, setSimulateForm] = useState<Platform | null>(null);
  const [accountId, setAccountId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    if (success === "twitter") {
      setSuccessMsg("Account Twitter collegato con successo!");
      setTimeout(() => setSuccessMsg(""), 5000);
    }
    if (success === "facebook") {
      setSuccessMsg("Account Facebook collegato con successo!");
      setTimeout(() => setSuccessMsg(""), 5000);
    }
    if (success === "linkedin") {
      setSuccessMsg("Account LinkedIn collegato con successo!");
      setTimeout(() => setSuccessMsg(""), 5000);
    }
    if (success === "instagram") {
      setSuccessMsg("Account Instagram collegato con successo!");
      setTimeout(() => setSuccessMsg(""), 5000);
    }
    if (error) {
      const errorMessages: Record<string, string> = {
        missing_code: "Codice OAuth mancante.",
        oauth_failed: "Collegamento OAuth fallito. Riprova.",
        access_denied: "Accesso negato dall'utente.",
      };
      setErrorMsg(errorMessages[error] || `Errore: ${error}`);
      setTimeout(() => setErrorMsg(""), 5000);
    }
  }, [searchParams]);

  const fetchAccounts = useCallback(async () => {
    try {
      const response = await fetch("/api/social-accounts");
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleRealConnect = async (platform: Platform) => {
    const authEndpoints: Record<string, string> = {
      twitter: "/api/auth/twitter",
      facebook: "/api/auth/facebook",
      linkedin: "/api/auth/linkedin",
      instagram: "/api/auth/instagram",
    };

    const endpoint = authEndpoints[platform];
    if (endpoint) {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          setErrorMsg(
            `${PLATFORM_CONFIG[platform].name} OAuth non configurato. Configura le variabili d'ambiente.`
          );
          setTimeout(() => setErrorMsg(""), 5000);
        }
      } catch {
        setErrorMsg("Errore di connessione.");
        setTimeout(() => setErrorMsg(""), 5000);
      }
    } else {
      setSimulateForm(platform);
      setAccountId("");
      setAccountName("");
    }
  };

  const handleSimulateConnect = async () => {
    if (!simulateForm || !accountId.trim() || !accountName.trim()) return;
    setConnecting(simulateForm);
    try {
      const response = await fetch("/api/social-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: simulateForm,
          accountId: accountId.trim(),
          accountName: accountName.trim(),
        }),
      });
      if (response.ok) {
        const newAccount = await response.json();
        setAccounts((prev) => [newAccount, ...prev]);
        setSimulateForm(null);
        setAccountId("");
        setAccountName("");
      }
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (id: number) => {
    const response = await fetch(`/api/social-accounts/${id}`, { method: "DELETE" });
    if (response.ok) {
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const platforms: Platform[] = ["twitter", "instagram", "linkedin", "facebook"];
  const realOAuthPlatforms: Platform[] = ["twitter", "facebook", "linkedin", "instagram"];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Collega Account Social</h1>
      <p className="text-gray-500 mb-8">
        Collega i tuoi account social per pubblicare direttamente da PostSync.
      </p>

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {errorMsg}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-sm text-blue-700">
        <strong>Configurazione:</strong> Per Twitter/X e Facebook, configura le variabili d&apos;ambiente
        per abilitare il collegamento reale. Gli altri social usano la modalità demo.
      </div>

      {simulateForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{PLATFORM_CONFIG[simulateForm].icon}</span>
            <h2 className="text-lg font-semibold text-gray-900">
              Collega {PLATFORM_CONFIG[simulateForm].name}
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            {OAUTH_CONFIG[simulateForm].description}
          </p>
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Account / Username
              </label>
              <input
                type="text"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                placeholder="es. @iltuoaccount"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Visualizzato
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="es. Mario Rossi"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSimulateConnect}
              disabled={connecting === simulateForm || !accountId.trim() || !accountName.trim()}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {connecting === simulateForm ? "Collegamento..." : "Collega Account"}
            </button>
            <button
              onClick={() => setSimulateForm(null)}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((platform) => {
          const config = PLATFORM_CONFIG[platform];
          const connectedAccount = accounts.find(
            (a) => a.platform === platform && a.connected
          );
          const isConnected = !!connectedAccount;
          const hasRealOAuth = realOAuthPlatforms.includes(platform);

          return (
            <div
              key={platform}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{config.name}</h3>
                    <p className="text-xs text-gray-500">
                      {OAUTH_CONFIG[platform].description}
                    </p>
                    {hasRealOAuth && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded font-medium">
                        OAuth 2.0
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isConnected
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {isConnected ? "Collegato" : "Non collegato"}
                </span>
              </div>

              {isConnected && connectedAccount ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {connectedAccount.accountName}
                    </p>
                    <p className="text-xs text-gray-400">{connectedAccount.accountId}</p>
                  </div>
                  <button
                    onClick={() => handleDisconnect(connectedAccount.id)}
                    className="px-3 py-1.5 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    Disconnetti
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleRealConnect(platform)}
                  disabled={loading}
                  className={`w-full px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    hasRealOAuth
                      ? "bg-black text-white hover:bg-gray-800"
                      : "border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {hasRealOAuth
                    ? `Collega con ${config.name}`
                    : "+ Collega Account (Demo)"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ConnectionsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-gray-400">Caricamento...</div>}>
      <ConnectionsContent />
    </Suspense>
  );
}
