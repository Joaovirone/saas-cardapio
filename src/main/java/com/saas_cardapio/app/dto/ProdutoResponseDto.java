package com.saas_cardapio.app.dto;

import java.util.List;

import lombok.Data;

@Data
public class ProdutoResponseDto {
    private String id;
    private String nome;
    private String descricao;
    private Double preco;
    private String categoria;
    private String imageUrl;
    private boolean disponivel;
    private List<AdicionalResponseDto> adicionais;
}
