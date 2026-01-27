import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import UploadBillPage from './pages/UploadBillPage';
import SearchPage from './pages/SearchPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import BillDetailPage from './pages/BillDetailPage';
import BooksPage from './pages/BooksPage';
import DeliveriesPage from './pages/DeliveriesPage';
import NewCustomerPage from './pages/NewCustomerPage';
import LoginPage from './pages/LoginPage';

// Protected Route wrapper
function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const authData = localStorage.getItem('eagle_auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        setUser(parsed.user);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('eagle_auth');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (username) => {
    setUser(username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('eagle_auth');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#faf9f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTopColor: '#1e3a5f',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          {/* Public route - Login */}
          <Route
            path="/login"
            element={
              isAuthenticated
                ? <Navigate to="/" replace />
                : <LoginPage onLogin={handleLogin} />
            }
          />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <HomePage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UploadBillPage />
            </ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SearchPage />
            </ProtectedRoute>
          } />
          <Route path="/customer/new" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NewCustomerPage />
            </ProtectedRoute>
          } />
          <Route path="/customer/:id" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CustomerDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/bill/:id" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <BillDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/books" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <BooksPage />
            </ProtectedRoute>
          } />
          <Route path="/deliveries" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DeliveriesPage />
            </ProtectedRoute>
          } />

          {/* Catch all - redirect to home or login */}
          <Route path="*" element={
            <Navigate to={isAuthenticated ? "/" : "/login"} replace />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
