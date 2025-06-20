
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { useAppContext } from '../hooks/useAppContext'; // To interact with user data

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, passwordAttempt: string) => Promise<boolean>;
  signup: (name: string, email: string, passwordRaw: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple ID generator
const generateId = (): string => Date.now().toString(36) + Math.random().toString(36).substring(2, 9);


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { users, addUser, addToast } = useAppContext();

  useEffect(() => {
    // Simulate checking for an existing session (e.g., from localStorage)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        // Validate user exists in our "DB"
        const existingUser = users.find(u => u.id === parsedUser.id);
        if (existingUser) {
          setCurrentUser(existingUser);
        } else {
          localStorage.removeItem('currentUser'); // Stale user data
        }
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, [users]); // Depend on users from AppContext in case it initializes later

  const login = async (email: string, passwordAttempt: string): Promise<boolean> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = users.find(u => u.email === email);
    
    // IMPORTANT: This is NOT secure password checking. For MVP only.
    // In a real app, passwords would be hashed and compared on the server.
    if (user && user.passwordHash === passwordAttempt) { // Direct compare for MVP
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      addToast({ id: generateId(), message: `Welcome back, ${user.name}!`, type: 'success' });
      setLoading(false);
      return true;
    }
    addToast({ id: generateId(), message: 'Invalid email or password.', type: 'error' });
    setLoading(false);
    return false;
  };

  const signup = async (name: string, email: string, passwordRaw: string): Promise<boolean> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    if (users.find(u => u.email === email)) {
      addToast({ id: generateId(), message: 'Email already in use.', type: 'error' });
      setLoading(false);
      return false;
    }

    const newUser: User = {
      id: generateId(),
      name,
      email,
      passwordHash: passwordRaw, // Store raw for MVP, DO NOT DO THIS IN PRODUCTION
    };
    addUser(newUser); // Add to our "DB" via AppContext
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    addToast({ id: generateId(), message: `Welcome, ${name}! Account created.`, type: 'success' });
    setLoading(false);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    addToast({ id: generateId(), message: 'Successfully logged out.', type: 'info' });
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
    