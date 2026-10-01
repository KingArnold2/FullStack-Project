import { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categories';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const loadCategories = () => {
    getCategories()
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to fetch categories:', err));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingId) {
        await updateCategory(editingId, { name });
      } else {
        await createCategory({ name });
      }
      setName('');
      setEditingId(null);
      loadCategories();
    } catch (err) {
      setError(err.response?.data || 'Failed to save category.');
    }
  };

  const handleEditClick = (category) => {
    setEditingId(category.id);
    setName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;

    setError(null);
    try {
      await deleteCategory(id);
      loadCategories();
    } catch (err) {
      setError(err.response?.data || 'Failed to delete category. It may still have assets assigned to it.');
    }
  };

  return (
    <div>
      <h1 className="mb-4">Categories</h1>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Row className="align-items-end g-2">
          <Col xs="auto">
            <Form.Label>Category name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Laptops"
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
            <th style={{ width: '160px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => handleEditClick(cat)}>
                  Edit
                </Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(cat.id)}>
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

export default CategoriesPage;