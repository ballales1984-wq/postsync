"use client";

import { Platform, PLATFORM_CONFIG, Post } from "@/lib/types";

interface PostCardProps {
  post: Post;
  onDelete: (id: number) => void;
  onPublish: (id: number) => void;
}

export function PostCard({ post, onDelete, onPublish }: PostCardProps) {
  const platforms: Platform[] = JSON.parse(post.platforms);
  const date = new Date(post.createdAt).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const scheduledDate = post.scheduledAt
    ? new Date(post.scheduledAt).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              post.status === "published"
                ? "bg-green-100 text-green-700"
                : post.status === "scheduled"
                ? "bg-amber-100 text-amber-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {post.status === "published"
              ? "Pubblicato"
              : post.status === "scheduled"
              ? "Programmato"
              : "Bozza"}
          </span>
          <span className="text-xs text-gray-400">{date}</span>
          {scheduledDate && (
            <span className="text-xs text-amber-600 flex items-center gap-1">
              ⏰ {scheduledDate}
            </span>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          {post.status === "draft" && (
            <button
              onClick={() => onPublish(post.id)}
              className="px-3 py-1 text-xs rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              Pubblica
            </button>
          )}
          <button
            onClick={() => onDelete(post.id)}
            className="px-3 py-1 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            Elimina
          </button>
        </div>
      </div>

      <p className="text-gray-800 text-sm whitespace-pre-wrap mb-3 line-clamp-3">{post.content}</p>

      {post.imageUrl && (
        <div className="mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt="Post media"
            className="w-full max-h-40 object-cover rounded-lg border border-gray-100"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <span
            key={platform}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-600"
          >
            {PLATFORM_CONFIG[platform].icon} {PLATFORM_CONFIG[platform].name}
          </span>
        ))}
      </div>
    </div>
  );
}
