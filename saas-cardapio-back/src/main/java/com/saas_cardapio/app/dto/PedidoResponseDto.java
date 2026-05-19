package com.saas_cardapio.app.dto;

import lombok.Data;

@Data
public class PedidoResponseDto{

    String pedidoId;
    String mensagem;
    Double valorTotal;
    String status;
}
