const Article = require('../models/Article');

// GET /api/articles - published articles for the blog
exports.getPublishedArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const category = req.query.category;
    const search = req.query.search;

    const filter = { is_published: true };
    if (category && category !== 'all') filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Article.countDocuments(filter);
    const articles = await Article.find(filter)
      .sort({ published_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-__v');

    res.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/articles/:slug
exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      is_published: true,
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment views
    article.views += 1;
    await article.save();

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/articles/:slug/related
exports.getRelatedArticles = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      is_published: true,
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const related = await Article.find({
      _id: { $ne: article._id },
      is_published: true,
      category: article.category,
    })
      .sort({ published_at: -1 })
      .limit(3)
      .select('title slug image source category published_at views description');

    res.json(related);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/articles/categories/stats
exports.getCategoryStats = async (req, res) => {
  try {
    const stats = await Article.aggregate([
      { $match: { is_published: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
