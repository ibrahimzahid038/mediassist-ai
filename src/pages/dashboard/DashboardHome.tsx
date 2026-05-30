import { useAuth } from '../../context/AuthContext';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';

export default function DashboardHome() {
  const { user } = useAuth();

  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'client') return <ClientDashboard />;
  return <UserDashboard />;
}
