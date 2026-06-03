import { useState, useEffect } from 'react';
import api from '../api/axios';
import WatchlistItem from '../components/WatchlistItem';
import LoadingSpinner from '../components/LoadingSpinner';

const WatchlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/api/watchlist')
      .then((res) => setItems(res.data))
      .catch(() => setError('Failed to load watchlist.'))
      .finally(() => setLoading(false));
  }, []);

  // Called by WatchlistItem when a fund is removed
  const handleRemoved = (schemeCode) => {
    setItems((prev) => prev.filter((item) => item.schemeCode !== schemeCode));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Watchlist</h1>
        <p className="text-muted">Click a fund to view its NAV chart</p>
      </div>

      {loading && <LoadingSpinner message="Loading watchlist..." />}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <p>Your watchlist is empty.</p>
          <p className="text-muted">
            Go to <a href="/">Search</a> and add funds you want to track.
          </p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="watchlist-list">
          {items.map((item) => (
            <WatchlistItem key={item._id} item={item} onRemoved={handleRemoved} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
