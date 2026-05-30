import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, Building2, ArrowRight, Heart, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export function DashboardLayout() {
  const { user, updateUserRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirmRole = async () => {
    if (!selectedRole) return;
    setSubmitting(true);
    try {
      await updateUserRole(selectedRole);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Glassmorphic First-Time Google Signup Role Selection Overlay */}
      <AnimatePresence>
        {user && user.role_selected === false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="glass-card p-6 md:p-8 max-w-lg w-full text-center space-y-6 shadow-2xl border border-cyan-500/20 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500" />
              
              {/* Logo icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-teal-500/10 border border-cyan-500/25 shadow-lg shadow-cyan-500/5 mb-2 relative">
                <Heart className="w-7 h-7 text-cyan-500 animate-pulse" fill="rgba(6, 182, 212, 0.15)" />
                <Sparkles className="w-3.5 h-3.5 text-cyan-500 absolute -top-1 -right-1" />
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold font-display">Complete Your Registration</h2>
                <p className="text-muted-foreground text-xs md:text-sm mt-1.5 leading-relaxed">
                  Please specify your account type to personalize your clinical dashboard. This is set only once.
                </p>
              </div>

              {/* Roles Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    value: 'user' as const,
                    title: 'Patient / User',
                    icon: UserIcon,
                    desc: 'Log AI clinical checks, view charts, and check diagnostics.',
                    color: 'from-cyan-500/10 to-teal-500/10 border-cyan-500',
                  },
                  {
                    value: 'client' as const,
                    title: 'Clinic / Provider',
                    icon: Building2,
                    desc: 'Monitor directories, medical logs, and close alerts.',
                    color: 'from-blue-500/10 to-indigo-500/10 border-blue-500',
                  },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedRole(item.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all active:scale-[0.98] ${
                      selectedRole === item.value
                        ? `border-cyan-500 bg-gradient-to-br ${item.color}`
                        : 'border-border hover:border-cyan-500/30 bg-card/40'
                    }`}
                  >
                    <item.icon className={`w-6 h-6 mb-2 ${selectedRole === item.value ? 'text-cyan-500' : 'text-muted-foreground'}`} />
                    <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleConfirmRole}
                disabled={!selectedRole || submitting}
                className="btn-primary w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all shadow-lg shadow-cyan-500/10 mt-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Confirm & Enter Dashboard <ArrowRight className="w-4.5 h-4.5" /></>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
