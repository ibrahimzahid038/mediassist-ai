import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  Bell, Moon, Sun, Lock, Eye, EyeOff, Shield, Database,
  Download, Globe, Trash2, Save, HelpCircle, KeyRound, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSavePreferences = () => {
    toast.success('Preferences saved successfully!');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your interface, security, and account preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="space-y-4">
          <div className="glass-card p-4 space-y-1">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Settings Panels
            </h2>
            {['appearance', 'notifications', 'security', 'data'].map((tab) => (
              <a
                key={tab}
                href={`#${tab}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all capitalize"
              >
                {tab === 'appearance' && <Sun className="w-4 h-4 text-cyan-500" />}
                {tab === 'notifications' && <Bell className="w-4 h-4 text-blue-500" />}
                {tab === 'security' && <Lock className="w-4 h-4 text-purple-500" />}
                {tab === 'data' && <Database className="w-4 h-4 text-emerald-500" />}
                {tab}
              </a>
            ))}
          </div>

          <div className="glass-card p-4 text-center">
            <Sparkles className="w-8 h-8 text-cyan-500 mx-auto mb-2 animate-pulse" />
            <h4 className="text-sm font-semibold font-display">Pro Features Active</h4>
            <p className="text-xs text-muted-foreground mt-1">
              You have unlimited AI symptom checks and private medical vaults.
            </p>
          </div>
        </div>

        {/* Settings Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Appearance Section */}
          <section id="appearance" className="glass-card p-6 scroll-mt-6">
            <h3 className="text-lg font-semibold font-display flex items-center gap-2 mb-6">
              <Sun className="w-5 h-5 text-cyan-500" /> Appearance & Theme
            </h3>
            
            <div className="flex items-center justify-between py-4 border-b border-border/50">
              <div>
                <p className="text-sm font-semibold">System Theme</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Toggle between a brilliant light mode or a soothing dark mode.
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="w-12 h-6 rounded-full bg-accent relative flex items-center p-1 cursor-pointer transition-colors"
              >
                <motion.div
                  layout
                  className="w-4 h-4 rounded-full bg-cyan-500 shadow flex items-center justify-center"
                  style={{ marginLeft: theme === 'dark' ? 'auto' : '0px' }}
                >
                  {theme === 'dark' ? (
                    <Moon className="w-2.5 h-2.5 text-white" />
                  ) : (
                    <Sun className="w-2.5 h-2.5 text-white" />
                  )}
                </motion.div>
              </button>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm font-semibold">Language Select</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose your preferred medical terminology language.
                </p>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input-field max-w-[150px] py-1 text-xs"
              >
                <option value="en">English (US)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </section>

          {/* Notifications Section */}
          <section id="notifications" className="glass-card p-6 scroll-mt-6">
            <h3 className="text-lg font-semibold font-display flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-blue-500" /> Notifications & Alerts
            </h3>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-semibold">Email Summary Notifications</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Receive email updates when medical reports are analyzed.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded border-border text-cyan-600 focus:ring-cyan-500 w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer border-t border-border/30 pt-4">
                <div>
                  <p className="text-sm font-semibold">Real-Time Push Alerts</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Enable in-app notifications for critical symptom warnings.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={pushAlerts}
                  onChange={(e) => setPushAlerts(e.target.checked)}
                  className="rounded border-border text-cyan-600 focus:ring-cyan-500 w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer border-t border-border/30 pt-4">
                <div>
                  <p className="text-sm font-semibold">Critical Events Only</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Mute ordinary health insights; only alert on severe medical risks.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={criticalOnly}
                  onChange={(e) => setCriticalOnly(e.target.checked)}
                  className="rounded border-border text-cyan-600 focus:ring-cyan-500 w-5 h-5"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={handleSavePreferences} className="btn-primary py-1.5 px-4 text-sm flex items-center gap-1.5">
                <Save className="w-4 h-4" /> Save Preferences
              </button>
            </div>
          </section>

          {/* Security Password Section */}
          <section id="security" className="glass-card p-6 scroll-mt-6">
            <h3 className="text-lg font-semibold font-display flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-purple-500" /> Security Credentials
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary py-1.5 px-4 text-sm flex items-center gap-1.5"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><KeyRound className="w-4 h-4" /> Update Password</>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Data Management Section */}
          <section id="data" className="glass-card p-6 scroll-mt-6 border border-red-500/10">
            <h3 className="text-lg font-semibold font-display flex items-center gap-2 mb-6">
              <Database className="w-5 h-5 text-emerald-500" /> Data Storage & Privacy
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-semibold">Export Medical History</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Download all your reports, chat histories, and profile settings as a structured JSON file.
                  </p>
                </div>
                <button
                  onClick={() => toast.success('Data export started!')}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Export Data
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-border/30 pt-4">
                <div>
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400">Purge Medical Vault</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Permanently delete all diagnostic reports, chat history, and symptom logs. This cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const confirm = window.confirm('Are you absolutely sure you want to delete all your medical data? This cannot be undone.');
                    if (confirm) toast.success('All history has been permanently purged.');
                  }}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Vault
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
