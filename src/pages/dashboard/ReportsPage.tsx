import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Printer, Search, Filter, Clock, AlertTriangle,
  ChevronDown, ChevronUp, Eye, Share2, Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getReports, getAllReports } from '../../lib/supabase';
import { cn, formatDateTime, getRiskBgClass } from '../../lib/utils';
import toast from 'react-hot-toast';
import type { Report } from '../../types';

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'risk'>('date');

  useEffect(() => {
    if (user) {
      loadReports();
    }
  }, [user]);

  const loadReports = async () => {
    try {
      // Admins and clients see all reports; users see only their own
      const data = user?.role === 'admin' || user?.role === 'client'
        ? await getAllReports()
        : await getReports(user!.id);
      setReports((data as Report[]) || []);
    } catch (err) {
      console.error('Failed to load reports', err);
      toast.error('Could not load reports');
    } finally {
      setLoading(false);
    }
  };

  let filteredReports = reports.filter(r => {
    const matchesSearch = searchQuery === '' || 
      r.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.ai_analysis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || r.risk_level === riskFilter;
    return matchesSearch && matchesRisk;
  });

  if (sortBy === 'risk') {
    const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    filteredReports = [...filteredReports].sort((a, b) => 
      (order[a.risk_level] ?? 4) - (order[b.risk_level] ?? 4)
    );
  }

  const handleDownload = (reportId: string) => {
    toast.success(`Downloading report ${reportId}...`);
    // In production, this would generate a PDF using jsPDF
  };

  const handlePrint = (reportId: string) => {
    toast.success(`Preparing to print report ${reportId}...`);
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Medical Reports
          </h1>
          <p className="page-subtitle">View and manage your AI-generated health reports</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reports by symptoms or content..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-field pl-9 !py-2 text-sm"
            />
          </div>
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="input-field !py-2 text-sm w-full sm:w-36"
          >
            <option value="all">All Risks</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'date' | 'risk')}
            className="input-field !py-2 text-sm w-full sm:w-36"
          >
            <option value="date">Sort by Date</option>
            <option value="risk">Sort by Risk</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">No Reports Found</h3>
            <p className="text-sm text-muted-foreground">
              {reports.length === 0 
                ? 'No diagnostic sessions have been completed yet. Run a symptom check to generate your first report.'
                : 'No reports match your search criteria.'}
            </p>
          </div>
        ) : (
          filteredReports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden card-hover"
            >
              {/* Report Header */}
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`risk-badge ${getRiskBgClass(report.risk_level)}`}>
                        {report.risk_level}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">{report.report_id}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {report.symptoms.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-accent text-xs font-medium">{s}</span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{report.ai_analysis}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(report.created_at)}
                    </span>
                    {expandedReport === report.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedReport === report.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-border"
                >
                  <div className="p-5 space-y-4">
                    {/* AI Analysis */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">AI Analysis</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{report.ai_analysis}</p>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {report.recommendations.map((rec, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0 mt-1.5" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={() => handleDownload(report.report_id || '')}
                        className="btn-primary text-sm !py-2 !px-4 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Download PDF
                      </button>
                      <button
                        onClick={() => handlePrint(report.report_id || '')}
                        className="btn-secondary text-sm !py-2 !px-4 flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print
                      </button>
                      <button className="btn-ghost text-sm !py-2 !px-4 flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
