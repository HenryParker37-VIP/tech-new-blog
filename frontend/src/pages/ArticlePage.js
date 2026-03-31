import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import AdBanner from '../components/AdBanner';

function ArticlePage() {
  const { slug } = useParams();
  const { data: article, loading, error } = useApi(`/articles/${slug}`);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">
          &larr; Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
        &larr; Back to all articles
      </Link>

      <article className="mt-6">
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}

        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-medium px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
            {article.source}
          </span>
          <span className="text-sm font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
            {article.category}
          </span>
          <span className="text-sm text-gray-400">
            {new Date(article.published_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>

        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          {article.description}
        </p>

        {/* Ad between content */}
        <div className="my-8">
          <AdBanner slot="article-inline" />
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            Read the full article at the original source:
          </p>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            Read Full Article &rarr;
          </a>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          {article.views} views
        </div>
      </article>

      {/* Sidebar Ad */}
      <div className="mt-8">
        <AdBanner slot="article-bottom" />
      </div>
    </div>
  );
}

export default ArticlePage;
