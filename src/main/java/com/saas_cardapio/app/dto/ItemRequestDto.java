package com.saas_cardapio.app.dto;

import lombok.Data;

@Data
public class ItemRequestDto{
    
    String nome;
    Integer quantidade;
    Double preco;
}
