import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Stethoscope, MessageSquare, FileText, Activity, Heart,
  TrendingUp, AlertTriangle, Sparkles, ArrowRight, Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import { getGreeting, formatDateTime, getRiskBgClass } from '../../lib/utils';
import { getReports, getChatHistory, getNotifications } from '../../lib/supabase';
import { WELLNESS_TIPS } from '../../services/aiService';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function UserDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [chatCount, setChatCount] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const dailyTip = WELLNESS_TIPS[new Date().getDay() % WELLNESS_TIPS.length];

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const reportsData = await getReports(user!.id);
      setReports(reportsData || []);

      const chatData = await getChatHistory(user!.id);
      setChatCount(chatData?.length || 0);

      const notificationsData = await getNotifications(user!.id);
      const activeAlerts = notificationsData?.filter((n: any) => n.type === 'warning' || n.type === 'error').length || 0;
      setAlertCount(activeAlerts);
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeeklyActivity = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const map = days.map(d => ({ day: d, checks: 0 }));
    
    reports.forEach(r => {
      const date = new Date(r.created_at);
      const dayName = days[date.getDay()];
      const item = map.find(x => x.day === dayName);
      if (item) item.checks += 1;
    });

    return map;
  };

  const calculateWellnessScore = () => {
    if (reports.length === 0) return 100; // Start fresh!
    
    // Decrease for high/critical risks
    let score = 100;
    reports.forEach(r => {
      if (r.risk_level === 'critical') score -= 20;
      else if (r.risk_level === 'high') score -= 15;
      else if (r.risk_level === 'medium') score -= 5;
    });
    return Math.max(score, 30);
  };

  const recentReports = reports.slice(0, 3);
  const activityData = getWeeklyActivity();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display">
            {getGreeting()}, <span className="gradient-text">{user?.full_name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here's your health overview for today</p>
        </div>
        <Link to="/dashboard/symptoms" className="btn-primary inline-flex items-center gap-2 self-start">
          <Stethoscope className="w-4 h-4" /> New Symptom Check
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Reports"
          value={reports.length}
          icon={FileText}
          color="cyan"
          trend={{ value: reports.length > 0 ? 100 : 0, label: 'real reports', direction: 'up' }}
          delay={0}
        />
        <StatCard
          title="AI Conversations"
          value={chatCount}
          icon={MessageSquare}
          color="blue"
          trend={{ value: chatCount > 0 ? 100 : 0, label: 'messages', direction: 'up' }}
          delay={1}
        />
        <StatCard
          title="Risk Alerts"
          value={alertCount}
          icon={AlertTriangle}
          color="orange"
          trend={{ value: 0, label: 'live tracking', direction: 'stable' }}
          delay={2}
        />
        <StatCard
          title="Wellness Score"
          value={`${calculateWellnessScore()}/100`}
          icon={Heart}
          color="green"
          trend={{ value: 0, label: 'calculated index', direction: 'stable' }}
          delay={3}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold font-display">Weekly Activity</h2>
              <p className="text-sm text-muted-foreground">Your symptom checkers this week</p>
            </div>
            <Activity className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorChecks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  }}
                />
                <Area type="monotone" dataKey="checks" stroke="#06b6d4" fill="url(#colorChecks)" strokeWidth={2} name="Symptom Checks" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Daily Wellness Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-cyan-500" />
            <h2 className="font-semibold font-display">Daily Wellness</h2>
          </div>
          <div className="flex-1 flex flex-col justify-center text-center py-4">
            <span className="text-4xl mb-3">{dailyTip.icon}</span>
            <h3 className="font-semibold text-lg mb-2">{dailyTip.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{dailyTip.description}</p>
            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-xs font-medium">
              {dailyTip.category}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions + Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="font-semibold font-display mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { icon: Stethoscope, label: 'Check Symptoms', href: '/dashboard/symptoms', color: 'text-cyan-500' },
              { icon: MessageSquare, label: 'Chat with AI', href: '/dashboard/chat', color: 'text-blue-500' },
              { icon: FileText, label: 'View Reports', href: '/dashboard/reports', color: 'text-purple-500' },
              { icon: TrendingUp, label: 'Health Analytics', href: '/dashboard/analytics', color: 'text-emerald-500' },
            ].map(action => (
              <Link
                key={action.href}
                to={action.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <span className="font-medium text-sm flex-1">{action.label}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold font-display">Recent Reports</h2>
            <Link to="/dashboard/reports" className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentReports.length > 0 ? (
              recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors"
                >
                  <div className={`risk-badge ${getRiskBgClass(report.risk_level)}`}>
                    {report.risk_level}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {report.symptoms.join(', ')}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(report.created_at)}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{report.report_id}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-muted-foreground">
                No diagnostic sessions logged yet.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Medical Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 text-center"
      >
        <p className="text-xs text-amber-700 dark:text-amber-400">
          ⚕️ <strong>Medical Disclaimer:</strong> MediAssist AI provides health information for educational purposes only. 
          It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek qualified medical care.
        </p>
      </motion.div>
    </div>
  );
}
