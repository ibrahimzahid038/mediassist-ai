import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Users, Heart, Filter, FileText, ChevronRight,
  ShieldAlert, Clock, Phone, MapPin, AlertTriangle, Sparkles, X, Bot, Activity, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, getAllUsers, getAllReports } from '../../lib/supabase';
import { getRiskBgClass } from '../../lib/utils';

export default function PatientSearchPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('all');
  
  // Selection details state
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [patientReports, setPatientReports] = useState<any[]>([]);
  const [patientAlerts, setPatientAlerts] = useState<any[]>([]);
  const [patientChats, setPatientChats] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const usersData = await getAllUsers();
      // Filter out non-patients for the clinic's patient directory
      const patientList = (usersData || []).filter((u: any) => u.role === 'user');
      setPatients(patientList);

      const reportsData = await getAllReports();
      setReports(reportsData || []);
    } catch (err) {
      toast.error('Failed to load clinic patient directory.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = async (patient: any) => {
    setSelectedPatient(patient);
    setLoadingDetails(true);
    try {
      // 1. Fetch user-specific diagnostic reports
      const { data: reportsData } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', patient.id)
        .order('created_at', { ascending: false });
      setPatientReports(reportsData || []);

      // 2. Fetch user-specific emergency alerts
      const { data: alertsData } = await supabase
        .from('emergency_alerts')
        .select('*')
        .eq('user_id', patient.id)
        .order('created_at', { ascending: false });
      setPatientAlerts(alertsData || []);

      // 3. Fetch user-specific AI chat history logs
      const { data: chatsData } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', patient.id)
        .order('timestamp', { ascending: true });
      setPatientChats(chatsData || []);
    } catch (err) {
      toast.error('Failed to query patient medical profiles.');
    } finally {
      setLoadingDetails(false);
    }
  };

  // Directory filter logic
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      (p.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.phone || '').includes(search);
    const matchesBlood = bloodFilter === 'all' || p.blood_group === bloodFilter;
    return matchesSearch && matchesBlood;
  });

  // Calculate statistics dynamically
  const highRiskReportsCount = reports.filter(
    (r) => r.risk_level === 'high' || r.risk_level === 'critical'
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in relative min-h-[calc(100vh-120px)]">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-display flex items-center gap-2">
          🏥 Clinic Patient Directory
        </h1>
        <p className="text-muted-foreground mt-1">Search monitored patient registry, audit diagnostic history, and check active triage alerts</p>
      </div>

      {/* Clinical Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Monitored Patients', value: patients.length, icon: Users, color: 'text-cyan-500 bg-cyan-500/10' },
          { label: 'Critical / High Triage', value: highRiskReportsCount, icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' },
          { label: 'Diagnostic Vol.', value: reports.length, icon: FileText, color: 'text-blue-500 bg-blue-500/10' },
          { label: 'Platform Engaged', value: `${reports.length > 0 ? Math.round((reports.length / (patients.length || 1)) * 10) / 10 : 0} avg`, icon: Activity, color: 'text-purple-500 bg-purple-500/10' },
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xxs font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</p>
              <p className="text-xl font-bold font-display mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Directory & Controls layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Index Panel */}
        <div className="lg:col-span-2 space-y-4 flex flex-col">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient by name, email, or telephone..."
                className="input-field pl-10 py-1.5 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={bloodFilter}
                onChange={(e) => setBloodFilter(e.target.value)}
                className="input-field py-1.5 text-xs w-[140px]"
              >
                <option value="all">All Blood Groups</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          {/* List */}
          <div className="glass-card divide-y divide-border/50">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => {
                const patientReportsCount = reports.filter(r => r.user_id === patient.id).length;
                return (
                  <button
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className={`w-full text-left p-4 hover:bg-accent/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 last:rounded-b-2xl first:rounded-t-2xl border-l-4 ${
                      selectedPatient?.id === patient.id
                        ? 'border-cyan-500 bg-cyan-500/5'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500/20 to-teal-500/20 flex items-center justify-center font-bold text-sm text-cyan-600 dark:text-cyan-400">
                        {(patient.full_name || 'P')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{patient.full_name || 'No Name'}</p>
                        <p className="text-xs text-muted-foreground">{patient.email}</p>
                        {patient.phone && <p className="text-[10px] text-muted-foreground/80 mt-0.5">{patient.phone}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div className="text-left sm:text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] bg-accent px-2 py-0.5 rounded-full text-muted-foreground">
                          <FileText className="w-3 h-3" /> {patientReportsCount} Reports
                        </span>
                        {patient.blood_group && (
                          <span className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-bold">
                            🩸 {patient.blood_group}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/60 hidden sm:block" />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-12 text-center text-muted-foreground text-xs">
                <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                No patients matched filtering criteria.
              </div>
            )}
          </div>
        </div>

        {/* Selected Patient Medical Health Portal Side-Panel */}
        <div className="glass-card p-6 flex flex-col h-[calc(100vh-340px)] sticky top-[230px] overflow-y-auto scrollbar-thin">
          <AnimatePresence mode="wait">
            {selectedPatient ? (
              <motion.div
                key={selectedPatient.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 flex flex-col"
              >
                {/* Close Portal Button */}
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h2 className="font-semibold font-display text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-cyan-500" fill="currentColor" /> Clinical Portal
                  </h2>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Patient Summary Card */}
                <div className="text-center py-2 border-b border-border/40">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500/30 to-blue-500/30 flex items-center justify-center font-bold text-xl text-cyan-600 dark:text-cyan-400 mx-auto">
                    {(selectedPatient.full_name || 'P')[0].toUpperCase()}
                  </div>
                  <h3 className="font-bold text-lg text-foreground mt-3 font-display">{selectedPatient.full_name || 'No Name'}</h3>
                  <p className="text-xs text-muted-foreground">{selectedPatient.email}</p>
                </div>

                {/* Health Attributes Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-accent/30 p-3.5 rounded-xl border border-border/80 font-mono">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Blood Group</span>
                    <span className="font-bold text-red-500 dark:text-red-400">{selectedPatient.blood_group || 'Not Specified'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Emergency Contact</span>
                    <span className="font-semibold truncate block">{selectedPatient.emergency_contact || 'None'}</span>
                  </div>
                  <div className="col-span-2 border-t border-border/40 pt-2 mt-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Allergies</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400 block whitespace-normal">{selectedPatient.allergies || 'No allergies declared'}</span>
                  </div>
                  <div className="col-span-2 border-t border-border/40 pt-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Active Conditions</span>
                    <span className="font-semibold text-foreground block whitespace-normal">{selectedPatient.medical_conditions || 'No conditions declared'}</span>
                  </div>
                  {selectedPatient.location && (
                    <div className="col-span-2 border-t border-border/40 pt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{selectedPatient.location}</span>
                    </div>
                  )}
                </div>

                {loadingDetails ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-3 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Active Emergency Alerts Block */}
                    {patientAlerts.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xxs font-bold uppercase tracking-wider text-red-500 font-mono flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Active Emergency Alerts
                        </h4>
                        <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl space-y-2 text-xs">
                          {patientAlerts.map(alert => (
                            <div key={alert.id} className="flex justify-between items-start py-1 border-b border-red-500/10 last:border-0">
                              <div>
                                <p className="font-semibold capitalize text-red-600 dark:text-red-400 font-mono text-[10px]">Severity: {alert.severity}</p>
                                <p className="text-[10px] text-muted-foreground">{alert.symptoms.join(', ')}</p>
                              </div>
                              <span className="text-[9px] font-mono text-muted-foreground whitespace-nowrap">{new Date(alert.created_at).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Historical Diagnostic Timeline Block */}
                    <div className="space-y-2">
                      <h4 className="text-xxs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Diagnostic Timeline
                      </h4>

                      {patientReports.length > 0 ? (
                        <div className="space-y-2">
                          {patientReports.slice(0, 3).map((report) => (
                            <div key={report.id} className="p-3 bg-accent/40 hover:bg-accent/60 transition-colors border border-border/80 rounded-xl space-y-2 text-xs relative group">
                              <div className="flex justify-between items-center">
                                <span className={`risk-badge py-0.5 px-2 rounded-full font-bold uppercase text-[9px] font-mono ${getRiskBgClass(report.risk_level)}`}>
                                  {report.risk_level}
                                </span>
                                <span className="text-[9px] font-mono text-muted-foreground flex items-center gap-0.5">
                                  <Clock className="w-3 h-3" /> {new Date(report.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="font-semibold text-foreground truncate pr-6">{report.symptoms.join(', ')}</p>
                              
                              {/* Expandable detail summary popover */}
                              <div className="text-[10px] text-muted-foreground border-t border-border/40 pt-1.5 leading-relaxed italic">
                                {report.ai_analysis.slice(0, 100)}...
                              </div>
                            </div>
                          ))}
                          {patientReports.length > 3 && (
                            <p className="text-center text-[10px] text-muted-foreground italic font-mono">+ {patientReports.length - 3} older records log</p>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6 border border-dashed border-border rounded-xl text-xxs text-muted-foreground">
                          No diagnostic checks recorded yet.
                        </div>
                      )}
                    </div>

                    {/* Chat Logs companion summary */}
                    {patientChats.length > 0 && (
                      <div className="space-y-2 border-t border-border/40 pt-4">
                        <h4 className="text-xxs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1">
                          <Bot className="w-3.5 h-3.5 text-cyan-500" /> Virtual Ingest Activity
                        </h4>
                        <div className="flex items-center justify-between text-xs bg-cyan-500/5 border border-cyan-500/10 p-2.5 rounded-xl font-mono">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Sparkles className="w-3 h-3 text-cyan-500" /> AI Dialog Interactions</span>
                          <span className="font-bold text-cyan-600 dark:text-cyan-400">{patientChats.length} Messages</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col justify-center items-center text-center p-6 text-muted-foreground border-2 border-dashed border-border rounded-2xl min-h-[300px]"
              >
                <Users className="w-12 h-12 mb-3 text-muted-foreground/40" />
                <h3 className="font-bold text-sm text-foreground">Select a Patient</h3>
                <p className="text-xs text-muted-foreground/80 mt-1 max-w-[200px] leading-relaxed">
                  Click on any patient in the directory to explore their full clinical diagnostic portal.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
