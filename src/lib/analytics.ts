type EventType =
  | 'page_view'
  | 'post_view'
  | 'post_share'
  | 'copy_click'
  | 'compose_open'
  | 'login'
  | 'signup';

interface TrackEventParams {
  event_type: EventType;
  source?: string;
  url_path?: string;
  metadata?: Record<string, unknown>;
}

export async function trackEvent(params: TrackEventParams) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

export function trackPageView(path?: string) {
  trackEvent({
    event_type: 'page_view',
    url_path: path || window.location.pathname,
    source: document.referrer || 'direct',
    metadata: {
      sessionId: getSessionId(),
      userAgent: navigator.userAgent,
    },
  });
}

export function usePageView(path?: string) {
  if (typeof window !== 'undefined') {
    trackPageView(path);
  }
}