package com.saas_cardapio.app.entity;

import java.util.List;

import lombok.Data;

@Data
public class Pedido {
    private String id;
    private String clienteNome;
    private String telefone;
    private List<ItemPedido> itens;
    private Double valorTotal;
    private String status;
    private String dataCriacao;
}
