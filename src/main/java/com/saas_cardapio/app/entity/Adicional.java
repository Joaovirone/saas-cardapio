package com.saas_cardapio.app.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Adicional {
    private String id;
    private String nome;
    private Double preco;
}