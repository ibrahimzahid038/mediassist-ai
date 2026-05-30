import { createClient } from '@supabase/supabase-js';
// NOTE: Removed aggressive session-clearing code that was here previously.
// It was wiping sb-* cookies and localStorage tokens on every page load,
// which destroyed the active Supabase session and caused infinite loading loops.

// -------------------------------------------------
// Load and validate environment variables
// -------------------------------------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is not configured. Please set a valid Supabase project URL in your .env file.');
}
if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is not configured. Please set a valid Supabase anon public key in your .env file.');
}

// -------------------------------------------------
// Create Supabase client
// -------------------------------------------------
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// -------------------------------------------------------------------
// Database helper functions (unchanged)
// -------------------------------------------------------------------
export async function signUp(email: string, password: string, fullName: string, role: string = 'user') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

// Reports
export async function createReport(report: {
  user_id: string;
  symptoms: string[];
  ai_analysis: string;
  risk_level: string;
  recommendations: string[];
}) {
  const { data, error } = await supabase
    .from('reports')
    .insert([report])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getReports(userId: string) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Chat history
export async function saveChatMessage(message: {
  user_id: string;
  message: string;
  sender: 'user' | 'ai';
}) {
  const { data, error } = await supabase
    .from('chat_history')
    .insert([{ ...message, timestamp: new Date().toISOString() }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getChatHistory(userId: string) {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: true });
  if (error) throw error;
  return data;
}

// Notifications
export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read_status: true })
    .eq('id', id);
  if (error) throw error;
}

// Emergency alerts
export async function createEmergencyAlert(alert: {
  user_id: string;
  severity: string;
  symptoms: string[];
}) {
  const { data, error } = await supabase
    .from('emergency_alerts')
    .insert([alert])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Admin: get all users (profiles)
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Admin: delete user profile (trigger handles auth deletion)
export async function deleteUser(userId: string) {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);
  if (error) throw error;
}
