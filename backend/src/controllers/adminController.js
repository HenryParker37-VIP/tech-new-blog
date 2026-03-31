const Article = require('../models/Article');
const ScrapeLog = require('../models/ScrapeLog');
const { runAllScrapers, autoPublishArticles } = require('../scrapers');

// GET /api/admin/articles - all articles (published + unpublished)
exports.getAllArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status; // 'published', 'unpublished', or undefined for all

    const filter = {};
    if (status === 'published') filter.is_published = true;
    if (status === 'unpublished') filter.is_published = false;

    const total = await Article.countDocuments(filter);
    const articles = await Article.find(filter)
      .sort({ scraped_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      articles,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/admin/articles/:id/publish
exports.publishArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });

    article.is_published = true;
    article.published_at = new Date();
    await article.save();

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/admin/articles/:id/unpublish
exports.unpublishArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });

    article.is_published = false;
    article.published_at = null;
    await article.save();

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/admin/articles/:id
exports.deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/admin/scrape - trigger manual scrape
exports.triggerScrape = async (req, res) => {
  try {
    const results = await runAllScrapers();
    const published = await autoPublishArticles();
    res.json({ scrapeResults: results, autoPublished: published });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const totalArticles = await Article.countDocuments();
    const publishedArticles = await Article.countDocuments({ is_published: true });
    const totalViews = await Article.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } },
    ]);

    const sourceStats = await Article.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentLogs = await ScrapeLog.find()
      .sort({ started_at: -1 })
      .limit(10);

    res.json({
      totalArticles,
      publishedArticles,
      unpublishedArticles: totalArticles - publishedArticles,
      totalViews: totalViews[0]?.total || 0,
      sourceStats,
      recentLogs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
