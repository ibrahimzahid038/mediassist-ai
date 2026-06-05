import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, UserRole } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role?: UserRole, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Guard flag: prevents onAuthStateChange from overwriting state during role update
  const isUpdatingRole = useRef(false);

  // Helper to construct User object from profiles table with metadata fallback
  const fetchProfileAndMap = async (supabaseUser: any): Promise<User> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      
      if (error || !profile) throw error || new Error('No profile found');
      
      return {
        id: supabaseUser.id,
        full_name: profile.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'User',
        email: profile.email || supabaseUser.email || '',
        role: (profile.role as UserRole) || 'user',
        avatar_url: profile.avatar_url || supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || '',
        phone: profile.phone || supabaseUser.user_metadata?.phone || supabaseUser.phone || '',
        blood_group: profile.blood_group || supabaseUser.user_metadata?.blood_group || '',
        allergies: profile.allergies || supabaseUser.user_metadata?.allergies || '',
        medical_conditions: profile.medical_conditions || supabaseUser.user_metadata?.medical_conditions || '',
        emergency_contact: profile.emergency_contact || supabaseUser.user_metadata?.emergency_contact || '',
        location: profile.location || supabaseUser.user_metadata?.location || '',
        role_selected: profile.role_selected ?? false,
        created_at: profile.created_at || supabaseUser.created_at,
      };
    } catch (err) {
      // Fallback directly to OAuth metadata if profile fetch fails
      return {
        id: supabaseUser.id,
        full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'User',
        email: supabaseUser.email || '',
        role: (supabaseUser.user_metadata?.role as UserRole) || 'user',
        avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || '',
        phone: supabaseUser.user_metadata?.phone || supabaseUser.phone || '',
        blood_group: supabaseUser.user_metadata?.blood_group || '',
        allergies: supabaseUser.user_metadata?.allergies || '',
        medical_conditions: supabaseUser.user_metadata?.medical_conditions || '',
        emergency_contact: supabaseUser.user_metadata?.emergency_contact || '',
        location: supabaseUser.user_metadata?.location || '',
        role_selected: supabaseUser.user_metadata?.role_selected ?? false,
        created_at: supabaseUser.created_at,
      };
    }
  };

  useEffect(() => {
    let active = true;

    // Check active session on mount with timeout
    const sessionTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Session check timeout')), 5000)
    );

    Promise.race([supabase.auth.getSession(), sessionTimeout])
      .then(async ({ data: { session } }) => {
        if (!active) return;
        try {
          if (session?.user) {
            const mapped = await fetchProfileAndMap(session.user);
            setUser(mapped);
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error("[AuthContext] Error checking session on mount:", err);
          setUser(null);
        } finally {
          if (active) setLoading(false);
        }
      })
      .catch((err) => {
        console.error("[AuthContext] Session check failed:", err);
        if (active) {
          setUser(null);
          setLoading(false);
        }
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!active) return;

      // Ignore initial session event on mount to prevent race conditions with getSession()
      if (event === 'INITIAL_SESSION') {
        return;
      }

      // Skip re-fetching during an active role update to prevent stale data from overwriting local state
      if (isUpdatingRole.current) {
        return;
      }

      try {
        if (session?.user) {
          const mapped = await fetchProfileAndMap(session.user);
          setUser(mapped);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("[AuthContext] Error on auth state change:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        const mapped = await fetchProfileAndMap(data.user);
        setUser(mapped);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, fullName: string, role: UserRole = 'user', phone?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            phone: phone || '',
            role_selected: true,
          },
        },
      });
      if (error) throw error;
      if (data.user) {
        // Allow trigger to execute
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mapped = await fetchProfileAndMap(data.user);
        setUser(mapped);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
  };

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (selectedRole: UserRole) => {
    if (!user) return;

    // Set the guard flag so onAuthStateChange skips re-fetching during this update
    isUpdatingRole.current = true;

    try {
      // 1. Update public profiles table (using upsert in case the row doesn't exist yet)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: user.full_name || '',
          email: user.email || '',
          avatar_url: user.avatar_url || '',
          phone: user.phone || '',
          role: selectedRole,
          role_selected: true,
          updated_at: new Date().toISOString(),
        });
      
      if (profileError) throw profileError;

      // 2. Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          role: selectedRole,
          role_selected: true,
        }
      });
      if (authError) throw authError;

      // 3. Update local state
      setUser((prev) => (prev ? { ...prev, role: selectedRole, role_selected: true } : null));
      
      toast.success(`Account configured as ${selectedRole === 'client' ? 'Clinic' : 'Patient'}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete profile configuration');
      throw err;
    } finally {
      // Release the guard after a short delay to let any pending onAuthStateChange callbacks settle
      setTimeout(() => { isUpdatingRole.current = false; }, 2000);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        resetPassword: handleResetPassword,
        signInWithGoogle: handleSignInWithGoogle,
        updateUserRole: handleUpdateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
