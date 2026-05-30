import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  User, Mail, Calendar, Shield, Heart, Edit2, Check,
  Activity, AlertCircle, FileText, Phone, MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDateTime } from '../../lib/utils';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bloodGroup, setBloodGroup] = useState(user?.blood_group || '');
  const [allergies, setAllergies] = useState(user?.allergies || '');
  const [medicalConditions, setMedicalConditions] = useState(user?.medical_conditions || '');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergency_contact || '');
  const [location, setLocation] = useState(user?.location || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error('Full name cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          phone: phone,
          blood_group: bloodGroup,
          allergies: allergies,
          medical_conditions: medicalConditions,
          emergency_contact: emergencyContact,
          location: location,
        }
      });
      if (error) throw error;
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-display">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and health profile</p>
      </div>

      {/* Main Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 flex flex-col items-center text-center space-y-4"
        >
          <div className="relative">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-24 h-24 rounded-full object-cover border-4 border-cyan-500/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                {getInitials(user?.full_name || 'User')}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-background" />
          </div>

          <div>
            <h2 className="text-xl font-bold font-display">{user?.full_name}</h2>
            <div className="flex items-center gap-1.5 justify-center mt-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="w-full border-t border-border pt-4 text-left space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-500" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-500" />
              <span>Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'recently'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-500" />
              <span>Role-based authorization active</span>
            </div>
          </div>
        </motion.div>

        {/* Edit Info Form & Health Profile */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 space-y-6"
        >
          {/* General Information */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold font-display flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-500" /> General Information
              </h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary py-1 px-3 text-xs flex items-center gap-1"
                  >
                    {loading ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Check className="w-3.5 h-3.5" /> Save</>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-field"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground py-2 border-b border-border/50">
                    {user?.full_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <p className="text-sm font-medium text-muted-foreground py-2 border-b border-border/50 bg-muted/20 dark:bg-muted/5 px-2 rounded">
                  {user?.email}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 555-0100"
                    className="input-field"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground py-2 border-b border-border/50">
                    {phone || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="input-field"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground py-2 border-b border-border/50 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> {location || 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Health Profile */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold font-display flex items-center gap-2 mb-6">
              <Heart className="w-5 h-5 text-red-500" fill="currentColor" /> Medical & Health Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Blood Group
                </label>
                {isEditing ? (
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select blood group</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                    {bloodGroup || 'Not specified'}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Known Allergies
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g. Peanuts, Penicillin"
                    className="input-field"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground py-1.5">
                    {allergies || 'None specified'}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Chronic Medical Conditions
                </label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                    placeholder="e.g. Asthma, Hypertension"
                    className="input-field"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground py-1.5">
                    {medicalConditions || 'None specified'}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Phone className="w-3 h-3" /> Emergency Contact
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="e.g. Jane Doe (Spouse) - 555-0199"
                    className="input-field"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground py-1.5 bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 rounded px-2">
                    {emergencyContact || 'None specified'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
