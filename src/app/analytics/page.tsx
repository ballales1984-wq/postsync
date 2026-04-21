'use client';

import { useEffect, useState } from 'react';

interface AnalyticsData {
  views: number;
  visitors: number;
  bounce_rate: string;
  sources: Record<string, number>;
  pages: Record<string, number>;
  daily_data: Array<{ date: string; views: number; visitors: number }>;
  period: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d'>('7d');

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`/api/analytics/summary?period=${period}`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [period]);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-900 p-8">
        <div className="text-white">Loading analytics...</div>
      </main>
    );
  }

  const topSources = data?.sources
    ? Object.entries(data.sources)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : [];

  const topPages = data?.pages
    ? Object.entries(data.pages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : [];

  return (
    <main className="min-h-screen bg-neutral-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setPeriod('7d')}
              className={`px-4 py-2 rounded ${
                period === '7d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 text-gray-300'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setPeriod('30d')}
              className={`px-4 py-2 rounded ${
                period === '30d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 text-gray-300'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-neutral-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm">Total Views</div>
            <div className="text-3xl font-bold text-white mt-2">
              {data?.views.toLocaleString() || 0}
            </div>
          </div>
          <div className="bg-neutral-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm">Unique Visitors</div>
            <div className="text-3xl font-bold text-white mt-2">
              {data?.visitors.toLocaleString() || 0}
            </div>
          </div>
          <div className="bg-neutral-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm">Bounce Rate</div>
            <div className="text-3xl font-bold text-white mt-2">
              {data?.bounce_rate || '0'}%
            </div>
          </div>
          <div className="bg-neutral-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm">Avg Session</div>
            <div className="text-3xl font-bold text-white mt-2">--</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-neutral-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Traffic Sources</h2>
            <div className="space-y-3">
              {topSources.length > 0 ? (
                topSources.map(([source, count]) => {
                  const percentage = data?.views ? (count / data.views) * 100 : 0;
                  return (
                    <div key={source}>
                      <div className="flex justify-between text-gray-300 mb-1">
                        <span>{source}</span>
                        <span>{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="bg-neutral-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500">No data available</div>
              )}
            </div>
          </div>

          <div className="bg-neutral-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Top Pages</h2>
            <div className="space-y-3">
              {topPages.length > 0 ? (
                topPages.map(([page, views]) => (
                  <div key={page} className="flex justify-between text-gray-300">
                    <span className="truncate">{page || '/'}</span>
                    <span>{views}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No data available</div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Views Over Time</h2>
          <div className="h-64 flex items-end gap-2">
            {data?.daily_data && data.daily_data.length > 0 ? (
              data.daily_data.map((day, index) => {
                const maxViews = Math.max(...data.daily_data.map((d) => d.views));
                const height = maxViews > 0 ? (day.views / maxViews) * 100 : 0;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-gray-500 text-xs mt-2 truncate">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500">No data available</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}