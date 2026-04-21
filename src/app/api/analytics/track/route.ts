import { NextResponse } from 'next/server';

const analyticsEvents: Array<{
  eventType: string;
  source: string;
  urlPath: string;
  sessionId: string;
  userAgent: string;
  referrer: string;
  timestamp: Date;
}> = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_type, source, url_path, session_id, user_agent, referrer } = body;

    if (!event_type) {
      return NextResponse.json(
        { error: 'event_type is required' },
        { status: 400 }
      );
    }

    analyticsEvents.push({
      eventType: event_type,
      source: source || 'direct',
      urlPath: url_path || '',
      sessionId: session_id || '',
      userAgent: user_agent || '',
      referrer: referrer || '',
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