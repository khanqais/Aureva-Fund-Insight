import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

// Create the context
const AuthContext = createContext(null);

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading until we check localStorage

  // On app load, check if there's a saved token and fetch the user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api
        .get('/api/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => {
          // Token is invalid or expired — clear it
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
