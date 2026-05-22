package com.saas_cardapio.app.dto.mapper;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.saas_cardapio.app.dto.ItemRequestDto;
import com.saas_cardapio.app.entity.ItemPedido;

@Component
public class ItemMapper {
    
        private final ModelMapper modelMapper;

    public ItemMapper(){
        this.modelMapper = new ModelMapper();
    }
    
    public ItemPedido toItemPedido(ItemRequestDto pedido){
        return modelMapper.map(pedido, ItemPedido.class);
    }
}
