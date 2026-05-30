import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Stethoscope, MessageSquare, FileText,
  BarChart3, Bell, Settings, User, Shield, Users, Database,
  AlertTriangle, Building2, Search, ChevronLeft, ChevronRight, Heart
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const userLinks: SidebarLink[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Symptom Checker', href: '/dashboard/symptoms', icon: Stethoscope },
    { name: 'AI Chat', href: '/dashboard/chat', icon: MessageSquare },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: 2 },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const adminLinks: SidebarLink[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Emergency Alerts', href: '/dashboard/emergencies', icon: AlertTriangle, badge: 2 },
    { name: 'Database', href: '/dashboard/database', icon: Database },
    { name: 'Security', href: '/dashboard/security', icon: Shield },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const clientLinks: SidebarLink[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Patient Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Critical Cases', href: '/dashboard/emergencies', icon: AlertTriangle, badge: 5 },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Search Patients', href: '/dashboard/search', icon: Search },
    { name: 'Clinic Profile', href: '/dashboard/profile', icon: Building2 },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const links = user.role === 'admin' ? adminLinks : user.role === 'client' ? clientLinks : userLinks;

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2 }}
      className="hidden lg:flex flex-col h-[calc(100vh-64px)] sticky top-16 border-r border-border bg-card/50 backdrop-blur-sm"
    >
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="wait">
          {links.map((link) => {
            const isActive = location.pathname === link.href ||
              (link.href !== '/dashboard' && location.pathname.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                  isActive
                    ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 font-semibold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-500 rounded-r-full"
                  />
                )}
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-cyan-600 dark:text-cyan-400')} />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm truncate"
                  >
                    {link.name}
                  </motion.span>
                )}
                {link.badge && !collapsed && (
                  <span className="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">
                    {link.badge}
                  </span>
                )}
                {link.badge && collapsed && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="p-3 border-t border-border">
        {!collapsed && (
          <div className="mb-3 p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-cyan-500" />
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">SDG 3</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Supporting Good Health & Well-Being for all
            </p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
