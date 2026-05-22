import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Dica: Se estiver no emulador Android, use 10.0.2.2. Se for Web/iOS, use localhost
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 
  (Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080');

// Função auxiliar para montar os cabeçalhos com o Token JWT (se existir)
const getHeaders = async (): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  try {
    const token = await AsyncStorage.getItem('@SaaS_Token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Erro ao ler o token do AsyncStorage:', error);
  }
  
  return headers;
};

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: await getHeaders(), // Usando o gerador de cabeçalhos
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  },

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: await getHeaders(),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  },
};