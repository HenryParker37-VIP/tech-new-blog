import React from 'react';
import { Link } from 'react-router-dom';

const SOURCE_COLORS = {
  hackernews: 'bg-orange-100 text-orange-800',
  devto: 'bg-gray-100 text-gray-800',
  techcrunch: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
};

const CATEGORY_COLORS = {
  general: 'bg-blue-100 text-blue-800',
  ai: 'bg-purple-100 text-purple-800',
  web: 'bg-cyan-100 text-cyan-800',
  mobile: 'bg-pink-100 text-pink-800',
  devops: 'bg-teal-100 text-teal-800',
  security: 'bg-red-100 text-red-800',
  programming: 'bg-indigo-100 text-indigo-800',
  startups: 'bg-amber-100 text-amber-800',
};

const CATEGORY_PLACEHOLDERS = {
  ai: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=338&fit=crop',
  web: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=338&fit=crop',
  mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=338&fit=crop',
  devops: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=338&fit=crop',
  security: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=338&fit=crop',
  programming: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=338&fit=crop',
  startups: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=338&fit=crop',
  general: 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=600&h=338&fit=crop',
};

function ArticleCard({ article }) {
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const thumbnailSrc = article.image || CATEGORY_PLACEHOLDERS[article.category] || CATEGORY_PLACEHOLDERS.general;
  const fallbackSrc = CATEGORY_PLACEHOLDERS[article.category] || CATEGORY_PLACEHOLDERS.general;

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Thumbnail - 16:9 aspect ratio */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <img
          src={thumbnailSrc}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            if (e.target.src !== fallbackSrc) {
              e.target.src = fallbackSrc;
            }
          }}
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Badges and time */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${SOURCE_COLORS[article.source] || 'bg-gray-100 text-gray-800'}`}>
            {article.source}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${CATEGORY_COLORS[article.category] || 'bg-blue-100 text-blue-800'}`}>
            {article.category}
          </span>
          <span className="text-xs text-gray-400 ml-auto">
            {timeAgo(article.published_at)}
          </span>
        </div>

        {/* Title - exactly 2 lines */}
        <Link to={`/article/${article.slug}`}>
          <h2 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 mb-2 transition-colors"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: '1.5em',
                minHeight: '3em',
              }}>
            {article.title}
          </h2>
        </Link>

        {/* Description - exactly 3 lines */}
        <p className="text-sm text-gray-600"
           style={{
             display: '-webkit-box',
             WebkitLineClamp: 3,
             WebkitBoxOrient: 'vertical',
             overflow: 'hidden',
             lineHeight: '1.5em',
             minHeight: '4.5em',
           }}>
          {article.description}
        </p>

        {/* Footer - always pinned to bottom */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <Link
            to={`/article/${article.slug}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Read more &rarr;
          </Link>
          <span className="text-xs text-gray-400">{article.views} views</span>
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;
