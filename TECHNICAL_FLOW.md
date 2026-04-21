# PostSync - Technical Flow: AI Generator + Analytics

## Architettura Unificata

```
┌─────────────────────────────────────────────────────────────┐
│                    PostSync v5.0                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   AI Posts    │  │  Analytics   │  │  Dashboard   │   │
│  │  Generator   │  │   Engine     │  │   Unified    │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer (PostgreSQL)                │
│  • posts, social_accounts, scheduled_posts             │
│  • analytics_events, traffic_sources, metrics             │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Schema Database

```sql
-- Tabelle esistenti (mantenute)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT,
  platform VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE social_accounts (
  id UUID PRIMARY KEY,
  platform VARCHAR(20),
  access_token TEXT,
  account_name VARCHAR(255)
);

-- NUOVE TABELLE PER ANALYTICS
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50),  -- page_view, click, share, impression
  source VARCHAR(255),     -- direct, social, organic, referral
  url_path VARCHAR(500),
  metadata JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE traffic_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2),
  avg_session_duration INTEGER,
  top_sources JSONB,
  top_pages JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE campaign_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id),
  platform VARCHAR(20),
  impressions INTEGER DEFAULT 0,
  engagements INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  recorded_at DATE DEFAULT CURRENT_DATE
);
```

---

## 2. API Routes

### Analytics Ingestion
```
POST /api/analytics/track
Body: { event_type, source, url_path, metadata }
```

```
GET /api/analytics/summary?period=7d
Response: { views, visitors, bounce_rate, sources, pages }
```

```
GET /api/analytics/traffic?start=DATE&end=DATE
Response: { daily_data[], sources[], top_pages[] }
```

### Campaign/Post Analytics
```
GET /api/analytics/posts/[id]/metrics
Response: { impressions, engagements, clicks, reach, trend[] }
```

```
GET /api/analytics/platform/[platform]/performance
Response: { total_posts, avg_engagement, top_posts[] }
```

---

## 3. Frontend Pages

### /analytics (nuovo)
- Overview cards: Views, Visitors, Bounce Rate, Avg Time
- Traffic chart (line chart 7/30 days)
- Sources pie chart
- Top pages table
- Real-time visitors indicator

### /analytics/social (integrato)
- Connected accounts performance
- Per-platform metrics
- Post-by-post analytics
- Engagement trends

### /composer (esistente + arricchito)
- AI post generator
- Preview with predicted reach
- A/B variant suggestions based on analytics data

---

## 4. Flusso Dati

```
Utente → Track Event → API /analytics/track → DB analytics_events
                                     ↓
                              Cron Job (giornaliero)
                                     ↓
                              Aggrega in traffic_metrics
                                     ↓
                              Dashboard visualizzazione
```

### Eventi tracciati
| Evento | Descrizione | Metadata |
|--------|------------|----------|
| page_view | Pagina visitata | { path, referrer } |
| post_view | Post visualizzato | { post_id, platform } |
| post_share | Post condiviso | { post_id, platform } |
| copy_click | Copy clicked | { post_id, count } |
| compose_open | Composer aperto | { source } |

---

## 5. Tech Stack Components

| Componente | Tecnologia |
|------------|------------|
| Database | PostgreSQL (Neon) + Drizzle |
| Analytics DB | Tabella dedicata in stesso DB |
| Charts | Recharts / Chart.js |
| Real-time | Server-Sent Events o polling |
| Data Fetching | React Query / Next.js Server Components |

---

## 6. Priorità Implementazione

### Fase 1: Analytics Base
- [ ] Database schema
- [ ] API track eventi
- [ ] Dashboard analytics semplice

### Fase 2: Social Analytics
- [ ] Integrazione API sociali (platform metrics)
- [ ] Visualizzazione per piattaforma
- [ ] Correlazione post → metriche

### Fase 3: AI Integration
- [ ] Suggerimenti basati su analytics
- [ ] Preview predicted performance
- [ ] A/B testing suggestions

---

## 7. Variazioni Deployment

| Opzione | Analytics | Storage | Costo |
|---------|-----------|---------|-------|
| Lite | No | Locale SQLite | €0 |
| Cloud | Sì | Neon | €0-19/mese |
| Enterprise | Advanced | Custom DB | Custom |

---

## 8. Note Importanti

1. **Privacy**: GDPR compliant, cookie policy aggiornata
2. **Performance**: Eventi tracciati in batch, non in sync
3. **Scalabilità**: Neon free tier → 0.5GB, 2 progetti
4. **Real-time**: Polling ogni 30s per dashboard live

---

## Prossimi Passi

1. Approvare questo flow
2. Definire quali metriche specifiche tracciare
3. Iniziare implementazione Fase 1