import { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { getActiveLoans, returnLoan } from '../api/loans';
import CreateLoanForm from '../components/CreateLoanForm';

function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState(null);

  const loadLoans = () => {
    getActiveLoans()
      .then(data => setLoans(data))
      .catch(err => console.error('Failed to fetch loans:', err));
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleReturn = async (loanId) => {
    setError(null);
    try {
      await returnLoan(loanId);
      loadLoans();
    } catch (err) {
      setError(err.response?.data || 'Failed to return this loan.');
    }
  };

  return (
    <div>
      <CreateLoanForm onLoanCreated={loadLoans} />

      <h1 className="mb-4 mt-5">Active Loans</h1>
      {error && <Alert variant="danger">{JSON.stringify(error)}</Alert>}

      {loans.length === 0 ? (
        <Alert variant="secondary">No active loans right now.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Customer</th>
              <th>Processed By</th>
              <th>Loan Date</th>
              <th>Due Date</th>
              <th style={{ width: '120px' }}></th>
            </tr>
          </thead>
          <tbody>
            {loans.map(loan => (
              <tr key={loan.id}>
                <td>{loan.assetName}</td>
                <td>{loan.customerName}</td>
                <td>{loan.employeeName}</td>
                <td>{new Date(loan.loanDate).toLocaleDateString()}</td>
                <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                <td>
                  <Button size="sm" variant="outline-success" onClick={() => handleReturn(loan.id)}>
                    Return
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default LoansPage;