"use client";

interface InstagramPreviewProps {
  content: string;
  imageUrl?: string | null;
}

export function InstagramPreview({ content, imageUrl }: InstagramPreviewProps) {
  const handleShare = () => {
    // Instagram non ha share URL diretto, apriamo il sito per incollare
    window.open("https://www.instagram.com/", "_blank");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg max-w-[400px] overflow-hidden">
      <div className="flex items-center gap-3 p-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold">
            U
          </div>
        </div>
        <span className="font-semibold text-sm text-gray-900">iltuoaccount</span>
      </div>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="Post media" className="w-full aspect-square object-cover" />
      ) : (
        <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Nessuna immagine</span>
        </div>
      )}
      <div className="flex gap-4 p-3">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <button
          onClick={handleShare}
          className="cursor-pointer"
          title="Apri Instagram per pubblicare"
        >
          <svg className="w-6 h-6 hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>
      <div className="px-3 pb-3">
        <p className="text-sm">
          <span className="font-semibold text-gray-900">iltuoaccount</span>{" "}
          <span className="text-gray-900 whitespace-pre-wrap">{content}</span>
        </p>
      </div>
    </div>
  );
}
