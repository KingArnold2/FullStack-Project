import { useEffect, useState } from 'react';
import { getLoanHistory } from '../api/loanHistory';

// The API sends UTC times without a "Z", and JavaScript would read that as
// local time. Adding the Z tells it the value is UTC, so it converts correctly.
const formatTimestamp = (ts) =>
  new Date(ts.endsWith('Z') ? ts : ts + 'Z').toLocaleString();

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [action, setAction] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    getLoanHistory(action)
      .then(setHistory)
      .catch(err => {
        console.error('Failed to fetch history:', err);
        setError('Could not load loan history.');
      });
  }, [action]);

  return (
    <div>
      <h1 className="ui-page-title">Loan History</h1>

      <div className="ui-field">
        <label htmlFor="action-filter">Filter by action</label>
        <select
          id="action-filter"
          className="ui-select"
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          <option value="">All actions</option>
          <option value="Loaned">Loaned</option>
          <option value="Returned">Returned</option>
          <option value="MarkedOverdue">Marked overdue</option>
        </select>
      </div>

      {error && <div className="ui-alert ui-alert--error">{error}</div>}

      {history.length === 0 ? (
        <div className="ui-alert">No history entries found.</div>
      ) : (
        <div className="ui-table-wrap">
          <table className="ui-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Action</th>
                <th>Asset</th>
                <th>Employee</th>
              </tr>
            </thead>
            <tbody>
              {history.map(h => (
                <tr key={h.id}>
                  <td>{formatTimestamp(h.timestamp)}</td>
                  <td>
                    <span className={`ui-badge ui-badge--${h.action.toLowerCase()}`}>
                      {h.action}
                    </span>
                  </td>
                  <td>{h.assetName}</td>
                  <td>{h.employeeName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;