package com.saas_cardapio.app.dto;

import java.util.*;



public record PedidoRequest (

    String nomeCliente,
    String telefone,
    List<ItemRequest> itens
) {

}

