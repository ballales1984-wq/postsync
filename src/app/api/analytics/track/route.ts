import { NextResponse } from 'next/server';
import { db } from '@/db';
import { analyticsEvents } from '@/db/schema';

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

    await db.insert(analyticsEvents).values({
      eventType: event_type,
      source: source || 'direct',
      urlPath: url_path || '',
      sessionId: session_id || '',
      userAgent: user_agent || '',
      referrer: referrer || '',
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