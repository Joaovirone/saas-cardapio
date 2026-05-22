package com.saas_cardapio.app.dto;

import lombok.Data;

@Data
public class RegistroRequestDto {
    
    private String nome;
    private String email;
    private String senha;
    private String telefone;
}
