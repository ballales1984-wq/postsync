export type Platform = "twitter" | "instagram" | "linkedin" | "facebook" | "threads";

export interface Post {
  id: number;
  content: string;
  platforms: string; // JSON array
  status: "draft" | "scheduled" | "published";
  imageUrl: string | null;
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialAccount {
  id: number;
  platform: Platform;
  accountId: string;
  accountName: string;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
  connected: boolean;
  createdAt: Date;
}

export interface PostFormData {
  content: string;
  platforms: Platform[];
  imageUrl?: string;
  scheduledAt?: string;
}

export const PLATFORM_CONFIG: Record<
  Platform,
  { name: string; maxChars: number; color: string; icon: string; oauthSupported: boolean }
> = {
  twitter: { name: "X (Twitter)", maxChars: 280, color: "#000000", icon: "𝕏", oauthSupported: true },
  instagram: { name: "Instagram", maxChars: 2200, color: "#E4405F", icon: "📷", oauthSupported: true },
  linkedin: { name: "LinkedIn", maxChars: 3000, color: "#0A66C2", icon: "💼", oauthSupported: true },
  facebook: { name: "Facebook", maxChars: 63206, color: "#1877F2", icon: "👤", oauthSupported: true },
  threads: { name: "Threads", maxChars: 500, color: "#000000", icon: "🧵", oauthSupported: true },
};
