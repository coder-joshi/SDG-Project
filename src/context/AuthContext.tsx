import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { mockApi } from '../lib/mockApi';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  currentRole: UserRole;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  updateCurrentUserBalance: (creditsDelta: number, inrDelta?: number) => void;
  isLoadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const SESSION_KEY = 'greenledger-session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;
    mockApi.getUsers().then((loadedUsers) => {
      if (!mounted) return;
      setUsers(loadedUsers);
      const savedId = sessionStorage.getItem(SESSION_KEY);
      setCurrentUser(loadedUsers.find((user) => user.id === savedId) || null);
      setIsLoadingAuth(false);
    });
    return () => { mounted = false; };
  }, []);

  const login = async (email: string, password: string) => {
    const candidate = users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase());
    // This frontend-only demonstration uses one shared demo password. Replace with server authentication before deployment.
    if (!candidate || password !== 'GreenLedger2026!') return null;
    sessionStorage.setItem(SESSION_KEY, candidate.id);
    setCurrentUser(candidate);
    return candidate;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  };

  const updateCurrentUserBalance = (creditsDelta: number, inrDelta = 0) => {
    setCurrentUser((prev) => prev ? {
      ...prev,
      totalCredits: (prev.totalCredits || 0) + creditsDelta,
      availableCredits: (prev.availableCredits || 0) + creditsDelta,
      balanceINR: (prev.balanceINR || 0) + inrDelta
    } : null);
  };

  return <AuthContext.Provider value={{ currentUser, users, currentRole: currentUser?.role || 'citizen', login, logout, updateCurrentUserBalance, isLoadingAuth }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
