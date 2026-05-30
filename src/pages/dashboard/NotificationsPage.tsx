import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Check, AlertCircle, Info, AlertTriangle, Eye,
  Trash2, Filter, Sparkles, CheckSquare
} from 'lucide-react';
import type { Notification } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, markNotificationRead, supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { formatDateTime } from '../../lib/utils';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications(user!.id);
      setNotifications((data as Notification[]) || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleReadStatus = async (id: string) => {
    const item = notifications.find((n) => n.id === id);
    if (!item) return;

    try {
      if (!item.read_status) {
        await markNotificationRead(id);
      } else {
        // Mark as unread by updating read_status to false
        const { error } = await supabase
          .from('notifications')
          .update({ read_status: false })
          .eq('id', id);
        if (error) throw error;
      }

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_status: !n.read_status } : n))
      );
      toast.success(item.read_status ? 'Marked as unread' : 'Marked as read');
    } catch (err) {
      toast.error('Failed to update notification status');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read_status).map(n => n.id);
      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read_status: true })
        .in('id', unreadIds);
      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, read_status: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      if (error) throw error;

      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success('Notification cleared');
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-cyan-500" />;
    }
  };

  const getBgClass = (type?: string) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-100/30 dark:bg-emerald-500/10 border-emerald-500/20';
      case 'warning':
        return 'bg-amber-100/30 dark:bg-amber-500/10 border-amber-500/20';
      case 'error':
        return 'bg-red-100/30 dark:bg-red-500/10 border-red-500/20';
      case 'info':
      default:
        return 'bg-cyan-100/30 dark:bg-cyan-500/10 border-cyan-500/20';
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read_status;
    if (filter === 'read') return n.read_status;
    return true;
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with system updates and health notifications</p>
        </div>
        {notifications.some((n) => !n.read_status) && (
          <button
            onClick={markAllAsRead}
            className="btn-primary py-1.5 px-4 text-sm flex items-center gap-1.5 self-start sm:self-center"
          >
            <CheckSquare className="w-4 h-4" /> Mark All Read
          </button>
        )}
      </div>

      {/* Filter and Content Controls */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex gap-2">
          {(['all', 'unread', 'read'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                filter === type
                  ? 'border-cyan-500 bg-cyan-100/50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold'
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          Showing {filteredNotifications.length} of {notifications.length} alerts
        </span>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                layout
                className={`glass-card p-4 flex gap-4 items-start border-l-4 transition-colors ${
                  notif.read_status ? 'opacity-75' : ''
                } ${getBgClass(notif.type)}`}
              >
                <div className="mt-0.5">{getIcon(notif.type)}</div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-sm">{notif.title}</h3>
                    <span className="text-xxs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(notif.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                </div>

                <div className="flex gap-1.5 self-center">
                  <button
                    onClick={() => toggleReadStatus(notif.id)}
                    title={notif.read_status ? 'Mark as unread' : 'Mark as read'}
                    className="p-1.5 rounded-lg hover:bg-background border border-transparent hover:border-border text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    title="Delete"
                    className="p-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 glass-card p-6 flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-cyan-100/50 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-base font-display">No Notifications</h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                {notifications.length === 0
                  ? "You don't have any notifications yet. They will appear here as the system generates alerts."
                  : "You're all caught up! No notifications fit your selected filters."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
