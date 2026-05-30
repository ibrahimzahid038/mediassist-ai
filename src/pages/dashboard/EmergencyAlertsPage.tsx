import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertOctagon, Phone, ShieldAlert, Clock, AlertTriangle,
  MapPin, CheckCircle, Search, Heart, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDateTime } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { EmergencyAlert } from '../../types';

export default function EmergencyAlertsPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAlerts();
    }
  }, [user]);

  const loadAlerts = async () => {
    try {
      // Admins/clients see all alerts; users see only their own
      let query = supabase
        .from('emergency_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (user?.role === 'user') {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setAlerts((data as EmergencyAlert[]) || []);
    } catch (err) {
      console.error('Failed to load emergency alerts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('emergency_alerts')
        .delete()
        .eq('id', id);
      if (error) throw error;

      setAlerts((prev) => prev.filter((a) => a.id !== id));
      toast.success('Emergency alert marked as resolved and logged.');
    } catch (err) {
      toast.error('Failed to resolve alert');
    }
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'border-red-500 bg-red-100/40 dark:bg-red-500/10 text-red-700 dark:text-red-400';
      case 'high':
        return 'border-orange-500 bg-orange-100/40 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 'medium':
      default:
        return 'border-amber-500 bg-amber-100/40 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-display text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertOctagon className="w-8 h-8 animate-pulse text-red-500" /> Emergency Alerts
        </h1>
        <p className="text-muted-foreground mt-1">Real-time medical warnings requiring immediate actions</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Alerts List */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Active Alerts Queue ({alerts.length})
          </h2>

          <AnimatePresence mode="popLayout">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className={`glass-card p-5 border-l-4 flex gap-4 flex-col sm:flex-row sm:items-center justify-between ${getSeverityColor(
                    alert.severity
                  )}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      <span className="font-bold text-xs uppercase tracking-widest font-mono">
                        {alert.severity} event
                      </span>
                    </div>

                    <h3 className="font-bold text-base font-display text-foreground">
                      Severe Symptoms Logged
                    </h3>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {alert.symptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="px-2.5 py-0.5 rounded-lg bg-card/60 dark:bg-card/20 border border-border/30 text-xxs font-medium text-foreground"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-xxs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDateTime(alert.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        Patient ID: {alert.user_id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleResolveAlert(alert.id)}
                    className="btn-primary self-start sm:self-center py-2 px-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 border-emerald-700 hover:border-emerald-600 flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" /> Resolve Case
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 glass-card p-6 flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100/50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-base font-display">No Active Emergencies</h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Outstanding cases resolved! All systems report operating within normal risk limits.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Emergency Resources */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Medical Hotlines
          </h2>

          <div className="glass-card p-5 space-y-4 border border-red-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100/80 dark:bg-red-500/10 flex items-center justify-center text-red-500">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Emergency Services</h3>
                <p className="text-xxs text-muted-foreground">National ambulance hotline</p>
              </div>
              <a
                href="tel:911"
                className="ml-auto text-red-600 dark:text-red-400 font-bold hover:underline font-mono text-sm"
              >
                911
              </a>
            </div>

            <div className="border-t border-border/40 pt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100/80 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Crisis Lifeline</h3>
                <p className="text-xxs text-muted-foreground">Suicide & crisis help line</p>
              </div>
              <a
                href="tel:988"
                className="ml-auto text-orange-600 dark:text-orange-400 font-bold hover:underline font-mono text-sm"
              >
                988
              </a>
            </div>
            
            <div className="border-t border-border/40 pt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-100/80 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Poison Control</h3>
                <p className="text-xxs text-muted-foreground">National toxin assistance</p>
              </div>
              <a
                href="tel:18002221222"
                className="ml-auto text-cyan-600 dark:text-cyan-400 font-bold hover:underline font-mono text-xs"
              >
                1-800-222-1222
              </a>
            </div>
          </div>

          <div className="glass-card p-4 text-xs text-muted-foreground leading-relaxed">
            💡 <strong>Severe Chest Pain?</strong> Do not wait. If you experience crushing chest pain radiating to your jaw or left arm, seek emergency care immediately.
          </div>
        </div>

      </div>
    </div>
  );
}
