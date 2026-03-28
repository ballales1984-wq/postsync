"use client";

interface LinkedInPreviewProps {
  content: string;
  imageUrl?: string | null;
}

export function LinkedInPreview({ content, imageUrl }: LinkedInPreviewProps) {
  const handleShare = () => {
    const text = encodeURIComponent(content);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://postsync.app&summary=${text}`, "_blank");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg max-w-[550px] overflow-hidden">
      <div className="flex gap-3 p-4">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
          U
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900">Il Tuo Nome</p>
          <p className="text-xs text-gray-500">Il tuo titolo professionale</p>
          <p className="text-xs text-gray-400">ora · 🌐</p>
        </div>
      </div>
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
      {imageUrl && (
        <div className="border-t border-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Post media" className="w-full max-h-72 object-cover" />
        </div>
      )}
      <div className="border-t border-gray-100 flex justify-around py-2 text-gray-500 text-xs">
        <button className="flex items-center gap-1 hover:bg-gray-50 px-3 py-1 rounded">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Consiglio
        </button>
        <button className="flex items-center gap-1 hover:bg-gray-50 px-3 py-1 rounded">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Commenta
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1 hover:bg-gray-50 px-3 py-1 rounded cursor-pointer"
          title="Pubblica su LinkedIn"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Diffondi
        </button>
      </div>
    </div>
  );
}
