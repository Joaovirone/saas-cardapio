package com.saas_cardapio.app.dto;

import java.util.List;
import lombok.Data;

@Data
public class ProdutoRequestDto {

    private String nome;
    private String descricao;
    private Double preco;
    private String categoria;
    private String imageUrl;
    private Boolean disponivel;
    private List<AdicionalRequestDto> adicionais;
}
