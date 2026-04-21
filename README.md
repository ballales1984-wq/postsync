# ✨ PostSync

**From link to social content in 1 click.**

AI-powered social media content generator. Web app + Desktop app.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org) [![React](https://img.shields.io/badge/React-19-blue)](https://react.dev) [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://typescriptlang.org) [![Tauri](https://img.shields.io/badge/Tauri-1-FFC131)](https://tauri.app) [![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## Download

| Versione | Link | Stato |
|----------|------|-------|
| **Desktop (Linux)** | [GitHub Releases v1.0.0](https://github.com/ballales1984-wq/postsync/releases/tag/v1.0.0-desktop) | Scarica |
| **Web App** | [postsync.vercel.app](https://postsync.vercel.app) | Demo |

**Prezzo**: €1 pagamento unico. Oppure gratis da GitHub.

---

## Features

| Feature | Descrizione |
|---------|------------|
| 🤖 AI Generation | Genera post con Groq (cloud) o Ollama (locale) |
| 🔗 URL Extraction | Estrai contenuti da YouTube, GitHub, siti web |
| 📱 5 Piattaforme | X/Twitter, Instagram, LinkedIn, Facebook, Threads |
| 🎨 6 Template | Virale, Professionale, Storytelling, Tips, Annuncio, Domanda |
| 🔄 Multi-Varianti | 5 toni diversi per ogni post |
| #️⃣ Hashtag Auto | Generazione intelligente per piattaforma |
| 📅 Scheduling | Calendario con orari consigliati |
| 📁 CSV Export | Esporta il planner 7 giorni |
| 📤 Share Buttons | Pubblica diretto su X, Facebook, LinkedIn |
| 📋 Copia 1 Click | Singolo post o tutti insieme |
| 🖼️ Immagini | Upload + generazione placeholder |
| 🌙 Dark Mode | Toggle con persistenza |
| 📱 PWA | Installa come app |
| 💾 SQLite Locale | Database nel desktop app |

---

## Come funziona

```
1. Inserisci un tema o un link
2. Scegli un template
3. L'AI genera il post
4. Anteprima live
5. Copia e pubblica
```

---

## Desktop App

L'app desktop funziona offline con la tua API key:

### Setup
```bash
# Scarica da GitHub Releases
# O builda da sorgente:
git clone https://github.com/ballales1984-wq/postsync.git
cd postsync
bun install
bun tauri:build
```

### Configurazione AI
- **Groq** (cloud, gratuito): inserisci la tua API key nelle impostazioni
- **Ollama** (locale, gratuito): `ollama pull llama3`

---

## Web App

### Installazione
```bash
git clone https://github.com/ballales1984-wq/postsync.git
cd postsync
bun install
cp .env.example .env.local
bun dev
```

### Variabili d'ambiente
```env
GROQ_API_KEY=gsk_...      # Da groq.com (gratis)
GROQ_MODEL=llama-3.3-70b-versatile
```

---

## Struttura

```
src/
├── app/
│   ├── compose/page.tsx    # Generatore AI (6 tab)
│   ├── dashboard/          # Gestione post
│   ├── schedule/           # Calendario
│   ├── settings/           # API key
│   ├── pricing/            # Download page
│   └── connections/        # OAuth social
├── components/
│   ├── previews/           # Anteprima social
│   └── ui/                 # Componenti UI
├── lib/
│   ├── ai.ts               # Groq + Ollama
│   ├── extractor.ts        # URL extraction
│   └── images.ts           # Generazione immagini
└── db/                     # SQLite / Neon
src-tauri/                  # Desktop app (Tauri)
```

---

## API Endpoints

| Metodo | Route | Descrizione |
|--------|-------|-------------|
| POST | `/api/generate` | Genera post con AI |
| POST | `/api/extract` | Estrai contenuto da URL |
| POST | `/api/images` | Genera immagini |
| CRUD | `/api/posts` | Gestione post |
| POST | `/api/publish/*` | Pubblicazione social |

---

## Modello di business

- **Web app**: demo gratuita con limitazione
- **Desktop app**: €1 pagamento unico
- **GitHub**: codice open source (MIT)

---

## Target

- Creator YouTube
- Sviluppatori (GitHub)
- Social media manager
- Freelance e marketer

---

## License

MIT
