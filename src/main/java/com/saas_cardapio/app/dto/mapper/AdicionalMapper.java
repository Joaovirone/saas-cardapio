package com.saas_cardapio.app.dto.mapper;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.saas_cardapio.app.dto.AdicionalRequestDto;
import com.saas_cardapio.app.dto.AdicionalResponseDto;
import com.saas_cardapio.app.entity.Adicional;

@Component
public class AdicionalMapper {
    
    private final ModelMapper modelMapper;

    public AdicionalMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }
    
    public Adicional toAdicional(AdicionalRequestDto adicionalRequestDto) {
        return modelMapper.map(adicionalRequestDto, Adicional.class);
    }

    public AdicionalResponseDto toAdicionalResponseDto(Adicional adicional) {
        return modelMapper.map(adicional, AdicionalResponseDto.class);
    }
}
