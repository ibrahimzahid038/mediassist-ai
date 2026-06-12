import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Search, Shield, Trash2, Edit, AlertCircle,
  Filter, UserPlus, CheckCircle, ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { UserRole } from '../../types';
import { getAllUsers, deleteUser, supabase } from '../../lib/supabase';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (err: any) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    const confirm = window.confirm(`Are you sure you want to delete user ${name}? This will permanently delete their account and auth credentials.`);
    if (confirm) {
      try {
        await deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success(`User ${name} has been successfully deleted.`);
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete user');
      }
    }
  };

  const handleChangeRole = async (id: string, currentRole: UserRole) => {
    const nextRole: UserRole = currentRole === 'user' ? 'client' : currentRole === 'client' ? 'admin' : 'user';
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: nextRole })
        .eq('id', id);
      if (error) throw error;
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: nextRole } : u))
      );
      toast.success(`Updated role to ${nextRole}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user role');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20 font-mono">
            <ShieldAlert className="w-3.5 h-3.5" /> Admin
          </span>
        );
      case 'client':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 font-mono">
            🏥 Clinic
          </span>
        );
      case 'user':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20 font-mono">
            👤 Patient
          </span>
        );
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display">User Management</h1>
          <p className="text-muted-foreground mt-1">Control client accounts, manage roles, and review registrations</p>
        </div>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: 'text-cyan-500 bg-cyan-500/10' },
          { label: 'Clinics', value: users.filter((u) => u.role === 'client').length, icon: Shield, color: 'text-blue-500 bg-blue-500/10' },
          { label: 'Administrators', value: users.filter((u) => u.role === 'admin').length, icon: ShieldAlert, color: 'text-red-500 bg-red-500/10' },
          { label: 'Patients', value: users.filter((u) => u.role === 'user').length, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-500/10' },
        ].map((item) => (
          <div key={item.label} className="glass-card p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xxs font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</p>
              <p className="text-xl font-bold font-display">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input-field pl-10 py-1.5 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="input-field py-1.5 text-xs max-w-[150px]"
          >
            <option value="all">All Roles</option>
            <option value="user">Patients Only</option>
            <option value="client">Clinics Only</option>
            <option value="admin">Admins Only</option>
          </select>
        </div>
      </div>

      {/* Users Database Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-accent/40 border-b border-border/80 text-xxs font-bold text-muted-foreground uppercase tracking-widest font-mono">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((item) => (
                  <tr key={item.id} className="border-b border-border/50 last:border-0 hover:bg-accent/20 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 flex items-center justify-center font-bold text-xs text-cyan-600 dark:text-cyan-400">
                        {(item.full_name || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{item.full_name || 'No Name'}</p>
                        <p className="text-xs text-muted-foreground">{item.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getRoleBadge(item.role)}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground font-mono">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleChangeRole(item.id, item.role)}
                          title="Rotate Role"
                          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(item.id, item.full_name)}
                          title="Delete User"
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors border border-transparent hover:border-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted-foreground text-xs">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground/60" />
                    No users found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
