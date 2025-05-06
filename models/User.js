const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  credits: { type: Number, default: 0 },
  lastLogin: { type: Date }, // 🆕 Track daily login for credits
  savedFeeds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feed' }],
  recentActivity: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
