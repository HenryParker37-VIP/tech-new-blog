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

function ArticleCard({ article }) {
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-48 object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      <div className="p-5">
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
        <Link to={`/article/${article.slug}`}>
          <h2 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 mb-2 line-clamp-2">
            {article.title}
          </h2>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-3">
          {article.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
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
