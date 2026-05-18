package com.saas_cardapio.app.dto;

public record ItemRequest(
    String nome,
    Integer quantidade,
    Double preco
) {
    
}
