import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import FundCard from '../components/FundCard';
import LoadingSpinner from '../components/LoadingSpinner';
import useDebounce from '../hooks/useDebounce';

const HomePage = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (user) {
      api
        .get('/api/watchlist')
        .then((res) => setWatchlist(res.data.map((item) => item.schemeCode)))
        .catch(() => { });
    }
  }, [user]);

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    api
      .get(`/api/funds/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => setResults(res.data))
      .catch(() => setError('Failed to fetch results. Please try again.'))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Search Mutual Funds</h1>
        <p className="text-muted">Search by fund name or scheme code</p>
      </div>

      <div className="search-box">
        <input
          id="search-input"
          type="text"
          className="search-input"
          placeholder="e.g. HDFC Nifty 50, SBI Blue Chip..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className="results-area">
        {loading && <LoadingSpinner message="Searching funds..." />}

        {error && <p className="error-msg">{error}</p>}

        {!loading && searched && results.length === 0 && !error && (
          <p className="text-muted text-center">No funds found for "{query}"</p>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="results-count">{results.length} results found</p>
            <div className="fund-list">
              {results.map((fund) => (
                <FundCard
                  key={fund.schemeCode}
                  fund={fund}
                  isInWatchlist={watchlist.includes(String(fund.schemeCode))}
                />
              ))}
            </div>
          </>
        )}

        {!searched && (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>Start typing to search for mutual funds</p>
            {!user && (
              <p className="text-muted">
                <a href="/login">Login</a> to save funds to your watchlist
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
