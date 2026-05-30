import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Listen for auth changes. When the session is successfully established, redirect to dashboard.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        if (isMounted) {
          navigate('/dashboard', { replace: true });
        }
      }
    });

    // 2. Check if a session already exists (e.g. if the SDK already processed the callback)
    // If not, we wait for a maximum of 4 seconds before redirecting to login as a fallback.
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          if (isMounted) {
            navigate('/dashboard', { replace: true });
          }
        } else {
          // If no session is active immediately, set a timeout to redirect to login if auth fails
          const timer = setTimeout(() => {
            if (isMounted) {
              navigate('/login', { replace: true });
            }
          }, 4000);
          return () => clearTimeout(timer);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Authentication failed');
          setTimeout(() => {
            if (isMounted) navigate('/login', { replace: true });
          }, 3000);
        }
      }
    };

    const cleanupPromise = checkSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      cleanupPromise.then((cleanup) => cleanup && cleanup());
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-4">
      <div className="flex flex-col items-center max-w-sm text-center">
        <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Completing Sign-In</h2>
        <p className="text-slate-500 dark:text-slate-400">
          {error ? `Error: ${error}` : 'Please wait while we secure your session and redirect you...'}
        </p>
      </div>
    </div>
  );
}

