const mongoose = require('mongoose');

const FeedSchema = new mongoose.Schema({
  platform: { type: String, enum: ['reddit', 'twitter'], required: true },
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  saved: { type: Boolean, default: false },
  reported: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feed', FeedSchema);
