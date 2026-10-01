import { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from '../api/employees';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const loadEmployees = () => {
    getEmployees()
      .then(data => setEmployees(data))
      .catch(err => console.error('Failed to fetch employees', err));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const employeeData = { fullName, email, department };

    try {
      if (editingId) {
        await updateEmployee(editingId, employeeData);
      } else {
        await createEmployee(employeeData);
      }
      resetForm();
      loadEmployees();
    } catch (err) {
      setError(err.response?.data || 'Failed to save employee.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFullName('');
    setEmail('');
    setDepartment('');
  };

  const handleEditClick = (employee) => {
    setEditingId(employee.id);
    setFullName(employee.fullName);
    setEmail(employee.email);
    setDepartment(employee.department);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;

    setError(null);
    try {
      await deleteEmployee(id);
      loadEmployees();
    } catch (err) {
      setError(err.response?.data || 'Failed to delete employee. They may still have loans on record');
    }
  };

  return (
    <div>
      <h1 className="mb-4">Employees</h1>

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
            <Form.Label>Department</Form.Label>
            <Form.Control
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Department"
              required
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
            <th>Department</th>
            <th style={{ width: '160px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.fullName}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => handleEditClick(employee)}>
                  Edit
                </Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(employee.id)}>
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