import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  }
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand>Hardware Loan Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            {(role === 'Admin' || role ==='Employee') && (
            <LinkContainer to="/"><Nav.Link>Dashboard</Nav.Link></LinkContainer>
            )}
            {(role === 'Admin') && (
                <LinkContainer to="/categories"><Nav.Link>Categories</Nav.Link></LinkContainer>

            )}
            {(role === 'Admin' || role === 'Employee') && (
              <LinkContainer to="/assets"><Nav.Link>Assets</Nav.Link></LinkContainer>
            )}
            {role === 'Admin' && (
               <LinkContainer to="/employees"><Nav.Link>Employees</Nav.Link></LinkContainer>
            )}
            {(role === 'Admin' || role === 'Employee') && (
               <LinkContainer to="/customers"><Nav.Link>Customers</Nav.Link></LinkContainer>
              
            )}
            {(role === 'Admin' || role === 'Employee') && (
                <LinkContainer to="/loans"><Nav.Link>Loans</Nav.Link></LinkContainer>

            )}
            {(role === 'Admin') && (
               <LinkContainer to="/history"><Nav.Link>History</Nav.Link></LinkContainer>
            )}
             
            {/* <LinkContainer to="/login"><Nav.Link>Log in</Nav.Link></LinkContainer> */}
            {role === 'Customer' && (
                <LinkContainer to="/my-loans"><Nav.Link>Request Hardware</Nav.Link></LinkContainer>
            )}
          </Nav>
          <Nav>
            {role &&<Nav.Link onClick={handleLogout}>Logout</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}