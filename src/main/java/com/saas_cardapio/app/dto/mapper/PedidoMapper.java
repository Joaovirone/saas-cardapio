package com.saas_cardapio.app.dto.mapper;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.saas_cardapio.app.dto.PedidoRequestDto;
import com.saas_cardapio.app.dto.PedidoResponseDto;
import com.saas_cardapio.app.entity.Pedido;
import com.saas_cardapio.app.entity.ItemPedido;

import java.util.ArrayList;

@Component
public class PedidoMapper {

    private final ModelMapper modelMapper;

    public PedidoMapper(){
        this.modelMapper = new ModelMapper();
    }
    
    public Pedido toPedido(PedidoRequestDto pedido){
        Pedido entity = new Pedido();
        entity.setClienteNome(pedido.getNomeCliente());
        entity.setTelefone(pedido.getTelefone());
        entity.setItens(pedido.getItens() != null
                ? new ArrayList<>(pedido.getItens().stream().map(item -> {
                    ItemPedido itemPedido = new ItemPedido();
                    itemPedido.setNome(item.getNome());
                    itemPedido.setQuantidade(item.getQuantidade());
                    itemPedido.setPreco(item.getPreco());
                    return itemPedido;
                }).toList())
                : new ArrayList<>());
        return entity;
    }

    public PedidoResponseDto toPedidoResponse(Pedido pedido){
        PedidoResponseDto response = modelMapper.map(pedido, PedidoResponseDto.class);
        response.setPedidoId(pedido.getId());
        return response;
    }
}
