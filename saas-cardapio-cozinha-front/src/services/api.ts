// Descobre se o código está rodando no Servidor (Docker) ou no Navegador (Client-side)
const isServer = typeof window === 'undefined';

// O Pulo do Gato para o Docker: 
// Se for no servidor SSR do Next.js, usa a rede interna (http://api:8080).
// Se for no navegador do usuário, usa o localhost normal (http://localhost:8080).
const API_BASE_URL = isServer 
  ? (process.env.INTERNAL_API_URL || 'http://api:8080')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');

const getToken = () => {
  // Reaproveitamos a constante isServer para evitar erros de "window is not defined"
  if (isServer) return null; 
  return window.localStorage.getItem('@SaaS_Token');
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Erro na API: ${response.status}`;
    try {
      const body = await response.json();
      message = body.message || body.mensagem || message;
    } catch {
      const text = await response.text();
      if (text) message = text;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  patch: <T>(endpoint: string) => request<T>(endpoint, { method: 'PATCH' }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};