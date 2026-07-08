// useAuth — v1.2 (code/msg/data)
import { useState, useEffect, useCallback } from 'react';
import { login as apiLogin, getMe, logout as apiLogout, setToken, clearToken, isAuthenticated } from '../api/auth';
import { getProfile, updateProfile } from '../api/profile';
import type { LoginRequest, PublicProfile, PrivateProfile, AuthUser } from '../types';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) { setLoading(false); return; }
    Promise.all([getMe().then((r) => setUser(r.data)), getProfile().then((r) => setProfile(r.data))])
      .catch(() => { clearToken(); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    setError(null);
    const res = await apiLogin(data);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try { await apiLogout(); } catch {}
    clearToken();
    setUser(null);
    setProfile(null);
  }, []);

  const updateUserProfile = useCallback(async (data: Record<string, unknown>) => {
    const res = await updateProfile(data as Parameters<typeof updateProfile>[0]);
    setProfile(res.data);
    return res.data;
  }, []);

  return {
    user, profile, loading, error,
    isLoggedIn: !!user,
    isAdmin: !!user,
    login, logout, updateProfile: updateUserProfile,
  };
}
