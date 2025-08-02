import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  isRegistered?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setUserRegistered: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleUserSession(session.user);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        handleUserSession(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSession = async (supabaseUser: SupabaseUser) => {
    const userData: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'User',
      picture: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
      isRegistered: false
    };

    // Check if user is registered
    const isRegistered = await checkRegistrationStatus(userData.email);
    userData.isRegistered = isRegistered;

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const login = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error('Error logging in:', error.message);
        throw error;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error.message);
      }
      setUser(null);
      localStorage.removeItem('user');
      sessionStorage.clear();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const setUserRegistered = () => {
    if (user) {
      const updatedUser = { ...user, isRegistered: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      sessionStorage.setItem('isRegistered', 'true');
    }
  };

  const checkRegistrationStatus = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('email')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking registration:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking registration status:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    setUserRegistered
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};