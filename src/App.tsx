import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import BookingHistoryPage from './pages/BookingHistoryPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="bookings" element={<BookingHistoryPage />} />

              {/* Fallback internal routes */}
              <Route path="artisans" element={<Navigate to="/users" replace />} />
              <Route path="finances" element={<div className="card" style={{ padding: '2rem' }}>Finance module coming soon.</div>} />
              <Route path="settings" element={<div className="card" style={{ padding: '2rem' }}>Settings module coming soon.</div>} />
            </Route>
          </Route>

          {/* Global Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
