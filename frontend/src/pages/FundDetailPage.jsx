import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import NavChart from '../components/NavChart';
import LoadingSpinner from '../components/LoadingSpinner';

const FundDetailPage = () => {
  const { schemeCode } = useParams();
  const navigate = useNavigate();

  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    api
      .get(`/api/funds/${schemeCode}`)
      .then((res) => setFund(res.data))
      .catch((err) => {
        if (err.response?.status === 404) {
          setError('Fund not found.');
        } else {
          setError('Failed to load fund data. Please try again.');
        }
      })
      .finally(() => setLoading(false));
  }, [schemeCode]);

  if (loading) return <LoadingSpinner message="Loading fund data..." />;

  if (error) {
    return (
      <div className="page">
        <p className="error-msg">{error}</p>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    );
  }

  const meta = fund?.meta;
  const navData = fund?.data || [];

  const latestNav = navData.length > 0 ? navData[0] : null;

  return (
    <div className="page">
      <button className="btn btn-outline btn-sm back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="fund-detail-header">
        <h1>{meta?.scheme_name || 'Fund Detail'}</h1>
        <div className="fund-meta">
          {meta?.fund_house && <span className="badge">{meta.fund_house}</span>}
          {meta?.scheme_type && <span className="badge">{meta.scheme_type}</span>}
          {meta?.scheme_category && <span className="badge">{meta.scheme_category}</span>}
        </div>
        {latestNav && (
          <div className="nav-highlight">
            <span className="nav-value">₹{parseFloat(latestNav.nav).toFixed(4)}</span>
            <span className="nav-date">as of {latestNav.date}</span>
          </div>
        )}
      </div>


      <div className="chart-section">
        <h2>NAV History</h2>
        {navData.length === 0 ? (
          <p className="text-muted">No historical NAV data available.</p>
        ) : (
          <NavChart data={navData} />
        )}
      </div>

      {meta && (
        <div className="fund-info-section">
          <h2>Scheme Details</h2>
          <table className="info-table">
            <tbody>
              {meta.scheme_code && (
                <tr>
                  <td>Scheme Code</td>
                  <td>{meta.scheme_code}</td>
                </tr>
              )}
              {meta.fund_house && (
                <tr>
                  <td>Fund House</td>
                  <td>{meta.fund_house}</td>
                </tr>
              )}
              {meta.scheme_type && (
                <tr>
                  <td>Type</td>
                  <td>{meta.scheme_type}</td>
                </tr>
              )}
              {meta.scheme_category && (
                <tr>
                  <td>Category</td>
                  <td>{meta.scheme_category}</td>
                </tr>
              )}
              {navData.length > 0 && (
                <tr>
                  <td>Data Points</td>
                  <td>{navData.length} days of history</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FundDetailPage;
