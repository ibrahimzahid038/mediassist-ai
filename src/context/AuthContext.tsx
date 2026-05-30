import React, { createContext, useContext, useEffect, useState } from 'react';
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

  // Helper to construct User object from profiles table with metadata fallback
  const fetchProfileAndMap = async (supabaseUser: any): Promise<User> => {
    console.log("[AuthContext] fetchProfileAndMap requested for user:", supabaseUser.id);
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      
      if (error) {
        console.warn("[AuthContext] Profile database fetch failed (could be stale cache). Error:", error.message || error);
        throw error;
      }
      if (!profile) {
        console.warn("[AuthContext] No profile found in DB for user:", supabaseUser.id);
        throw new Error('No profile found');
      }
      
      console.log("[AuthContext] Profile successfully fetched from DB:", profile);
      return {
        id: supabaseUser.id,
        full_name: profile.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'User',
        email: profile.email || supabaseUser.email || '',
        role: (profile.role as UserRole) || 'user',
        avatar_url: profile.avatar_url || supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || '',
        phone: profile.phone || supabaseUser.user_metadata?.phone || supabaseUser.phone || '',
        blood_group: profile.blood_group || '',
        allergies: profile.allergies || '',
        medical_conditions: profile.medical_conditions || '',
        emergency_contact: profile.emergency_contact || '',
        location: profile.location || '',
        role_selected: profile.role_selected ?? supabaseUser.user_metadata?.role_selected ?? false,
        created_at: profile.created_at || supabaseUser.created_at,
      };
    } catch (err: any) {
      console.warn("[AuthContext] Profile fetch error. Falling back directly to Auth metadata. Error:", err?.message || err);
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
    console.log("[AuthContext] Initializing session check on mount...");

    // Check active session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return;
      console.log("[AuthContext] getSession resolved. Session exists:", !!session, "User ID:", session?.user?.id || "None");
      try {
        if (session?.user) {
          const mapped = await fetchProfileAndMap(session.user);
          setUser(mapped);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("[AuthContext] Error mapping user from session:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }).catch((err) => {
      console.error("[AuthContext] getSession promise rejected:", err);
      if (active) {
        setUser(null);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!active) return;
      console.log("[AuthContext] onAuthStateChange event:", event, "Session exists:", !!session, "User ID:", session?.user?.id || "None");
      try {
        if (session?.user) {
          const mapped = await fetchProfileAndMap(session.user);
          setUser(mapped);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("[AuthContext] Error mapping user in auth state change:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      console.log("[AuthContext] Cleaning up session check mount...");
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
    setLoading(true);
    try {
      // 1. Update auth user metadata first, because it is synchronous and reliable
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          role: selectedRole,
          role_selected: true,
        }
      });
      if (authError) throw authError;

      // 2. Try to update the public profiles table
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: selectedRole, role_selected: true })
          .eq('id', user.id);
        
        if (profileError) {
          // If the role_selected column doesn't exist in the PostgREST cache yet, update just 'role'
          console.warn('Schema cache error or stale cache. Retrying profile update without role_selected...');
          const { error: fallbackError } = await supabase
            .from('profiles')
            .update({ role: selectedRole })
            .eq('id', user.id);
          
          if (fallbackError) throw fallbackError;
        }
      } catch (profileErr: any) {
        console.error('Failed to update public profiles table, but auth metadata was updated successfully:', profileErr);
        // Do not block the user here, since their metadata updated successfully and they can navigate
      }

      // 3. Update local state
      setUser((prev) => (prev ? { ...prev, role: selectedRole, role_selected: true } : null));
      
      toast.success(`Account configured as ${selectedRole === 'client' ? 'Clinic' : 'Patient'}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete profile configuration');
      throw err;
    } finally {
      setLoading(false);
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
