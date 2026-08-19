'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import { farmers, buyers, admins } from '@/data/users';

const AuthContext = createContext(null);

// Demo users for each role
const DEMO_USERS = {
  farmer: farmers[0],  // Ramesh Patel
  buyer: buyers[0],    // Metro Fresh Retail
  admin: admins[0],    // Vikram Desai
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const login = useCallback((selectedRole) => {
    const demoUser = DEMO_USERS[selectedRole];
    setUser(demoUser);
    setRole(selectedRole);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setRole(null);
  }, []);

  const switchRole = useCallback((newRole) => {
    const demoUser = DEMO_USERS[newRole];
    setUser(demoUser);
    setRole(newRole);
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, login, logout, switchRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
