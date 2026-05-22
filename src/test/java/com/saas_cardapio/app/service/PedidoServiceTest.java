package com.saas_cardapio.app.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.saas_cardapio.app.dto.ItemRequestDto;
import com.saas_cardapio.app.dto.PedidoRequestDto;
import com.saas_cardapio.app.dto.PedidoResponseDto;
import com.saas_cardapio.app.dto.mapper.PedidoMapper;
import com.saas_cardapio.app.entity.ItemPedido;
import com.saas_cardapio.app.entity.Pedido;
import com.saas_cardapio.app.repository.PedidoRepository;
import com.saas_cardapio.app.repository.ProdutoRepository;

@ExtendWith(MockitoExtension.class)
public class PedidoServiceTest {
    
    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private PedidoMapper pedidoMapper;

    @InjectMocks
    private PedidoService pedidoService;

   @Test
    public void deveProcessarPedidoECalcularTotal() {
    
        // 1. ARRANGE (Preparar os dados do teste)
        PedidoRequestDto requestDto = new PedidoRequestDto();
        requestDto.setNomeCliente("João Vitor");
        
        // CORREÇÃO: Faltava colocar os itens na requisição de entrada (DTO)!
        // Importe a classe ItemRequestDto lá em cima se necessário
        ItemRequestDto itemReq1 = new ItemRequestDto();
        itemReq1.setNome("Duplo Smash Bacon");
        itemReq1.setQuantidade(2);
        
        ItemRequestDto itemReq2 = new ItemRequestDto();
        itemReq2.setNome("Coca-Cola Lata");
        itemReq2.setQuantidade(1);
        
        // Adicionando os itens no Request
        requestDto.setItens(List.of(itemReq1, itemReq2)); 
        
        // =========================================================
        
        // Simulando a Entidade que o Mapper devolveria
        Pedido pedidoSimulado = new Pedido();
        pedidoSimulado.setClienteNome("João Vitor");
        
        ItemPedido item1 = new ItemPedido();
        item1.setNome("Duplo Smash Bacon");
        item1.setQuantidade(2); 
        
        ItemPedido item2 = new ItemPedido();
        item2.setNome("Coca-Cola Lata");
        item2.setQuantidade(1); 
        
        pedidoSimulado.setItens(List.of(item1, item2));

        // Ensinando os Mocks a responderem
        when(pedidoMapper.toPedido(requestDto)).thenReturn(pedidoSimulado);
        when(produtoRepository.buscarPrecoPorNome("Duplo Smash Bacon")).thenReturn(28.90);
        when(produtoRepository.buscarPrecoPorNome("Coca-Cola Lata")).thenReturn(6.00);
        
        PedidoResponseDto responseSimulada = new PedidoResponseDto();
        when(pedidoMapper.toPedidoResponse(any(Pedido.class))).thenReturn(responseSimulada);

        // 2. ACT (Executar a ação principal)
        PedidoResponseDto resultado = pedidoService.processarPedido(requestDto);

        // 3. ASSERT (Verificar se o código fez o que deveria)
        assertNotNull(resultado);
        
        // (28.90 * 2) + (6.00 * 1) = 57.80 + 6.00 = 63.80
        assertEquals(63.80, pedidoSimulado.getValorTotal(), 0.001, "O cálculo do valor total está incorreto!");
        assertEquals("RECEBIDO", pedidoSimulado.getStatus());
        verify(pedidoRepository, times(1)).salvar(pedidoSimulado);
    }
    @Test
    public void deveLancarExcecaoQuandoProdutoNaoExistir() {
        PedidoRequestDto requestDto = new PedidoRequestDto();
        requestDto.setNomeCliente("");

        // Executar e Verificar se a exceção é lançada
        IllegalArgumentException excecao = assertThrows(IllegalArgumentException.class, () -> {
            pedidoService.processarPedido(requestDto);
        });

        assertEquals("O nome do cliente não pode ser vazio.", excecao.getMessage());
        
        // Garante que o sistema NUNCA chamou o banco de dados se deu erro
        verify(pedidoRepository, never()).salvar(any());
}
}

