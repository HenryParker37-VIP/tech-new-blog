const mongoose = require('mongoose');

const scrapeLogSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
  },
  articles_found: {
    type: Number,
    default: 0,
  },
  articles_saved: {
    type: Number,
    default: 0,
  },
  scrape_errors: [{
    message: String,
    timestamp: { type: Date, default: Date.now },
  }],
  started_at: {
    type: Date,
    default: Date.now,
  },
  completed_at: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['running', 'completed', 'failed'],
    default: 'running',
  },
});

module.exports = mongoose.model('ScrapeLog', scrapeLogSchema);
