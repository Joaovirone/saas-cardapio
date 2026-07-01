import { mockProdutos } from './mockData';

const isServer = typeof window === 'undefined';

const API_BASE_URL = isServer 
  ? (process.env.INTERNAL_API_URL || 'http://api:8080')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');

// ==========================================================
// MODO LOCAL: use a API real por padrão para validar o Docker
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
// ==========================================================

const getToken = () => {
  if (isServer) return null; 
  return window.localStorage.getItem('@SaaS_Token');
};

// Simulador de atraso de rede (delay)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  
  // SEÇÃO MOCK: Intercepta a requisição antes de bater na rede
  if (USE_MOCKS && !isServer) {
    await delay(800); // Finge que a internet demorou 800ms (ótimo para testar loadings)
    const method = options.method || 'GET';

    console.log(`[MOCK] ${method} ${endpoint}`);

    // Mock do Login
    if (endpoint.includes('/auth/login') && method === 'POST') {
      const body = JSON.parse(options.body as string);
      if (body.email && body.senha) {
        return { token: 'mock-jwt-token-super-seguro-123' } as T;
      }
      throw new Error('E-mail e senha são obrigatórios no mock.');
    }

    // Mock de Listar Produtos
    if (endpoint === '/produtos' && method === 'GET') {
      return mockProdutos as T;
    }

    // Mock de Buscar Produto por ID
    if (endpoint.startsWith('/produtos/') && method === 'GET') {
      const id = endpoint.split('/')[2];
      const produto = mockProdutos.find(item => item.id === id);
      if (!produto) throw new Error('Produto não encontrado.');
      return produto as T;
    }

    // Mock de Criar Produto
    if (endpoint === '/produtos' && method === 'POST') {
      const novoProduto = JSON.parse(options.body as string);
      const produtoCriado = { id: Math.random().toString(), ...novoProduto };
      mockProdutos.unshift(produtoCriado);
      return produtoCriado as T;
    }

    // Mock de Atualizar Produto
    if (endpoint.startsWith('/produtos/') && method === 'PUT') {
      const id = endpoint.split('/')[2];
      const dadosAtualizados = JSON.parse(options.body as string);
      const index = mockProdutos.findIndex(item => item.id === id);
      if (index === -1) throw new Error('Produto não encontrado.');
      mockProdutos[index] = { ...mockProdutos[index], ...dadosAtualizados };
      return mockProdutos[index] as T;
    }

    // Mock de Excluir Produto
    if (endpoint.startsWith('/produtos/') && method === 'DELETE') {
      const id = endpoint.split('/')[2];
      const index = mockProdutos.findIndex(item => item.id === id);
      if (index === -1) throw new Error('Produto não encontrado.');
      mockProdutos.splice(index, 1);
      return undefined as T;
    }
  }

  // SEÇÃO REAL: O código que você já tinha e funciona perfeitamente
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
    const responseText = await response.text();
    
    try {
      if (responseText) {
        const body = JSON.parse(responseText);
        message = body.message || body.mensagem || message;
      }
    } catch {
      if (responseText) message = responseText;
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
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