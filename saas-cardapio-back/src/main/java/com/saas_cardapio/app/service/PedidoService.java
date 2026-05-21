package com.saas_cardapio.app.service;

import java.util.List;
import java.util.stream.*;
import org.springframework.stereotype.Service;

import com.saas_cardapio.app.dto.PedidoRequestDto;
import com.saas_cardapio.app.dto.PedidoResponseDto;
import com.saas_cardapio.app.dto.mapper.PedidoMapper;
import com.saas_cardapio.app.entity.ItemPedido;
import com.saas_cardapio.app.entity.Pedido;
import com.saas_cardapio.app.repository.PedidoRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PedidoService {
    
    private final PedidoMapper pedidoMapper;
    private final PedidoRepository pedidoRepository;

    public PedidoResponseDto processarPedido(PedidoRequestDto requestDto) {
        
        if (requestDto.getNomeCliente() == null || requestDto.getNomeCliente().isBlank()) {
            throw new IllegalArgumentException("O nome do cliente não pode ser vazio.");
        }
        if (requestDto.getItens() == null || requestDto.getItens().isEmpty()) {
            throw new IllegalArgumentException("O pedido precisa ter pelo menos um item do cardápio.");
       }
    
       Pedido novoPedido = pedidoMapper.toPedido(requestDto);

       novoPedido.setStatus("RECEBIDO");
       novoPedido.setDataCriacao(java.time.Instant.now().toString());


       double totalCalculado = 0.0;
        for (ItemPedido item : novoPedido.getItens()) {
            int quantidade = (item.getQuantidade() != null && item.getQuantidade() > 0) ? item.getQuantidade() : 1;
            
            double precoReal Seguro = buscarPrecoRealNoBancoDeDados(item.getNome());

            item.setPreco(precoRealSeguro);

            totalCalculado += precoRealSeguro * quantidade;
        }
        novoPedido.setValorTotal(totalCalculado);

        pedidoRepository.salvar(novoPedido);
    
    
        PedidoResponseDto response = pedidoMapper.toPedidoResponse(novoPedido);
        response.setMensagem("Pedido processado com sucesso!");
        
        return response;
    
    }

    public List<PedidoResponseDto> listarPedidos() {
        List<Pedido> pedidosNoBanco = pedidoRepository.listarPedidosAtivos();
        return pedidosNoBanco.stream()
                .map(pedidoMapper::toPedidoResponse)
                .collect(Collectors.toList());
    }

    public void atualizarStatusPedido(String pedidoId, String novoStatus) {
        
        if(novoStatus == null || novoStatus.isBlank()) {
            throw new IllegalArgumentException("O novo status não pode ser vazio.");
        }
        pedidoRepository.atualizarStatusPedido(pedidoId, novoStatus.toUpperCase());
    }

}
