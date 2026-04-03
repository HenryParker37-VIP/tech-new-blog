import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import AdBanner from '../components/AdBanner';

const CATEGORY_PLACEHOLDERS = {
  ai: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=600&fit=crop',
  web: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&h=600&fit=crop',
  mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=600&fit=crop',
  devops: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&h=600&fit=crop',
  security: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&h=600&fit=crop',
  programming: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop',
  startups: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=600&fit=crop',
  general: 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=1200&h=600&fit=crop',
};

const SOURCE_LABELS = {
  hackernews: 'Hacker News',
  devto: 'Dev.to',
  techcrunch: 'TechCrunch',
  medium: 'Medium',
};

function estimateReadTime(text) {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function RelatedImage({ item }) {
  const [failed, setFailed] = React.useState(false);
  const fallback = CATEGORY_PLACEHOLDERS[item.category] || CATEGORY_PLACEHOLDERS.general;
  const src = (!failed && item.image) ? item.image : fallback;

  return (
    <img
      src={src}
      alt=""
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => { if (!failed) setFailed(true); }}
    />
  );
}

function ArticlePage() {
  const { slug } = useParams();
  const { data: article, loading, error } = useApi(`/articles/${slug}`);
  const [related, setRelated] = useState([]);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || '/api';

  const fetchRelated = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/articles/${slug}/related`);
      if (res.ok) {
        const data = await res.json();
        setRelated(data);
      }
    } catch {
      // silently fail
    }
  }, [slug, API_BASE]);

  useEffect(() => {
    if (article) {
      fetchRelated();
    }
  }, [article, fetchRelated]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(article.title);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

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

  const readTime = estimateReadTime(`${article.title} ${article.description} ${article.content}`);
  const coverImage = (!imgError && article.image) ? article.image : CATEGORY_PLACEHOLDERS[article.category] || CATEGORY_PLACEHOLDERS.general;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back navigation */}
      <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-6">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to all articles
      </Link>

      <article>
        {/* Cover Image */}
        <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8 bg-gray-200">
          <img
            src={coverImage}
            alt=""
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-sm font-medium px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
            {SOURCE_LABELS[article.source] || article.source}
          </span>
          <span className="text-sm font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
            {article.category}
          </span>
          <span className="text-sm text-gray-400">
            {new Date(article.published_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </span>
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readTime} min read
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
          {article.description}
        </p>

        {/* Share buttons */}
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-500">Share:</span>
          <button
            onClick={shareOnTwitter}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 text-sm font-medium transition-colors"
            title="Share on X (Twitter)"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Post
          </button>
          <button
            onClick={shareOnLinkedIn}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
            title="Share on LinkedIn"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Share
          </button>
          <button
            onClick={handleCopyLink}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              copied
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Copy link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {copied ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              )}
            </svg>
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>

        {/* Ad between content */}
        <div className="my-8">
          <AdBanner slot="article-inline" />
        </div>

        {/* CTA to read full article */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-8 text-center">
          <p className="text-gray-700 mb-2 text-lg">
            Want to read the full article?
          </p>
          <p className="text-sm text-gray-500 mb-5">
            Continue reading at {SOURCE_LABELS[article.source] || article.source}
          </p>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-lg transition-colors shadow-sm"
          >
            Read Full Article
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Views */}
        <div className="mt-6 text-sm text-gray-400 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {article.views} views
        </div>
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((item) => (
              <Link
                key={item._id}
                to={`/article/${item.slug}`}
                className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-gray-200 overflow-hidden">
                  <RelatedImage item={item} />
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-indigo-600 capitalize">{item.category}</span>
                  <h3 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(item.published_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric',
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Ad */}
      <div className="mt-8">
        <AdBanner slot="article-bottom" />
      </div>
    </div>
  );
}

export default ArticlePage;
