"use client";

interface MediaItem {
  type: "image" | "video" | "audio";
  url: string;
  filename: string;
}

interface Post {
  id: string;
  content: string;
  media?: string | null;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
  isAuthenticated?: boolean;
}

export default function PostCard({
  post,
  onDelete,
  isAuthenticated,
}: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const mediaItems: MediaItem[] = post.media
    ? JSON.parse(post.media)
    : [];

  return (
    <article className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <div
        className="prose prose-sm sm:prose lg:prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      {mediaItems.length > 0 && (
        <div className="mt-6 space-y-4">
          {mediaItems.map((item, index) => (
            <div key={index} className="rounded-lg overflow-hidden">
              {item.type === "image" && (
                <img
                  src={item.url}
                  alt={item.filename}
                  className="w-full h-auto object-contain max-h-[600px] bg-gray-100"
                />
              )}
              {item.type === "video" && (
                <video
                  src={item.url}
                  controls
                  className="w-full h-auto max-h-[600px] bg-black"
                >
                  Your browser does not support the video tag.
                </video>
              )}
              {item.type === "audio" && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{item.filename}</p>
                  <audio src={item.url} controls className="w-full">
                    Your browser does not support the audio tag.
                  </audio>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <time className="text-sm text-gray-500">{formatDate(post.createdAt)}</time>
        {isAuthenticated && onDelete && (
          <button
            onClick={() => onDelete(post.id)}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
}

