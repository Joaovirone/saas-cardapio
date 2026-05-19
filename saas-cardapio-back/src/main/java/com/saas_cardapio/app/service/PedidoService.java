package com.saas_cardapio.app.service;

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


       double totalCalculado = 0.0;
        for (ItemPedido item : novoPedido.getItens()) {
            int quantidade = (item.getQuantidade() != null && item.getQuantidade() > 0) ? item.getQuantidade() : 1;
            totalCalculado += (item.getPreco() * quantidade);
        }
        novoPedido.setValorTotal(totalCalculado);

        pedidoRepository.salvar(novoPedido);
    
    
        PedidoResponseDto response = pedidoMapper.toPedidoResponse(novoPedido);
        response.setMensagem("Pedido processado com sucesso!");
        
        return response;
    
    }

}
