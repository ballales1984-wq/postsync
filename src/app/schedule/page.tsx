"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import { Platform, PLATFORM_CONFIG } from "@/lib/types";

interface ScheduledPost {
  id: number;
  content: string;
  platforms: string;
  status: string;
  scheduledAt: string | null;
  createdAt: string;
}

const SMART_TIMES: Record<Platform, string[]> = {
  twitter: ["08:00", "12:00", "17:00", "20:00"],
  instagram: ["11:00", "14:00", "19:00", "21:00"],
  linkedin: ["07:30", "12:00", "17:30"],
  facebook: ["09:00", "13:00", "16:00"],
  threads: ["09:00", "12:00", "18:00", "21:00"],
};

export default function SchedulePage() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"queue" | "calendar">("queue");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data.filter((p: ScheduledPost) => p.status === "scheduled" || p.status === "draft"));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (response.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      showToast("Post eliminato", "success");
    }
  };

  const handlePublishNow = async (id: number) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published" }),
    });
    if (response.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      showToast("Post pubblicato!", "success");
    }
  };

  const scheduledPosts = posts.filter((p) => p.status === "scheduled" && p.scheduledAt);
  const draftPosts = posts.filter((p) => p.status === "draft");

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter((p) => {
      if (!p.scheduledAt) return false;
      const postDate = new Date(p.scheduledAt);
      return (
        postDate.getFullYear() === date.getFullYear() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getDate() === date.getDate()
      );
    });
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📅 Scheduling</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestisci i tuoi post programmati e in coda.
          </p>
        </div>
        <Link
          href="/compose"
          className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          + Nuovo Post
        </Link>
      </div>

      {/* Smart Times Suggestion */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl border border-blue-200 dark:border-blue-800 p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          💡 Orari consigliati per pubblicare
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(Object.keys(SMART_TIMES) as Platform[]).map((platform) => (
            <div key={platform} className="text-xs">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {PLATFORM_CONFIG[platform].icon} {PLATFORM_CONFIG[platform].name}
              </span>
              <div className="text-gray-500 dark:text-gray-400 mt-0.5">
                {SMART_TIMES[platform].join(", ")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setView("queue")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            view === "queue"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          📋 Coda ({scheduledPosts.length})
        </button>
        <button
          onClick={() => setView("calendar")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            view === "calendar"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          📅 Calendario
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Caricamento...</div>
      ) : view === "queue" ? (
        <div className="space-y-4">
          {/* Scheduled Posts */}
          {scheduledPosts.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                ⏰ Programmati ({scheduledPosts.length})
              </h2>
              <div className="space-y-3">
                {scheduledPosts.map((post) => {
                  const platforms: Platform[] = JSON.parse(post.platforms);
                  const date = new Date(post.scheduledAt!).toLocaleDateString("it-IT", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <div
                      key={post.id}
                      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs rounded-full">
                              ⏰ {date}
                            </span>
                            {platforms.map((p) => (
                              <span key={p} className="text-xs">
                                {PLATFORM_CONFIG[p].icon}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                            {post.content}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handlePublishNow(post.id)}
                            className="px-3 py-1 text-xs bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
                          >
                            Pubblica ora
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
                          >
                            Elimina
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Draft Posts */}
          {draftPosts.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                📝 Bozze ({draftPosts.length})
              </h2>
              <div className="space-y-3">
                {draftPosts.map((post) => {
                  const platforms: Platform[] = JSON.parse(post.platforms);
                  return (
                    <div
                      key={post.id}
                      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 opacity-75"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                              Bozza
                            </span>
                            {platforms.map((p) => (
                              <span key={p} className="text-xs">
                                {PLATFORM_CONFIG[p].icon}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                            {post.content}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handlePublishNow(post.id)}
                            className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                          >
                            Pubblica
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
                          >
                            Elimina
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {scheduledPosts.length === 0 && draftPosts.length === 0 && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
              <p className="text-gray-400 mb-4">Nessun post programmato o in bozza</p>
              <Link
                href="/compose"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Crea il tuo primo post
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                )
              }
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              ←
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                )
              }
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
            {["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"].map((day) => (
              <div
                key={day}
                className="bg-gray-50 dark:bg-gray-800 p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}
            {days.map((day, i) => {
              const dayPosts = day ? getPostsForDate(day) : [];
              const isToday =
                day &&
                day.toDateString() === new Date().toDateString();
              return (
                <div
                  key={i}
                  className={`bg-white dark:bg-gray-900 min-h-[80px] p-1 ${
                    isToday ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  {day && (
                    <>
                      <div
                        className={`text-xs font-medium mb-1 ${
                          isToday
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {day.getDate()}
                      </div>
                      {dayPosts.map((post) => {
                        const time = new Date(post.scheduledAt!).toLocaleTimeString("it-IT", {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        const platforms: Platform[] = JSON.parse(post.platforms);
                        return (
                          <div
                            key={post.id}
                            className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded px-1 py-0.5 mb-0.5 truncate"
                          >
                            {time} {platforms.map((p) => PLATFORM_CONFIG[p].icon).join("")}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
