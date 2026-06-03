const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require('../controllers/watchlistController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

const addValidation = [
  body('schemeCode').notEmpty().withMessage('Scheme code is required'),
  body('schemeName').notEmpty().withMessage('Scheme name is required'),
];

router.get('/', getWatchlist);
router.post('/', addValidation, addToWatchlist);
router.delete('/:schemeCode', removeFromWatchlist);

module.exports = router;
