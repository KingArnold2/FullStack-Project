import { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col, Alert, Badge } from 'react-bootstrap';
import { getAssets, createAsset, updateAsset, deleteAsset, markInRepair, markRetired, markAvailable } from '../api/assets';
import { getCategories } from '../api/categories';

const statusColors = {
  Available: 'success',
  OnLoan: 'primary',
  Overdue: 'danger',
  InRepair: 'warning',
  Retired: 'secondary',
};

function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);

  const [assetTag, setAssetTag] = useState('');
  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const loadAssets = () => {
    getAssets()
      .then(data => setAssets(data))
      .catch(err => console.error('Failed to fetch assets:', err));
  };

  useEffect(() => {
    loadAssets();
    getCategories().then(setCategories).catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const assetData = {
      assetTag,
      name,
      serialNumber,
      purchaseDate,
      categoryId: Number(categoryId),
    };

    try {
      if (editingId) {
        await updateAsset(editingId, assetData);
      } else {
        await createAsset(assetData);
      }
      resetForm();
      loadAssets();
    } catch (err) {
      setError(err.response?.data || 'Failed to save asset.');
    }
  };

  const handleStatusChange = async (id, action) => {
    setError(null);
    try {
      if (action === 'repair') await markInRepair(id);
      if (action === 'retire') await markRetired(id);
      if (action === 'available') await markAvailable(id);
      loadAssets();
    } catch (err) {
      setError(err.response?.data || 'Failed to change status.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setAssetTag('');
    setName('');
    setSerialNumber('');
    setPurchaseDate('');
    setCategoryId('');
  };

  const handleEditClick = (asset) => {
    setEditingId(asset.id);
    setAssetTag(asset.assetTag);
    setName(asset.name);
    setSerialNumber(asset.serialNumber || '');
    setPurchaseDate(asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '');
    setCategoryId(asset.categoryId);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this asset?')) return;

    setError(null);
    try {
      await deleteAsset(id);
      loadAssets();
    } catch (err) {
      setError(err.response?.data || 'Failed to delete asset. It may have loan history.');
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesCategory = filterCategory ? asset.categoryId === Number(filterCategory) : true;
    const matchesStatus = filterStatus ? asset.status === filterStatus : true;
    return matchesCategory && matchesStatus;
  });

  return (
    <div>
      <h1 className="mb-4">Assets</h1>

      <Form onSubmit={handleSubmit} className="mb-4 p-3 border rounded bg-light">
        <Row className="g-2">
          <Col md={2}>
            <Form.Label>Asset tag</Form.Label>
            <Form.Control value={assetTag} onChange={(e) => setAssetTag(e.target.value)} placeholder="LAP-001" required />
          </Col>
          <Col md={3}>
            <Form.Label>Name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="Dell Latitude 5440" required />
          </Col>
          <Col md={2}>
            <Form.Label>Serial number</Form.Label>
            <Form.Control value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="Optional" />
          </Col>
          <Col md={2}>
            <Form.Label>Purchase date</Form.Label>
            <Form.Control type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required />
          </Col>
          <Col md={2}>
            <Form.Label>Category</Form.Label>
            <Form.Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="">-- Select --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={1} className="d-flex align-items-end">
            <Button type="submit" variant="primary" className="w-100">
              {editingId ? 'Update' : 'Add'}
            </Button>
          </Col>
        </Row>
        {editingId && (
          <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={resetForm}>
            Cancel editing
          </Button>
        )}
      </Form>

      {error && <Alert variant="danger">{JSON.stringify(error)}</Alert>}

      <Row className="mb-3 g-2 align-items-end">
        <Col md={3}>
          <Form.Label>Filter by category</Form.Label>
          <Form.Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label>Filter by status</Form.Label>
          <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="Available">Available</option>
            <option value="OnLoan">On Loan</option>
            <option value="Overdue">Overdue</option>
            <option value="InRepair">In Repair</option>
            <option value="Retired">Retired</option>
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Tag</th>
            <th>Name</th>
            <th>Category</th>
            <th>Status</th>
            <th style={{ width: '160px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssets.map(asset => (
            <tr key={asset.id}>
              <td>{asset.assetTag}</td>
              <td>{asset.name}</td>
              <td>{asset.categoryName}</td>
              <td>
                <Badge bg={statusColors[asset.status] || 'secondary'}>{asset.status}</Badge>
              </td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => handleEditClick(asset)}>Edit</Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(asset.id)}>Delete</Button>{' '}
                {asset.status !== 'InRepair' && asset.status !== 'OnLoan' && (
                  <Button size="sm" variant="outline-warning" onClick={() => handleStatusChange(asset.id, 'repair')}>Repair</Button>
                )}{' '}
                {asset.status !== 'Retired' && asset.status !== 'OnLoan' && (
                  <Button size="sm" variant="outline-secondary" onClick={() => handleStatusChange(asset.id, 'retire')}>Retire</Button>
                )}{' '}
                {(asset.status === 'InRepair' || asset.status === 'Retired') && (
                  <Button size="sm" variant="outline-success" onClick={() => handleStatusChange(asset.id, 'available')}>Make Available</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default AssetsPage;