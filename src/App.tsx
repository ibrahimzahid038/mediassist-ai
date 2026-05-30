import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { MainLayout, DashboardLayout } from './layouts/Layouts';
import { FullScreenLoader } from './components/LoadingStates';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Dashboard pages
import DashboardHome from './pages/dashboard/DashboardHome';
import SymptomChecker from './pages/dashboard/SymptomChecker';
import ChatPage from './pages/dashboard/ChatPage';
import ReportsPage from './pages/dashboard/ReportsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import SettingsPage from './pages/dashboard/SettingsPage';
import NotificationsPage from './pages/dashboard/NotificationsPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import UserManagementPage from './pages/dashboard/UserManagementPage';
import EmergencyAlertsPage from './pages/dashboard/EmergencyAlertsPage';
import DatabasePage from './pages/dashboard/DatabasePage';
import SecurityPage from './pages/dashboard/SecurityPage';
import PatientSearchPage from './pages/dashboard/PatientSearchPage';

// Placeholder pages for sidebar links that don't have dedicated pages yet
import PlaceholderPage from './pages/PlaceholderPage';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes with MainLayout (Navbar + Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/features" element={<LandingPage />} />
        <Route path="/about" element={<LandingPage />} />
        <Route path="/contact" element={<PlaceholderPage title="Contact Us" description="Get in touch with MediAssist AI team for support, partnerships, and inquiries." />} />
        <Route path="/faq" element={<LandingPage />} />
      </Route>

      {/* Protected dashboard routes with DashboardLayout (Navbar + Sidebar) */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/symptoms" element={<SymptomChecker />} />
        <Route path="/dashboard/chat" element={<ChatPage />} />
        <Route path="/dashboard/reports" element={<ReportsPage />} />
        <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
        <Route path="/dashboard/users" element={<UserManagementPage />} />
        <Route path="/dashboard/emergencies" element={<EmergencyAlertsPage />} />
        <Route path="/dashboard/database" element={<DatabasePage />} />
        <Route path="/dashboard/security" element={<SecurityPage />} />
        <Route path="/dashboard/search" element={<PatientSearchPage />} />
        <Route path="/dashboard/notifications" element={<NotificationsPage />} />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
