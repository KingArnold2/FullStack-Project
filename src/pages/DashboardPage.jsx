import { useEffect, useState } from 'react';
import { getDashboard } from '../api/dashboard';
import './DashboardPage.css';

function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(err => {
        console.error('Failed to load dashboard:', err);
        setError('Could not load dashboard data.');
      });
  }, []);

  if (error) return <div className="dash-error">{error}</div>;
  if (!data) return <p className="dash-loading">Loading...</p>;

  // Longest bar = 100% width; the others scale relative to it.
  // The "1" fallback prevents dividing by zero when every count is 0.
  const maxCategoryCount = Math.max(...data.categoryCounts.map(c => c.count), 1);

  return (
    <div className="dash">
      <h1 className="dash-title">Dashboard</h1>

      <section className="dash-grid dash-grid--two">
        <div className="dash-card">
          <span className="dash-label">Total Assets</span>
          <span className="dash-number">{data.totalAssets}</span>
        </div>
        <div className="dash-card">
          <span className="dash-label">Active Loans</span>
          <span className="dash-number">{data.activeLoans}</span>
        </div>
      </section>

      <h2 className="dash-heading">Assets by Status</h2>
      <section className="dash-grid dash-grid--status">
        {data.statusCounts.map(s => (
          <div
            key={s.status}
            className={`dash-card dash-status dash-status--${s.status.toLowerCase()}`}
          >
            <span className="dash-pill">{s.status}</span>
            <span className="dash-number dash-number--sm">{s.count}</span>
          </div>
        ))}
      </section>

      <h2 className="dash-heading">Assets by Category</h2>
      <div className="dash-card">
        <ul className="dash-bars">
          {data.categoryCounts.map(c => (
            <li key={c.categoryName} className="dash-bar-row">
              <span className="dash-bar-label">{c.categoryName}</span>
              <div className="dash-bar-track">
                <div
                  className="dash-bar-fill"
                  style={{ width: `${(c.count / maxCategoryCount) * 100}%` }}
                />
              </div>
              <span className="dash-bar-count">{c.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DashboardPage;