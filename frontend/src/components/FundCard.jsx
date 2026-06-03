import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const FundCard = ({ fund, isInWatchlist }) => {
  const navigate = useNavigate();

  const handleAdd = async () => {
    try {
      await api.post('/api/watchlist', {
        schemeCode: String(fund.schemeCode),
        schemeName: fund.schemeName,
      });
      toast.success('Added to watchlist!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add';
      toast.error(msg);
    }
  };

  return (
    <div className="fund-card">
      <div className="fund-card-info">
        <p className="fund-name">{fund.schemeName}</p>
        <p className="fund-code">Code: {fund.schemeCode}</p>
      </div>
      <div className="fund-card-actions">
        <button
          className="btn btn-outline btn-sm"
          onClick={() => navigate(`/fund/${fund.schemeCode}`)}
        >
          View
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleAdd}
          disabled={isInWatchlist}
        >
          {isInWatchlist ? '✓ Added' : '+ Watchlist'}
        </button>
      </div>
    </div>
  );
};

export default FundCard;
