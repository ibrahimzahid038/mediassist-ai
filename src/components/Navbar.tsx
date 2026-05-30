import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu, X, Sun, Moon, Bell, LogOut, User, Settings,
  Activity, ChevronDown, Heart
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { cn, getInitials } from '../lib/utils';
import { getNotifications } from '../lib/supabase';
import type { Notification } from '../types';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const isLanding = !user && (location.pathname === '/' || location.pathname === '/about' || location.pathname === '/features' || location.pathname === '/contact' || location.pathname === '/faq');
  const unreadCount = notifications.filter(n => !n.read_status).length;

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
      console.error('Failed to load navbar notifications', err);
    }
  };

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = user
    ? []
    : [
        { name: 'Home', href: '/' },
        { name: 'Features', href: '/features' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
      ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        'sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-colors',
        isLanding
          ? 'bg-slate-900/80 border-white/10'
          : 'bg-background/80 border-border'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl medical-gradient-bg flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-shadow">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                'text-lg font-bold font-display tracking-tight',
                isLanding ? 'text-white' : 'gradient-text'
              )}>
                MediAssist
              </span>
              <span className={cn(
                'text-[10px] font-medium -mt-1 tracking-wider',
                isLanding ? 'text-cyan-400' : 'text-cyan-600 dark:text-cyan-400'
              )}>
                AI POWERED
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === link.href
                    ? isLanding ? 'text-white bg-white/10' : 'text-foreground bg-accent'
                    : isLanding ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isLanding ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <>
                {/* Notifications */}
                <div ref={notifRef} className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-border">
                        <h3 className="font-semibold">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.slice(0, 4).map(notif => (
                            <div
                              key={notif.id}
                              className={cn(
                                'p-3 border-b border-border last:border-0 hover:bg-accent/50 cursor-pointer transition-colors',
                                !notif.read_status && 'bg-cyan-50/50 dark:bg-cyan-500/5'
                              )}
                            >
                              <p className="text-sm font-medium">{notif.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-xs text-muted-foreground">
                            No notifications yet.
                          </div>
                        )}
                      </div>
                      <Link
                        to="/dashboard/notifications"
                        onClick={() => setNotifOpen(false)}
                        className="block p-3 text-center text-sm text-cyan-600 dark:text-cyan-400 hover:bg-accent/50 font-medium"
                      >
                        View all notifications
                      </Link>
                    </motion.div>
                  )}
                </div>

                {/* Profile dropdown */}
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-accent transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg medical-gradient-bg flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(user.full_name)}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium leading-tight">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                  </button>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                    >
                      <div className="p-3 border-b border-border">
                        <p className="font-medium text-sm">{user.full_name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                        >
                          <Activity className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link
                          to="/dashboard/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                        >
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <Link
                          to="/dashboard/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                        >
                          <Settings className="w-4 h-4" /> Settings
                        </Link>
                      </div>
                      <div className="p-1 border-t border-border">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isLanding ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm !py-2 !px-5"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                'md:hidden p-2 rounded-lg transition-colors',
                isLanding ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={cn(
            'md:hidden border-t',
            isLanding ? 'bg-slate-900 border-white/10' : 'bg-card border-border'
          )}
        >
          <div className="p-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isLanding ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <div className="pt-3 space-y-2 border-t border-border mt-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-center text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block btn-primary text-sm text-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
