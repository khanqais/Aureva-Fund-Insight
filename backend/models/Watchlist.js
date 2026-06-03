const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    schemeCode: {
      type: String,
      required: [true, 'Scheme code is required'],
    },
    schemeName: {
      type: String,
      required: [true, 'Scheme name is required'],
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent a user from adding the same scheme twice
watchlistSchema.index({ userId: 1, schemeCode: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
