package com.saas_cardapio.app.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor

public class Cliente {

    private String id; 
    private String nome;
    private String email;
    private String senha;
    private String telefone;
    private String endereco;
    private String cep;

    public String getId() {
        return id;
    }
}
