import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, FileText, MessageSquare, AlertTriangle, Activity, TrendingUp,
  Shield, Server, Clock, Zap, ArrowUpRight, MoreVertical
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import { getGreeting, getInitials } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { getAllUsers, getAllReports, supabase } from '../../lib/supabase';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const RISK_COLORS = ['#10b981', '#f59e0b', '#f97316', '#ef4444'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const usersData = await getAllUsers();
      setUsers(usersData || []);

      const reportsData = await getAllReports();
      setReports(reportsData || []);

      // Fetch emergency alerts
      const { data: alertsData } = await supabase
        .from('emergency_alerts')
        .select('*')
        .order('created_at', { ascending: false });
      setAlerts(alertsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskDistribution = () => {
    const counts = { low: 0, medium: 0, high: 0, critical: 0 };
    reports.forEach((r) => {
      const level = r.risk_level as keyof typeof counts;
      if (counts[level] !== undefined) {
        counts[level]++;
      }
    });

    return [
      { level: 'low', count: counts.low },
      { level: 'medium', count: counts.medium },
      { level: 'high', count: counts.high },
      { level: 'critical', count: counts.critical },
    ];
  };

  const getMonthlyUserActivity = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const map = days.map((d) => ({ date: d, count: 0 }));

    users.forEach((u) => {
      const date = new Date(u.created_at);
      const dayName = days[date.getDay()];
      const item = map.find((x) => x.date === dayName);
      if (item) item.count += 1;
    });

    return map;
  };

  const getAIUsageMetrics = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const map = days.map((d) => ({
      date: d,
      symptom_checks: 0,
      reports_generated: 0,
    }));

    reports.forEach((r) => {
      const date = new Date(r.created_at);
      const dayName = days[date.getDay()];
      const item = map.find((x) => x.date === dayName);
      if (item) {
        item.symptom_checks += 1;
        item.reports_generated += 1;
      }
    });

    return map;
  };

  const riskData = getRiskDistribution();
  const userActivityData = getMonthlyUserActivity();
  const aiUsageData = getAIUsageMetrics();
  const recentUsers = users.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold font-display">
          {getGreeting()}, <span className="gradient-text">{user?.full_name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">Platform administration overview</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={users.length} icon={Users} color="cyan" trend={{ value: users.length > 0 ? 100 : 0, label: 'real registered', direction: 'up' }} delay={0} />
        <StatCard title="Reports Analyzed" value={reports.length} icon={FileText} color="blue" trend={{ value: reports.length > 0 ? 100 : 0, label: 'real entries', direction: 'up' }} delay={1} />
        <StatCard title="Emergencies Logged" value={alerts.length} icon={AlertTriangle} color="red" trend={{ value: 0, label: 'triage cases', direction: 'stable' }} delay={2} />
        <StatCard title="AI Diagnostic Requests" value={reports.length} icon={Zap} color="purple" trend={{ value: 0, label: 'runs', direction: 'stable' }} delay={3} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold font-display">User Registrations</h2>
              <p className="text-sm text-muted-foreground">User signup counts by day of week</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userActivityData}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="count" stroke="#06b6d4" fill="url(#colorActivity)" strokeWidth={2} name="Registered Users" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold font-display">Risk Distribution</h2>
              <p className="text-sm text-muted-foreground">Assessment risk levels</p>
            </div>
            <Shield className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="h-64 flex items-center">
            {reports.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="level"
                  >
                    {riskData.map((_, i) => (
                      <Cell key={i} fill={RISK_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                  <Legend iconType="circle" formatter={(value: string) => <span className="text-sm capitalize">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center w-full text-xs text-muted-foreground">
                No patient reports present to calculate risk ratios.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* AI Usage & Reports Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold font-display">AI Diagnostic Load</h2>
            <p className="text-sm text-muted-foreground">Weekly report and analysis triggers</p>
          </div>
          <Activity className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aiUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
              <Legend iconType="circle" />
              <Bar dataKey="symptom_checks" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Symptom Checks" />
              <Bar dataKey="reports_generated" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Reports Compiled" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* System Status + Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h2 className="font-semibold font-display mb-4 flex items-center gap-2">
            <Server className="w-4 h-4" /> System Status
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Server Status', value: 'Nominal', status: 'green' },
              { label: 'Response Delay', value: '0.8s avg', status: 'green' },
              { label: 'Active Users', value: users.length.toString(), status: 'blue' },
              { label: 'Ingestion Pipeline', value: 'Operational', status: 'green' },
              { label: 'Database Health', value: 'Healthy', status: 'green' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.status === 'green' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold font-display">Recent Users</h2>
            <Link to="/dashboard/users" className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border font-mono">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length > 0 ? (
                  recentUsers.map(u => (
                    <tr key={u.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg medical-gradient-bg flex items-center justify-center text-white text-xs font-bold">
                            {getInitials(u.full_name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{u.full_name || 'No Name'}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400' :
                          u.role === 'client' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 font-mono"><Clock className="w-3 h-3" />{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-xs text-muted-foreground">
                      No user accounts present.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
