# ✨ PostSync

**From link to social content in 1 click.** | **Da link a contenuto social in 1 click.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org) [![React](https://img.shields.io/badge/React-19-blue)](https://react.dev) [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://typescriptlang.org) [![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8)](https://tailwindcss.com) [![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

**🌐 [English](#-english)** | **🇮🇹 [Italiano](#-italiano)**

---

## 🌐 English

**Demo:** [postsync-xi.vercel.app](https://postsync-xi.vercel.app)

### What is PostSync?

PostSync is an AI tool that transforms any content into social media posts. Paste a link (YouTube, GitHub, website) or write a topic, and get ready-to-post content for 4 platforms.

### How it works

```
1. Enter a topic or paste a link
2. AI generates posts for all platforms
3. Preview live
4. Copy and publish
```

### Features

| Feature | Description |
|---------|------------|
| 🔗 From Link | Extract content from YouTube, GitHub, websites |
| 🤖 AI Groq | Free cloud AI (Llama 3.3) |
| 🖥️ AI Ollama | Local AI (zero cost, total privacy) |
| 📱 4 Platforms | X/Twitter, Instagram, LinkedIn, Facebook |
| 🎨 6 Templates | Viral, Professional, Storytelling, Tips, Announcement, Question |
| #️⃣ Auto Hashtags | Smart hashtag generation per platform |
| 📅 7 Days | Generate a full week of content |
| 📤 Share Buttons | Direct publish via platform share URLs |
| 📋 1-Click Copy | Copy single post or all at once |
| 📁 CSV Export | Export 7-day planner to CSV |
| 🌙 Dark Mode | Toggle with persistence |
| 📱 Responsive | Works on all devices |

### Pricing

| Plan | Posts | Price |
|------|-------|-------|
| Free | 5/day | $0 |
| Starter | 30/month | €5 |
| Pro | 100/month | €10 |
| Business | Unlimited | €20 |

Or bring your own **free Groq API key** for unlimited generations.

### Tech Stack

| Technology | Use |
|-----------|-----|
| Next.js 16 | Framework |
| React 19 | UI |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| Drizzle ORM + Neon | Database |
| Groq | Cloud AI |
| Ollama | Local AI |
| Cheerio | URL extraction |

### Installation

```bash
git clone https://github.com/ballales1984-wq/postsync.git
cd postsync
bun install
cp .env.example .env.local
bun dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://...
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile
```

### Commands

```bash
bun dev / bun build / bun lint / bun typecheck
```

---

## 🇮🇹 Italiano

**Demo:** [postsync-xi.vercel.app](https://postsync-xi.vercel.app)

### Cos'è PostSync?

PostSync è uno strumento AI che trasforma qualsiasi contenuto in post per i social media. Incolla un link o scrivi un tema, e ottieni contenuti pronti per 4 piattaforme.

### Come funziona

```
1. Inserisci un tema o incolla un link
2. L'AI genera post per tutte le piattaforme
3. Anteprima live
4. Copia e pubblica
```

### Funzionalità

| Feature | Descrizione |
|---------|------------|
| 🔗 Da Link | Estrai contenuto da YouTube, GitHub, siti web |
| 🤖 AI Groq | AI cloud gratuita (Llama 3.3) |
| 🖥️ AI Ollama | AI locale (zero costi, privacy totale) |
| 📱 4 Piattaforme | X/Twitter, Instagram, LinkedIn, Facebook |
| 🎨 6 Template | Virale, Professionale, Storytelling, Tips, Annuncio, Domanda |
| #️⃣ Hashtag automatici | Generazione intelligente per piattaforma |
| 📅 7 Giorni | Genera una settimana di contenuti |
| 📤 Pulsanti Condividi | Pubblica direttamente tramite share URL |
| 📋 Copia 1 click | Copia singolo post o tutti insieme |
| 📁 Esporta CSV | Esporta il planner 7 giorni in CSV |
| 🌙 Dark mode | Toggle con persistenza |
| 📱 Responsive | Funziona su tutti i dispositivi |

### Pacchetti

| Piano | Post | Prezzo |
|-------|------|--------|
| Gratis | 5/giorno | 0€ |
| Starter | 30/mese | 5€ |
| Pro | 100/mese | 10€ |
| Business | Illimitato | 20€ |

Oppure porta la tua **API key Groq gratuita** per generazioni illimitate.

### Installazione

```bash
git clone https://github.com/ballales1984-wq/postsync.git
cd postsync
bun install
cp .env.example .env.local
bun dev
```

### Target utenti

- 🎬 Creator YouTube
- 👨‍💻 Sviluppatori (GitHub)
- 📊 Social media manager
- 💼 Freelance e marketer

---

## License

MIT
