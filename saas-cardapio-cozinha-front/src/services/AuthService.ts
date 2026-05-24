import { LoginResponse } from '../domain/types';
import { api } from './api';

export const AuthService = {
  login: async (email: string, senha: string) => {
    const response = await api.post<LoginResponse>('/auth/login', { email, senha });
    window.localStorage.setItem('@SaaS_Token', response.token);
    return response;
  },

  logout: () => {
    window.localStorage.removeItem('@SaaS_Token');
  },

  estaAutenticado: () => {
    if (typeof window === 'undefined') return false;
    return Boolean(window.localStorage.getItem('@SaaS_Token'));
  },
};
