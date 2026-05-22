package com.saas_cardapio.app.dto;

import lombok.Data;

@Data
public class LoginRequestDto {
    
    private String email;
    private String senha;
}
