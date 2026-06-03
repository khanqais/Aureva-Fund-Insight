const express = require('express');
const router = express.Router();
const { searchFunds, getFundDetail } = require('../controllers/fundsController');

// GET /api/funds/search?q=<query>
router.get('/search', searchFunds);

// GET /api/funds/:schemeCode
router.get('/:schemeCode', getFundDetail);

module.exports = router;
