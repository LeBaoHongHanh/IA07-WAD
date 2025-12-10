import React, { createContext, useContext, useEffect, useState } from 'react';
import { tokenService } from '../../services/tokenService';
import { authApi } from '../../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const isAuthenticated = Boolean(accessToken && user);

  const applyAuth = ({ accessToken, refreshToken, user }) => {
    if (accessToken) {
      tokenService.setAccessToken(accessToken);
      setAccessToken(accessToken);
    }
    if (refreshToken) {
      tokenService.setRefreshToken(refreshToken);
    }
    setUser(user || null);
  };

  const login = (data) => {
    applyAuth(data);
  };

  const logout = async () => {
    try {
      const refreshToken = tokenService.getRefreshToken();
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (e) {
      // ignore
    }
    tokenService.clearTokens();
    setAccessToken(null);
    setUser(null);
  };

  // On first load, if refresh token exists, try to refresh & get profile
  useEffect(() => {
    const init = async () => {
      try {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) return;

        // Try refresh access token
        const res = await fetch('http://localhost:4000/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.accessToken) {
          tokenService.setAccessToken(data.accessToken);
          setAccessToken(data.accessToken);
          const me = await authApi.getMe();
          setUser(me);
        }
      } catch (e) {
        tokenService.clearTokens();
        setAccessToken(null);
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };
    init();
  }, []);

  const value = {
    user,
    accessToken,
    isAuthenticated,
    initializing,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
};
