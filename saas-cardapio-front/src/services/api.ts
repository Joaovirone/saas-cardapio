const API_URL = 'SUA_NOVA_URL_DO_API_GATEWAY_V1'; // Ex: https://xyz123.execute-api.sa-east-1.amazonaws.com/prd
const API_KEY = 'A_CHAVE_GIGANTE_QUE_O_GITHUB_ACTIONS_PRINTOU';

export interface ItemPedidoDTO {
  nome: string;
  preco: number;
  quantidade: number;
}

export interface PedidoRequestDTO {
  nomeCliente: string;
  telefone: string;
  itens: ItemPedidoDTO[];
}

export const cardapioApi = {
  async enviarPedido(pedido: PedidoRequestDTO) {
    try {
      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY // A blindagem que criamos no Gateway!
        },
        body: JSON.stringify(pedido)
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Falha ao integrar com o backend AWS:", error);
      throw error;
    }
  }
};