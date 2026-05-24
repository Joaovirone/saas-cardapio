package com.saas_cardapio.app.dto;

import java.util.List;

import lombok.Data;

@Data
public class PedidoResponseDto{

    String id;
    String pedidoId;
    String mensagem;
    String clienteNome;
    String telefone;
    List<ItemRequestDto> itens;
    Double valorTotal;
    String status;
    String dataCriacao;
}
