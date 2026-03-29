"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PostCard } from "@/components/ui/PostCard";
import { Post } from "@/lib/types";

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "draft" | "scheduled" | "published">("all");

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
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
    }
  };

  const handlePublish = async (id: number) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published" }),
    });
    if (response.ok) {
      const updated = await response.json();
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }
  };

  const filteredPosts = posts.filter((p) => filter === "all" || p.status === filter);

  const filterOptions: { key: typeof filter; label: string }[] = [
    { key: "all", label: "Tutti" },
    { key: "draft", label: "Bozze" },
    { key: "scheduled", label: "Programmati" },
    { key: "published", label: "Pubblicati" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">I Miei Post</h1>
        <Link
          href="/compose"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          + Nuovo Post
        </Link>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {filterOptions.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === key
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Caricamento...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-400 mb-4">Nessun post trovato</p>
          <Link
            href="/compose"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Crea il tuo primo post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDelete}
              onPublish={handlePublish}
            />
          ))}
        </div>
      )}
    </div>
  );
}
