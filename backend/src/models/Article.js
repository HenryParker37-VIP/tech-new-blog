const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    required: true,
    unique: true,
  },
  source: {
    type: String,
    required: true,
    enum: ['hackernews', 'devto', 'techcrunch', 'medium'],
  },
  image: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'general',
    enum: ['general', 'ai', 'web', 'mobile', 'devops', 'security', 'programming', 'startups'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  is_published: {
    type: Boolean,
    default: false,
  },
  scraped_at: {
    type: Date,
    default: Date.now,
  },
  published_at: {
    type: Date,
    default: null,
  },
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

articleSchema.index({ is_published: 1, published_at: -1 });
articleSchema.index({ source: 1 });

module.exports = mongoose.model('Article', articleSchema);
