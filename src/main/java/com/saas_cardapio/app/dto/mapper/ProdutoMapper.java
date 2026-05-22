package com.saas_cardapio.app.dto.mapper;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.saas_cardapio.app.dto.ProdutoRequestDto;
import com.saas_cardapio.app.dto.ProdutoResponseDto;
import com.saas_cardapio.app.entity.Produto;

@Component
public class ProdutoMapper {
    
    private final ModelMapper modelMapper;

    public ProdutoMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public Produto toProduto(ProdutoRequestDto produtoRequestDto) {
        return modelMapper.map(produtoRequestDto, Produto.class);
    }
    public ProdutoResponseDto toProdutoResponseDto(Produto produto) {
        return modelMapper.map(produto, ProdutoResponseDto.class);
    }
}
