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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_type, source, url_path, metadata } = body;

    if (!event_type) {
      return NextResponse.json(
        { error: 'event_type is required' },
        { status: 400 }
      );
    }

    inMemoryAnalytics.events.push({
      id: crypto.randomUUID(),
      eventType: event_type,
      source: source || 'direct',
      urlPath: url_path || '',
      metadata: metadata || {},
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics track error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}