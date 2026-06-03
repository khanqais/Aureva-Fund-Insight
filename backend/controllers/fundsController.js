const axios = require('axios');
const NodeCache = require('node-cache');

const navCache = new NodeCache({ stdTTL: 3600 });
const MFAPI_BASE = 'https://api.mfapi.in';

//Route Used:  GET /api/funds/search?q=<query> 
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

// Route use karenge GET /api/funds/:schemeCode
const getFundDetail = async (req, res) => {
  const { schemeCode } = req.params;

  if (!schemeCode || isNaN(schemeCode)) {
    return res.status(400).json({ message: 'Invalid scheme code' });
  }


  const cached = navCache.get(schemeCode);
  if (cached) {
    return res.status(200).json({ ...cached, fromCache: true });
  }

  try {
    const response = await axios.get(`${MFAPI_BASE}/mf/${schemeCode}`);

    if (!response.data || !response.data.data) {
      return res.status(404).json({ message: 'Fund not found or no NAV data' });
    }


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
