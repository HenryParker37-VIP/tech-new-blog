import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import ArticleCard from '../components/ArticleCard';
import AdBanner from '../components/AdBanner';

const CATEGORIES = ['all', 'ai', 'web', 'mobile', 'devops', 'security', 'programming', 'startups', 'general'];

function HomePage() {
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const queryParams = new URLSearchParams({ page, limit: 12 });
  if (category !== 'all') queryParams.set('category', category);
  if (search) queryParams.set('search', search);

  const { data, loading, error } = useApi(`/articles?${queryParams}`);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Latest Tech News
        </h1>
        <p className="text-lg text-gray-600">
          Curated from the best sources, updated every 6 hours
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 max-w-xl mx-auto">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search articles..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Top Ad */}
      <div className="mb-8">
        <AdBanner slot="top-banner" style={{ minHeight: '90px' }} />
      </div>

      {/* Articles Grid */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Loading articles...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load articles. Make sure the backend is running.</p>
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.articles.map((article, index) => (
              <React.Fragment key={article._id}>
                <ArticleCard article={article} />
                {/* Insert ad after every 6th article */}
                {(index + 1) % 6 === 0 && (
                  <div className="col-span-full">
                    <AdBanner slot={`inline-${index}`} style={{ minHeight: '90px' }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {data.articles.length === 0 && (
            <p className="text-center text-gray-500 py-12">No articles found.</p>
          )}

          {/* Pagination */}
          {data.pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {page} of {data.pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.pages, p + 1))}
                disabled={page === data.pagination.pages}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Bottom Ad */}
      <div className="mt-8">
        <AdBanner slot="bottom-banner" style={{ minHeight: '90px' }} />
      </div>
    </div>
  );
}

export default HomePage;
