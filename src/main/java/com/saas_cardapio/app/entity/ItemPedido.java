package com.saas_cardapio.app.entity;

import lombok.Data;

@Data
public class ItemPedido {
    private String nome;
    private Double preco;
    private Integer quantidade;
}
