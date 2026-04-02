const express = require('express');
const router = express.Router();
const {
  getPublishedArticles,
  getArticleBySlug,
  getRelatedArticles,
  getCategoryStats,
} = require('../controllers/articleController');

router.get('/', getPublishedArticles);
router.get('/categories/stats', getCategoryStats);
router.get('/:slug/related', getRelatedArticles);
router.get('/:slug', getArticleBySlug);

module.exports = router;
