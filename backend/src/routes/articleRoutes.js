const express = require('express');
const router = express.Router();
const {
  getPublishedArticles,
  getArticleBySlug,
  getCategoryStats,
} = require('../controllers/articleController');

router.get('/', getPublishedArticles);
router.get('/categories/stats', getCategoryStats);
router.get('/:slug', getArticleBySlug);

module.exports = router;
