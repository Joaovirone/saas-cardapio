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
      isAdmin: !!token, // Se tem token, assumimos que é admin no contexto deste app
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