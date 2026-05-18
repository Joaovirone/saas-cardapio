package com.saas_cardapio.app.dto;

public record PedidoResponse(

    String pedidoId,
    String mensagem,
    Double valorTotal,
    String status

) {}
