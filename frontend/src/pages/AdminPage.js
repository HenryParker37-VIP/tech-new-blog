import React, { useState, useCallback, useEffect } from 'react';
import { useApi, apiPost, apiDelete } from '../hooks/useApi';

const CATEGORIES = ['all', 'ai', 'web', 'mobile', 'devops', 'security', 'programming', 'startups', 'general'];

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await apiPost('/admin/login', { username, password });
      localStorage.setItem('admin_token', result.token);
      onLogin();
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-lg border p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to access the dashboard</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Confirm Action</h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = type === 'error'
    ? 'bg-red-50 border-red-200 text-red-800'
    : 'bg-green-50 border-green-200 text-green-800';

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border shadow-lg ${colors} animate-slide-in`}>
      <div className="flex items-center gap-2">
        {type === 'error' ? (
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('admin_token'));
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [scraping, setScraping] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const queryParams = new URLSearchParams({ page, limit: 20 });
  if (statusFilter) queryParams.set('status', statusFilter);
  if (categoryFilter && categoryFilter !== 'all') queryParams.set('category', categoryFilter);

  const { data: statsData, refetch: refetchStats, error: statsError } = useApi('/admin/stats', { auth: true, skip: !isAuthenticated });
  const { data: articlesData, refetch: refetchArticles, error: articlesError } = useApi(`/admin/articles?${queryParams}`, { auth: true, skip: !isAuthenticated });

  // If we get a 401, clear auth
  useEffect(() => {
    if (statsError === 'HTTP 401' || articlesError === 'HTTP 401') {
      localStorage.removeItem('admin_token');
      setIsAuthenticated(false);
    }
  }, [statsError, articlesError]);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ message: msg, type });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  const handleScrape = () => {
    setConfirmDialog({
      message: 'This will run all scrapers and auto-publish new articles. Continue?',
      onConfirm: async () => {
        setConfirmDialog(null);
        setScraping(true);
        try {
          const result = await apiPost('/admin/scrape');
          showToast(`Scrape complete! Auto-published ${result.autoPublished} articles.`);
          refetchStats();
          refetchArticles();
        } catch (err) {
          showToast(`Scrape failed: ${err.message}`, 'error');
        } finally {
          setScraping(false);
        }
      },
    });
  };

  const handlePublish = async (id) => {
    try {
      await apiPost(`/admin/articles/${id}/publish`);
      showToast('Article published');
      refetchArticles();
      refetchStats();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await apiPost(`/admin/articles/${id}/unpublish`);
      showToast('Article unpublished');
      refetchArticles();
      refetchStats();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      message: 'Are you sure you want to delete this article? This cannot be undone.',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await apiDelete(`/admin/articles/${id}`);
          showToast('Article deleted');
          refetchArticles();
          refetchStats();
        } catch (err) {
          showToast(`Error: ${err.message}`, 'error');
        }
      },
    });
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm dialog */}
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      {statsData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">{statsData.totalArticles}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Articles Today</p>
                <p className="text-2xl font-bold text-green-600">{statsData.articlesToday}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="text-2xl font-bold text-indigo-600">{statsData.totalViews.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Sources Count</p>
                <p className="text-2xl font-bold text-amber-600">{statsData.sourcesCount}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Source Stats */}
      {statsData?.sourceStats && (
        <div className="bg-white p-5 rounded-xl shadow-sm border mb-8">
          <h2 className="text-lg font-semibold mb-3">Articles by Source</h2>
          <div className="flex flex-wrap gap-4">
            {statsData.sourceStats.map((s) => (
              <div key={s._id} className="flex items-center gap-2">
                <span className="font-medium capitalize">{s._id}:</span>
                <span className="text-gray-600">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={handleScrape}
          disabled={scraping}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 transition-colors"
        >
          {scraping ? (
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Scraping...
            </span>
          ) : 'Run Scraper Now'}
        </button>

        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>

      {/* Recent Scrape Logs */}
      {statsData?.recentLogs?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
          <h2 className="text-lg font-semibold p-5 border-b">Recent Scrape Logs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Source</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Found</th>
                  <th className="text-left p-3">Saved</th>
                  <th className="text-left p-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {statsData.recentLogs.map((log) => (
                  <tr key={log._id} className="border-t">
                    <td className="p-3 capitalize">{log.source}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === 'completed' ? 'bg-green-100 text-green-800' :
                        log.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3">{log.articles_found}</td>
                    <td className="p-3">{log.articles_saved}</td>
                    <td className="p-3">{new Date(log.started_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Articles Table */}
      {articlesData && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <h2 className="text-lg font-semibold p-5 border-b">
            Articles
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({articlesData.pagination.total} total)
            </span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Title</th>
                  <th className="text-left p-3">Source</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Views</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articlesData.articles.map((article) => (
                  <tr key={article._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 max-w-xs">
                      <div className="truncate" title={article.title}>
                        {article.title}
                      </div>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                        article.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-3 capitalize">{article.source}</td>
                    <td className="p-3 capitalize">{article.category}</td>
                    <td className="p-3 text-gray-500 whitespace-nowrap">
                      {new Date(article.scraped_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">{article.views}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {article.is_published ? (
                          <button
                            onClick={() => handleUnpublish(article._id)}
                            className="text-yellow-600 hover:text-yellow-800 text-xs font-medium"
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublish(article._id)}
                            className="text-green-600 hover:text-green-800 text-xs font-medium"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {articlesData.pagination.pages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm hover:bg-gray-300"
              >
                Prev
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                {page} / {articlesData.pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(articlesData.pagination.pages, p + 1))}
                disabled={page === articlesData.pagination.pages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPage;
