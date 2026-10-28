import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { mockApi } from '../lib/mockApi';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  updateCurrentUserBalance: (creditsDelta: number, inrDelta?: number) => void;
  isLoadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;
    mockApi.getUsers().then((loadedUsers) => {
      if (!mounted) return;
      setUsers(loadedUsers);
      // Default to Citizen user Aarav Sharma
      const defaultUser = loadedUsers.find((u) => u.role === 'citizen') || loadedUsers[0];
      setCurrentUser(defaultUser);
      setIsLoadingAuth(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const switchRole = (role: UserRole) => {
    const userForRole = users.find((u) => u.role === role);
    if (userForRole) {
      setCurrentUser(userForRole);
    }
  };

  const updateCurrentUserBalance = (creditsDelta: number, inrDelta: number = 0) => {
    if (!currentUser) return;
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        totalCredits: (prev.totalCredits || 0) + creditsDelta,
        availableCredits: (prev.availableCredits || 0) + creditsDelta,
        balanceINR: (prev.balanceINR || 0) + inrDelta
      };
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        currentRole: currentUser?.role || 'citizen',
        switchRole,
        updateCurrentUserBalance,
        isLoadingAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
