const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
  getAllArticles,
  publishArticle,
  unpublishArticle,
  deleteArticle,
  triggerScrape,
  getStats,
} = require('../controllers/adminController');

// Login endpoint (no auth required)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const expectedUser = process.env.ADMIN_USER || 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD || 'techpulse2024';

  if (username === expectedUser && password === expectedPass) {
    const token = Buffer.from(`${username}:${password}`).toString('base64');
    res.json({ token, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Protected admin routes
router.get('/articles', adminAuth, getAllArticles);
router.post('/articles/:id/publish', adminAuth, publishArticle);
router.post('/articles/:id/unpublish', adminAuth, unpublishArticle);
router.delete('/articles/:id', adminAuth, deleteArticle);
router.post('/scrape', adminAuth, triggerScrape);
router.get('/stats', adminAuth, getStats);

module.exports = router;
