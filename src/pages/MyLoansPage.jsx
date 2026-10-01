import {useEffect, useState} from 'react';
import {getAssets} from '../api/assets';
import {createLoan, getMyLoans} from '../api/loans';
import '../styles/MyLoansPage.css';

export default function MyLoansPage() {
const [assets, setAssets] = useState([]);
const [myLoans, setMyLoans] = useState([]);
const[assetId, setAssetId] = useState('');
const[dueDate, setDueDate] = useState('');
const[error, setError] = useState('');

const load = () => {
    getAssets().then(setAssets).catch((err) => setError(err.message));
    getMyLoans().then(setMyLoans).catch((err) => setError(err.message));
};

useEffect(() => {load();}, []);

const availableAssets = assets.filter((asset) => asset.status === 'Available');

const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try{
        await createLoan({ assetId: Number(assetId), dueDate });
        setAssetId('');
        setDueDate('');
        load();

    }catch(err){
        setError(err.response?.data || 'Failed to request loan. ');
    }
};

return (
    <div className="my-loans">
    <h1 className="ui-page-title">Request Hardware</h1>

    <form onSubmit={handleSubmit} className="my-loans-form">
    <div className="ui-field">
    <label>Asset</label>
    <select className="ui-input" value={assetId} onChange={(e) => setAssetId(e.target.value)} required>
    <option value="">Select an available item</option>
    {availableAssets.map((asset) => (
        <option key={asset.id} value={asset.id}>
            {asset.name}
        </option>
    ))}
    </select>
    </div>
    <div className="ui-field">
    <label>Due Date</label>
    <input type='date' className="ui-select" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
    </div>
   <button type="submit" className="my-loans-button">Request Loan</button>
   </form>
   {error && <div className="ui-alert ui-alert--error">{JSON.stringify(error)}</div>}
   <h2 className="ui-page-title" style={{ marginTop: '2rem' }}>My Loans</h2>
   {myLoans.length === 0 ? (
    <div className="ui-alert">You have no loans.</div>
   ):(
     <div className="ui-table-wrap">
    <table className="ui-table">
        <thead>
            <tr>
                <th>Item</th>
                <th>Loan Date</th>
                <th>Due Date</th>
                <th>Returned</th>
            </tr>
        </thead>
        <tbody>
            {myLoans.map((loan) => (
                <tr key={loan.id}>
                    <td>{loan.assetName}</td>
                    <td>{new Date(loan.loanDate).toLocaleDateString()}</td>
                    <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                    <td>{loan.returnedDate ? new Date(loan.returnedDate).toLocaleDateString() : 'No'}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

 