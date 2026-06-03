import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const WatchlistItem = ({ item, onRemoved }) => {
  const navigate = useNavigate();

  const handleRemove = async () => {
    try {
      await api.delete(`/api/watchlist/${item.schemeCode}`);
      toast.success('Removed from watchlist');
      onRemoved(item.schemeCode);
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  return (
    <div className="watchlist-item">
      <div className="watchlist-item-info" onClick={() => navigate(`/fund/${item.schemeCode}`)}>
        <p className="fund-name">{item.schemeName}</p>
        <p className="fund-code">Code: {item.schemeCode}</p>
      </div>
      <button className="btn btn-danger btn-sm" onClick={handleRemove}>
        Remove
      </button>
    </div>
  );
};

export default WatchlistItem;
