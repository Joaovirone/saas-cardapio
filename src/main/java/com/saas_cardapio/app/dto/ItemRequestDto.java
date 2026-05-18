package com.saas_cardapio.app.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class ItemRequestDto{
    
    String nome;
    Integer quantidade;
    Double preco;
}
