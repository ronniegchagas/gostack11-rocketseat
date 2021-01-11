import React, { createContext, useCallback, useContext, useState } from 'react';

import api from '../services/api';

interface AuthState {
  token: string;
  user: any;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: any;
  signIn(credentials: SignInCredentials): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState | null>(() => {
    const token = localStorage.getItem('@GoBaber:token');
    const user = localStorage.getItem('@GoBaber:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password
    });

    const { token, user } = response.data;

    localStorage.setItem('@GoBaber:token', token);
    localStorage.setItem('@GoBaber:user', JSON.stringify(user));

    setData({ token, user });
  }, []);
  return (
    <AuthContext.Provider value={{ user: data?.user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
