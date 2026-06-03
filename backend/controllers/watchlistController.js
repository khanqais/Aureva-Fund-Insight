const Watchlist = require('../models/Watchlist');
const { validationResult } = require('express-validator');

//Route use karenge GET /api/watchlist
const getWatchlist = async (req, res) => {
  try {
    const items = await Watchlist.find({ userId: req.user._id }).sort({
      addedAt: -1,
    });
    res.status(200).json(items);
  } catch (error) {
    console.error('Get watchlist error:', error.message);
    res.status(500).json({ message: 'Server error fetching watchlist' });
  }
};

// Route use karenge POST /api/watchlist
const addToWatchlist = async (req, res) => {


  const { schemeCode, schemeName } = req.body;

  try {
    const item = await Watchlist.create({
      userId: req.user._id,
      schemeCode,
      schemeName,
    });
    res.status(201).json(item);
  } catch (error) {
    // MongoDB duplicate key error code
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: 'This fund is already in your watchlist' });
    }
    console.error('Add watchlist error:', error.message);
    res.status(500).json({ message: 'Server error adding to watchlist' });
  }
};

// @desc    Remove a scheme from the watchlist
// @route   DELETE /api/watchlist/:schemeCode
// @access  Private
const removeFromWatchlist = async (req, res) => {
  try {
    const deleted = await Watchlist.findOneAndDelete({
      userId: req.user._id,
      schemeCode: req.params.schemeCode,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: 'Fund not found in your watchlist' });
    }

    res.status(200).json({ message: 'Fund removed from watchlist' });
  } catch (error) {
    console.error('Remove watchlist error:', error.message);
    res.status(500).json({ message: 'Server error removing from watchlist' });
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
