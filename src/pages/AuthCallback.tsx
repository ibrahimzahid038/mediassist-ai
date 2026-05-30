import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    // Let Supabase parse the URL and create a session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Redirect to the dashboard (or any page you prefer)
        navigate('/dashboard', { replace: true });
      } else {
        // No session – go back to login
        navigate('/login', { replace: true });
      }
    }).catch(() => {
      navigate('/login', { replace: true });
    });
  }, []);

  // Render nothing – this component only handles the redirect
  return null;
}
