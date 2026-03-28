import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PostSync - L'AI che scrive i tuoi post social",
  description: "Genera post perfetti per X, Instagram, LinkedIn, Facebook e Threads con l'AI. Copia e pubblica in un click.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PostSync",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        {/* iubenda Consent Banner - afterInteractive to avoid hydration mismatch */}
        <Script id="iubenda-config" strategy="afterInteractive">
          {`var _iub = _iub || [];
_iub.csConfiguration = {"siteId":4477711,"cookiePolicyId":90455251,"lang":"en","storage":{"useSiteId":true}};`}
        </Script>
        <Script src="https://cs.iubenda.com/autoblocking/4477711.js" strategy="afterInteractive" />
        <Script src="//cdn.iubenda.com/cs/gpp/stub.js" strategy="afterInteractive" />
        <Script src="//cdn.iubenda.com/cs/iubenda_cs.js" strategy="afterInteractive" charSet="UTF-8" />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4H8PKV46MQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4H8PKV46MQ');
          `}
        </Script>
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js').catch(() => {});
            }
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors`}
      >
        <ToastProvider>
          <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between h-14">
                <Link href="/" className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">PostSync</span>
                </Link>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <Link
                    href="/schedule"
                    className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    title="Scheduling"
                  >
                    📅
                  </Link>
                  <Link
                    href="/pricing"
                    className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    title="Pricing"
                  >
                    💰
                  </Link>
                  <Link
                    href="/settings"
                    className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    title="Impostazioni"
                  >
                    ⚙️
                  </Link>
                  <Link
                    href="/compose"
                    className="px-4 py-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    Genera Post
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="py-8 px-4 sm:px-6">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
