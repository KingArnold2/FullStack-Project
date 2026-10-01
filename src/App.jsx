import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NavBar from './components/NavBar';
import CategoriesPage from './pages/CategoriesPage';
import AssetsPage from './pages/AssetsPage';
import EmployeesPage from './pages/EmployeesPage';
import CustomersPage from './pages/CustomersPage';
import LoansPage from './pages/LoansPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import MyLoansPage from './pages/MyLoansPage';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Container>
        <Routes>


          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<div className="ui-alert ui-alert--error">You do not have permission to view this page.</div>} />
          <Route path="/" element={<ProtectedRoute allowedRoles={['Admin', 'Employee']}><DashboardPage /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute allowedRoles = {['Admin']}><CategoriesPage /></ProtectedRoute>} />
          <Route path="/assets" element={<ProtectedRoute allowedRoles = {['Admin', 'Employee']}><AssetsPage /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute allowedRoles = {['Admin']}><EmployeesPage /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute allowedRoles = {['Admin', 'Employee']}><CustomersPage /></ProtectedRoute>} />
          <Route path="/loans" element={<ProtectedRoute allowedRoles = {['Admin', 'Employee']}><LoansPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute allowedRoles = {['Admin']}><HistoryPage /></ProtectedRoute>} />
          <Route path="/my-loans" element={<ProtectedRoute allowedRoles = {['Customer']}><MyLoansPage /></ProtectedRoute>} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;