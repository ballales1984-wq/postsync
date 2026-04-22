import { NextResponse } from "next/server";
import { db } from "@/db";
import { analyticsEvents } from "@/db/schema";
import { gte } from "drizzle-orm";

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || process.env.NEXT_PUBLIC_GA4_ID;
const GA4_CLIENT_EMAIL = process.env.GA4_CLIENT_EMAIL;
const GA4_PRIVATE_KEY = process.env.GA4_PRIVATE_KEY;

function base64UrlEncode(data: string): string {
  return Buffer.from(data).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function getGa4AccessToken(): Promise<string | null> {
  if (!GA4_PRIVATE_KEY || !GA4_CLIENT_EMAIL) return null;

  const now = Math.floor(Date.now() / 1000);
  const exp = now + 3600;
  
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: GA4_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: exp,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signInput = `${encodedHeader}.${encodedPayload}`;

  try {
    const crypto = await import("crypto");
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(signInput);
    const signature = sign.sign(GA4_PRIVATE_KEY, "base64");
    const encodedSignature = base64UrlEncode(signature);

    const jwt = `${signInput}.${encodedSignature}`;

    const body = new URLSearchParams();
    body.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
    body.append("assertion", jwt);

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await res.json();
    return data.access_token || null;
  } catch (e) {
    console.error("JWT sign error:", e);
    return null;
  }
}

function normalizeGa4Id(id: string): string {
  if (!id) return "";
  return id.replace(/^G-/, "").replace(/^properties\//, "");
}

async function fetchGa4Data(days: number) {
  if (!GA4_PROPERTY_ID || !GA4_PRIVATE_KEY || !GA4_CLIENT_EMAIL) {
    return null;
  }

  const accessToken = await getGa4AccessToken();
  if (!accessToken) return null;

  const propertyId = normalizeGa4Id(GA4_PROPERTY_ID);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split("T")[0];
  const endDateStr = new Date().toISOString().split("T")[0];

  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "totalUsers" }
        ],
        dimensions: [
          { name: "firstUserSource" },
          { name: "country" }
        ],
      }),
    });

    const data = await res.json();
    return data;
  } catch (e) {
    console.error("GA4 API error:", e);
    return null;
  }
}

async function fetchLocalData(days: number) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const events = await db
    .select()
    .from(analyticsEvents)
    .where(gte(analyticsEvents.timestamp, startDate));

  const sources: Record<string, number> = {};
  const pages: Record<string, number> = {};
  let totalViews = 0;
  const uniqueSessions = new Set<string>();

  for (const event of events) {
    if (event.eventType === "page_view") {
      totalViews++;
      const source = event.source || "direct";
      sources[source] = (sources[source] || 0) + 1;
      const page = event.urlPath || "/";
      pages[page] = (pages[page] || 0) + 1;
    }
    if (event.sessionId) {
      uniqueSessions.add(event.sessionId);
    }
  }

  const dailyData: Array<{ date: string; views: number; visitors: number }> = [];
  const viewsByDate: Record<string, number> = {};

  for (const event of events) {
    if (event.eventType === "page_view" && event.timestamp) {
      const dateStr = new Date(event.timestamp).toISOString().split("T")[0];
      viewsByDate[dateStr] = (viewsByDate[dateStr] || 0) + 1;
    }
  }

  for (const [date, views] of Object.entries(viewsByDate).sort()) {
    dailyData.push({ date, views, visitors: Math.floor(views * 0.7) });
  }

  return {
    views: totalViews,
    visitors: uniqueSessions.size,
    sources,
    pages,
    daily_data: dailyData,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d";
    const days = period === "30d" ? 30 : 7;

    const ga4Data = await fetchGa4Data(days);

    if (ga4Data && ga4Data.rows) {
      const sources: Record<string, number> = {};
      let totalViews = 0;
      let totalVisitors = 0;

      for (const row of ga4Data.rows) {
        const source = row.dimensionValues?.[0]?.value || "direct";
        const users = parseInt(row.metricValues?.[0]?.value || "0", 10);
        sources[source] = (sources[source] || 0) + users;
        totalVisitors += users;
        totalViews += parseInt(row.metricValues?.[1]?.value || "0", 10);
      }

      return NextResponse.json({
        views: totalViews,
        visitors: totalVisitors,
        bounce_rate: "45.00",
        sources,
        pages: { "/": totalViews },
        period: days,
        daily_data: [],
        fromGa4: true,
      });
    }

    if (db) {
      try {
        const localData = await fetchLocalData(days);
        return NextResponse.json({
          views: localData.views,
          visitors: localData.visitors,
          bounce_rate: "0.00",
          sources: localData.sources,
          pages: localData.pages,
          period: days,
          daily_data: localData.daily_data,
          fromGa4: false,
        });
      } catch (e) {
        console.error("Local DB error:", e);
      }
    }

    return NextResponse.json({
      views: 0,
      visitors: 0,
      bounce_rate: "0.00",
      sources: {},
      pages: {},
      period: days,
      daily_data: [],
      fromGa4: false,
    });
  } catch (error) {
    console.error("Analytics summary error:", error);
    return NextResponse.json(
      { error: "Failed to get analytics summary" },
      { status: 500 }
    );
  }
}