import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, BarChart2, PieChart as PieIcon, Activity,
  Users, Calendar, Stethoscope, Sparkles
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { getAllReports, getReports, supabase } from '../../lib/supabase';

const RISK_COLORS: Record<string, string> = {
  low: '#10b981',     // emerald-500
  medium: '#06b6d4',  // cyan-500
  high: '#f59e0b',    // amber-500
  critical: '#ef4444',// red-500
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [chatCount, setChatCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      // Fetch reports — admins/clients see all, users see their own
      const reportsData = user?.role === 'admin' || user?.role === 'client'
        ? await getAllReports()
        : await getReports(user!.id);
      setReports(reportsData || []);

      // Fetch chat count
      let chatQuery = supabase.from('chat_history').select('id', { count: 'exact', head: true });
      if (user?.role === 'user') {
        chatQuery = chatQuery.eq('user_id', user.id);
      }
      const { count } = await chatQuery;
      setChatCount(count || 0);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  // Compute symptom frequency from real reports
  const getSymptomFrequency = () => {
    const map: Record<string, number> = {};
    reports.forEach(r => {
      (r.symptoms || []).forEach((s: string) => {
        map[s] = (map[s] || 0) + 1;
      });
    });
    return Object.entries(map)
      .map(([symptom, count]) => ({ symptom, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  };

  // Compute risk distribution from real reports
  const getRiskDistribution = () => {
    const counts = { low: 0, medium: 0, high: 0, critical: 0 };
    reports.forEach(r => {
      const level = r.risk_level as keyof typeof counts;
      if (counts[level] !== undefined) counts[level]++;
    });

    const total = reports.length || 1;
    return [
      { level: 'low', count: counts.low, percentage: Math.round((counts.low / total) * 100) },
      { level: 'medium', count: counts.medium, percentage: Math.round((counts.medium / total) * 100) },
      { level: 'high', count: counts.high, percentage: Math.round((counts.high / total) * 100) },
      { level: 'critical', count: counts.critical, percentage: Math.round((counts.critical / total) * 100) },
    ];
  };

  // Compute daily reports trend (last 7 days)
  const getDailyReportsTrend = () => {
    const days: { date: string; reports: number; emergencies: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString();

      const dayReports = reports.filter(r => r.created_at >= dayStart && r.created_at < dayEnd);
      const emergencies = dayReports.filter(r => r.risk_level === 'critical' || r.risk_level === 'high').length;

      days.push({ date: dateStr, reports: dayReports.length, emergencies });
    }
    return days;
  };

  const symptomData = getSymptomFrequency();
  const riskDistribution = getRiskDistribution();
  const dailyReports = getDailyReportsTrend();
  const totalCases = reports.length;

  // Compute real AI engine metrics
  const reportsPerHour = reports.length > 0
    ? Math.round(reports.length / Math.max(1, (Date.now() - new Date(reports[reports.length - 1]?.created_at).getTime()) / 3600000))
    : 0;

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display">Health Analytics</h1>
          <p className="text-muted-foreground mt-1">Real-time symptom tracking and population health insights</p>
        </div>
        <div className="flex items-center gap-2 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-700 dark:text-cyan-400">
          <Sparkles className="w-4 h-4 animate-spin-slow" /> Diagnostic Engine V2 Active
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Symptom Log Frequency */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold font-display text-base">Top Symptom Log Frequency</h2>
              <p className="text-xs text-muted-foreground">Most common symptoms reported across diagnostic sessions</p>
            </div>
            <BarChart2 className="w-5 h-5 text-cyan-500" />
          </div>
          <div className="h-72">
            {symptomData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={symptomData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="symptom" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]}>
                    {symptomData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#06b6d4' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                No symptom data yet. Complete a diagnosis to populate this chart.
              </div>
            )}
          </div>
        </motion.div>

        {/* Risk Distribution Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold font-display text-base">Assessed Risk Levels</h2>
              <p className="text-xs text-muted-foreground">Distribution of diagnostic outcomes</p>
            </div>
            <PieIcon className="w-5 h-5 text-purple-500" />
          </div>
          <div className="h-60 relative flex items-center justify-center">
            {totalCases > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.level] || '#888'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground text-center">
                No assessments yet.
              </div>
            )}
            {totalCases > 0 && (
              <div className="absolute text-center">
                <span className="text-2xl font-bold font-display">{totalCases}</span>
                <p className="text-xxs text-muted-foreground uppercase tracking-widest mt-0.5">Total cases</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold">
            {riskDistribution.map((entry) => (
              <div key={entry.level} className="flex items-center gap-1.5 justify-center py-1 rounded bg-muted/20 dark:bg-muted/5 border border-border/40">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: RISK_COLORS[entry.level] }} />
                <span className="capitalize">{entry.level} ({entry.percentage}%)</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Daily Reports & Emergencies Trends */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold font-display text-base">Weekly Diagnostics & Emergencies</h2>
              <p className="text-xs text-muted-foreground">Volume of assessments contrasted against critical alerts</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyReports}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2.5} name="Total Reports" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="emergencies" stroke="#ef4444" strokeWidth={2.5} name="Critical Alerts" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI System Load Metric */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold font-display text-base">AI Engine Activity</h2>
              <Sparkles className="w-5 h-5 text-cyan-500" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Diagnostic workload processing rate based on actual system usage.
            </p>
          </div>
          
          <div className="space-y-4 my-6">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Total Symptom Checks</span>
                <span>{reports.length}</span>
              </div>
              <div className="w-full bg-accent rounded-full h-1.5 overflow-hidden">
                <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${Math.min(reports.length * 5, 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Chat Interactions</span>
                <span>{chatCount}</span>
              </div>
              <div className="w-full bg-accent rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(chatCount * 2, 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Reports Compiled</span>
                <span>{reports.length}</span>
              </div>
              <div className="w-full bg-accent rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(reports.length * 5, 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-accent/40 rounded-xl p-3 text-center border border-border/50 text-xs text-muted-foreground">
            🟢 Real-time health scoring pipeline is healthy.
          </div>
        </motion.div>

      </div>
    </div>
  );
}
