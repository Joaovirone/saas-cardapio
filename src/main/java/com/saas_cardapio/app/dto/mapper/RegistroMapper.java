package com.saas_cardapio.app.dto.mapper;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.saas_cardapio.app.dto.RegistroRequestDto;
import com.saas_cardapio.app.entity.Cliente;


@Component
public class RegistroMapper {
    
        private final ModelMapper modelMapper;

    public RegistroMapper(){
        this.modelMapper = new ModelMapper();
    }
    
    public Cliente toCliente(RegistroRequestDto pedido){
        return modelMapper.map(pedido, Cliente.class);
    }
}
