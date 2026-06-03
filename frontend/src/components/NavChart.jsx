import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const parseDate = (str) => {
  const [dd, mm, yyyy] = str.split('-');
  return new Date(`${yyyy}-${mm}-${dd}`);
};

const RANGES = [
  { label: '1Y', years: 1 },
  { label: '3Y', years: 3 },
  { label: '5Y', years: 5 },
  { label: 'All', years: null },
];

const NavChart = ({ data }) => {
  const [range, setRange] = useState('5Y');

  const chartData = useMemo(() => {
    const sorted = [...data]
      .map((entry) => ({
        date: parseDate(entry.date),
        nav: parseFloat(entry.nav),
      }))
      .filter((entry) => !isNaN(entry.nav))
      .sort((a, b) => a.date - b.date);

    const selectedRange = RANGES.find((r) => r.label === range);
    if (selectedRange.years === null) return sorted;

    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - selectedRange.years);
    return sorted.filter((entry) => entry.date >= cutoff);
  }, [data, range]);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
  };

  if (chartData.length === 0) {
    return <p className="text-muted">No NAV data available for this range.</p>;
  }

  return (
    <div className="chart-wrapper">
      <div className="chart-ranges">
        {RANGES.map((r) => (
          <button
            key={r.label}
            className={`range-btn ${range === r.label ? 'active' : ''}`}
            onClick={() => setRange(r.label)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            minTickGap={40}
          />
          <YAxis
            tickFormatter={(v) => `₹${v.toFixed(0)}`}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            width={70}
          />
          <Tooltip
            formatter={(value) => [`₹${parseFloat(value).toFixed(4)}`, 'NAV']}
            labelFormatter={(date) =>
              date instanceof Date ? date.toLocaleDateString('en-IN') : ''
            }
          />
          <Line
            type="monotone"
            dataKey="nav"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NavChart;
