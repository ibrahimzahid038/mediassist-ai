import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, FileText, AlertTriangle, Activity, Search, Clock, ArrowUpRight, Filter
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import { getGreeting, getRiskBgClass, formatDateTime } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { getAllReports } from '../../lib/supabase';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await getAllReports();
      setReports(data || []);
    } catch (err) {
      console.error('Failed to load clinic dashboard reports', err);
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

    const total = reports.length || 1;

    return [
      { name: 'Low', value: Math.round((counts.low / total) * 100), color: '#10b981' },
      { name: 'Medium', value: Math.round((counts.medium / total) * 100), color: '#f59e0b' },
      { name: 'High', value: Math.round((counts.high / total) * 100), color: '#f97316' },
      { name: 'Critical', value: Math.round((counts.critical / total) * 100), color: '#ef4444' },
    ];
  };

  const getWeeklyReportsData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const map = days.map((d) => ({ day: d, reports: 0 }));

    reports.forEach((r) => {
      const date = new Date(r.created_at);
      const dayName = days[date.getDay()];
      const item = map.find((x) => x.day === dayName);
      if (item) item.reports += 1;
    });

    return map;
  };

  const riskData = getRiskDistribution();
  const weeklyData = getWeeklyReportsData();

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      searchQuery === '' ||
      r.symptoms.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRisk = riskFilter === 'all' || r.risk_level === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const criticalCases = reports.filter(r => r.risk_level === 'critical').length;
  const reportsThisWeek = reports.length;
  const uniquePatients = new Set(reports.map(r => r.user_id)).size;

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
          {getGreeting()}, <span className="gradient-text">{user?.full_name}</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">Clinic patient monitoring dashboard</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Monitored Patients" value={uniquePatients} icon={Users} color="cyan" trend={{ value: uniquePatients > 0 ? 100 : 0, label: 'real patients', direction: 'up' }} delay={0} />
        <StatCard title="Critical Cases" value={criticalCases} icon={AlertTriangle} color="red" trend={{ value: 0, label: 'requiring attention', direction: 'stable' }} delay={1} />
        <StatCard title="Total Reports" value={reportsThisWeek} icon={FileText} color="blue" trend={{ value: reportsThisWeek > 0 ? 100 : 0, label: 'submitted', direction: 'up' }} delay={2} />
        <StatCard title="Emergency Events" value={criticalCases} icon={Clock} color="orange" trend={{ value: 0, label: 'critical triage', direction: 'stable' }} delay={3} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h2 className="font-semibold font-display mb-4">Symptom Checks Weekly Trend</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                <Bar dataKey="reports" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Reports" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h2 className="font-semibold font-display mb-4">Risk Distribution Ratio</h2>
          <div className="h-56 flex items-center">
            {reports.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={riskData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                      {riskData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 ml-4">
                  {riskData.map(d => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-xs font-semibold whitespace-nowrap">{d.name}: {d.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center w-full text-xs text-muted-foreground">
                No logs present.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Patient Reports Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="font-semibold font-display">Patient Diagnostic Reports</h2>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search symptoms..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-field pl-9 !py-2 text-sm w-full sm:w-64"
              />
            </div>
            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
              className="input-field !py-2 text-sm w-32"
            >
              <option value="all">All Risks</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border font-mono">
                <th className="pb-3 font-medium">Report ID</th>
                <th className="pb-3 font-medium">Symptoms</th>
                <th className="pb-3 font-medium">Risk Level</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map(report => (
                  <tr key={report.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="py-3 text-sm font-mono text-muted-foreground">{report.report_id}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {report.symptoms.map((s: string) => (
                          <span key={s} className="px-2 py-0.5 rounded-md bg-accent text-xs">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3"><span className={`risk-badge ${getRiskBgClass(report.risk_level)}`}>{report.risk_level}</span></td>
                    <td className="py-3 text-sm text-muted-foreground font-mono">{formatDateTime(report.created_at)}</td>
                    <td className="py-3">
                      <Link to="/dashboard/reports" className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold">
                        View <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-xs text-muted-foreground">
                    No reports match criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
