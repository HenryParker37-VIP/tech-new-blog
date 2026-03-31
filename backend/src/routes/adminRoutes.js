const express = require('express');
const router = express.Router();
const {
  getAllArticles,
  publishArticle,
  unpublishArticle,
  deleteArticle,
  triggerScrape,
  getStats,
} = require('../controllers/adminController');

router.get('/articles', getAllArticles);
router.post('/articles/:id/publish', publishArticle);
router.post('/articles/:id/unpublish', unpublishArticle);
router.delete('/articles/:id', deleteArticle);
router.post('/scrape', triggerScrape);
router.get('/stats', getStats);

module.exports = router;
