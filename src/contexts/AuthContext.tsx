import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  login: () => void;
  logout: () => void;
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
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = () => {
    // Mock Google OAuth implementation
    // In production, this would integrate with Google OAuth2
    const mockUser = {
      id: 'google_' + Date.now(),
      email: 'user@example.com',
      name: 'Test User',
      picture: 'https://via.placeholder.com/150',
      isRegistered: false
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Check if user is already registered
    checkRegistrationStatus(mockUser.email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.clear();
  };

  const setUserRegistered = () => {
    if (user) {
      const updatedUser = { ...user, isRegistered: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      sessionStorage.setItem('isRegistered', 'true');
    }
  };

  const checkRegistrationStatus = async (email: string) => {
    try {
      // Mock API call to check registration
      const isRegistered = sessionStorage.getItem('isRegistered') === 'true';
      if (user && isRegistered) {
        const updatedUser = { ...user, isRegistered: true };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error checking registration status:', error);
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