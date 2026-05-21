package com.saas_cardapio.app.dto.mapper;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.saas_cardapio.app.dto.PedidoRequestDto;
import com.saas_cardapio.app.dto.PedidoResponseDto;
import com.saas_cardapio.app.entity.Pedido;


@Component
public class PedidoMapper {

    private final ModelMapper modelMapper;

    public PedidoMapper(){
        this.modelMapper = new ModelMapper();
    }
    
    public Pedido toPedido(PedidoRequestDto pedido){
        return modelMapper.map(pedido, Pedido.class);
    }

    public PedidoResponseDto toPedidoResponse(Pedido pedido){
        return modelMapper.map(pedido, PedidoResponseDto.class);
    }
}
