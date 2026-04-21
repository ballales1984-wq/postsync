import { NextResponse } from 'next/server';

const inMemoryAnalytics: {
  events: Array<{
    id: string;
    eventType: string;
    source: string;
    urlPath: string;
    metadata: Record<string, unknown>;
    timestamp: Date;
  }>;
} = {
  events: [],
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';
    
    const days = period === '30d' ? 30 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = inMemoryAnalytics.events.filter(
      (e) => e.timestamp >= startDate
    );

    const pageViews = events.filter((e) => e.eventType === 'page_view');
    const views = pageViews.length;
    
    const visitorsSet = new Set(
      pageViews
        .map((e) => e.metadata?.sessionId as string)
        .filter(Boolean)
    );
    const visitors = visitorsSet.size;

    const sources: Record<string, number> = {};
    events.forEach((e) => {
      const source = e.source || 'direct';
      sources[source] = (sources[source] || 0) + 1;
    });

    const pages: Record<string, number> = {};
    events.forEach((e) => {
      const page = e.urlPath || '/';
      pages[page] = (pages[page] || 0) + 1;
    });

    const dailyData: Record<string, { views: number; visitors: number }> = {};
    pageViews.forEach((e) => {
      const dateKey = e.timestamp.toISOString().split('T')[0];
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { views: 0, visitors: 0 };
      }
      dailyData[dateKey].views++;
    });

    return NextResponse.json({
      views,
      visitors,
      bounce_rate: '0.00',
      sources,
      pages,
      period: days,
      daily_data: Object.entries(dailyData).map(([date, data]) => ({
        date,
        views: data.views,
        visitors: data.visitors,
      })),
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    return NextResponse.json(
      { error: 'Failed to get analytics summary' },
      { status: 500 }
    );
  }
}