const axios = require('axios');
const NodeCache = require('node-cache');

// Cache NAV responses for 1 hour (3600 seconds)
const navCache = new NodeCache({ stdTTL: 3600 });

const MFAPI_BASE = 'https://api.mfapi.in';

// @desc    Search mutual funds by name/code
// @route   GET /api/funds/search?q=<query>
// @access  Public
const searchFunds = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res
      .status(400)
      .json({ message: 'Search query must be at least 2 characters' });
  }

  try {
    const response = await axios.get(`${MFAPI_BASE}/mf/search?q=${encodeURIComponent(q)}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ message: 'Failed to search funds' });
  }
};

// @desc    Get historical NAV data for a scheme (proxied + cached)
// @route   GET /api/funds/:schemeCode
// @access  Public
const getFundDetail = async (req, res) => {
  const { schemeCode } = req.params;

  if (!schemeCode || isNaN(schemeCode)) {
    return res.status(400).json({ message: 'Invalid scheme code' });
  }

  // Check cache first
  const cached = navCache.get(schemeCode);
  if (cached) {
    return res.status(200).json({ ...cached, fromCache: true });
  }

  try {
    const response = await axios.get(`${MFAPI_BASE}/mf/${schemeCode}`);

    if (!response.data || !response.data.data) {
      return res.status(404).json({ message: 'Fund not found or no NAV data' });
    }

    // Store in cache
    navCache.set(schemeCode, response.data);

    res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'Fund not found' });
    }
    console.error('Fund detail error:', error.message);
    res.status(500).json({ message: 'Failed to fetch fund data' });
  }
};

module.exports = { searchFunds, getFundDetail };
