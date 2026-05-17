import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DriverDashboard from './pages/DriverDashboard';
import StreetDisplay from './pages/StreetDisplay';
import PersonalTracking from './pages/PersonalTracking';

function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated) return <Navigate to={user?.role === 'driver' ? '/driver' : '/dashboard'} replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#0F1629', color: '#F1F5F9', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '14px' },
          success: { iconTheme: { primary: '#10B981', secondary: '#0F1629' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#0F1629' } }
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/display" element={<StreetDisplay />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/personal" element={<ProtectedRoute><PersonalTracking /></ProtectedRoute>} />
        <Route path="/driver" element={<ProtectedRoute role="driver"><DriverDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
