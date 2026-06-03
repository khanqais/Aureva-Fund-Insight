import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

// This page handles the redirect from the backend after Google OAuth.
// The backend sends the user here with ?token=<jwt> in the URL.
const AuthCallback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      navigate('/login?error=oauth_failed');
      return;
    }

    // Store the token so the axios interceptor picks it up
    localStorage.setItem('token', token);

    // Fetch the user profile using the new token
    api
      .get('/api/auth/me')
      .then((res) => {
        login(res.data, token);
        navigate('/');
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login?error=oauth_failed');
      });
  }, []);

  return <LoadingSpinner message="Signing you in with Google..." />;
};

export default AuthCallback;
