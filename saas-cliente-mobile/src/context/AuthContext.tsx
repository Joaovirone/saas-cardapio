import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api'; 

interface AuthContextData {
  token: string | null;
  isAdmin: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  carregando: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const tokenTemRoleAdmin = (jwt: string | null) => {
  if (!jwt) return false;
  try {
    const payloadBase64 = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(payloadBase64));
    return payload.role === 'ADMIN' || payload.role === 'ROLE_ADMIN';
  } catch {
    return false;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarStorage() {
      const storageToken = await AsyncStorage.getItem('@SaaS_Token');
      if (storageToken) {
        setToken(storageToken);
      }
      setCarregando(false);
    }
    carregarStorage();
  }, []);

  async function login(email: string, senha: string) {
    try {
      // Chama o endpoint de autenticação que criamos no Java
      const response = await api.post<{ token: string }>('/auth/login', { email, senha });
      
      const novoToken = response.token;
      setToken(novoToken);
      await AsyncStorage.setItem('@SaaS_Token', novoToken);
    } catch (error) {
      throw new Error('Credenciais inválidas. Verifique seu e-mail e senha.');
    }
  }

  async function logout() {
    setToken(null);
    await AsyncStorage.removeItem('@SaaS_Token');
  }

  return (
    <AuthContext.Provider value={{ 
      token, 
      isAdmin: tokenTemRoleAdmin(token),
      login, 
      logout, 
      carregando 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
