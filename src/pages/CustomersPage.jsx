import { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../api/customers';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const loadCustomers = () => {
    getCustomers()
      .then((data) => setCustomers(data))
      .catch((err) => console.error('Failed to fetch customers', err));
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFullName('');
    setEmail('');
    setPhone('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const customerData = { fullName, email, phone };

    try {
      if (editingId) {
        await updateCustomer(editingId, customerData);
      } else {
        await createCustomer(customerData);
      }
      resetForm();
      loadCustomers();
    } catch (err) {
      setError(err.response?.data || 'Failed to save customer.');
    }
  };

  const handleEditClick = (customer) => {
    setEditingId(customer.id);
    setFullName(customer.fullName);
    setEmail(customer.email);
    setPhone(customer.phone);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;

    setError(null);
    try {
      await deleteCustomer(id);
      loadCustomers();
    } catch (err) {
      setError(err.response?.data || 'Failed to delete customer. They may still have loans on record');
    }
  };

  return (
    <div>
      <h1 className="mb-4">Customers</h1>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Row className="align-items-end g-2">
          <Col xs="auto">
            <Form.Label>Full name</Form.Label>
            <Form.Control
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              required
            />
          </Col>
          <Col xs="auto">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </Col>
          <Col xs="auto">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
            />
          </Col>
          <Col xs="auto">
            <Button type="submit" variant="primary">
              {editingId ? 'Update' : 'Create'}
            </Button>{' '}
            {editingId && (
              <Button type="button" variant="secondary" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
          </Col>
        </Row>
      </Form>

      {error && <Alert variant="danger">{JSON.stringify(error)}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th style={{ width: '160px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.fullName}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => handleEditClick(customer)}>
                  Edit
                </Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(customer.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
   